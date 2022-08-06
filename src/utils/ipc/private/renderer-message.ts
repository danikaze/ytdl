import { ipcRenderer } from 'electron';
import { END_MSG_TYPE, IpcMessage, TypeDataMapping } from '.';
import type { TypedIpcRenderer, IpcRendererMessageHandler } from './renderer';

// cheap trick to avoid calling the unwanted methods
export type IpcRendererMessage<
  C extends string, // Channels
  TDM extends TypeDataMapping, // Type-Data Mapping
  T extends keyof TDM // Message Type
> = Omit<IpcRendererMessageClass<C, TDM, T>, 'end' | 'reply'>;

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
  data?: TDM[T]
): IpcRendererMessage<C, TDM, T> {
  return new IpcRendererMessageClass<C, TDM, T>(ipc, channel, type, data);
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
  data?: TDM[T]
): IpcRendererIncomingMessage<C, TDM, T> {
  return new IpcRendererMessageClass<C, TDM, T>(ipc, channel, type, data, id);
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

  private ipc: TypedIpcRenderer<C, TDM>;

  constructor(
    ipc: TypedIpcRenderer<C, TDM>,
    channel: C,
    type: T,
    data?: TDM[T],
    id?: string
  ) {
    this.ipc = ipc;
    this.channel = channel;
    this.id = id || IpcRendererMessageClass.generateMsgId();
    this.type = type;
    this.data = data!;
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
    ipcRenderer.send(this.channel, msg);
  }

  public reply<R extends keyof TDM>(type: R, data: TDM[R]): void {
    const msg: IpcMessage<TDM, R> = {
      id: this.id,
      type,
      data,
    };
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
    this.ipc.off(this.channel, handler);
  }
}
