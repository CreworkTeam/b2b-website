import { BLOG_RESULTS_LIMIT } from '@/constants';
import { BLOG_CATEGORIES_MAP } from '@/constants';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);

  const { search, category, page } = {
    search: url.searchParams.get('search') || '',
    category: url.searchParams.get('category') || 'all',
    page: parseInt(url.searchParams.get('page') || BLOG_RESULTS_LIMIT.toString(), 10),
  };

  const data = await getCollection('blogs', ({ data }) => {
    return data.draft !== true;
  });

  const filteredBlogs = data
    .filter(({ data }) => {
      const matchesSearch = search
        ? data?.blogTitle?.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesCategory =
        category && category !== 'all'
          ? (() => {
            const matchedCategory = BLOG_CATEGORIES_MAP.find(cat => cat.tag === category)?.name || category;
            return data?.mainCategory === matchedCategory || (data?.blogCategories?.includes(matchedCategory) ?? false);
          })()
          : true;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (a.data.featured && !b.data.featured) return 1;
      if (!a.data.featured && b.data.featured) return -1;
      return new Date(b.data.blogDate).getTime() - new Date(a.data.blogDate).getTime();
    });

  const paginatedBlogs = filteredBlogs.slice(
    (page - 1) * BLOG_RESULTS_LIMIT,
    page * BLOG_RESULTS_LIMIT,
  );

  const serializedBlogs = paginatedBlogs.map((entry) => ({
    slug: entry.slug,
    data: {
      blogTitle: entry.data.blogTitle,
      blogDate: entry.data.blogDate,
      blogAuthor: entry.data.blogAuthor,
      blogImage: entry.data.blogImage,
      blogDescription: entry.data.blogDescription,
      draft: entry.data.draft,
      featured: entry.data.featured,
      blogCategories: entry.data.blogCategories || [],
    },
  }));

  return new Response(
    JSON.stringify({
      blogs: serializedBlogs,
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
