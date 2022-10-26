import colors from 'colors/safe';
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
  data?: TDM[T],
  log?: boolean
): IpcMainIncomingMessage<W, C, TDM, T> {
  return new IpcMainMessageClass<W, C, TDM, T>(
    ipc,
    target,
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

  private readonly handlersMap: Map<
    | IpcMainMessageHandler<W, C, never, never>
    | IpcMainMessageHandler<W, C, TDM, keyof TDM>,
    IpcMainMessageHandler<W, C, TDM, keyof TDM>
  > = new Map();

  private readonly ipc: TypedIpcMain<W, C, TDM>;

  private readonly log: boolean;

  constructor(
    ipc: TypedIpcMain<W, C, TDM>,
    target: WebContents,
    channel: C,
    type: T,
    data?: TDM[T],
    id?: string,
    log?: boolean
  ) {
    this.ipc = ipc;
    this.target = target;
    this.channel = channel;
    this.id = id || IpcMainMessageClass.generateMsgId();
    this.type = type;
    this.data = data!;
    this.log = log || false;
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

    if (this.log) {
      console.log(`${colors.red('Sending IPC')}`, {
        channel: this.channel,
        ...msg,
      });
    }

    this.target.send(this.channel, msg);
  }

  public reply<R extends keyof TDM>(type: R, data: TDM[R]): void {
    const msg: IpcMessage<TDM, R> = {
      id: this.id,
      type,
      data,
    };

    if (this.log) {
      console.log(`${colors.red('Replying IPC')}`, {
        channel: this.channel,
        ...msg,
      });
    }

    this.target.send(this.channel, msg);
  }

  public onReply<R extends keyof TDM = never>(
    handler: IpcMainMessageHandler<W, C, TDM, keyof TDM>,
    type?: R
  ): void {
    const realHandler: IpcMainMessageHandler<W, C, TDM, keyof TDM> = (msg) => {
      if (this.log) {
        console.log(`${colors.blue('IPC Reply received')}`, msg);
      }
      return handler(msg);
    };
    this.handlersMap.set(handler, realHandler);

    this.ipc.on(
      {
        channel: this.channel,
        id: this.id,
        type,
      },
      realHandler
    );
  }

  public end(): void {
    const msg = {
      id: this.id,
      type: END_MSG_TYPE,
    };

    if (this.log) {
      console.log(`${colors.red('IPC end')}`, msg);
    }

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
    const realHandler = this.handlersMap.get(handler) || handler;
    this.ipc.off(this.channel, realHandler);
    this.handlersMap.delete(handler);
  }
}
