import React from 'react';
import Link from 'next/link';

export interface AuthHeaderProps {
  homePage?: string;
  logo?: React.ReactNode | string;
  title: string;
  subtitle?: string;
  backLabel?: string;
}

export function AuthHeader({ homePage, logo, title, subtitle, backLabel = 'Home' }: AuthHeaderProps) {
  return (
    <div className="bg-white p-8 pb-0">
      <div className="flex items-start justify-between">
        {homePage ? (
          <Link
            href={homePage}
            className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {backLabel}
          </Link>
        ) : (
          <span className="w-16" aria-hidden="true" />
        )}

        <div className="flex-1 flex justify-center">
          {logo ? (
            typeof logo === 'string' ? (
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white text-lg font-bold">
                {logo}
              </div>
            ) : (
              <div className="inline-flex items-center gap-3 text-left">{logo}</div>
            )
          ) : null}
        </div>

        <span className="w-16" aria-hidden="true" />
      </div>

      <div className="mt-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        {subtitle ? <p className="text-slate-500 mt-2 text-sm">{subtitle}</p> : null}
      </div>
    </div>
  );
}
