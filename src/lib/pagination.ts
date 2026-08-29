export const POSTS_PAGE_SIZE = 10;

export function getTotalPages(totalItems: number, pageSize = POSTS_PAGE_SIZE): number {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}
