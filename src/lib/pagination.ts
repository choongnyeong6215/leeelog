export const POSTS_PAGE_SIZE = 10;

export function getTotalPages(totalItems: number, pageSize = POSTS_PAGE_SIZE): number {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

export interface PageWindow {
  pages: number[];
  showFirst: boolean;
  showLeftEllipsis: boolean;
  showLast: boolean;
  showRightEllipsis: boolean;
}

/** currentPage 주변으로 windowSize개의 페이지 번호만 노출하고, 양 끝은 처음/마지막 페이지 + 말줄임표로 표시한다. */
export function getPageWindow(currentPage: number, totalPages: number, windowSize = 5): PageWindow {
  let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
  let end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return {
    pages,
    showFirst: start > 1,
    showLeftEllipsis: start > 2,
    showLast: end < totalPages,
    showRightEllipsis: end < totalPages - 1,
  };
}
