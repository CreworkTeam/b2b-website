export type RoadmapStep = {
  title: string
  description: string
}

export type PainCard = {
  title: string
  description: string
}

export type StatItem = {
  value: string
  label: string
}

export type Testimonial = {
  quote: string
  name: string
  role: string
  image: string
}

export const roadmapSteps: RoadmapStep[] = [
  {
    title: 'Market Validator',
    description: 'Stress-test your assumptions against real market demand data.',
  },
  {
    title: 'Technical Scope',
    description: 'Define the architectural backbone and MVP feature set.',
  },
  {
    title: 'Execution Plan',
    description: 'A 12-week sprint logic tailored to your specific constraints.',
  },
  {
    title: 'Resource Allocation',
    description: 'Connect with vetted partners and infrastructure tools.',
  },
  {
    title: 'Launch Engine',
    description: 'Final go-to-market protocol and feedback loops.',
  },
]

export const painCards: PainCard[] = [
  {
    title: 'Overcharged?',
    description:
      'Agencies often inflate scope to increase billing. We provide exact technical specs to hold them accountable to your budget.',
  },
  {
    title: 'Too Complex?',
    description:
      'We translate high-level vision into logic flows and data schemas that developers can actually understand from day one.',
  },
  {
    title: 'Validated?',
    description:
      "Do not build features no one wants. Every blueprint starts with a demand audit to ensure market-fit is built in.",
  },
]

export const stats: StatItem[] = [
  { value: '2,400+', label: 'Active solo founders' },
  { value: '$500M+', label: 'Collective revenue' },
  { value: '94%', label: 'Retention rate' },
]

export const testimonials: Testimonial[] = [
  {
    quote:
      'Founder OS did not just give me a roadmap; they gave me the engine. My business grew 4x in 6 months without adding a single headcount.',
    name: 'Marcus Chen',
    role: 'CEO @ FlowState',
    image: 'https://i.pravatar.cc/160?img=56',
  },
  {
    quote:
      'The level of detail in the editorial architecture is insane. It is the first system that actually understands how my creative brain works.',
    name: 'Sarah Jenkins',
    role: 'Founder @ The Edit',
    image: 'https://i.pravatar.cc/160?img=49',
  },
]
