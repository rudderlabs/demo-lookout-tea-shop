'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/shared/Button';
import {
  trackPromotionClicked,
  trackPromotionViewed,
  useRudderAnalytics,
} from '@/lib/analytics';

interface HeroBannerProps {
  promotion: {
    id: string;
    name: string;
    creative: string;
    position: string;
    description: string;
    cta_text: string;
    cta_url: string;
  };
}

export function HeroBanner({ promotion }: HeroBannerProps): React.JSX.Element {
  const analytics = useRudderAnalytics();
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (!analytics || hasTrackedView.current) return;
    hasTrackedView.current = true;

    trackPromotionViewed(analytics, {
      promotion_id: promotion.id,
      name: promotion.name,
      creative: promotion.creative,
      position: promotion.position,
    });
  }, [analytics, promotion]);

  function handleCtaClick(): void {
    if (!analytics) return;

    trackPromotionClicked(analytics, {
      promotion_id: promotion.id,
      name: promotion.name,
      creative: promotion.creative,
      position: promotion.position,
    });
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-matcha-dark via-matcha to-matcha-light">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-cream" />
        <div className="absolute -bottom-10 right-10 h-60 w-60 rounded-full bg-oolong" />
        <div className="absolute right-1/3 top-1/4 h-40 w-40 rounded-full bg-cream" />
      </div>

      {/* Leaf pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <pattern
            id="leaf-pattern"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M10 2c-4 4-4 12 0 16 4-4 4-12 0-16z"
              fill="currentColor"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#leaf-pattern)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 lg:py-40">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-cream sm:text-5xl lg:text-6xl">
            {promotion.name}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-cream/85 sm:text-xl">
            {promotion.description}
          </p>
          <div className="mt-10">
            <Link href={promotion.cta_url} onClick={handleCtaClick}>
              <Button size="lg" className="bg-cream text-matcha-dark hover:bg-cream/90 active:bg-cream/80 shadow-lg">
                {promotion.cta_text}
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative tea cup illustration */}
        <div className="absolute bottom-8 right-8 hidden text-cream/10 lg:block">
          <svg
            className="h-64 w-64"
            viewBox="0 0 120 120"
            fill="currentColor"
            aria-hidden="true"
          >
            <ellipse cx="50" cy="85" rx="35" ry="8" />
            <path d="M20 45c0-20 15-35 30-35s30 15 30 35v30c0 5-13 10-30 10S20 80 20 75V45z" />
            <path d="M80 50c10 0 18 5 18 15s-8 15-18 15" fill="none" stroke="currentColor" strokeWidth="4" />
            {/* Steam */}
            <path d="M35 15c0-5 5-8 5-13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M50 12c0-5 5-8 5-13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M65 15c0-5 5-8 5-13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}
