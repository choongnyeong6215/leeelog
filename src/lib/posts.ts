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

export function getPostsByCategory(posts: Post[], categorySlug: string): Post[] {
  return posts.filter((post) => post.data.category === categorySlug);
}

export function getPostsByTag(posts: Post[], tag: string): Post[] {
  return posts.filter((post) => post.data.tags.includes(tag));
}

export function getRelatedPosts(current: Post, posts: Post[], limit = 3): Post[] {
  const others = posts.filter((post) => post.id !== current.id);
  const scored = others.map((post) => {
    const sameCategory = post.data.category === current.data.category ? 2 : 0;
    const sharedTags = post.data.tags.filter((tag) => current.data.tags.includes(tag)).length;
    return { post, score: sameCategory + sharedTags };
  });
  scored.sort((a, b) => b.score - a.score || b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf());
  return scored
    .filter((s) => s.score > 0)
    .slice(0, limit)
    .map((s) => s.post);
}

export type TagCount = { tag: string; count: number };

export function getAllTags(posts: Post[]): TagCount[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
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
