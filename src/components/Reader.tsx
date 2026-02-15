import React, { useMemo } from 'react';
import { Page } from '../types';
import { parse } from 'marked';

interface ReaderProps {
  page?: Page;
  isRightPage?: boolean;
}

const Reader: React.FC<ReaderProps> = ({ page, isRightPage = false }) => {
  const htmlContent = useMemo(() => {
     if (!page?.content) return "";
     try {
       return parse(page.content);
     } catch (e) {
       return page.content;
     }
  }, [page?.content]);

  if (!page) {
    return (
      <div className={`h-full w-full bg-paper flex flex-col justify-center items-center text-leather-light opacity-30 select-none ${isRightPage ? 'bg-gradient-to-l from-white/10 to-transparent shadow-page-left' : 'bg-gradient-to-r from-white/10 to-transparent shadow-page-right'}`}>
        <span className="text-4xl font-serif italic">Fine</span>
      </div>
    );
  }

  return (
    <div className={`h-full w-full bg-paper relative flex flex-col ${isRightPage ? 'shadow-page-left' : 'shadow-page-right'}`}>
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
         <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor" className="text-leather">
             <path d="M0,0 L40,0 L40,40 C20,40 0,20 0,0 Z" />
         </svg>
      </div>

      <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scroll">
        <h2 className="text-3xl font-serif font-bold text-leather mb-6 border-b border-leather/20 pb-4">{page.title}</h2>
        <div 
            className="font-serif text-lg leading-loose text-ink prose prose-stone max-w-none prose-headings:font-serif prose-p:font-serif"
            dangerouslySetInnerHTML={{ __html: htmlContent as string }}
        />
      </div>

      <div className="h-12 flex items-center justify-center font-serif text-leather-light text-sm border-t border-stone-200/50 mx-8">
        {page.pageNumber}
      </div>
    </div>
  );
};

export default Reader;