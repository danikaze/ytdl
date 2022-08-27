import { BrowserWindow, ipcMain, IpcMainEvent, WebContents } from 'electron';
import { removeFromArray } from '../../remove-from-array';
import { END_MSG_TYPE, isValidMessage, TypeDataMapping } from '.';
import {
  createIpcMainIncomingMessage,
  createIpcMainMessage,
  IpcMainIncomingMessage,
  IpcMainMessage,
} from './main-message';

export type IpcMainMessageHandler<
  W extends string | number | Symbol, // Target ids
  C extends string, // Channels
  TDM extends TypeDataMapping, // Type-Data Mapping
  T extends keyof TDM // Message Type
> = (msg: IpcMainIncomingMessage<W, C, TDM, T>) => void | Promise<void>;

type IpcMessageHandlerWrapper<
  W extends string | number | Symbol, // Target ids
  C extends string, // Channels
  TDM extends TypeDataMapping // Type-Data Mapping
> = IpcMainMessageHandler<W, C, TDM, keyof TDM>;

type RealIpcMessageHandler = (event: IpcMainEvent, ...args: unknown[]) => void;

interface OnFilter<
  C extends string,
  TDM extends TypeDataMapping,
  T extends keyof TDM = keyof TDM
> {
  channel: C;
  id?: string;
  type?: T;
}

export class TypedIpcMain<
  W extends string | number | Symbol, // Target ids
  C extends string, // Channels
  TDM extends TypeDataMapping // Type-Data Mapping
> {
  /**
   * Mapping between TargetIds => BrowserWindows to be able to send messages
   * directly from the main process to different windows
   * (need to be registered first via `registerTarget()`)
   */
  private windows: Map<W, BrowserWindow> = new Map();

  /**
   * List of private handlers attached to the `ipcMain` object,
   * those are the ones to clean
   */
  private handlers: Map<
    C,
    {
      realHandler: RealIpcMessageHandler;
      list: IpcMessageHandlerWrapper<W, C, TDM>[];
    }
  > = new Map();

  /**
   * List of handlers attached to a certain message id so they can be removed
   * when an `.end()` message is received
   */
  private idHandlers: Map<
    string,
    IpcMainMessageHandler<W, C, TDM, keyof TDM>[]
  > = new Map();

  /**
   * Mapping to be able to remove handlers by the one used in `on`
   * (as the real handler to remove is the generated one)
   */
  private handlerMapping: Map<
    IpcMainMessageHandler<W, C, TDM, keyof TDM>,
    IpcMessageHandlerWrapper<W, C, TDM>
  > = new Map();

  public registerTarget(targetId: W, window: BrowserWindow): void {
    this.windows.set(targetId, window);
  }

  public getWindow(
    msgOrTarget: IpcMainMessage<W, C, TDM, keyof TDM> | WebContents
  ): BrowserWindow {
    const windows = this.windows.values();
    const target = this.isMsg(msgOrTarget) ? msgOrTarget.target : msgOrTarget;

    for (const window of windows) {
      if (window.id === target.id) return window;
    }

    throw new Error(`Target for the message has not been set`);
  }

  public is<T extends keyof TDM>(
    msg: IpcMainMessage<W, C, TDM, keyof TDM>,
    type: T
  ): msg is IpcMainMessage<W, C, TDM, T>;
  public is<T extends keyof TDM>(
    msg: IpcMainIncomingMessage<W, C, TDM, keyof TDM>,
    type: T
  ): msg is IpcMainIncomingMessage<W, C, TDM, T>;
  // eslint-disable-next-line class-methods-use-this
  public is<T extends keyof TDM>(
    msg: unknown,
    type: T
  ): msg is IpcMainIncomingMessage<W, C, TDM, T> {
    return (msg as { type: T })?.type === type;
  }

  public createMessage<T extends keyof TDM & string>(
    targetId: W,
    channel: C,
    type: T,
    data: TDM[T]
  ): IpcMainMessage<W, C, TDM, keyof TDM> {
    const window = this.windows.get(targetId);
    if (!window) {
      throw new Error(`Target ${targetId} has not been set`);
    }
    return createIpcMainMessage(this, window.webContents, channel, type, data);
  }

  public on<T extends keyof TDM = keyof TDM>(
    filter: OnFilter<C, TDM, T>,
    handler: IpcMainMessageHandler<W, C, TDM, keyof TDM>
  ): void {
    this.processOn(filter, handler);
  }

  public once<T extends keyof TDM = keyof TDM>(
    filter: OnFilter<C, TDM, T>,
    handler: IpcMainMessageHandler<W, C, TDM, keyof TDM>
  ): void {
    this.processOn(filter, handler, true);
  }

  public off(
    channel: C,
    handler: IpcMainMessageHandler<W, C, TDM, keyof TDM>
  ): void {
    const realHandler = this.handlerMapping.get(handler);
    if (!realHandler) return;
    const channelHandlers = this.getChannelHandlers(channel);
    removeFromArray(channelHandlers, realHandler);
    this.handlerMapping.delete(handler);
  }

  private getChannelHandlers(
    channel: C
  ): IpcMessageHandlerWrapper<W, C, TDM>[] {
    let channelHandlers = this.handlers.get(channel);
    if (!channelHandlers) {
      const realHandler = this.createIpcChannelHandler(channel);

      channelHandlers = {
        realHandler,
        list: [],
      };
      this.handlers.set(channel, channelHandlers);
      ipcMain.on(channel, realHandler);
    }

    return channelHandlers.list;
  }

  private getIdHandlers(
    id: string
  ): IpcMainMessageHandler<W, C, TDM, keyof TDM>[] {
    let idHandlers = this.idHandlers.get(id);
    if (!idHandlers) {
      idHandlers = [];
      this.idHandlers.set(id, idHandlers);
    }
    return idHandlers;
  }

  private processOn<T extends keyof TDM = keyof TDM>(
    { channel, id, type }: OnFilter<C, TDM, T>,
    handler: IpcMainMessageHandler<W, C, TDM, keyof TDM>,
    once?: boolean
  ): void {
    const channelHandlers = this.getChannelHandlers(channel);
    const handlerWrapper: IpcMessageHandlerWrapper<W, C, TDM> = (msg) => {
      if (id && id !== msg.id) return;
      if (type && type !== msg.type) return;

      if (once) {
        this.off(channel, handler);
      }
      handler(msg);
    };
    this.handlerMapping.set(handler, handlerWrapper);
    channelHandlers.push(handlerWrapper);
    if (!id) return;
    this.getIdHandlers(id).push(handler);
  }

  /**
   * This is the handler attached to electron.ipcMain
   * it's only attached once per channel, and everything else is
   * managed internally
   */
  private createIpcChannelHandler(channel: C): RealIpcMessageHandler {
    return (event, data) => {
      if (!isValidMessage(data)) return;
      const msg = createIpcMainIncomingMessage(
        data.id,
        this,
        event.sender,
        channel,
        data.type,
        data.data as TDM[keyof TDM]
      );

      // if the message was sent with `.end()`, then remove all handlers
      // attached to that message `id`
      if (data.type === END_MSG_TYPE) {
        const idHandlers = this.getIdHandlers(data.id);
        for (let i = 0; i < idHandlers.length; i++) {
          this.off(channel, idHandlers[i]);
        }
        this.idHandlers.delete(data.id);
        return;
      }

      // call all attached handlers with the incoming message
      const handlers = this.getChannelHandlers(channel);
      for (let i = 0; i < handlers.length; i++) {
        handlers[i](msg);
      }
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private isMsg(
    obj: IpcMainMessage<W, C, TDM, keyof TDM> | WebContents
  ): obj is IpcMainMessage<W, C, TDM, keyof TDM> {
    return (obj as IpcMainMessage<W, C, TDM, keyof TDM>).target !== undefined;
  }
}
