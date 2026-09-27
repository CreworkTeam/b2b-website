import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    blogTitle: z.string(),
    blogDate: z.string(),
    blogAuthor: reference('author'),
    blogImage: z.object({
      src: z
        .string()
        .default(
          'https://res.cloudinary.com/crework-cloud/image/upload/v1726582634/blogs/image_3_b8uw6r.png',
        ),
      alt: z.string().default('A picture of a coder'),
    }),
    blogDescription: z.string(),
    blogModified: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    mainCategory: z.string(),
    blogCategories: z.array(z.string()),
  }),
});

const casestudy = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/casestudy' }),
  schema: z.object({
    cstitle: z.string(),
    csimage: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    csmptag: z.string(),
    csdescription: z.string(),
    csspan: z.string().optional(),
    cstags: z.array(z.string()),
    csimages: z.array(
      z.object({
        src: z.string(),
        alt: z.string(),
      }),
    ),
    cstag: z.string().default('website'),
    cslivelink: z.string().optional(),
    order: z.number(),
  }),
});

const author = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/author' }),
  schema: z.object({
    name: z.string(),
    avatar: z.string(),
  }),
});

export const collections = { blog, casestudy, author };
