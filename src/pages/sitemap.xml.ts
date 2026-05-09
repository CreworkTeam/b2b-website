import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { BLOG_CATEGORIES_MAP } from '@/constants';

export const prerender = true;

const SITE = import.meta.env.SITE ?? 'https://www.creworklabs.com';

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const toAbsoluteUrl = (path: string) => new URL(path, SITE).href;

export const GET: APIRoute = async () => {
  const [blogs, caseStudies] = await Promise.all([
    getCollection('blogs', ({ data }) => data.draft !== true),
    getCollection('casestudy'),
  ]);

  const staticPaths = [
    '/',
    '/blog/',
    '/case-studies/',
    ...BLOG_CATEGORIES_MAP.map((cat) => `/category/${cat.tag}/`),
  ];

  const blogPaths = blogs.map((entry) => `/blog/${entry.slug}/`);
  const caseStudyPaths = caseStudies.map((entry) => `/case-studies/${entry.slug}/`);

  const urls = Array.from(new Set([...staticPaths, ...blogPaths, ...caseStudyPaths]))
    .map(toAbsoluteUrl)
    .map((loc) => `  <url><loc>${escapeXml(loc)}</loc></url>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urls}\n` +
    `</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
