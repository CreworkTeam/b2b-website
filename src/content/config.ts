import { defineCollection, reference, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
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
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    mainCategory: z.string(),
    blogCategories: z.array(z.string()),
  }),
});

const casestudy = defineCollection({
  type: 'content',
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
  type: 'data',
  schema: z.object({
    name: z.string(),
    avatar: z.string(),
  }),
});

export const collections = { blog, casestudy, author };
