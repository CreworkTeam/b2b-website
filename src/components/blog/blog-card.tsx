import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const BlogCard = (props) => {
  const { blogTitle, blogDescription, blogImage, blogDate, slug } = props;

  const url = `/blog/${slug}`;

  return (
    <a
      href={url}
      className="block overflow-hidden rounded-md shadow-[0px_0px_4px_0px_#00000040]"
      data-btntype="blog"
      data-btnname={blogTitle}
    >
      <img
        src={blogImage?.src || '/opengraph.png'}
        alt={blogTitle}
        className="aspect-video w-full rounded-t-md object-cover"
      />

      <div className="flex min-h-0 flex-col overflow-hidden rounded-md bg-white p-4 md:h-36">
        <p className="mb-1 text-xs text-gray-500">
          {/* {blogDate ? format(new Date(blogDate), 'MMMM dd, yyyy') : null} */}
        </p>
        <h3 className="line-clamp-2 mb-2 text-lg font-medium leading-tight">
          {blogTitle}
        </h3>
        <div className="line-clamp-3 flex-1 overflow-hidden text-sm text-gray-500">
          {blogDescription}
        </div>
      </div>
    </a>
  );
};

export default BlogCard;
