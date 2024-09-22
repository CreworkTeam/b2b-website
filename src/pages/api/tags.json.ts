import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ request }) => {
  const data = await getCollection('blogs');

  const uniqueTags = data
    .map(({ data }) => data.blogCategories)
    .flat()
    .filter((tag: any, index: any, self: string | any[]) => self.indexOf(tag) === index);

  return new Response(JSON.stringify(uniqueTags), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
