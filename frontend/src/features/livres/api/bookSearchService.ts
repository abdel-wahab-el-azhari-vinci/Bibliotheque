import axios from 'axios';

export interface BookInfo {
  titre: string;
  auteur: string;
  isbn: string;
  resume?: string;
  datePublication?: string;
  langue?: string;
}

/**
 * Service pour rechercher les infos d'un livre via son ISBN
 * Utilise plusieurs APIs (Open Library + Worldcat + Google Books)
 */
export const bookSearchService = {
  /**
   * Récupère les infos d'un livre via son ISBN
   * @param isbn - Code ISBN du livre
   * @returns Les infos du livre trouvé
   */
  async searchByISBN(isbn: string): Promise<BookInfo | null> {
    try {
      // Nettoyer l'ISBN (supprimer espaces et tirets)
      const cleanISBN = isbn.replace(/[-\s]/g, '');

      if (!cleanISBN || cleanISBN.length < 10) {
        throw new Error('ISBN invalide');
      }

      console.log('��� Recherche du livre pour ISBN:', cleanISBN);

      // Essayer les APIs dans cet ordre
      let bookInfo = await searchOpenLibrary(cleanISBN);
      
      if (!bookInfo) {
        console.log('��� Essai avec Worldcat xISBN...');
        bookInfo = await searchWorldcatISBN(cleanISBN);
      }
      
      if (!bookInfo) {
        console.log('��� Essai avec OpenISBN...');
        bookInfo = await searchOpenISBN(cleanISBN);
      }

      if (!bookInfo) {
        console.warn('⚠️ Aucun livre trouvé pour cet ISBN');
        return null;
      }

      console.log('✅ Livre trouvé:', bookInfo);
      return bookInfo;
    } catch (error: any) {
      console.error('❌ Erreur recherche ISBN:', error.message);
      return null;
    }
  },
};

/**
 * Recherche sur Open Library
 */
async function searchOpenLibrary(isbn: string): Promise<BookInfo | null> {
  try {
    const response = await axios.get(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
      { timeout: 5000 }
    );

    const data = response.data;
    const key = `ISBN:${isbn}`;

    if (!data[key]) {
      return null;
    }

    const book = data[key];

    const bookInfo: BookInfo = {
      titre: book.title || '',
      auteur: book.authors?.[0]?.name || '',
      isbn: isbn,
      resume: book.excerpts?.[0]?.text || book.description || '',
      datePublication: book.publish_date || '',
      langue: getLanguageFromCode(book.languages?.[0]?.key),
    };

    return bookInfo;
  } catch (error) {
    console.warn('⚠️ Open Library erreur:', error);
    return null;
  }
}

/**
 * Recherche sur Worldcat xISBN (meilleure couverture mondiale)
 */
async function searchWorldcatISBN(isbn: string): Promise<BookInfo | null> {
  try {
    const response = await axios.get(
      `https://xisbn.worldcat.org/webservices/xid/isbn/${isbn}?method=getMetadata&format=json`,
      { timeout: 5000 }
    );

    const data = response.data;

    if (data.stat !== 'ok' || !data.title) {
      return null;
    }

    const bookInfo: BookInfo = {
      titre: data.title || '',
      auteur: data.author || '',
      isbn: isbn,
      resume: '',
      datePublication: data.year ? data.year.toString() : '',
      langue: determineLanguageFromTitle(data.title),
    };

    return bookInfo;
  } catch (error) {
    console.warn('⚠️ Worldcat xISBN erreur:', error);
    return null;
  }
}

/**
 * Recherche sur OpenISBN (agrège plusieurs sources)
 */
async function searchOpenISBN(isbn: string): Promise<BookInfo | null> {
  try {
    const response = await axios.get(
      `https://api2.isbndb.com/books/${isbn}`,
      { timeout: 5000 }
    );

    const book = response.data;

    if (!book.title) {
      return null;
    }

    const bookInfo: BookInfo = {
      titre: book.title || '',
      auteur: book.authors?.[0] || '',
      isbn: isbn,
      resume: book.synopsis || '',
      datePublication: book.date_published || '',
      langue: determineLanguageFromTitle(book.title),
    };

    return bookInfo;
  } catch (error) {
    console.warn('⚠️ OpenISBN erreur:', error);
    return null;
  }
}

/**
 * Convertit le code langue d'Open Library en langue lisible
 */
function getLanguageFromCode(langKey?: string): string {
  if (!langKey) return '';

  const langMap: Record<string, string> = {
    '/languages/eng': 'Anglais',
    '/languages/fre': 'Français',
    '/languages/spa': 'Espagnol',
    '/languages/deu': 'Allemand',
    '/languages/ita': 'Italien',
    '/languages/por': 'Portugais',
    '/languages/jpn': 'Japonais',
    '/languages/chi': 'Chinois',
  };

  return langMap[langKey] || '';
}

/**
 * Détermine la langue à partir du titre
 */
function determineLanguageFromTitle(title: string): string {
  if (!title) return '';
  
  // Simple heuristique : chercher des mots clés français communs
  const frenchWords = ['le ', 'la ', 'les ', 'un ', 'une ', 'des ', 'et ', 'ou ', 'de ', 'du '];
  const titleLower = title.toLowerCase();
  
  let frenchCount = 0;
  frenchWords.forEach(word => {
    if (titleLower.includes(word)) {
      frenchCount++;
    }
  });
  
  if (frenchCount >= 2) {
    return 'Français';
  }
  
  return 'Anglais'; // Défaut : Anglais
}
