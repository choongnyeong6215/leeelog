export function formatDateLong(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function formatDateShort(date: Date): string {
  const yy = String(date.getFullYear()).slice(2);
  return `${yy}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}
