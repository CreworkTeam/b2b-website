import { format } from 'date-fns';

const BlogCard = (props) => {
  const { blogTitle, blogDescription, blogImage, blogDate, url } = props;
  return (
    <a href={url} className="block aspect-[16/8] rounded-md shadow-[0px_0px_4px_0px_#00000040]">
      <img
        src={blogImage.src}
        alt={blogTitle}
        className="h-full w-full rounded-t-md object-cover"
      />

      <div className="rounded-md bg-white p-4">
        <p className="text-xs text-gray-500">{format(new Date(blogDate), 'MMMM dd, yyyy')}</p>
        <h3 className="text-lg font-medium">{blogTitle}</h3>
        <p className="line-clamp-2 text-sm text-gray-500">{blogDescription}</p>
      </div>
    </a>
  );
};

export default BlogCard;
