import React, { useState, useEffect, useRef } from 'react';
import { BookData, Page, AppMode } from './types';
import BookFrame from './components/BookFrame';
import Editor from './components/Editor';
import Reader from './components/Reader';
import { Book, Edit3, ChevronLeft, ChevronRight, BookOpen, Plus, Trash2, PlayCircle, Cloud, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

// Initial Data used only as fallback if server is unreachable
const FALLBACK_BOOK: BookData = {
  title: "Libro Locale",
  author: "Utente",
  pages: [
    {
      id: '1',
      pageNumber: 1,
      title: "Benvenuto",
      content: "Impossibile connettersi al server. Stai lavorando in modalità offline o il file api.php non è configurato correttamente."
    }
  ]
};

const App: React.FC = () => {
  // Initialize with null to indicate loading state
  const [book, setBook] = useState<BookData | null>(null);
  const [mode, setMode] = useState<AppMode>(AppMode.READING);
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const [showingCover, setShowingCover] = useState(true);

  // Sync Status: 'idle', 'saving', 'saved', 'error'
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const isFirstLoad = useRef(true);

  // 1. Load data from localStorage on mount
  useEffect(() => {
    const savedBook = localStorage.getItem('libromagico_data');
    if (savedBook) {
      try {
        setBook(JSON.parse(savedBook));
        isFirstLoad.current = false;
        setSyncStatus('saved');
        setTimeout(() => setSyncStatus('idle'), 2000);
      } catch (e) {
        console.error("Error parsing saved book:", e);
        setBook(FALLBACK_BOOK);
      }
    } else {
      setBook(FALLBACK_BOOK);
      isFirstLoad.current = false;
    }
  }, []);

  // 2. Auto-save to localStorage when book changes (with debounce)
  useEffect(() => {
    if (isFirstLoad.current || !book) return;

    setSyncStatus('saving');
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('libromagico_data', JSON.stringify(book));
        setSyncStatus('saved');
        setTimeout(() => setSyncStatus('idle'), 2000);
      } catch (err) {
        console.error("Error saving book:", err);
        setSyncStatus('error');
      }
    }, 1000); // 1s debounce

    return () => clearTimeout(timer);
  }, [book]);

  // Loading Screen
  if (!book) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-stone-200 text-leather">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-serif text-xl">Caricamento Libro...</p>
      </div>
    );
  }

  const updateBookMeta = (field: 'title' | 'author', value: string) => {
    setBook(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const totalPages = book.pages.length;

  // Navigation
  const goToNext = () => {
    if (showingCover) {
      setShowingCover(false);
      setCurrentSpreadIndex(0);
      return;
    }
    if (currentSpreadIndex + 2 < totalPages + 1) {
      setCurrentSpreadIndex(curr => curr + 2);
    }
  };

  const goToPrev = () => {
    if (currentSpreadIndex === 0) {
      setShowingCover(true);
      return;
    }
    if (currentSpreadIndex > 0) {
      setCurrentSpreadIndex(curr => curr - 2);
    }
  };

  const handlePageUpdate = (updatedPage: Page) => {
    const newPages = book.pages.map(p => p.id === updatedPage.id ? updatedPage : p);
    setBook({ ...book, pages: newPages });
  };

  const addNewPage = () => {
    const newPageNumber = book.pages.length + 1;
    const newPage: Page = {
      id: Date.now().toString(),
      pageNumber: newPageNumber,
      title: `Nuova Pagina ${newPageNumber}`,
      content: ""
    };
    setBook({ ...book, pages: [...book.pages, newPage] });

    setShowingCover(false);
    if (newPageNumber % 2 !== 0) {
      setCurrentSpreadIndex(newPageNumber - 1);
    } else {
      setCurrentSpreadIndex(newPageNumber - 2);
    }
  };

  const deleteCurrentPage = () => {
    if (book.pages.length <= 1) return;
    if (window.confirm("Sei sicuro di voler eliminare l'ultima pagina?")) {
      const newPages = book.pages.slice(0, -1);
      setBook({ ...book, pages: newPages });
      if (currentSpreadIndex >= newPages.length) {
        setCurrentSpreadIndex(Math.max(0, currentSpreadIndex - 2));
      }
    }
  };

  const leftPage = book.pages[currentSpreadIndex];
  const rightPage = book.pages[currentSpreadIndex + 1];

  return (
    <div className="flex flex-col h-screen bg-stone-200 overflow-hidden font-sans">

      {/* Header */}
      <header className="h-16 bg-leather text-paper-dark shadow-lg flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowingCover(true)}>
          <Book className="text-orange-200" />
          <div className="hidden sm:block">
            {mode === AppMode.EDITING ? (
              <input
                type="text"
                value={book.title}
                onChange={(e) => updateBookMeta('title', e.target.value)}
                className="bg-black/20 text-orange-50 px-2 py-1 rounded border border-orange-900/50 focus:outline-none focus:border-orange-500 font-serif font-bold tracking-wide w-[200px]"
                placeholder="Titolo libro"
              />
            ) : (
              <h1 className="text-xl font-serif font-bold tracking-wide truncate max-w-[200px]">{book.title}</h1>
            )}
          </div>

          {/* Cloud Sync Indicator */}
          <div className="ml-4 flex items-center gap-2 text-xs font-mono">
            {syncStatus === 'saving' && <span className="text-orange-300 flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Saving...</span>}
            {syncStatus === 'saved' && <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Saved</span>}
            {syncStatus === 'error' && <span className="text-red-400 flex items-center gap-1"><AlertCircle size={12} /> Offline</span>}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-6">

          <div className="flex items-center gap-2 bg-black/20 p-1 rounded-lg">
            <button onClick={() => setMode(AppMode.READING)} className={`flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-md transition-all ${mode === AppMode.READING ? 'bg-orange-100 text-leather font-bold shadow' : 'text-orange-100 hover:bg-white/10'}`}>
              <BookOpen size={18} />
              <span className="hidden sm:inline">Lettura</span>
            </button>
            <button onClick={() => setMode(AppMode.EDITING)} className={`flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-md transition-all ${mode === AppMode.EDITING ? 'bg-orange-100 text-leather font-bold shadow' : 'text-orange-100 hover:bg-white/10'}`}>
              <Edit3 size={18} />
              <span className="hidden sm:inline">Modifica</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Stage */}
      <main className="flex-1 flex flex-col justify-center items-center relative p-4 md:p-8 overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}></div>

        <BookFrame state={showingCover ? 'cover' : 'open'}>
          {showingCover ? (
            // COVER CONTENT
            <div className="flex flex-col items-center justify-between h-full w-full py-16 px-6 animate-in fade-in duration-700">
              <div className="text-center space-y-2 w-full max-w-lg">
                <div className="w-16 h-1 bg-yellow-600/50 mx-auto rounded-full mb-8"></div>

                {mode === AppMode.EDITING ? (
                  <textarea
                    value={book.title}
                    onChange={(e) => updateBookMeta('title', e.target.value)}
                    className="w-full text-5xl md:text-6xl font-serif font-bold text-yellow-100 bg-transparent border-b-2 border-yellow-600/30 outline-none text-center resize-none overflow-hidden placeholder-yellow-100/30 leading-tight"
                    rows={2}
                    placeholder="Inserisci Titolo"
                  />
                ) : (
                  <h1 className="text-5xl md:text-6xl font-serif font-bold text-yellow-100 drop-shadow-md tracking-wider leading-tight">
                    {book.title}
                  </h1>
                )}
              </div>

              <div className="flex flex-col items-center gap-8 w-full max-w-xs">
                {mode === AppMode.EDITING ? (
                  <input
                    type="text"
                    value={book.author}
                    onChange={(e) => updateBookMeta('author', e.target.value)}
                    className="text-xl text-yellow-200/80 font-serif italic bg-transparent border-b border-yellow-600/30 outline-none text-center placeholder-yellow-200/30 w-full"
                    placeholder="Nome Autore"
                  />
                ) : (
                  <p className="text-xl text-yellow-200/80 font-serif italic border-b border-yellow-600/30 pb-2">
                    {book.author}
                  </p>
                )}

                <button
                  onClick={() => setShowingCover(false)}
                  className="group flex items-center gap-3 px-8 py-3 bg-paper-dark text-leather font-serif font-bold text-xl rounded shadow-lg hover:bg-white hover:scale-105 transition-all duration-300 ring-4 ring-black/10"
                >
                  Apri il Libro
                  <PlayCircle className="group-hover:text-orange-600 transition-colors" size={24} />
                </button>
              </div>

              <div className="text-yellow-600/30 text-xs tracking-[0.3em] font-serif uppercase mt-8">Edizione Digitale</div>
            </div>
          ) : (
            // OPEN BOOK CONTENT
            <div className="w-full h-full flex animate-in zoom-in-95 duration-500">
              {/* Left Page */}
              <div className={`w-full md:w-1/2 h-full border-r border-stone-200 relative ${mode === AppMode.EDITING ? 'hidden md:block' : 'block'}`}>
                {mode === AppMode.EDITING ? (
                  leftPage ? <Editor page={leftPage} onSave={handlePageUpdate} /> :
                    <div className="flex items-center justify-center h-full text-stone-400">Nessuna pagina a sinistra</div>
                ) : (
                  <Reader page={leftPage} />
                )}
              </div>

              {/* Right Page */}
              <div className={`w-full md:w-1/2 h-full relative ${mode === AppMode.EDITING ? 'block md:block' : 'hidden md:block'}`}>
                {mode === AppMode.EDITING ? (
                  rightPage ? <Editor page={rightPage} onSave={handlePageUpdate} /> :
                    <div className="flex flex-col items-center justify-center h-full gap-4 bg-stone-50">
                      <p className="text-stone-500 font-serif italic">Fine del libro attuale.</p>
                      <button onClick={addNewPage} className="flex items-center gap-2 px-4 py-2 bg-leather text-orange-50 rounded shadow hover:bg-leather-light transition">
                        <Plus size={18} /> Aggiungi Pagina
                      </button>
                    </div>
                ) : (
                  <Reader page={rightPage} isRightPage={true} />
                )}
              </div>
            </div>
          )}
        </BookFrame>

        {/* Navigation Controls */}
        <div className="absolute bottom-6 md:bottom-10 flex items-center gap-8 z-20">
          {/* Hide Prev button if on Cover */}
          {!showingCover && (
            <button
              onClick={goToPrev}
              className="p-3 rounded-full bg-leather text-orange-100 shadow-lg hover:scale-110 transition-transform"
              title={currentSpreadIndex === 0 ? "Chiudi libro" : "Pagina precedente"}
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {!showingCover && (
            <div className="bg-white/80 backdrop-blur px-4 py-1 rounded-full text-leather font-mono text-sm shadow">
              {currentSpreadIndex + 1} - {Math.min(currentSpreadIndex + 2, totalPages)} / {totalPages}
            </div>
          )}

          {!showingCover && (
            <button
              onClick={goToNext}
              disabled={currentSpreadIndex + 2 > totalPages}
              className="p-3 rounded-full bg-leather text-orange-100 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>

        {/* Footer Actions (Editing) */}
        {!showingCover && mode === AppMode.EDITING && (
          <div className="absolute top-4 right-4 md:right-10 flex flex-col gap-2">
            <button onClick={addNewPage} className="p-2 bg-emerald-600 text-white rounded-full shadow hover:bg-emerald-700 transition" title="Aggiungi Pagina">
              <Plus size={20} />
            </button>
            <button onClick={deleteCurrentPage} className="p-2 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition" title="Rimuovi Pagina">
              <Trash2 size={20} />
            </button>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;