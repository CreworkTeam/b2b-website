import { format } from 'date-fns';

const BlogCard = (props) => {
  const { blogTitle, blogDescription, blogImage, blogDate, url } = props;

  return (
    <a
      href={url}
      className="block rounded-md shadow-[0px_0px_4px_0px_#00000040]"
      data-btntype="blog"
      data-btnname={blogTitle}
    >
      <img
        src={blogImage?.src}
        alt={blogTitle}
        className="aspect-[16/8] size-full rounded-t-md object-cover"
      />

      <div className="rounded-md bg-white p-4">
        <p className="text-xs text-gray-500">
          {blogDate ? format(new Date(blogDate), 'MMMM dd, yyyy') : null}
        </p>
        <h3 className="truncate text-lg font-medium">{blogTitle}</h3>
        <p className="line-clamp-2 text-sm text-gray-500">{blogDescription}</p>
      </div>
    </a>
  );
};

export default BlogCard;
