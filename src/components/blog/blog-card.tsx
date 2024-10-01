import { format } from 'date-fns';

const BlogCard = (props) => {
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
        className="aspect-[16/8] size-full rounded-t-md object-cover"
      />

      <div className="p-4 bg-white rounded-md">
        <p className="text-xs text-gray-500">
          {blogDate ? format(new Date(blogDate), 'MMMM dd, yyyy') : null}
        </p>
        <h3 className="text-lg font-medium truncate">{blogTitle}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{blogDescription}</p>
      </div>
    </a>
  );
};

export default BlogCard;
