import React from 'react';

interface BookFrameProps {
  children: React.ReactNode;
  state?: 'cover' | 'open';
}

const BookFrame: React.FC<BookFrameProps> = ({ children, state = 'open' }) => {
  const isCover = state === 'cover';

  return (
    <div 
      className={`
        relative z-10 transition-all duration-700 perspective-1000
        ${isCover 
          ? 'w-full max-w-md aspect-[1/1.4] cursor-pointer hover:transform hover:-translate-y-2' 
          : 'w-full max-w-6xl aspect-[3/2] md:aspect-[2/1.4]'
        }
      `}
    >
      {/* Leather Cover Background */}
      <div className={`absolute inset-0 bg-leather rounded-lg shadow-book transform transition-transform duration-700 ${isCover ? 'scale-100' : 'scale-[1.02] translate-y-1'}`}>
        {/* Decorative Gold Border for Cover */}
        {isCover && (
          <div className="absolute inset-4 border-2 border-yellow-600/30 rounded opacity-70 pointer-events-none">
             <div className="absolute inset-1 border border-yellow-600/20 rounded-sm"></div>
             {/* Corner Ornaments */}
             <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-yellow-600/40 rounded-tl-lg"></div>
             <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-yellow-600/40 rounded-tr-lg"></div>
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-yellow-600/40 rounded-bl-lg"></div>
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-yellow-600/40 rounded-br-lg"></div>
          </div>
        )}
      </div>
      
      {/* The Spine (Only visible when open) */}
      {!isCover && (
        <div className="absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-gradient-to-r from-leather via-leather-light to-leather z-20 rounded-sm opacity-90 hidden md:block"></div>
      )}

      {/* Book Spine Effect for Closed Cover (Left side) */}
      {isCover && (
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/40 to-transparent rounded-l-lg z-20"></div>
      )}

      {/* Pages Container / Cover Content Area */}
      <div 
        className={`
          absolute flex overflow-hidden rounded shadow-inner transition-all duration-700
          ${isCover 
            ? 'inset-0 m-0 bg-transparent flex-col items-center justify-center text-center p-8' 
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