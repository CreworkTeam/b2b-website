import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import BlogCard from './blog-card';

function FeaturedCarousel({ blogs }) {
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="w-full"
    >
      <CarouselContent className="-mt-1 h-full">
        {blogs.map(({ url, ...frontmatter }, idx) => {
          return (
            <CarouselItem key={idx} className="md:basis-1/2">
              <div className="p-1">
                <BlogCard url={url} {...frontmatter} />
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default FeaturedCarousel;
