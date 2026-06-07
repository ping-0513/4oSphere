export const MAX_USER_MESSAGE_CHARACTERS = 20_000;

export function countMessageCharacters(value: string) {
  return Array.from(value).length;
}

export function validateUserMessageContent(value: string) {
  if (!value.trim()) {
    return "メッセージを入力してください。";
  }

  if (countMessageCharacters(value) > MAX_USER_MESSAGE_CHARACTERS) {
    return "メッセージが長すぎます。";
  }

  return null;
}
