import React, { useEffect, useRef, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { TabsContent } from '@radix-ui/react-tabs';
import { MVP_WEBSITE_CASE_STUDY_CARDS, WEBSITE_CASE_STUDY_CARDS } from '@/constants.ts';
import { ArrowRight, Search } from 'lucide-react';

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
  livelink: string,
  rtl?: boolean;
}

const LOCAL_AI_CASE_STUDY_CARDS = [
  {
    title: 'Same Day Proposals for a Roofing Contractor',
    description: 'An agentic proposal engine reads job details from the CRM and drafts complete proposals automatically. Faster responses converted directly into more closed jobs.',
    span: '2 weeks to same day turnaround',
    tags: ['Agentic Proposal Engine', 'CRM Integration', 'Revenue Automation'],
    images: [{ src: '/ai-case-studies/ai-proposal.svg', alt: 'Proposal' }],
    rtl: true,
    link: '/case-studies/ai-proposal-automation',
    livelink: ''
  },
  {
    title: 'Learning Operations on Autopilot',
    description: 'Learner health, mentor matching and cohort intelligence agents took over an edtech platform\'s operations end to end. The next cohort grew 40% with zero new hires.',
    span: '50% Ops Capacity Recovered',
    tags: ['Multi Agent System', 'Learner Intelligence', 'Cohort Analytics'],
    images: [{ src: '/ai-case-studies/ai-learning.svg', alt: 'Learning' }],
    rtl: false,
    link: '/case-studies/ai-learning-operations',
    livelink: ''
  },
  {
    title: 'Lead Intelligence at 5x Volume',
    description: 'A research and qualification system that finds, researches and qualifies prospects around the clock, cutting manual research from 15 hours a week to 2.',
    span: '5x Outreach Capacity',
    tags: ['Research Automation', 'Lead Qualification', 'Personalized Outreach'],
    images: [{ src: '/ai-case-studies/ai-lead.svg', alt: 'Lead intelligence' }],
    rtl: true,
    link: '/case-studies/ai-lead-intelligence',
    livelink: ''
  }
];

const CaseStudiesSwitch = ({ sticky, limit, showSearch, isAi }: { sticky: boolean; limit?: number; showSearch?: boolean; isAi?: boolean }) => {
  const [tab, setTab] = useState(isAi ? 'ai' : 'website');
  const [searchQuery, setSearchQuery] = useState('');

  const onTabChange = (value: React.SetStateAction<string>) => {
    handleScrollToSectionTop();
    setTab(value);
  };

  const caseStudyContainerRef = useRef<HTMLDivElement>(null);
  const items = isAi ? [
    {
      tab: {
        value: 'ai',
        label: 'AI Systems',
      },
      content: LOCAL_AI_CASE_STUDY_CARDS,
    }
  ] : [
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
    <>
      <Tabs value={tab} onValueChange={onTabChange} defaultValue={isAi ? 'ai' : 'website'} className="space-y-12 pb-24">
        {!isAi && (
          <TabsList
            className={cn(
              'mx-auto grid h-12 w-10/12 grid-cols-2 rounded-2xl shadow-[0px_0px_6px_0px_#00000040] sm:w-[300px]',
              {
                'sticky top-10 z-40': sticky,
              },
            )}
          >
            {items.map((item) => (
              <TabsTrigger key={item.tab.value} value={item.tab.value} className="h-full rounded-xl">
                {item.tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        )}
        <div id="case-study-container" ref={caseStudyContainerRef}>
          {items.map((item) => {
            let filteredContent = item.content;
            if (searchQuery) {
              const q = searchQuery.toLowerCase();
              filteredContent = item.content.filter(card =>
                card.title.toLowerCase().includes(q) ||
                card.description.toLowerCase().includes(q) ||
                card.tags.some(tag => tag.toLowerCase().includes(q))
              );
            }

            const safeContent = filteredContent || [];
            return (
              <TabsContent key={item.tab.value} value={item.tab.value} className="space-y-16">
                {safeContent.slice(0, limit || safeContent.length).map((content, index) => (
                  <CaseStudyCard
                    key={`${item.tab.value}-${index}`}
                    cardContent={content}
                    index={index}
                    length={Math.min(safeContent.length, limit || safeContent.length)}
                    sticky={sticky}
                    isAi={isAi}
                  />
                ))}
                {safeContent.length === 0 && (
                  <div className="py-20 text-center text-gray-500">
                    No case studies found matching "{searchQuery}"
                  </div>
                )}
              </TabsContent>
            );
          })}
        </div>
      </Tabs>

      {showSearch && (
        <div className="fixed bottom-12 left-1/2 z-50 w-[90%] max-w-[600px] -translate-x-1/2">
          <div className="w-full">
            <div
              className={cn(
                "flex items-center overflow-hidden rounded-full border shadow-2xl",
                isAi ? "bg-white border-black/10 text-black" : "bg-black/70 border-white/10 text-white shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              )}
              style={{
                backdropFilter: isAi ? "blur(24px)" : "blur(200px)",
                WebkitBackdropFilter: isAi ? "blur(24px)" : "blur(200px)",
              }}
            >
              <input
                type="text"
                placeholder="Search case studies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "flex-1 bg-transparent px-6 py-4 text-sm focus:outline-none",
                  isAi ? "placeholder:text-gray-500 text-black" : "placeholder:text-white/50 text-white"
                )}
              />
              <div
                className={cn(
                  "flex cursor-pointer items-center justify-center rounded-full p-2 mr-2 transition-colors",
                  isAi ? "bg-white hover:bg-gray-200" : "bg-black hover:bg-black/80"
                )}
                onClick={() => {
                  if (searchQuery) handleScrollToSectionTop();
                }}
              >
                <Search className={cn("h-4 w-4", isAi ? "text-black" : "text-white")} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const CaseStudyCard = ({
  cardContent,
  index,
  length,
  sticky,
  isAi,
}: {
  cardContent: CaseStudyCardProps;
  index: number;
  length: number;
  sticky: boolean;
  isAi?: boolean;
}) => {
  const { images, title, description, span, tags, link, rtl, livelink } = cardContent;

  return (
    <div
      key={index}
      style={
        {
          '--scale': `calc(0.8 + ${((index + 1) / length) * 0.2})`,
          '--card-scroll': `calc((var(--scroll) * ${length}) - ${index})`,
          '--z-index': `${index + 1}`,
          animationDelay: sticky ? `calc(var(--card-scroll) * -1s)` : `${index * 0.15}s`,
        } as React.CSSProperties
      }
      className={cn(
        'case-studies-container group relative flex origin-top cursor-pointer overflow-hidden',
        {
          'flex-col md:flex-row-reverse': rtl && !isAi,
          'flex-col md:flex-row': !rtl && !isAi,
          'flex-col': isAi,
          'w-full': isAi,
          'relative md:sticky md:top-[calc(16vh)] md:animate-scaledown': sticky,
          'z-[var(--z-index)]': sticky,
          'fade-in-up': !sticky,
          'bg-white text-black': !isAi,
          'bg-[#141414] text-[#E5E5E5] border border-white/10 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)]': isAi,
        },
      )}
      onClick={() => window.open(link, '_self')}
    >
      <div className={cn("flex-1", images[1] && !isAi ? "space-y-4 md:space-y-12" : "flex items-center justify-center")}>
        <div className={cn("w-full", isAi ? "aspect-[2/1] md:aspect-[2.2/1]" : "aspect-video")}>
          <img
            className={cn("h-full w-full rounded-xl object-cover object-top", isAi ? "border border-[#262626]" : "border")}
            src={images[0]?.src}
            alt={images[0]?.alt}
            width={800}
            height={450}
          />
        </div>
        {images[1] && !isAi && (
          <div className="aspect-[16/8]">
            <img
              className="h-full w-full rounded-xl border object-cover object-top"
              src={images[1].src}
              alt={images[1].alt}
              width={800}
              height={450}
            />
          </div>
        )}
      </div>
      <div className={cn("relative flex-1 flex flex-col justify-between", isAi ? "px-6 py-3 md:px-8 md:py-5" : "")}>
        <div className="space-y-6">
          <div className="space-y-6" onClick={(e) => {
            e.stopPropagation(); // Prevent event from bubbling up to parent
          }}>
            <h2 className={cn("text-2xl font-semibold sm:text-3xl", isAi ? "text-white" : "text-[#020617]")}>{title}</h2>
            <p className={cn(isAi ? "text-[#A3A3A3]" : "")}>{description}</p>
          </div>
          {span ? (
            <div className={cn("flex w-fit space-x-1 rounded-full px-2 py-1 text-xs", isAi ? "bg-[#1A2E20] text-[#71C782]" : "bg-[#EEF5F0] text-[#589E67]")}>
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
                className={cn("w-fit rounded-full border px-3 py-[0.3rem] text-[clamp(10px,3vw,12px)] sm:text-sm", isAi ? "border-[#333] text-[#ccc] shadow-none" : "border-[#CFCFCF] shadow-[0px_0px_10px_0px_#00000012]")}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={link}
            className={cn("flex cursor-pointer items-center gap-0 py-4 font-semibold transition-all hover:gap-1 group-hover:gap-1", isAi ? "text-white" : "")}
            data-btntype="view CTA"
            onClick={(e) => e.stopPropagation()}
          >
            <span>View Project</span>
            <img
              className={cn("inline-block size-6", isAi && "invert")}
              src="/icons/arrow-right.svg"
              alt="Arrow Right"
              width={16}
              height={16}
            />
          </a>

          {livelink && <a
            href={livelink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn flex w-full flex-row justify-center gap-2 text-center sm:mx-0 sm:w-fit md:px-6"
            data-btntype="live website CTA"
            onClick={(e) => e.stopPropagation()}
          >
            <span>View Live Link</span> {" "} <ArrowRight />
          </a>}
        </div>
      </div>
    </div>
  );
};

export default CaseStudiesSwitch;
