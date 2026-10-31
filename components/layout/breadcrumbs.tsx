'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from '@/components/ui/icons';
import { BreadcrumbsJsonLd } from '@/components/seo/json-ld';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems = [{ label: 'Home', href: '/' }, ...items];

  return (
    <>
      <BreadcrumbsJsonLd
        items={allItems.map((item) => ({
          name: item.label,
          url: item.href
        }))}
      />
      <nav aria-label="Breadcrumb" className="py-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ol className="flex items-center flex-wrap gap-1.5 text-xs text-gray-500 font-medium">
          <li>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-gray-500 hover:text-[#131A22] transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-gray-400" />
              <span>Startseite</span>
            </Link>
          </li>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" aria-hidden="true" />
                {isLast ? (
                  <span className="text-[#131A22] font-semibold truncate max-w-[240px] sm:max-w-none" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-500 hover:text-[#131A22] transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
