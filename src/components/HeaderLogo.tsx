import React from 'react';

export interface HeaderLogoProps {
  onClick: () => void;
  isNormalBackground: boolean;
  children?: React.ReactNode;
  companyName?: string;
  logoLetter?: string;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({ 
  onClick, 
  isNormalBackground, 
  children,
  companyName = 'Oueway',
  logoLetter = 'O'
}) => {
  if (children) {
    return <div onClick={onClick} className="cursor-pointer">{children}</div>;
  }

  return (
    <div
      className="shrink-0 flex items-center cursor-pointer"
      onClick={onClick}
    >
      <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-2">
        {logoLetter}
      </div>
      <span className={`font-bold text-2xl tracking-tight ${isNormalBackground ? 'text-gray-900' : 'text-white'}`}>
        {companyName}<span className="font-light">Tech</span>
      </span>
    </div>
  );
};
