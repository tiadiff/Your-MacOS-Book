import React, { useState, useRef, useEffect } from 'react';
import { Page } from '../types';
import { Bold, Italic, Heading1, Heading2, List, Save, Eye } from 'lucide-react';

interface EditorProps {
  page: Page;
  onSave: (updatedPage: Page) => void;
}

const Editor: React.FC<EditorProps> = ({ page, onSave }) => {
  const [content, setContent] = useState(page.content);
  const [title, setTitle] = useState(page.title);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setContent(page.content);
    setTitle(page.title);
  }, [page.id]);

  // Helper to insert markdown syntax at cursor position
  const insertSyntax = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = before + prefix + selection + suffix + after;
    
    setContent(newText);
    
    // Defer focus restore
    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleManualSave = () => {
      onSave({ ...page, title, content });
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-stone-200 bg-stone-50 text-stone-700 flex-wrap">
        <button onClick={() => insertSyntax('**', '**')} className="p-1.5 hover:bg-stone-200 rounded" title="Grassetto (Markdown)"><Bold size={18} /></button>
        <button onClick={() => insertSyntax('*', '*')} className="p-1.5 hover:bg-stone-200 rounded" title="Corsivo (Markdown)"><Italic size={18} /></button>
        <div className="w-px h-6 bg-stone-300 mx-1"></div>
        <button onClick={() => insertSyntax('# ')} className="p-1.5 hover:bg-stone-200 rounded" title="Titolo 1"><Heading1 size={18} /></button>
        <button onClick={() => insertSyntax('## ')} className="p-1.5 hover:bg-stone-200 rounded" title="Titolo 2"><Heading2 size={18} /></button>
        <button onClick={() => insertSyntax('- ')} className="p-1.5 hover:bg-stone-200 rounded" title="Lista"><List size={18} /></button>
        
        <div className="flex-grow"></div>
        
        <button 
            onClick={handleManualSave}
            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-full text-sm font-medium transition-colors"
        >
            <Save size={16} /> Salva
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-hidden flex flex-col p-8 md:p-12 font-serif bg-paper bg-opacity-50">
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className="w-full text-3xl font-bold font-serif bg-transparent border-none outline-none mb-6 text-leather placeholder-leather/50"
          placeholder="Titolo della pagina..."
        />
        <textarea 
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleManualSave}
          className="w-full flex-1 bg-transparent border-none outline-none resize-none font-serif text-lg leading-relaxed text-ink custom-scroll"
          placeholder="Scrivi qui la tua storia usando Markdown..."
          spellCheck={false}
        />
      </div>
      
      <div className="bg-stone-50 border-t border-stone-200 p-2 text-xs text-center text-stone-500 font-sans flex justify-between px-4">
        <span>Markdown Mode</span>
        <span>Pagina {page.pageNumber}</span>
      </div>
    </div>
  );
};

export default Editor;