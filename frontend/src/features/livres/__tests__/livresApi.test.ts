import { HttpClientManager } from '../api/livresApi';
import MockAdapter from 'axios-mock-adapter';

describe('LivresApi', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter((HttpClientManager as any).getInstance()['client']);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('Get All Books', () => {
    it('should fetch all books', async () => {
      const books = [
        {
          id: 1,
          titre: 'Book 1',
          auteur: 'Author 1',
          datePublication: '2023-01-01',
        },
        {
          id: 2,
          titre: 'Book 2',
          auteur: 'Author 2',
          datePublication: '2023-06-01',
        },
      ];

      mockAxios.onGet('/api/livres').reply(200, books);

      const result = await (HttpClientManager as any).getAllBooks();
      expect(result).toHaveLength(2);
      expect(result[0].titre).toBe('Book 1');
    });

    it('should handle empty book list', async () => {
      mockAxios.onGet('/api/livres').reply(200, []);

      const result = await (HttpClientManager as any).getAllBooks();
      expect(result).toHaveLength(0);
    });

    it('should handle server errors', async () => {
      mockAxios.onGet('/api/livres').reply(500);

      await expect((HttpClientManager as any).getAllBooks()).rejects.toThrow();
    });
  });

  describe('Get Book by ID', () => {
    it('should fetch single book by ID', async () => {
      const book = {
        id: 1,
        titre: 'Book 1',
        auteur: 'Author 1',
        genre: 'Fiction',
        datePublication: '2023-01-01',
        description: 'A great book',
      };

      mockAxios.onGet('/api/livres/1').reply(200, book);

      const result = await (HttpClientManager as any).getBookById(1);
      expect(result.id).toBe(1);
      expect(result.titre).toBe('Book 1');
      expect(result.description).toBe('A great book');
    });

    it('should handle book not found', async () => {
      mockAxios.onGet('/api/livres/999').reply(404, { error: 'Book not found' });

      await expect((HttpClientManager as any).getBookById(999)).rejects.toThrow();
    });
  });

  describe('Search Books', () => {
    it('should search books by title', async () => {
      const searchResults = [
        {
          id: 1,
          titre: 'The Great Gatsby',
          auteur: 'F. Scott Fitzgerald',
        },
      ];

      mockAxios.onGet('/api/livres/search', { params: { query: 'Gatsby' } }).reply(200, searchResults);

      const result = await (HttpClientManager as any).searchBooks('Gatsby');
      expect(result).toHaveLength(1);
      expect(result[0].titre).toContain('Gatsby');
    });

    it('should handle no search results', async () => {
      mockAxios.onGet('/api/livres/search').reply(200, []);

      const result = await (HttpClientManager as any).searchBooks('NonExistent');
      expect(result).toHaveLength(0);
    });

    it('should handle special characters in search', async () => {
      mockAxios.onGet('/api/livres/search').reply(200, []);

      const result = await (HttpClientManager as any).searchBooks('Book & "Title"');
      expect(result).toBeDefined();
    });
  });

  describe('Create Book', () => {
    it('should create new book', async () => {
      const newBook = {
        titre: 'New Book',
        auteur: 'New Author',
        genre: 'Fiction',
        datePublication: '2024-01-01',
      };

      const response = {
        id: 100,
        ...newBook,
      };

      mockAxios.onPost('/api/livres', newBook).reply(201, response);

      const result = await (HttpClientManager as any).createBook(newBook);
      expect(result.id).toBe(100);
      expect(result.titre).toBe('New Book');
    });

    it('should validate required fields', async () => {
      const invalidBook = {
        titre: 'Book without author',
      };

      mockAxios.onPost('/api/livres').reply(400, { error: 'Validation error' });

      await expect((HttpClientManager as any).createBook(invalidBook)).rejects.toThrow();
    });
  });

  describe('Update Book', () => {
    it('should update existing book', async () => {
      const updates = {
        titre: 'Updated Title',
        genre: 'Mystery',
      };

      const response = {
        id: 1,
        titre: 'Updated Title',
        auteur: 'Author 1',
        genre: 'Mystery',
        datePublication: '2023-01-01',
      };

      mockAxios.onPut('/api/livres/1', updates).reply(200, response);

      const result = await (HttpClientManager as any).updateBook(1, updates);
      expect(result.titre).toBe('Updated Title');
      expect(result.genre).toBe('Mystery');
    });

    it('should handle book not found on update', async () => {
      mockAxios.onPut('/api/livres/999').reply(404);

      await expect((HttpClientManager as any).updateBook(999, {})).rejects.toThrow();
    });
  });

  describe('Delete Book', () => {
    it('should delete book', async () => {
      mockAxios.onDelete('/api/livres/1').reply(204);

      await expect((HttpClientManager as any).deleteBook(1)).resolves.not.toThrow();
    });

    it('should handle delete of non-existent book', async () => {
      mockAxios.onDelete('/api/livres/999').reply(404);

      await expect((HttpClientManager as any).deleteBook(999)).rejects.toThrow();
    });
  });
});
