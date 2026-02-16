import React, { useState, useEffect, useRef } from 'react';
import { BookData, Page, AppMode, BookColor } from './types';
import BookFrame from './components/BookFrame';
import Editor from './components/Editor';
import Reader from './components/Reader';
import Library from './components/Library';
import { Book, Edit3, ChevronLeft, ChevronRight, BookOpen, Plus, Trash2, PlayCircle, HardDrive, Upload, Download, Save, CheckCircle2, Library as LibraryIcon, ArrowLeft } from 'lucide-react';

const STORAGE_KEY = 'libro_magico_data';

const DEFAULT_BOOK: BookData = {
  id: 'default-1',
  title: "Il Mio Primo Libro",
  subtitle: "Clicca per iniziare a scrivere",
  author: "Tu",
  coverColor: 'brown',
  createdAt: Date.now(),
  pages: [
    {
      id: '1',
      pageNumber: 1,
      title: "Incipit",
      content: "# Benvenuto\n\nQuesto è l'inizio della tua storia. Clicca su **Modifica** per cambiare questo testo."
    }
  ]
};

const App: React.FC = () => {
  // State for the Library (List of books)
  const [library, setLibrary] = useState<BookData[]>([]);
  // State for the currently active book ID (null means we are in the Library View)
  const [activeBookId, setActiveBookId] = useState<string | null>(null);

  // Existing state for the active book session
  const [mode, setMode] = useState<AppMode>(AppMode.READING);
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const [showingCover, setShowingCover] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  // --- GLOBAL ZOOM SIMULATION ---
  useEffect(() => {
    // Zoom removed to fix margins in native app
  }, []);



  // --- INITIALIZATION & MIGRATION ---
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);

        // MIGRATION LOGIC: Check if it's the old single-object format
        if (!Array.isArray(parsed) && parsed.title) {
          console.log("Migrating legacy single-book data to library format...");
          const migratedBook: BookData = {
            ...parsed,
            id: parsed.id || Date.now().toString(),
            coverColor: 'brown', // Default for legacy
            createdAt: Date.now()
          };
          setLibrary([migratedBook]);
        } else if (Array.isArray(parsed)) {
          // It is already a library
          setLibrary(parsed);
        } else {
          setLibrary([DEFAULT_BOOK]);
        }
      } catch (e) {
        console.error("Errore lettura localStorage", e);
        setLibrary([DEFAULT_BOOK]);
      }
    } else {
      setLibrary([DEFAULT_BOOK]);
    }
  }, []);

  // --- PERSISTENCE ---
  useEffect(() => {
    if (library.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
      setSaveStatus('saved');
      const timer = setTimeout(() => setSaveStatus('idle'), 2000);
      return () => clearTimeout(timer);
    }
  }, [library]);

  // --- LIBRARY ACTIONS ---

  const handleAddBook = (title: string, color: BookColor) => {
    const newBook: BookData = {
      id: Date.now().toString(),
      title: title,
      author: "Nuovo Autore",
      coverColor: color,
      createdAt: Date.now(),
      pages: [
        { id: '1', pageNumber: 1, title: 'Capitolo 1', content: '' }
      ]
    };
    setLibrary([...library, newBook]);
    // Optional: Auto-open the new book
    setActiveBookId(newBook.id);
    setShowingCover(true);
    setCurrentSpreadIndex(0);
    setMode(AppMode.EDITING);
  };

  const handleDeleteBook = (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questo libro definitivamente?")) {
      setLibrary(prev => prev.filter(b => b.id !== id));
      if (activeBookId === id) setActiveBookId(null);
    }
  };

  const handleImportBook = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        // Validating minimal structure
        if (parsed.title && Array.isArray(parsed.pages)) {
          const importedBook: BookData = {
            ...parsed,
            id: parsed.id || Date.now().toString() + Math.random(), // Ensure unique ID on import
            coverColor: parsed.coverColor || 'brown'
          };
          setLibrary(prev => [...prev, importedBook]);
          alert(`Libro "${importedBook.title}" importato con successo!`);
        } else {
          alert("Il file selezionato non è valido.");
        }
      } catch (err) {
        alert("Errore durante la lettura del file JSON.");
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // --- BOOK ACTIONS ---

  // Helper to get current book object
  const activeBook = library.find(b => b.id === activeBookId);

  const updateActiveBook = (updater: (b: BookData) => BookData) => {
    setLibrary(prev => prev.map(b => b.id === activeBookId ? updater(b) : b));
  };

  const handleMetaUpdate = (field: 'title' | 'subtitle' | 'author', value: string) => {
    if (!activeBook) return;
    updateActiveBook(b => ({ ...b, [field]: value }));
  };

  const handlePageUpdate = (updatedPage: Page) => {
    if (!activeBook) return;
    updateActiveBook(b => ({
      ...b,
      pages: b.pages.map(p => p.id === updatedPage.id ? updatedPage : p)
    }));
  };

  const handleExportBook = () => {
    if (!activeBook) return;
    const dataStr = JSON.stringify(activeBook, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeBook.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAddNewPage = () => {
    if (!activeBook) return;
    const newPageNumber = activeBook.pages.length + 1;
    const newPage: Page = {
      id: Date.now().toString(),
      pageNumber: newPageNumber,
      title: `Nuova Pagina ${newPageNumber}`,
      content: ""
    };

    updateActiveBook(b => ({ ...b, pages: [...b.pages, newPage] }));

    setShowingCover(false);
    if (newPageNumber % 2 !== 0) {
      setCurrentSpreadIndex(newPageNumber - 1);
    } else {
      setCurrentSpreadIndex(newPageNumber - 2);
    }
  };

  const handleDeletePage = () => {
    if (!activeBook || activeBook.pages.length <= 1) return;
    if (window.confirm("Sei sicuro di voler eliminare l'ultima pagina?")) {
      const newPages = activeBook.pages.slice(0, -1);
      updateActiveBook(b => ({ ...b, pages: newPages }));

      if (currentSpreadIndex >= newPages.length) {
        setCurrentSpreadIndex(Math.max(0, currentSpreadIndex - 2));
      }
    }
  };

  // --- NAVIGATION HELPERS ---

  const goToNext = () => {
    if (!activeBook) return;
    if (showingCover) {
      setShowingCover(false);
      setCurrentSpreadIndex(0);
      return;
    }
    if (currentSpreadIndex + 2 < activeBook.pages.length + 1) {
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

  const returnToLibrary = () => {
    setActiveBookId(null);
    setMode(AppMode.READING); // Reset default mode
    setShowingCover(true); // Reset to cover
  };


  // --- RENDER: LIBRARY VIEW ---
  if (!activeBookId || !activeBook) {
    return (
      <Library
        books={library}
        onSelectBook={(id) => {
          setActiveBookId(id);
          setShowingCover(true);
          setCurrentSpreadIndex(0);
        }}
        onAddBook={handleAddBook}
        onDeleteBook={handleDeleteBook}
        onImport={handleImportBook}
      />
    );
  }

  // --- RENDER: BOOK VIEW ---
  const totalPages = activeBook.pages.length;
  const leftPage = activeBook.pages[currentSpreadIndex];
  const rightPage = activeBook.pages[currentSpreadIndex + 1];

  return (
    <div className="flex flex-col h-screen bg-stone-200 overflow-hidden font-sans">

      {/* Header */}
      <header className={`h-16 shadow-lg flex items-center justify-between px-6 z-50 transition-colors duration-500`}
        style={{
          backgroundColor: activeBook.coverColor === 'brown' ? '#5c3a21' :
            activeBook.coverColor === 'red' ? '#7f1d1d' :
              activeBook.coverColor === 'blue' ? '#1e3a8a' :
                activeBook.coverColor === 'green' ? '#14532d' : '#171717'
        }}
      >
        <div className="flex items-center gap-4">
          <button onClick={returnToLibrary} className="flex items-center gap-1 text-orange-200 hover:text-white transition-colors" title="Torna alla Libreria">
            <ArrowLeft size={20} />
            <span className="hidden sm:inline font-serif font-bold">Libreria</span>
          </button>
          <div className="w-px h-6 bg-white/20"></div>

          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowingCover(true)}>
            <Book className="text-orange-200" size={20} />
            <div className="hidden sm:block text-paper-dark">
              {mode === AppMode.EDITING ? (
                <input
                  type="text"
                  value={activeBook.title}
                  onChange={(e) => handleMetaUpdate('title', e.target.value)}
                  className="bg-black/20 text-orange-50 px-2 py-1 rounded border border-white/20 focus:outline-none focus:border-orange-500 font-serif font-bold tracking-wide w-[200px]"
                />
              ) : (
                <h1 className="text-lg font-serif font-bold tracking-wide truncate max-w-[200px]">{activeBook.title}</h1>
              )}
            </div>
          </div>

          {saveStatus === 'saved' && <span className="text-emerald-400 flex items-center gap-1 text-xs animate-pulse ml-2"><CheckCircle2 size={12} /> Salvato</span>}
        </div>

        <div className="flex items-center gap-4">
          {/* Download Button */}
          <button onClick={handleExportBook} className="p-2 text-orange-100 hover:text-white bg-black/20 hover:bg-white/10 rounded transition-colors" title="Salva backup JSON">
            <Download size={18} />
          </button>

          {/* Mode Switcher */}
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

        <BookFrame state={showingCover ? 'cover' : 'open'} color={activeBook.coverColor}>
          {showingCover ? (
            // COVER CONTENT
            <div className="flex flex-col items-center justify-between h-full w-full py-16 px-6 animate-in fade-in duration-700">
              <div className="text-center space-y-4 w-full max-w-lg flex flex-col items-center">
                <div className="w-16 h-1 bg-yellow-600/50 mx-auto rounded-full mb-4"></div>

                {/* TITLE */}
                {mode === AppMode.EDITING ? (
                  <textarea
                    value={activeBook.title}
                    onChange={(e) => handleMetaUpdate('title', e.target.value)}
                    className="w-full text-5xl md:text-6xl font-serif font-bold text-yellow-100 bg-transparent border-b-2 border-yellow-600/30 outline-none text-center resize-none overflow-hidden placeholder-yellow-100/30 leading-tight"
                    rows={1}
                    placeholder="Titolo"
                    style={{ minHeight: '80px' }}
                  />
                ) : (
                  <h1 className="text-5xl md:text-6xl font-serif font-bold text-yellow-100 drop-shadow-md tracking-wider leading-tight">
                    {activeBook.title}
                  </h1>
                )}

                {/* SUBTITLE */}
                {mode === AppMode.EDITING ? (
                  <input
                    type="text"
                    value={activeBook.subtitle || ''}
                    onChange={(e) => handleMetaUpdate('subtitle', e.target.value)}
                    className="w-full text-xl md:text-2xl font-serif text-yellow-200/90 bg-transparent border-b border-yellow-600/20 outline-none text-center placeholder-yellow-200/20"
                    placeholder="Sottotitolo (opzionale)"
                  />
                ) : (
                  activeBook.subtitle && (
                    <h2 className="text-xl md:text-2xl font-serif text-yellow-200/90 drop-shadow-sm tracking-wide">
                      {activeBook.subtitle}
                    </h2>
                  )
                )}
              </div>

              <div className="flex flex-col items-center gap-8 w-full max-w-xs">
                {mode === AppMode.EDITING ? (
                  <input
                    type="text"
                    value={activeBook.author}
                    onChange={(e) => handleMetaUpdate('author', e.target.value)}
                    className="text-xl text-yellow-200/80 font-serif italic bg-transparent border-b border-yellow-600/30 outline-none text-center placeholder-yellow-200/30 w-full"
                    placeholder="Nome Autore"
                  />
                ) : (
                  <p className="text-xl text-yellow-200/80 font-serif italic border-b border-yellow-600/30 pb-2">
                    {activeBook.author}
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
                      <button onClick={handleAddNewPage} className="flex items-center gap-2 px-4 py-2 bg-leather text-orange-50 rounded shadow hover:bg-leather-light transition">
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
              className={`p-3 rounded-full text-orange-100 shadow-lg hover:scale-110 transition-transform ${activeBook.coverColor === 'brown' ? 'bg-leather' : activeBook.coverColor === 'red' ? 'bg-[#7f1d1d]' : activeBook.coverColor === 'blue' ? 'bg-[#1e3a8a]' : activeBook.coverColor === 'green' ? 'bg-[#14532d]' : 'bg-[#171717]'}`}
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
              className={`p-3 rounded-full text-orange-100 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform ${activeBook.coverColor === 'brown' ? 'bg-leather' : activeBook.coverColor === 'red' ? 'bg-[#7f1d1d]' : activeBook.coverColor === 'blue' ? 'bg-[#1e3a8a]' : activeBook.coverColor === 'green' ? 'bg-[#14532d]' : 'bg-[#171717]'}`}
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>

        {/* Footer Actions (Editing) */}
        {!showingCover && mode === AppMode.EDITING && (
          <div className="absolute top-4 right-4 md:right-10 flex flex-col gap-2">
            <button onClick={handleAddNewPage} className="p-2 bg-emerald-600 text-white rounded-full shadow hover:bg-emerald-700 transition" title="Aggiungi Pagina">
              <Plus size={20} />
            </button>
            <button onClick={handleDeletePage} className="p-2 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition" title="Rimuovi Pagina">
              <Trash2 size={20} />
            </button>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;