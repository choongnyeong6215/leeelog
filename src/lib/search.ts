import { getCategoryLeaf } from '../config';
import { getPostUrl, type Post } from './posts';

export type SearchDoc = {
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
};

export function buildSearchIndex(posts: Post[]): SearchDoc[] {
  return posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    url: getPostUrl(post),
    category: getCategoryLeaf(post.data.category)?.leaf.label ?? post.data.category,
    tags: post.data.tags,
  }));
}
