export const MAX_CHAT_TITLE_CHARACTERS = 40;

export function countChatTitleCharacters(title: string) {
  return Array.from(title).length;
}

export function normalizeChatTitle(title: string) {
  return title.trim();
}

export function validateChatTitle(title: string) {
  const normalizedTitle = normalizeChatTitle(title);

  if (!normalizedTitle) {
    return "チャット名を入力してください。";
  }

  if (countChatTitleCharacters(normalizedTitle) > MAX_CHAT_TITLE_CHARACTERS) {
    return "チャット名は40文字以内で入力してください。";
  }

  return null;
}
