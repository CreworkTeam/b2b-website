import React, { useEffect, useRef, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { TabsContent } from '@radix-ui/react-tabs';
import { MVP_WEBSITE_CASE_STUDY_CARDS, WEBSITE_CASE_STUDY_CARDS } from '@/constants.ts';

interface ImageProps {
  src: string;
  alt: string;
}

interface CaseStudyCardProps {
  images: ImageProps[];
  title: string;
  description: string;
  span: string;
  tags: string[];
  link: string;
  rtl?: boolean;
}

const CaseStudiesSwitch = ({ sticky }: { sticky: boolean }) => {
  const [tab, setTab] = useState('mvp');

  const onTabChange = (value: React.SetStateAction<string>) => {
    handleScrollToSectionTop();
    setTab(value);
  };

  const caseStudyContainerRef = useRef<HTMLDivElement>(null);
  const items = [
    {
      tab: {
        value: 'website',
        label: 'Website',
      },
      content: WEBSITE_CASE_STUDY_CARDS,
    },
    {
      tab: {
        value: 'mvp',
        label: 'MVP',
      },
      content: MVP_WEBSITE_CASE_STUDY_CARDS,
    },
  ];

  const handleScrollToSectionTop = () => {
    const csc = document.getElementById('case-studies');
    const headerOffset = 170;
    const elementPosition = csc?.getBoundingClientRect()?.top || 0;
    const offsetPosition = elementPosition + window.scrollY + headerOffset;
    if (csc) {
      setTimeout(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'instant',
        });
      }, 0);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (caseStudyContainerRef.current) {
        const bounds = caseStudyContainerRef.current.getBoundingClientRect();
        const scroll = (bounds.top * -1) / bounds.height;
        caseStudyContainerRef.current.style.setProperty('--scroll', `${scroll}`);
      }
    };

    window.addEventListener('scroll', handleScroll, false);

    return () => {
      window.removeEventListener('scroll', handleScroll, false);
    };
  }, []);

  return (
    <Tabs value={tab} onValueChange={onTabChange} defaultValue="website" className="space-y-12">
      <TabsList
        className={cn(
          'mx-auto grid h-12 w-10/12 grid-cols-2 rounded-2xl shadow-[0px_0px_6px_0px_#00000040] sm:w-[300px]',
          {
            'sticky top-10': sticky,
          },
        )}
      >
        {items.map((item) => (
          <TabsTrigger key={item.tab.value} value={item.tab.value} className="h-full rounded-xl">
            {item.tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <div id="case-study-container" ref={caseStudyContainerRef}>
        {items.map((item) => (
          <TabsContent key={item.tab.value} value={item.tab.value} className="space-y-16">
            {item?.content?.map((content, index) => (
              <CaseStudyCard
                key={`${item.tab.value}-${index}`}
                cardContent={content}
                index={index}
                length={item.content.length}
                sticky={sticky}
              />
            ))}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};

const CaseStudyCard = ({
  cardContent,
  index,
  length,
  sticky,
}: {
  cardContent: CaseStudyCardProps;
  index: number;
  length: number;
  sticky: boolean;
}) => {
  const { images, title, description, span, tags, link, rtl } = cardContent;

  return (
    <div
      key={index}
      style={
        {
          '--scale': `calc(0.8 + ${((index + 1) / length) * 0.2})`,
          '--card-scroll': `calc((var(--scroll) * ${length}) - ${index})`,
          '--z-index': `${index + 1}`,
          animationDelay: `calc(var(--card-scroll) * -1s)`,
        } as React.CSSProperties
      }
      className={cn(
        'case-studies-container group relative flex origin-top cursor-pointer overflow-hidden bg-white',
        {
          'flex-col md:flex-row-reverse': rtl,
          'relative md:sticky md:top-[calc(16vh)] md:animate-scaledown': sticky,
          'z-[var(--z-index)]': sticky,
        },
      )}
      onClick={() => window.open(link, '_self')}
    >
      <div className="-mb-2 flex-1 space-y-4 md:space-y-12">
        <div className="aspect-video">
          <img
            className="h-full w-full rounded-xl border object-cover object-top"
            src={images[0].src}
            alt={images[0].alt}
            width={800}
            height={450}
          />
        </div>
        <div className="aspect-[16/8]">
          <img
            className="h-full w-full rounded-xl border object-cover object-top"
            src={images[1].src}
            alt={images[1].alt}
            width={800}
            height={450}
          />
        </div>
      </div>
      <div className="relative flex-1 space-y-6">
        <h2 className="text-2xl font-semibold text-[#020617] sm:text-3xl">{title}</h2>
        <p>{description}</p>
        {span ? (
          <div className="flex w-fit space-x-1 rounded-full bg-[#EEF5F0] px-2 py-1 text-xs text-[#589E67]">
            <img
              className="inline-block h-4 w-4"
              src="/icons/trend-up.svg"
              alt="Arrow Up"
              width={16}
              height={16}
            />
            <span className="line-clamp-1 text-[clamp(0px,2.5vw,12px)]">{span}</span>
          </div>
        ) : null}
        <div className="space-y-4">
          {tags.map((item, tagIndex) => (
            <div
              key={tagIndex}
              className="w-fit rounded-full border border-[#CFCFCF] px-3 py-[0.3rem] text-[clamp(10px,3vw,12px)] shadow-[0px_0px_10px_0px_#00000012] sm:text-sm"
            >
              {item}
            </div>
          ))}
        </div>
        <a
          href={link}
          className="flex cursor-pointer items-center gap-0 py-4 font-semibold transition-all hover:gap-1 group-hover:gap-1"
          data-btntype="view CTA"
        >
          <span>View Project</span>
          <img
            className="inline-block size-6"
            src="/icons/arrow-right.svg"
            alt="Arrow Right"
            width={16}
            height={16}
          />
        </a>
      </div>
    </div>
  );
};

export default CaseStudiesSwitch;
