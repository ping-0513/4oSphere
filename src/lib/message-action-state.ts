export type SendUserMessageState = {
  error: string | null;
  generationFailed: boolean;
  successId: string | null;
};

export const INITIAL_SEND_USER_MESSAGE_STATE: SendUserMessageState = {
  error: null,
  generationFailed: false,
  successId: null,
};
