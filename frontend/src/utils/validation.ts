// 名前系の入力（カードタイトル・ボード名・リスト名）の検証。
// バックエンドの @NotBlank / @Size と同じ条件・メッセージに揃えている。
export const NAME_MAX_LENGTH = 255;

/** 問題なければ null、問題があればエラーメッセージを返す */
export function validateName(value: string, label: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return `${label}は必須です`;
  if (trimmed.length > NAME_MAX_LENGTH) {
    return `${label}は${NAME_MAX_LENGTH}文字以内で入力してください`;
  }
  return null;
}
