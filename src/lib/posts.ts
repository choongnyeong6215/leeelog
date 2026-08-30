import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

let cachedPosts: Post[] | null = null;

/** draft 글은 프로덕션 빌드에서 제외하고, pubDate 최신순으로 정렬된 전체 글 목록. */
export async function getAllPosts(): Promise<Post[]> {
  if (cachedPosts) return cachedPosts;
  const entries = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  cachedPosts = entries.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  return cachedPosts;
}

export function getPostUrl(post: Post): string {
  return `/${post.data.category}/${post.id}`;
}

/** 현재 글보다 나중에(더 최신으로) 발행된 글을 가까운 순서대로 반환한다. */
export function getPostsAfter(posts: Post[], current: Post, limit = 3): Post[] {
  const idx = posts.findIndex((post) => post.id === current.id);
  if (idx <= 0) return [];
  return posts.slice(Math.max(0, idx - limit), idx).reverse();
}

export type SeriesSummary = { name: string; posts: Post[] };

export function getSeriesList(posts: Post[]): SeriesSummary[] {
  const groups = new Map<string, Post[]>();
  for (const post of posts) {
    if (!post.data.series) continue;
    const list = groups.get(post.data.series) ?? [];
    list.push(post);
    groups.set(post.data.series, list);
  }
  return Array.from(groups.entries())
    .map(([name, seriesPosts]) => ({
      name,
      posts: seriesPosts.sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ko'));
}

export function getSeriesPosts(posts: Post[], seriesName: string): Post[] {
  return posts
    .filter((post) => post.data.series === seriesName)
    .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));
}

// getStaticPaths의 params는 디코딩된 원문 값을 그대로 받아야 라우팅과 매칭된다.
// href로 쓸 때는 브라우저/Astro가 알아서 인코딩·디코딩을 처리해준다.
export function paramSlug(value: string): string {
  return value;
}

export function seriesSlug(name: string): string {
  return paramSlug(name);
}
