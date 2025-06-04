
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Book, ChevronRight, ArrowLeft } from 'lucide-react';
import { useBible } from '@/hooks/useBible';

interface BibleTabProps {
  currentTheme: string;
}

export const BibleTab = ({ currentTheme }: BibleTabProps) => {
  const {
    oldTestamentBooks,
    newTestamentBooks,
    verses,
    loading,
    selectedBook,
    selectedChapter,
    selectBook,
    selectChapter,
  } = useBible();

  const getThemeColors = () => {
    switch (currentTheme) {
      case 'night':
        return {
          text: 'text-blue-200',
          accent: 'text-purple-300',
          bg: 'bg-indigo-800/30'
        };
      case 'desert':
        return {
          text: 'text-orange-800',
          accent: 'text-amber-600',
          bg: 'bg-orange-200/40'
        };
      case 'gratitude':
        return {
          text: 'text-pink-800',
          accent: 'text-rose-600',
          bg: 'bg-pink-200/40'
        };
      default:
        return {
          text: 'text-green-800',
          accent: 'text-green-600',
          bg: 'bg-white/40'
        };
    }
  };

  const colors = getThemeColors();

  const renderChapterNumbers = () => {
    if (!selectedBook) return null;
    
    const chapters = Array.from({ length: selectedBook.chapters }, (_, i) => i + 1);
    
    return (
      <div className="grid grid-cols-8 gap-2 mb-4">
        {chapters.map((chapter) => (
          <Button
            key={chapter}
            variant={selectedChapter === chapter ? "default" : "outline"}
            size="sm"
            onClick={() => selectChapter(chapter)}
            className={selectedChapter === chapter ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {chapter}
          </Button>
        ))}
      </div>
    );
  };

  if (selectedBook) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => selectBook(null as any)}
            className={`${colors.text} flex items-center space-x-2`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar aos livros</span>
          </Button>
          
          <div className="text-center">
            <h2 className={`text-2xl font-bold ${colors.text}`}>
              {selectedBook.book_name}
            </h2>
            <p className={`${colors.text} opacity-70`}>
              Capítulo {selectedChapter}
            </p>
          </div>
          
          <div></div>
        </div>

        <Card className={`${colors.bg} backdrop-blur-sm border-white/40 p-6`}>
          <h3 className={`text-lg font-semibold ${colors.text} mb-4`}>
            Selecionar Capítulo
          </h3>
          {renderChapterNumbers()}
        </Card>

        <Card className={`${colors.bg} backdrop-blur-sm border-white/40 p-6`}>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {verses.map((verse) => (
                  <div key={verse.id} className="flex">
                    <Badge variant="outline" className="mr-3 mt-1 min-w-[40px] justify-center">
                      {verse.verse}
                    </Badge>
                    <p className={`${colors.text} leading-relaxed`}>
                      {verse.text}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className={`text-3xl font-bold ${colors.text} mb-2`}>
          Sagrada Escritura
        </h2>
        <p className={`${colors.text} opacity-80`}>
          Leia e medite na Palavra de Deus
        </p>
      </div>

      {/* Antigo Testamento */}
      <Card className={`${colors.bg} backdrop-blur-sm border-white/40 p-6`}>
        <h3 className={`text-xl font-bold ${colors.text} mb-4 flex items-center`}>
          <Book className="w-5 h-5 mr-2" />
          Antigo Testamento
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {oldTestamentBooks.map((book) => (
            <Button
              key={book.id}
              variant="outline"
              className="justify-between text-left h-auto p-3"
              onClick={() => selectBook(book)}
            >
              <div>
                <p className="font-semibold">{book.book_name}</p>
                <p className="text-xs opacity-70">{book.chapters} cap.</p>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </Card>

      {/* Novo Testamento */}
      <Card className={`${colors.bg} backdrop-blur-sm border-white/40 p-6`}>
        <h3 className={`text-xl font-bold ${colors.text} mb-4 flex items-center`}>
          <Book className="w-5 h-5 mr-2" />
          Novo Testamento
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {newTestamentBooks.map((book) => (
            <Button
              key={book.id}
              variant="outline"
              className="justify-between text-left h-auto p-3"
              onClick={() => selectBook(book)}
            >
              <div>
                <p className="font-semibold">{book.book_name}</p>
                <p className="text-xs opacity-70">{book.chapters} cap.</p>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};
