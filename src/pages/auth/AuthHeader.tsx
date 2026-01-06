import React from 'react';

export interface AuthHeaderProps {
  homePageUrl?: string;
  logo?: React.ReactNode | string;
  appName?: string;
}

export function AuthHeader({ homePageUrl, logo, appName }: AuthHeaderProps) {
  // 如果 logo 是字符串，则渲染为带有样式的元素
  let logoElement = logo;
  if (typeof logo === 'string') {
    logoElement = (
      <div className="flex items-center gap-3" aria-label="JS Shared Example logo">
        <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
          {logo}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{appName || ''}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-0 left-0 w-full p-4 z-5">
      <div className="w-full max-w-4xl mx-auto">
        <div className="pl-8 pr-8 pt-0 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 flex justify-start">
              {logoElement ? (
                <div 
                  onClick={homePageUrl ? (() => window.location.href = homePageUrl) : undefined} 
                  className={`inline-flex items-center gap-3 text-left ${homePageUrl ? 'cursor-pointer' : ''}`}
                >
                  {logoElement}
                </div>
              ) : null}
            </div>
          </div>
        </div>
     </div>
   </div>
  );
}
