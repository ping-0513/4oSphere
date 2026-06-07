export type SendUserMessageState = {
  error: string | null;
  successId: string | null;
};

export const INITIAL_SEND_USER_MESSAGE_STATE: SendUserMessageState = {
  error: null,
  successId: null,
};
