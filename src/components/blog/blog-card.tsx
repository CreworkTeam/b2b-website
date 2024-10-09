import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useRef } from 'react';

const BlogCard = (props) => {
  const ref = useRef(null);
  const { blogTitle, blogDescription, blogImage, blogDate, slug } = props;

  const url = `/blog/${slug}`;

  return (
    <a
      href={url}
      className="block rounded-md shadow-[0px_0px_4px_0px_#00000040]"
      data-btntype="blog"
      data-btnname={blogTitle}
    >
      <img
        src={blogImage?.src || '/opengraph.png'}
        alt={blogTitle}
        className="aspect-video size-full rounded-t-md object-cover"
      />

      <div className="rounded-md bg-white p-4 md:h-36">
        <p className="text-xs text-gray-500">
          {blogDate ? format(new Date(blogDate), 'MMMM dd, yyyy') : null}
        </p>
        <h3 ref={ref} className="line-clamp-2 text-lg font-medium">
          {blogTitle}
        </h3>
        <div
          className={cn('mb-4 text-sm text-gray-500', {
            'line-clamp-2': ref.current?.clientHeight > 40,
            'line-clamp-3': ref.current?.clientHeight <= 40,
          })}
        >
          {blogDescription}
        </div>
      </div>
    </a>
  );
};

export default BlogCard;
