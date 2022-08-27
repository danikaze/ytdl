import type { WebContents } from 'electron';
import { END_MSG_TYPE, IpcMessage, TypeDataMapping } from '.';
import type { TypedIpcMain, IpcMainMessageHandler } from './main';

// cheap trick to avoid calling the unwanted methods
export type IpcMainMessage<
  W extends string | number | Symbol, // Target ids
  C extends string, // Channels
  TDM extends TypeDataMapping, // Type-Data Mapping
  T extends keyof TDM // Message Type
> = Omit<IpcMainMessageClass<W, C, TDM, T>, 'reply'>;

export type IpcMainIncomingMessage<
  W extends string | number | Symbol, // Target ids
  C extends string, // Channels
  TDM extends TypeDataMapping, // Type-Data Mapping
  T extends keyof TDM // Message Type
> = Omit<IpcMainMessageClass<W, C, TDM, T>, 'send'>;

export function createIpcMainMessage<
  W extends string | number | Symbol, // Target ids
  C extends string, // Channels
  TDM extends TypeDataMapping, // Type-Data Mapping
  T extends keyof TDM // Message Type
>(
  ipc: TypedIpcMain<W, C, TDM>,
  target: WebContents,
  channel: C,
  type: T,
  data?: TDM[T]
): IpcMainMessage<W, C, TDM, T> {
  return new IpcMainMessageClass<W, C, TDM, T>(
    ipc,
    target,
    channel,
    type,
    data
  );
}

export function createIpcMainIncomingMessage<
  W extends string | number | Symbol, // Target ids
  C extends string, // Channels
  TDM extends TypeDataMapping, // Type-Data Mapping
  T extends keyof TDM // Message Type
>(
  id: string,
  ipc: TypedIpcMain<W, C, TDM>,
  target: WebContents,
  channel: C,
  type: T,
  data?: TDM[T]
): IpcMainIncomingMessage<W, C, TDM, T> {
  return new IpcMainMessageClass<W, C, TDM, T>(
    ipc,
    target,
    channel,
    type,
    data,
    id
  );
}

/**
 * Typed Ipc message.
 * Not to be used directly but via `TypedIpcMain.createMessage`
 */
class IpcMainMessageClass<
  W extends string | number | Symbol, // Target ids
  C extends string, // Channels
  TDM extends TypeDataMapping, // Type-Data Mapping
  T extends keyof TDM // Message Type
> {
  private static msgId = 0;

  public readonly data: Readonly<TDM[T]>;

  public readonly target: WebContents;

  public channel: C;

  public id: string;

  public type: T;

  private ipc: TypedIpcMain<W, C, TDM>;

  constructor(
    ipc: TypedIpcMain<W, C, TDM>,
    target: WebContents,
    channel: C,
    type: T,
    data?: TDM[T],
    id?: string
  ) {
    this.ipc = ipc;
    this.target = target;
    this.channel = channel;
    this.id = id || IpcMainMessageClass.generateMsgId();
    this.type = type;
    this.data = data!;
  }

  private static generateMsgId(): string {
    IpcMainMessageClass.msgId =
      (IpcMainMessageClass.msgId + 1) % Number.MAX_SAFE_INTEGER;
    return `m${IpcMainMessageClass.msgId}`;
  }

  public send(): void {
    const msg: IpcMessage<TDM, T> = {
      id: this.id,
      type: this.type,
      data: this.data,
    };
    this.target.send(this.channel, msg);
  }

  public reply<R extends keyof TDM>(type: R, data: TDM[R]): void {
    const msg: IpcMessage<TDM, R> = {
      id: this.id,
      type,
      data,
    };
    this.target.send(this.channel, msg);
  }

  public onReply<R extends keyof TDM = never>(
    handler: IpcMainMessageHandler<W, C, TDM, keyof TDM>,
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
      type: END_MSG_TYPE,
    };
    this.target.send(this.channel, msg);
  }

  public onEnd(handler: IpcMainMessageHandler<W, C, never, never>): void {
    this.ipc.once(
      {
        channel: this.channel,
        id: this.id,
        type: END_MSG_TYPE,
      },
      handler as IpcMainMessageHandler<W, C, TDM, keyof TDM>
    );
  }

  public off(handler: IpcMainMessageHandler<W, C, TDM, keyof TDM>): void {
    this.ipc.off(this.channel, handler);
  }
}
