import { ipcRenderer } from 'electron';
import { END_MSG_TYPE, IpcMessage, TypeDataMapping } from '.';
import type { TypedIpcRenderer, IpcRendererMessageHandler } from './renderer';

// cheap trick to avoid calling the unwanted methods
export type IpcRendererMessage<
  C extends string, // Channels
  TDM extends TypeDataMapping, // Type-Data Mapping
  T extends keyof TDM // Message Type
> = Omit<IpcRendererMessageClass<C, TDM, T>, 'reply'>;

export type IpcRendererIncomingMessage<
  C extends string, // Channels
  TDM extends TypeDataMapping, // Type-Data Mapping
  T extends keyof TDM // Message Type
> = Omit<IpcRendererMessageClass<C, TDM, T>, 'send'>;

export function createIpcRendererMessage<
  C extends string, // Channels
  TDM extends TypeDataMapping, // Type-Data Mapping
  T extends keyof TDM // Message Type
>(
  ipc: TypedIpcRenderer<C, TDM>,
  channel: C,
  type: T,
  data?: TDM[T],
  log?: boolean
): IpcRendererMessage<C, TDM, T> {
  return new IpcRendererMessageClass<C, TDM, T>(
    ipc,
    channel,
    type,
    data,
    undefined,
    log
  );
}

export function createIpcRendererIncomingMessage<
  C extends string, // Channels
  TDM extends TypeDataMapping, // Type-Data Mapping
  T extends keyof TDM // Message Type
>(
  id: string,
  ipc: TypedIpcRenderer<C, TDM>,
  channel: C,
  type: T,
  data?: TDM[T],
  log?: boolean
): IpcRendererIncomingMessage<C, TDM, T> {
  return new IpcRendererMessageClass<C, TDM, T>(
    ipc,
    channel,
    type,
    data,
    id,
    log
  );
}

/**
 * Typed Ipc message.
 * Not to be used directly but via `TypedIpcMain.createMessage`
 */
class IpcRendererMessageClass<
  C extends string, // Channels
  TDM extends TypeDataMapping, // Type-Data Mapping
  T extends keyof TDM // Message Type
> {
  private static msgId = 0;

  public readonly data: Readonly<TDM[T]>;

  public channel: C;

  public id: string;

  public type: T;

  private readonly handlersMap: Map<
    | IpcRendererMessageHandler<C, never, never>
    | IpcRendererMessageHandler<C, TDM, keyof TDM>,
    IpcRendererMessageHandler<C, TDM, keyof TDM>
  > = new Map();

  private readonly ipc: TypedIpcRenderer<C, TDM>;

  private readonly log: boolean;

  constructor(
    ipc: TypedIpcRenderer<C, TDM>,
    channel: C,
    type: T,
    data?: TDM[T],
    id?: string,
    log?: boolean
  ) {
    this.ipc = ipc;
    this.channel = channel;
    this.id = id || IpcRendererMessageClass.generateMsgId();
    this.type = type;
    this.data = data!;
    this.log = log || false;
  }

  private static generateMsgId(): string {
    IpcRendererMessageClass.msgId =
      (IpcRendererMessageClass.msgId + 1) % Number.MAX_SAFE_INTEGER;
    return `r${IpcRendererMessageClass.msgId}`;
  }

  public send(): void {
    const msg: IpcMessage<TDM, T> = {
      id: this.id,
      type: this.type,
      data: this.data,
    };

    if (this.log) {
      console.log('%c▲%c IPC', 'color:red;', 'color:undefined;', msg);
    }

    ipcRenderer.send(this.channel, msg);
  }

  public reply<R extends keyof TDM>(type: R, data: TDM[R]): void {
    const msg: IpcMessage<TDM, R> = {
      id: this.id,
      type,
      data,
    };

    if (this.log) {
      console.log('%c▲%c IPC reply', 'color:red;', 'color:undefined;', msg);
    }

    ipcRenderer.send(this.channel, msg);
  }

  public onReply<R extends keyof TDM = never>(
    handler: IpcRendererMessageHandler<C, TDM, keyof TDM>,
    type?: R
  ): void {
    this.ipc.on(
      {
        channel: this.channel,
        id: this.id,
        type,
      },
      handler
    );
  }

  public end(): void {
    const msg = {
      id: this.id,
      data: END_MSG_TYPE,
    };

    if (this.log) {
      console.log('%c▲%c IPC end', 'color:red;', 'color:undefined;', msg);
    }

    ipcRenderer.send(this.channel, msg);
  }

  public onEnd(handler: IpcRendererMessageHandler<C, never, never>): void {
    this.ipc.once(
      {
        channel: this.channel,
        id: this.id,
        type: END_MSG_TYPE,
      },
      handler as IpcRendererMessageHandler<C, TDM, keyof TDM>
    );
  }

  public off(handler: IpcRendererMessageHandler<C, TDM, keyof TDM>): void {
    const realHandler = this.handlersMap.get(handler) || handler;
    this.ipc.off(this.channel, realHandler);
    this.handlersMap.delete(handler);
  }
}
