
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BibleBook {
  id: number;
  book_number: number;
  book_name: string;
  testament: 'Old' | 'New';
  chapters: number;
}

interface BibleVerse {
  id: number;
  book_id: number;
  chapter: number;
  verse: number;
  text: string;
}

export const useBible = () => {
  const { toast } = useToast();
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('bible_books' as any)
        .select('*')
        .order('book_number');

      if (error) throw error;
      setBooks((data as BibleBook[]) || []);
    } catch (error) {
      console.error('Error fetching bible books:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os livros da Bíblia",
        variant: "destructive",
      });
    }
  };

  const fetchChapter = async (bookId: number, chapter: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bible_verses' as any)
        .select('*')
        .eq('book_id', bookId)
        .eq('chapter', chapter)
        .order('verse');

      if (error) throw error;
      setVerses((data as BibleVerse[]) || []);
    } catch (error) {
      console.error('Error fetching bible verses:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os versículos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectBook = (book: BibleBook) => {
    setSelectedBook(book);
    setSelectedChapter(1);
    fetchChapter(book.id, 1);
  };

  const selectChapter = (chapter: number) => {
    if (selectedBook) {
      setSelectedChapter(chapter);
      fetchChapter(selectedBook.id, chapter);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return {
    books,
    verses,
    loading,
    selectedBook,
    selectedChapter,
    selectBook,
    selectChapter,
    oldTestamentBooks: books.filter(book => book.testament === 'Old'),
    newTestamentBooks: books.filter(book => book.testament === 'New'),
  };
};
