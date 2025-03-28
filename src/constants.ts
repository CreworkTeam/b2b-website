import { getCollection } from 'astro:content';
const casestudies = await getCollection('casestudy');

const CASE_STUDIES = [
  {
    title: 'Instant Business Valuation Web Application',
    description: 'How we built a quick, data-driven business valuations tool for FundsFinders.',
    src: '/portfolio/fundsfinder.png',
    alt: 'FundsFinder',
    link: '/case-studies/instant-business-valuation-web-application',
  },
  {
    title: 'Custom Learning Management System',
    description:
      'How we empowered Crework to increase engagement by deliver tailored learning experiences to aspiring Product Managers',
    src: '/portfolio/dashboard-2.png',
    alt: 'Custom Learning Management System',
    link: '/case-studies/custom-learning-management-system',
  },
  {
    title: 'Global Service Provider Website Redesign',
    description:
      'How we helped Travay Group with a complete redesign of their website to improve user experience and navigation.',
    src: '/portfolio/travaygroup.png',
    alt: 'Travay Group',
    link: '/case-studies/global-service-provider-website-redesign',
  },
];

const TESTIMONIALS = [
  {
    designation: 'Founder',
    companyName: 'Social Butterfly',
    testimonialText:
      'The experience has been extremely good. Their service exceeded all expectations, delivering outstanding results. Would recommend 10/10.',
    personName: 'Anupama Bhat',
    photo:
      'https://res.cloudinary.com/crework-cloud/image/upload/v1725960818/Crework%20Labs/anupama_p7ychd.jpg',
    country: 'India',
  },
  {
    designation: 'Co-Founder',
    companyName: 'TravayGroup',
    testimonialText:
      'I found their services to be extremely efficient and responsive. They consistently delivered prompt solutions that exceeded my expectations.',
    personName: 'Omar Alkhairy',
    photo: '/testimonials/omar-travay.png',
    country: 'Palestine',
  },
  {
    designation: 'Founder',
    companyName: 'FundsFinder',
    testimonialText:
      'Crework Labs was the best experience we ever had with an agency. They were fast with replies and deliveries, always ensuring that the final result was as expected. I will work with them in the future and totally recommend them.',
    personName: 'Om Rafols Cots',
    photo: '/testimonials/om.jpg',
    country: 'Spain',
  },
  {
    designation: 'Partner',
    companyName: 'White Swan Advisors',
    testimonialText:
      'Extremely professional, quick support, exceptional adherence to deadlines, and generally a breeze to work with.',
    personName: 'Abid Kamal',
    photo:
      'https://res.cloudinary.com/crework-cloud/image/upload/v1729096074/WhatsApp_Image_2024-10-16_at_21.56.11_dizacj.jpg',
    country: 'USA',
  },
];

const portfolio = [
  {
    image: '/portfolio/butterflies.png',
    name: 'Butterflies',
  },
  {
    image: '/portfolio/fundsfinder.png',
    name: 'Funds Finder',
  },
  {
    image: '/portfolio/feelgoodclub.png',
    name: 'Feel Good Club',
  },
  {
    image: '/portfolio/travaygroup.png',
    name: 'Travay Group',
  },
  {
    image: '/portfolio/PM.png',
    name: 'Product Management Cohort',
  },
  {
    image: '/portfolio/blendstudio.png',
    name: 'Blend Studio',
  },
  {
    image: '/portfolio/white-swan.png',
    name: 'White Swan',
  },
  {
    image: '/portfolio/site-genius.png',
    name: 'Site Genius',
  },
  {
    image: '/portfolio/quickfunds.png',
    name: 'QuickFunds'
  },
  {
    image: '/portfolio/ice-tribe-portfolio.png',
    name: 'Ice Tribe'
  },
  {
    image: '/portfolio/ace.png',
    name: 'Ace'
  },
  {
    image: '/portfolio/scale-up.png',
    name: 'Scale Up'
  },
];

const navLinks = [
  { href: '/#testimonials', text: 'Testimonials' },
  
  // { href: '/#our-impact', text: 'Our Impact' },
  { href: '/#case-studies', text: 'Case Studies' },
  { href:'/#team', text: 'Team' },
  { href: '/#pricing', text: 'Pricing' },
  { href: '/blog', text: 'Blogs', prefetch: true },
  { href: '/#contact-us', text: 'Contact Us' },
];

const socials = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/creworklabs',
    icon: '/social/linkedin.svg',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/CreworkHQ',
    icon: '/social/twitter.svg',
  },
];

const getSocialShareLinks = ({ url, title }: { url: string; title: string }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  return {
    LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    Twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
  };
};

const BOOK_CALL = 'https://calendly.com/creworklabs/30mins';
const LOOMS_ENDPOINT = 'https://app.loops.so/api/newsletter-form/clwv3dv6s014l11kiyput7szt';
const BLOG_RESULTS_LIMIT = 4;

const WEBSITE_CASE_STUDY_CARDS = casestudies
  .filter(({ data: { cstag } }) => cstag === 'website')
  .sort((a, b) => a.data.order - b.data.order)
  .map(({ data: { cstitle, csdescription, csspan, cstags, csimages, cslivelink }, slug }, index) => ({
    title: cstitle,
    description: csdescription,
    span: csspan,
    tags: cstags,
    images: csimages?.map(({ src, alt }) => ({ src, alt })),
    rtl: index % 2 === 0,
    link: `/case-studies/${slug}`,
    livelink: cslivelink
  }));

const MVP_WEBSITE_CASE_STUDY_CARDS = casestudies
  .filter(({ data: { cstag } }) => cstag === 'mvp')
  .sort((a, b) => a.data.order - b.data.order)
  .map(({ data: { cstitle, csdescription, csspan, cstags, csimages, cslivelink }, slug }, index) => ({
    title: cstitle,
    description: csdescription,
    span: csspan,
    tags: cstags,
    images: csimages?.map(({ src, alt }) => ({ src, alt })),
    rtl: index % 2 === 0,
    link: `/case-studies/${slug}`,
    livelink: cslivelink
  }));

export {
  CASE_STUDIES,
  TESTIMONIALS,
  BOOK_CALL,
  LOOMS_ENDPOINT,
  portfolio,
  navLinks,
  socials,
  BLOG_RESULTS_LIMIT,
  WEBSITE_CASE_STUDY_CARDS,
  MVP_WEBSITE_CASE_STUDY_CARDS,
  getSocialShareLinks,
};
