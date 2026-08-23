import { CATEGORY_TREE, type CategoryLeaf } from '../config';
import type { Post } from './posts';

export type CategoryLeafWithCount = CategoryLeaf & { count: number };
export type CategoryGroupWithCount = { label: string; children: CategoryLeafWithCount[]; total: number };

/** 카테고리 트리에 실제 콘텐츠 기준 글 개수를 채워 반환한다. 글이 0개인 소분류는 제외한다. */
export function getCategoryTreeWithCounts(posts: Post[]): CategoryGroupWithCount[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    counts.set(post.data.category, (counts.get(post.data.category) ?? 0) + 1);
  }

  return CATEGORY_TREE.map((group) => {
    const children = group.children
      .map((leaf) => ({ ...leaf, count: counts.get(leaf.slug) ?? 0 }))
      .filter((leaf) => leaf.count > 0);
    const total = children.reduce((sum, leaf) => sum + leaf.count, 0);
    return { label: group.label, children, total };
  }).filter((group) => group.children.length > 0);
}
