import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ request }) => {
  const data = await getCollection('blogs', ({ data }) => {
    return data.draft !== true;
  });

  const allTags = data
    .map(({ data }) => [...(data.blogCategories || []), data.mainCategory])
    .flat()
    .filter(Boolean);

  const uniqueTags = Array.from(new Set(allTags));

  return new Response(JSON.stringify(uniqueTags), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
