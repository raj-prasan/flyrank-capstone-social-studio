import type { Platform, PlatformConfig } from '../types';

export const PLATFORMS: Record<Platform, PlatformConfig> = {
  x: {
    id: 'x',
    name: 'X (Twitter)',
    displayName: 'X',
    maxLength: 280,
    maxHashtags: 2,
    tone: 'Concise & punchy, single clear insight',
    badge: '280 chars max',
    placeholder: 'Draft your punchy X post here...',
    accentClass: 'border-foreground/30 text-foreground',
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    displayName: 'LinkedIn',
    maxLength: 3000,
    maxHashtags: 5,
    tone: 'Professional, structured insights & takeaways',
    badge: '3,000 chars max',
    placeholder: 'Draft your high-engagement LinkedIn article/post here...',
    accentClass: 'border-[#0a66c2]/40 text-[#0a66c2]',
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    displayName: 'Instagram',
    maxLength: 2200,
    maxHashtags: 10,
    tone: 'Engaging, storytelling caption with curated tags',
    badge: '2,200 chars max',
    placeholder: 'Draft your aesthetic Instagram caption here...',
    accentClass: 'border-[#e1306c]/40 text-[#e1306c]',
  },
};

export const SAMPLE_ARTICLES = [
  {
    title: 'The Shift to AI-Native Development: Beyond Autocomplete',
    url: 'https://flyrank.com/blog/ai-native-development-2026',
    content: `Software engineering is undergoing its most profound architectural transformation since the transition from on-premise servers to cloud computing. For decades, developer tooling focused on incremental productivity gains—better linters, syntax highlighters, and integrated debuggers. Today, generative AI and autonomous agentic workflows are flipping the paradigm from assisted programming to autonomous code orchestration.

In this new era, developers spend less time writing boilerplate syntax and far more time defining intent, reviewing multi-step architectural execution plans, and verifying system constraints. AI agents don't merely suggest the next 5 tokens; they formulate hypotheses, run automated test suites, evaluate failures, and iterate in closed feedback loops.

Teams embracing agentic pair programming report up to a 4x reduction in feature delivery cycle times. However, the true bottleneck has shifted from raw typing throughput to rigorous verification, high-fidelity context curation, and continuous integration observability. Organizations that master prompt topology, sandbox isolation, and deterministic validation will dominate the next decade of software craftsmanship.`,
  },
  {
    title: 'Building Distributed BullMQ Queues with Redis in Modern Node.js',
    url: 'https://flyrank.com/blog/distributed-queues-bullmq-redis',
    content: `When building high-throughput microservices, background job orchestration is non-negotiable. Whether delivering transactional push notifications, batching media transcode jobs, or scheduling delayed social media broadcasts, synchronizing tasks across distributed Node.js nodes requires rock-solid queue guarantees.

BullMQ, built on top of Redis streams and atomic Lua scripts, provides deterministic idempotency, backoff retries, and delayed job execution without requiring heavy distributed brokers like Kafka for intermediate workloads. By leveraging Redis pub/sub alongside BullMQ's worker concurrency locks, developers achieve millisecond-level scheduling precision with minimal CPU footprint.

Key architectural takeaways:
1. Always configure unique idempotency keys to prevent duplicate execution during network partition retries.
2. Separate ingestion queues from high-latency AI generation workers to prevent thread-pool starvation.
3. Monitor queue lag with automated health probes to scale worker containers dynamically under burst traffic.`,
  },
  {
    title: 'Minimalist Design Systems in 2026: The Power of OKLCH Colors',
    url: 'https://flyrank.com/blog/minimalist-design-systems-oklch',
    content: `Color manipulation in CSS has historically suffered from the perceptual non-uniformity of sRGB and HSL. Two colors with identical HSL lightness values can appear dramatically different to the human eye, causing contrast failures and inconsistent branding across dark and light modes.

OKLCH fixes this fundamental flaw by decoupling perceptual lightness from chroma and hue in a mathematically uniform color space. With Tailwind CSS v4's native support for CSS variables in OKLCH, creating harmonious, accessible color palettes across dynamic themes becomes deterministic and mathematically balanced.

A truly aesthetic minimalist interface doesn't rely on decorative fluff; it relies on purposeful contrast, generous whitespace, deliberate typographic hierarchy, and subtle micro-interactions that respect user attention.`,
  },
];

export function extractHashtags(text: string): string[] {
  if (!text) return [];
  const matches = text.match(/#[a-zA-Z0-9_]+/g);
  return matches || [];
}

export function countCharacters(text: string): number {
  return text ? text.length : 0;
}
