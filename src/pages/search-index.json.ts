import type { APIRoute } from 'astro';
import { getAllPosts } from '../lib/posts';
import { buildSearchIndex } from '../lib/search';

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = await getAllPosts();
  const index = buildSearchIndex(posts);
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
