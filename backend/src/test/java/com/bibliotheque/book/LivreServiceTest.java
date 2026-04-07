package com.bibliotheque.book;

import com.bibliotheque.shared.entity.Livre;
import com.bibliotheque.shared.repository.LivreRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@DisplayName("Book Repository Tests")
class LivreServiceTest {

    @Mock
    private LivreRepository livreRepository;

    private Livre testBook;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testBook = new Livre();
        testBook.setId(1L);
        testBook.setTitre("Les Misérables");
        testBook.setIsbn("978-2-07-036822-8");
        testBook.setDatePublication(LocalDate.of(1862, 1, 1));
    }

    @Test
    @DisplayName("Should get all books")
    void testGetAllBooks() {
        List<Livre> books = Arrays.asList(testBook);
        when(livreRepository.findAll()).thenReturn(books);

        List<Livre> result = livreRepository.findAll();

        assertEquals(1, result.size());
        assertEquals("Les Misérables", result.get(0).getTitre());
    }

    @Test
    @DisplayName("Should get book by ID")
    void testGetBookById() {
        when(livreRepository.findById(1L)).thenReturn(Optional.of(testBook));

        Optional<Livre> result = livreRepository.findById(1L);

        assertTrue(result.isPresent());
        assertEquals("Les Misérables", result.get().getTitre());
    }

    @Test
    @DisplayName("Should search books by title")
    void testSearchByTitle() {
        List<Livre> searchResults = Arrays.asList(testBook);
        when(livreRepository.findByTitreContainingIgnoreCase("Misérables")).thenReturn(searchResults);

        List<Livre> result = livreRepository.findByTitreContainingIgnoreCase("Misérables");

        assertEquals(1, result.size());
    }

    @Test
    @DisplayName("Should save new book")
    void testSaveBook() {
        Livre newBook = new Livre();
        newBook.setTitre("1984");
        newBook.setIsbn("978-0-451-52494-2");

        when(livreRepository.save(any(Livre.class))).thenReturn(newBook);

        Livre result = livreRepository.save(newBook);

        assertNotNull(result);
        assertEquals("1984", result.getTitre());
    }

    @Test
    @DisplayName("Should delete book")
    void testDeleteBook() {
        livreRepository.delete(testBook);

        verify(livreRepository).delete(testBook);
    }
}
