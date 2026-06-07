export type ChatManagementActionState = {
  error: string | null;
  success: boolean;
};

export const INITIAL_CHAT_MANAGEMENT_ACTION_STATE: ChatManagementActionState = {
  error: null,
  success: false,
};
