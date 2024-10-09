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

      <div className="h-36 overflow-y-hidden rounded-md bg-white p-4">
        <p className="text-xs text-gray-500">
          {blogDate ? format(new Date(blogDate), 'MMMM dd, yyyy') : null}
        </p>
        <h3 ref={ref} className="line-clamp-2 text-lg font-medium">
          {blogTitle}
        </h3>
        <p
          className={cn('text-sm text-gray-500', {
            'line-clamp-2': ref.current?.clientHeight > 50,
            'line-clamp-3': ref.current?.clientHeight <= 50,
          })}
        >
          {blogDescription}
        </p>
      </div>
    </a>
  );
};

export default BlogCard;
