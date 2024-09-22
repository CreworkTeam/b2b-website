import { BLOG_RESULTS_LIMIT } from '@/constants';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);

  const { search, category, page } = {
    search: url.searchParams.get('search') || '',
    category: url.searchParams.get('category') || 'all',
    page: parseInt(url.searchParams.get('page') || BLOG_RESULTS_LIMIT.toString(), 10),
  };

  const data = await getCollection('blogs');

  const filteredBlogs = data.filter(({ data }) => {
    const matchesSearch = search
      ? data.blogTitle.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesCategory =
      category && category !== 'all' ? data.blogCategories.includes(category) : true;
    return matchesSearch && matchesCategory;
  });

  return new Response(
    JSON.stringify({
      blogs: filteredBlogs.slice((page - 1) * BLOG_RESULTS_LIMIT, page * BLOG_RESULTS_LIMIT),
      totalBlogs: filteredBlogs.length,
      page,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};
