package com.bibliotheque.book;

import com.bibliotheque.shared.entity.Possession;
import com.bibliotheque.shared.entity.Livre;
import com.bibliotheque.user.entity.User;
import com.bibliotheque.shared.repository.PossessionRepository;
import com.bibliotheque.shared.service.PossessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@DisplayName("Possession Service Tests - Book Management")
class PossessionServiceTest {

    @Mock
    private PossessionRepository possessionRepository;

    @InjectMocks
    private PossessionService possessionService;

    private Possession testPossession;
    private User testUser;
    private Livre testBook;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("user@example.com");

        testBook = new Livre();
        testBook.setId(1L);
        testBook.setTitre("Les Misérables");

        testPossession = new Possession();
        testPossession.setId(1L);
        testPossession.setUser(testUser);
        testPossession.setLivre(testBook);
        testPossession.setDateEmprunt(LocalDate.now());
    }

    @Test
    @DisplayName("Should get all books in stock")
    void testGetAllEnStock() {
        List<Possession> enStock = Arrays.asList(testPossession);
        when(possessionRepository.findAllEnStock()).thenReturn(enStock);

        List<Possession> result = possessionService.getAllEnStock();

        assertEquals(1, result.size());
        assertNull(result.get(0).getDateRetour());
    }

    @Test
    @DisplayName("Should get all books out of stock")
    void testGetAllSortis() {
        testPossession.setDateRetour(LocalDate.now());
        List<Possession> sortis = Arrays.asList(testPossession);
        when(possessionRepository.findAllSortis()).thenReturn(sortis);

        List<Possession> result = possessionService.getAllSortis();

        assertEquals(1, result.size());
        assertNotNull(result.get(0).getDateRetour());
    }

    @Test
    @DisplayName("Should get user borrowings in stock")
    void testGetUserBorrowingsEnStock() {
        List<Possession> borrowings = Arrays.asList(testPossession);
        when(possessionRepository.findByUserIdEnStock(1L)).thenReturn(borrowings);

        List<Possession> result = possessionService.getUserBorrowings(1L);

        assertEquals(1, result.size());
        assertEquals("Les Misérables", result.get(0).getLivre().getTitre());
    }

    @Test
    @DisplayName("Should get user borrowings out of stock")
    void testGetUserBorrowingsSortis() {
        testPossession.setDateRetour(LocalDate.now());
        List<Possession> sortis = Arrays.asList(testPossession);
        when(possessionRepository.findByUserIdSortis(1L)).thenReturn(sortis);

        List<Possession> result = possessionService.getUserBorrowings(1L);

        assertEquals(1, result.size());
    }

    @Test
    @DisplayName("Should check if livre is in stock")
    void testIsLivreEnStock() {
        when(possessionRepository.isLivreEnStock(1L)).thenReturn(true);

        boolean inStock = possessionService.isLivreEnStock(1L);

        assertTrue(inStock);
    }

    @Test
    @DisplayName("Should count available books stock")
    void testCountAvailable() {
        when(possessionRepository.countEnStock(1L)).thenReturn(3);

        int available = possessionService.countAvailable(1L);

        assertEquals(3, available);
    }

    @Test
    @DisplayName("Should get full history for a livre")
    void testGetFullHistory() {
        List<Possession> history = Arrays.asList(testPossession);
        when(possessionRepository.findByLivreId(1L)).thenReturn(history);

        List<Possession> result = possessionService.getFullHistory(1L);

        assertEquals(1, result.size());
        assertEquals("Les Misérables", result.get(0).getLivre().getTitre());
    }

    @Test
    @DisplayName("Should find livre possession by user and livre")
    void testFindLivreByUserAndLivre() {
        when(possessionRepository.findByLivreIdAndUserIdEnStock(1L, 1L))
                .thenReturn(Optional.of(testPossession));

        Optional<Possession> result = possessionRepository.findByLivreIdAndUserIdEnStock(1L, 1L);

        assertTrue(result.isPresent());
        assertEquals("Les Misérables", result.get().getLivre().getTitre());
    }

    @Test
    @DisplayName("Should save a new possession")
    void testSavePossession() {
        when(possessionRepository.save(any(Possession.class))).thenReturn(testPossession);

        Possession result = possessionRepository.save(testPossession);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(possessionRepository).save(any(Possession.class));
    }
}
