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
  livelink: string;
  rtl?: boolean;
}

const LOCAL_AI_CASE_STUDY_CARDS = [
  {
    title: 'Same Day Proposals for a Roofing Contractor',
    description:
      'An agentic proposal engine reads job details from the CRM and drafts complete proposals automatically. Faster responses converted directly into more closed jobs.',
    span: '2 weeks to same day turnaround',
    tags: ['Agentic Proposal Engine', 'CRM Integration', 'Revenue Automation'],
    images: [{ src: '/ai-case-studies/ai-proposal.svg', alt: 'Proposal' }],
    rtl: true,
    link: '/case-studies/ai-proposal-automation',
    livelink: '',
  },
  {
    title: 'Learning Operations on Autopilot',
    description:
      "Learner health, mentor matching and cohort intelligence agents took over an edtech platform's operations end to end. The next cohort grew 40% with zero new hires.",
    span: '50% Ops Capacity Recovered',
    tags: ['Multi Agent System', 'Learner Intelligence', 'Cohort Analytics'],
    images: [{ src: '/ai-case-studies/ai-learning.svg', alt: 'Learning' }],
    rtl: false,
    link: '/case-studies/ai-learning-operations',
    livelink: '',
  },
  {
    title: 'Lead Intelligence at 5x Volume',
    description:
      'A research and qualification system that finds, researches and qualifies prospects around the clock, cutting manual research from 15 hours a week to 2.',
    span: '5x Outreach Capacity',
    tags: ['Research Automation', 'Lead Qualification', 'Personalized Outreach'],
    images: [{ src: '/ai-case-studies/ai-lead.svg', alt: 'Lead intelligence' }],
    rtl: true,
    link: '/case-studies/ai-lead-intelligence',
    livelink: '',
  },
];

const ProposalSVG = () => (
  <div className="case-img w-full h-full border border-[#262626] rounded-xl overflow-hidden" aria-hidden="true">
    <svg viewBox="0 0 340 180" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
      <defs>
        <pattern id="d1-proposal" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.07)" />
        </pattern>
      </defs>
      <rect width="340" height="180" fill="url(#d1-proposal)" />
      <rect x="60" y="34" width="150" height="112" rx="8" fill="none" stroke="rgba(255,255,255,0.22)" />
      <line x1="78" y1="58" x2="192" y2="58" stroke="rgba(255,255,255,0.30)" strokeWidth={2} className="proposal-line" />
      <line x1="78" y1="76" x2="176" y2="76" stroke="rgba(255,255,255,0.16)" strokeWidth={2} className="proposal-line" />
      <line x1="78" y1="94" x2="186" y2="94" stroke="rgba(255,255,255,0.16)" strokeWidth={2} className="proposal-line" />
      <line x1="78" y1="112" x2="160" y2="112" stroke="rgba(255,255,255,0.16)" strokeWidth={2} className="proposal-line" />
      <circle cx="248" cy="118" r="26" fill="none" stroke="rgba(255,255,255,0.35)" />
      <path d="M 238 118 L 246 126 L 260 110" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const LearningSVG = () => (
  <div className="case-img w-full h-full border border-[#262626] rounded-xl overflow-hidden" aria-hidden="true">
    <svg viewBox="0 0 340 180" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
      <defs>
        <pattern id="d1-learning" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.07)" />
        </pattern>
      </defs>
      <rect width="340" height="180" fill="url(#d1-learning)" />
      <line x1="90" y1="90" x2="170" y2="46" stroke="rgba(255,255,255,0.18)" />
      <line x1="90" y1="90" x2="170" y2="134" stroke="rgba(255,255,255,0.18)" />
      <line x1="170" y1="46" x2="250" y2="90" stroke="rgba(255,255,255,0.18)" />
      <line x1="170" y1="134" x2="250" y2="90" stroke="rgba(255,255,255,0.18)" />
      <line x1="170" y1="46" x2="170" y2="134" stroke="rgba(255,255,255,0.12)" />
      <circle cx="90" cy="90" r="7" fill="none" stroke="rgba(255,255,255,0.45)" />
      <circle cx="170" cy="46" r="7" fill="none" stroke="rgba(255,255,255,0.45)" />
      <circle cx="170" cy="134" r="7" fill="none" stroke="rgba(255,255,255,0.45)" />
      <circle cx="250" cy="90" r="7" fill="none" stroke="rgba(255,255,255,0.45)" />
      <circle id="shifting-dot" cx="250" cy="90" r="3" fill="rgba(255,255,255,0.8)" />
    </svg>
  </div>
);

const LeadSVG = () => (
  <div className="case-img w-full h-full border border-[#262626] rounded-xl overflow-hidden" aria-hidden="true">
    <svg viewBox="0 0 340 180" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
      <defs>
        <pattern id="d1-lead" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.07)" />
        </pattern>
      </defs>
      <rect width="340" height="180" fill="url(#d1-lead)" />
      <circle cx="170" cy="90" r="4" fill="rgba(255,255,255,0.8)" />
      <circle cx="170" cy="90" r="24" fill="none" stroke="rgba(255,255,255,0.3)" />
      <circle cx="170" cy="90" r="46" fill="none" stroke="rgba(255,255,255,0.2)" />
      <circle cx="170" cy="90" r="68" fill="none" stroke="rgba(255,255,255,0.1)" />

      <g className="orbit-group orbit-group-1">
        <circle cx="170" cy="66" r="3" fill="rgba(255,255,255,0.7)" />
      </g>
      <g className="orbit-group orbit-group-2">
        <circle cx="212" cy="64" r="3.5" fill="rgba(255,255,255,0.55)" />
        <circle cx="128" cy="116" r="3.5" fill="rgba(255,255,255,0.55)" />
      </g>
      <g className="orbit-group orbit-group-3">
        <circle cx="196" cy="140" r="3.5" fill="rgba(255,255,255,0.4)" />
        <circle cx="110" cy="58" r="3.5" fill="rgba(255,255,255,0.4)" />
        <circle cx="236" cy="108" r="3.5" fill="rgba(255,255,255,0.55)" />
      </g>
    </svg>
  </div>
);

const getAiSvg = (src: string) => {
  if (src.includes('ai-proposal.svg')) return <ProposalSVG />;
  if (src.includes('ai-learning.svg')) return <LearningSVG />;
  if (src.includes('ai-lead.svg')) return <LeadSVG />;
  return null;
};

const CaseStudiesSwitch = ({ sticky, limit, showSearch, isAi }: { sticky: boolean; limit?: number; showSearch?: boolean; isAi?: boolean }) => {
  const [tab, setTab] = useState(isAi ? 'ai' : 'mvp');
  const [searchQuery, setSearchQuery] = useState('');
  const caseStudyContainerRef = useRef<HTMLDivElement>(null);

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

  const onTabChange = (value: React.SetStateAction<string>) => {
    handleScrollToSectionTop();
    setTab(value);
  };

  const items = isAi
    ? [
      {
        tab: {
          value: 'ai',
          label: 'AI Systems',
        },
        content: LOCAL_AI_CASE_STUDY_CARDS,
      },
    ]
    : [
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
      <Tabs value={tab} onValueChange={onTabChange} defaultValue={isAi ? 'ai' : 'mvp'} className="space-y-12 pb-24">
        {!isAi && (
          <TabsList
            className={cn('mx-auto grid h-12 w-10/12 grid-cols-2 rounded-2xl shadow-[0px_0px_6px_0px_#00000040] sm:w-[300px]', {
              'sticky top-10 z-40': sticky,
            })}
          >
            {items.map((item) => (
              <TabsTrigger key={item.tab.value} value={item.tab.value} className="h-full rounded-xl nav-link">
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
              filteredContent = item.content.filter(
                (card) =>
                  card.title.toLowerCase().includes(q) ||
                  card.description.toLowerCase().includes(q) ||
                  card.tags.some((tag) => tag.toLowerCase().includes(q)),
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
                  <div className="py-20 text-center text-gray-500">No case studies found matching "{searchQuery}"</div>
                )}
              </TabsContent>
            );
          })}
        </div>
      </Tabs>
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
      className={cn('case-studies-container group relative flex origin-top cursor-pointer overflow-hidden', {
        'flex-col md:flex-row-reverse': rtl && !isAi,
        'flex-col md:flex-row': !rtl && !isAi,
        'flex-col': isAi,
        'w-full': isAi,
        'relative md:sticky md:top-[calc(16vh)] md:animate-scaledown': sticky,
        'z-[var(--z-index)]': sticky,
        'fade-in-up': !sticky,
        'bg-white text-black': !isAi,
        'bg-[#141414] text-[#E5E5E5] border border-white/10 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)]': isAi,
      })}
      onClick={() => window.open(link, '_self')}
    >
      <div className={cn('flex-1', images[1] && !isAi ? 'space-y-4 md:space-y-12' : 'flex items-center justify-center')}>
        <div className={cn('w-full', isAi ? 'aspect-[2/1] md:aspect-[2.2/1]' : 'aspect-video')}>
          {isAi && images[0]?.src && getAiSvg(images[0].src) ? (
            getAiSvg(images[0].src)
          ) : (
            <img
              className={cn('h-full w-full rounded-xl object-cover object-top', isAi ? 'border border-[#262626]' : 'border')}
              src={images[0]?.src}
              alt={images[0]?.alt}
              width={800}
              height={450}
            />
          )}
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

      <div className={cn('relative flex-1 flex flex-col justify-between', isAi ? 'px-6 py-3 md:px-8 md:py-5' : '')}>
        <div className="space-y-6">
          <div className="space-y-6">
            <h2 className={cn('text-2xl font-semibold sm:text-3xl', isAi ? 'text-white' : 'text-[#020617]')}>{title}</h2>
            <p className={cn(isAi ? 'text-[#A3A3A3]' : '')}>{description}</p>
          </div>

          {span ? (
            <div className={cn('flex w-fit space-x-1 rounded-full px-2 py-1 text-xs', isAi ? 'bg-[#1A2E20] text-[#71C782]' : 'bg-[#EEF5F0] text-[#589E67]')}>
              <img className="inline-block h-4 w-4" src="/icons/trend-up.svg" alt="Arrow Up" width={16} height={16} />
              <span className="line-clamp-1 text-[clamp(0px,2.5vw,12px)]">{span}</span>
            </div>
          ) : null}

          <div className="space-y-4">
            {tags.map((item, tagIndex) => (
              <div
                key={tagIndex}
                className={cn(
                  'w-fit rounded-full border px-3 py-[0.3rem] text-[clamp(10px,3vw,12px)] sm:text-sm',
                  isAi ? 'border-[#333] text-[#ccc] shadow-none' : 'border-[#CFCFCF] shadow-[0px_0px_10px_0px_#00000012]',
                )}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={link}
            className={cn(
              'card-btn card-btn--light flex cursor-pointer items-center gap-0 py-4 font-semibold transition-all hover:gap-1 group-hover:gap-1',
              isAi ? 'text-white' : ''
            )}
            data-btntype="view CTA"
            onClick={(e) => e.stopPropagation()}
          >
            <span>View Product</span>
            <img className={cn('inline-block size-6', isAi && 'invert')} src="/icons/arrow-right.svg" alt="Arrow Right" width={16} height={16} />
          </a>

          {livelink && (
            <a
              href={livelink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn flex w-full flex-row justify-center gap-2 text-center sm:mx-0 sm:w-fit md:px-6"
              data-btntype="live website CTA"
              onClick={(e) => e.stopPropagation()}
            >
              <span>View Live Link</span> <ArrowRight />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseStudiesSwitch;