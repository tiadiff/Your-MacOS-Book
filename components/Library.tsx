import React, { useState } from 'react';
import { BookData, BookColor } from '../types';
import BookFrame from './BookFrame';
import { Plus, Trash2, Library as LibraryIcon } from 'lucide-react';

interface LibraryProps {
  books: BookData[];
  onSelectBook: (bookId: string) => void;
  onAddBook: (title: string, color: BookColor) => void;
  onDeleteBook: (bookId: string) => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AVAILABLE_COLORS: { id: BookColor; name: string; hex: string }[] = [
  { id: 'brown', name: 'Classico', hex: '#5c3a21' },
  { id: 'red', name: 'Rosso', hex: '#7f1d1d' },
  { id: 'blue', name: 'Blu', hex: '#1e3a8a' },
  { id: 'green', name: 'Verde', hex: '#14532d' },
  { id: 'black', name: 'Nero', hex: '#171717' },
];

const Library: React.FC<LibraryProps> = ({ books, onSelectBook, onAddBook, onDeleteBook, onImport }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newColor, setNewColor] = useState<BookColor>('brown');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onAddBook(newTitle, newColor);
      setNewTitle('');
      setNewColor('brown');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2c1e14] relative overflow-y-auto custom-scroll">
       {/* Background pattern */}
       <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}></div>
       
       <div className="relative z-10 max-w-6xl mx-auto p-8">
         <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-orange-900/50 rounded-full border border-orange-500/20">
                  <LibraryIcon className="text-orange-200" size={32} />
               </div>
               <div>
                  <h1 className="text-4xl font-serif text-orange-50 font-bold tracking-wide">La Tua Libreria</h1>
                  <p className="text-orange-200/60 font-serif italic">Seleziona un volume o scrivi una nuova storia</p>
               </div>
            </div>
            
            <div className="flex gap-3">
               <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 text-orange-200 hover:text-white border border-white/10 hover:border-white/30 rounded transition-colors text-sm">
                  Importa Libro
               </button>
               <input type="file" ref={fileInputRef} onChange={onImport} accept=".json" className="hidden" />
               
               <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 px-6 py-2 bg-orange-700 text-white rounded hover:bg-orange-600 shadow-lg transition-transform hover:scale-105 font-serif font-bold">
                  <Plus size={20} /> Nuovo Libro
               </button>
            </div>
         </header>

         {/* New Book Modal Overlay */}
         {isCreating && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
               <div className="bg-paper-dark p-8 rounded-lg shadow-2xl max-w-md w-full border-4 border-leather relative">
                  <h3 className="text-2xl font-serif font-bold text-leather mb-6 text-center">Rilega un nuovo libro</h3>
                  <form onSubmit={handleCreate} className="space-y-6">
                     <div>
                        <label className="block text-sm font-serif text-leather/70 mb-1">Titolo del Libro</label>
                        <input 
                           autoFocus
                           type="text" 
                           value={newTitle}
                           onChange={(e) => setNewTitle(e.target.value)}
                           className="w-full px-4 py-2 bg-white border border-stone-300 rounded focus:border-orange-500 focus:outline-none font-serif text-lg"
                           placeholder="Il mio capolavoro..."
                        />
                     </div>
                     
                     <div>
                        <label className="block text-sm font-serif text-leather/70 mb-2">Colore Copertina</label>
                        <div className="flex gap-3 justify-center">
                           {AVAILABLE_COLORS.map(c => (
                              <button
                                 key={c.id}
                                 type="button"
                                 onClick={() => setNewColor(c.id)}
                                 className={`w-10 h-10 rounded-full border-2 shadow-sm transition-transform hover:scale-110 ${newColor === c.id ? 'border-orange-500 scale-110 ring-2 ring-orange-200' : 'border-transparent'}`}
                                 style={{ backgroundColor: c.hex }}
                                 title={c.name}
                              />
                           ))}
                        </div>
                     </div>

                     <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setIsCreating(false)} className="flex-1 py-2 text-stone-600 hover:bg-stone-200 rounded transition-colors font-serif">Annulla</button>
                        <button type="submit" disabled={!newTitle.trim()} className="flex-1 py-2 bg-leather text-orange-50 font-bold rounded hover:bg-leather-light transition-colors disabled:opacity-50 font-serif">Crea</button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* Shelves Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {books.map((book) => (
               <div key={book.id} className="group relative flex flex-col items-center">
                  <div className="w-full aspect-[1/1.4] relative z-20 transition-transform duration-300 group-hover:-translate-y-4 group-hover:scale-105">
                     
                     {/* 1. Clickable Area for Opening Book (Separated from delete button) */}
                     <div 
                        onClick={() => onSelectBook(book.id)} 
                        className="w-full h-full cursor-pointer"
                        title={`Apri ${book.title}`}
                     >
                        <BookFrame state="cover" color={book.coverColor}>
                            <div className="flex flex-col items-center justify-center h-full space-y-2 pointer-events-none">
                                <div className="w-8 h-0.5 bg-yellow-500/40 rounded-full mb-2"></div>
                                <h3 className="text-yellow-100 font-serif font-bold text-lg md:text-xl leading-tight line-clamp-3 drop-shadow-md">
                                    {book.title}
                                </h3>
                                {book.subtitle && <p className="text-yellow-200/60 font-serif text-xs italic line-clamp-1">{book.subtitle}</p>}
                                <div className="mt-4 pt-4 border-t border-yellow-500/20 w-1/2"></div>
                            </div>
                        </BookFrame>
                     </div>
                     
                     {/* 2. Delete Button (Sibling to the open area, not child) */}
                     {/* Mobile: Opacity 100. Desktop: Opacity 0 -> Hover 100 */}
                     <button 
                        onClick={(e) => { 
                            e.preventDefault();
                            e.stopPropagation(); 
                            onDeleteBook(book.id); 
                        }}
                        className="absolute -top-2 -right-2 p-2 bg-red-600 text-white rounded-full shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-red-700 z-30 cursor-pointer"
                        title="Elimina libro"
                     >
                        <Trash2 size={16} />
                     </button>
                  </div>
                  
                  {/* Shelf Shadow */}
                  <div className="w-[120%] h-4 bg-black/40 blur-md rounded-full mt-[-10px] z-10"></div>
                  
                  {/* Shelf Board */}
                  <div className="absolute bottom-[-20px] left-[-20px] right-[-20px] h-4 bg-[#3d2b1f] border-t border-[#5c4030] shadow-xl z-0 rounded-sm"></div>
               </div>
            ))}

            {/* Empty Shelf Placeholder if no books */}
            {books.length === 0 && (
               <div className="col-span-full text-center py-20 opacity-40">
                  <p className="text-orange-100 font-serif text-2xl italic">La libreria è vuota...</p>
               </div>
            )}
         </div>
       </div>
    </div>
  );
};

export default Library;