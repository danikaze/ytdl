import { ipcRenderer, IpcRendererEvent } from 'electron';
import { removeFromArray } from '../../remove-from-array';
import { END_MSG_TYPE, isValidMessage, TypeDataMapping } from '.';
import {
  createIpcRendererIncomingMessage,
  createIpcRendererMessage,
  IpcRendererIncomingMessage,
  IpcRendererMessage,
} from './renderer-message';

export type IpcRendererMessageHandler<
  C extends string, // Channels
  TDM extends TypeDataMapping, // Type-Data Mapping
  T extends keyof TDM // Message Type
> = (msg: IpcRendererIncomingMessage<C, TDM, T>) => void | Promise<void>;

type IpcMessageHandlerWrapper<
  C extends string, // Channels
  TDM extends TypeDataMapping // Type-Data Mapping
> = IpcRendererMessageHandler<C, TDM, keyof TDM>;

type RealIpcMessageHandler = (
  event: IpcRendererEvent,
  ...args: unknown[]
) => void;

interface OnFilter<
  C extends string,
  TDM extends TypeDataMapping,
  T extends keyof TDM = keyof TDM
> {
  channel: C;
  id?: string;
  type?: T;
}

export class TypedIpcRenderer<
  C extends string, // Channels
  TDM extends TypeDataMapping // Type-Data Mapping
> {
  /**
   * List of private handlers attached to the `ipcMain` object,
   * those are the ones to clean
   */
  private handlers: Map<
    C,
    {
      realHandler: RealIpcMessageHandler;
      list: IpcMessageHandlerWrapper<C, TDM>[];
    }
  > = new Map();

  /**
   * List of handlers attached to a certain message id so they can be removed
   * when an `.end()` message is received
   */
  private idHandlers: Map<
    string,
    IpcRendererMessageHandler<C, TDM, keyof TDM>[]
  > = new Map();

  /**
   * Mapping to be able to remove handlers by the one used in `on`
   * (as the real handler to remove is the generated one)
   */
  private handlerMapping: Map<
    IpcRendererMessageHandler<C, TDM, keyof TDM>,
    IpcMessageHandlerWrapper<C, TDM>
  > = new Map();

  public is<T extends keyof TDM>(
    msg: IpcRendererMessage<C, TDM, keyof TDM>,
    type: T
  ): msg is IpcRendererMessage<C, TDM, T>;
  public is<T extends keyof TDM>(
    msg: IpcRendererIncomingMessage<C, TDM, keyof TDM>,
    type: T
  ): msg is IpcRendererIncomingMessage<C, TDM, T>;
  // eslint-disable-next-line class-methods-use-this
  public is<T extends keyof TDM>(
    msg: unknown,
    type: T
  ): msg is IpcRendererIncomingMessage<C, TDM, T> {
    return (msg as { type: T })?.type === type;
  }

  public createMessage<T extends keyof TDM & string>(
    channel: C,
    type: T,
    data: TDM[T]
  ): IpcRendererMessage<C, TDM, keyof TDM> {
    return createIpcRendererMessage(this, channel, type, data);
  }

  public on<T extends keyof TDM = keyof TDM>(
    filter: OnFilter<C, TDM, T>,
    handler: IpcRendererMessageHandler<C, TDM, keyof TDM>
  ): void {
    this.processOn(filter, handler);
  }

  public once<T extends keyof TDM = keyof TDM>(
    filter: OnFilter<C, TDM, T>,
    handler: IpcRendererMessageHandler<C, TDM, keyof TDM>
  ): void {
    this.processOn(filter, handler, true);
  }

  public off(
    channel: C,
    handler: IpcRendererMessageHandler<C, TDM, keyof TDM>
  ): void {
    const realHandler = this.handlerMapping.get(handler);
    if (!realHandler) return;
    const channelHandlers = this.getChannelHandlers(channel);
    removeFromArray(channelHandlers, realHandler);
    this.handlerMapping.delete(handler);
  }

  private getChannelHandlers(channel: C): IpcMessageHandlerWrapper<C, TDM>[] {
    let channelHandlers = this.handlers.get(channel);
    if (!channelHandlers) {
      const realHandler = this.createIpcChannelHandler(channel);

      channelHandlers = {
        realHandler,
        list: [],
      };
      this.handlers.set(channel, channelHandlers);
      ipcRenderer.on(channel, realHandler);
    }

    return channelHandlers.list;
  }

  private getIdHandlers(
    id: string
  ): IpcRendererMessageHandler<C, TDM, keyof TDM>[] {
    let idHandlers = this.idHandlers.get(id);
    if (!idHandlers) {
      idHandlers = [];
      this.idHandlers.set(id, idHandlers);
    }
    return idHandlers;
  }

  private processOn<T extends keyof TDM = keyof TDM>(
    { channel, id, type }: OnFilter<C, TDM, T>,
    handler: IpcRendererMessageHandler<C, TDM, keyof TDM>,
    once?: boolean
  ): void {
    const channelHandlers = this.getChannelHandlers(channel);
    const handlerWrapper: IpcMessageHandlerWrapper<C, TDM> = (msg) => {
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
   * This is the handler attached to electron.ipcRenderer
   * it's only attached once per channel, and everything else is
   * managed internally
   */
  private createIpcChannelHandler(channel: C): RealIpcMessageHandler {
    return (event, data) => {
      if (!isValidMessage(data)) return;
      const msg = createIpcRendererIncomingMessage(
        data.id,
        this,
        channel,
        data.type,
        data.data as TDM[keyof TDM]
      );

      // call all attached handlers with the incoming message
      const handlers = this.getChannelHandlers(channel);
      for (let i = 0; i < handlers.length; i++) {
        handlers[i](msg);
      }

      // if the message was sent with `.end()`, then remove all handlers
      // attached to that message `id`
      if (data.type === END_MSG_TYPE) {
        const idHandlers = this.getIdHandlers(data.id);
        for (let i = 0; i < idHandlers.length; i++) {
          this.off(channel, idHandlers[i]);
        }
        this.idHandlers.delete(data.id);
      }
    };
  }
}
