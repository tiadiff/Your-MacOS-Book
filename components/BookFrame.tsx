import React from 'react';
import { BookColor } from '../types';

interface BookFrameProps {
  children: React.ReactNode;
  state?: 'cover' | 'open';
  color?: BookColor;
}

const colorClasses: Record<BookColor, string> = {
  brown: 'bg-[#5c3a21]',
  red: 'bg-[#7f1d1d]',
  blue: 'bg-[#1e3a8a]',
  green: 'bg-[#14532d]',
  black: 'bg-[#171717]',
};

const BookFrame: React.FC<BookFrameProps> = ({ children, state = 'open', color = 'brown' }) => {
  const isCover = state === 'cover';
  const bgClass = colorClasses[color] || colorClasses.brown;

  return (
    <div 
      className={`
        relative z-10 transition-all duration-700 perspective-1000
        ${isCover 
          ? 'w-full h-full cursor-pointer hover:transform hover:-translate-y-2 hover:shadow-2xl' 
          : 'w-full max-w-4xl aspect-[3/2] md:aspect-[2/1.35] shadow-2xl'
        }
      `}
    >
      {/* Leather Cover Background with dynamic color */}
      <div className={`absolute inset-0 ${bgClass} rounded-lg shadow-book transform transition-transform duration-700 ${isCover ? 'scale-100' : 'scale-[1.02] translate-y-1'}`}>
        {/* Texture overlay */}
        <div className="absolute inset-0 rounded-lg opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/leather.png")' }}></div>
        
        {/* Decorative Gold Border for Cover */}
        {isCover && (
          <div className="absolute inset-4 border-2 border-yellow-500/30 rounded opacity-70 pointer-events-none">
             <div className="absolute inset-1 border border-yellow-500/20 rounded-sm"></div>
             {/* Corner Ornaments */}
             <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-yellow-500/40 rounded-tl-lg"></div>
             <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-yellow-500/40 rounded-tr-lg"></div>
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-yellow-500/40 rounded-bl-lg"></div>
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-yellow-500/40 rounded-br-lg"></div>
          </div>
        )}
      </div>
      
      {/* The Spine (Only visible when open) */}
      {!isCover && (
        <div className={`absolute left-1/2 top-0 bottom-0 w-8 -ml-4 ${bgClass} z-20 rounded-sm opacity-90 hidden md:block shadow-inner`}></div>
      )}

      {/* Book Spine Effect for Closed Cover (Left side) */}
      {isCover && (
        <div className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-black/50 to-transparent rounded-l-lg z-20 border-l border-white/10"></div>
      )}

      {/* Pages Container / Cover Content Area */}
      <div 
        className={`
          absolute flex overflow-hidden rounded shadow-inner transition-all duration-700
          ${isCover 
            ? 'inset-0 m-0 bg-transparent flex-col items-center justify-center text-center p-6' 
            : 'inset-0 m-2 md:m-3 bg-paper-dark'
          }
        `}
      >
        {children}
      </div>

      {/* Page Thickness Effect (Stack of pages on sides) - Only when open */}
      {!isCover && (
        <>
          <div className="absolute top-4 bottom-4 right-0 w-2 bg-white border-l border-gray-300 opacity-50 hidden md:block" style={{ backgroundImage: 'linear-gradient(to right, #e5e5e5 1px, transparent 1px)', backgroundSize: '2px 100%' }}></div>
          <div className="absolute top-4 bottom-4 left-0 w-2 bg-white border-r border-gray-300 opacity-50 hidden md:block" style={{ backgroundImage: 'linear-gradient(to left, #e5e5e5 1px, transparent 1px)', backgroundSize: '2px 100%' }}></div>
        </>
      )}
    </div>
  );
};

export default BookFrame;