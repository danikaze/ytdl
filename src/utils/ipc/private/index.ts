// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TypeDataMapping = Record<string, any>;

export interface IpcMessage<
  TDM extends TypeDataMapping = {},
  T extends keyof TDM = keyof TDM
> {
  id: string;
  type: T;
  data?: Readonly<TDM[T]>;
}

export function isValidMessage(msg: unknown): msg is IpcMessage {
  if (!msg) return false;
  const { id, type } = msg as IpcMessage;
  return typeof id === 'string' && typeof type === 'string';
}

export const END_MSG_TYPE = '__IPC_MSG_END__';
