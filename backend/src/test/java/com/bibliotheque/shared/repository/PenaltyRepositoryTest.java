package com.bibliotheque.shared.repository;

import com.bibliotheque.shared.entity.Penalty;
import com.bibliotheque.shared.entity.Possession;
import com.bibliotheque.shared.entity.Livre;
import com.bibliotheque.user.entity.User;
import com.bibliotheque.user.repository.UserRepository;
import com.bibliotheque.shared.repository.LivreRepository;
import com.bibliotheque.shared.repository.PossessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@DataJpaTest
@DisplayName("PenaltyRepository Tests")
class PenaltyRepositoryTest {

    @Autowired
    private PenaltyRepository penaltyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LivreRepository livreRepository;

    @Autowired
    private PossessionRepository possessionRepository;

    private User testUser;
    private Livre testLivre;
    private Possession testPossession;
    private Penalty testPenalty;

    @BeforeEach
    void setUp() {
        // Create test user
        testUser = new User();
        testUser.setEmail("test@example.com");
        testUser = userRepository.save(testUser);

        // Create test livre
        testLivre = new Livre();
        testLivre.setTitre("Test Book");
        testLivre = livreRepository.save(testLivre);

        // Create test possession
        testPossession = new Possession();
        testPossession.setUser(testUser);
        testPossession.setLivre(testLivre);
        testPossession.setDateEmprunt(LocalDate.now().minusDays(20));
        testPossession = possessionRepository.save(testPossession);

        // Create test penalty
        testPenalty = new Penalty();
        testPenalty.setUser(testUser);
        testPenalty.setLivre(testLivre);
        testPenalty.setPossession(testPossession);
        testPenalty.setDateCreation(LocalDateTime.now());
        testPenalty.setDateExpirationEmprunt(LocalDate.now().minusDays(7));
        testPenalty.setDateRetourActual(LocalDate.now().minusDays(4));
        testPenalty.setNombreJoursRetard(3);
        testPenalty.setTarifJournalier(new BigDecimal("0.50"));
        testPenalty.setMontantTotal(new BigDecimal("1.50"));
        testPenalty.setStatus(Penalty.PenaltyStatus.PENDING);
    }

    @Test
    @DisplayName("Should find all penalties by userId")
    void testFindByUserId() {
        // Save penalty
        testPenalty = penaltyRepository.save(testPenalty);

        // Find
        List<Penalty> penalties = penaltyRepository.findByUserId(testUser.getId());

        // Assert
        assert penalties.size() == 1;
        assert penalties.get(0).getUser().getId().equals(testUser.getId());
    }

    @Test
    @DisplayName("Should find penalties by userId and status")
    void testFindByUserIdAndStatus() {
        penaltyRepository.save(testPenalty);

        List<Penalty> pending = penaltyRepository.findByUserIdAndStatus(
            testUser.getId(), Penalty.PenaltyStatus.PENDING
        );

        assert pending.size() == 1;
        assert pending.get(0).getStatus().equals(Penalty.PenaltyStatus.PENDING);
    }

    @Test
    @DisplayName("Should find penalty by possessionId")
    void testFindByPossessionId() {
        penaltyRepository.save(testPenalty);

        Optional<Penalty> found = penaltyRepository.findByPossessionId(testPossession.getId());

        assert found.isPresent();
        assert found.get().getPossession().getId().equals(testPossession.getId());
    }

    @Test
    @DisplayName("Should count pending penalties for user")
    void testCountPendingPenaltiesForUser() {
        penaltyRepository.save(testPenalty);

        Long count = penaltyRepository.countPendingPenaltiesForUser(testUser.getId());

        assert count == 1;
    }

    @Test
    @DisplayName("Should calculate total pending amount for user")
    void testGetTotalPendingAmountForUser() {
        penaltyRepository.save(testPenalty);

        BigDecimal total = penaltyRepository.getTotalPendingAmountForUser(testUser.getId());

        assert total.compareTo(new BigDecimal("1.50")) == 0;
    }

    @Test
    @DisplayName("Should return 0 if no pending penalties")
    void testGetTotalPendingAmount_Empty() {
        BigDecimal total = penaltyRepository.getTotalPendingAmountForUser(999L);

        assert total.compareTo(BigDecimal.ZERO) == 0;
    }

    @Test
    @DisplayName("Should find penalties by livre")
    void testFindByLivreId() {
        penaltyRepository.save(testPenalty);

        List<Penalty> penalties = penaltyRepository.findByLivreId(testLivre.getId());

        assert penalties.size() == 1;
        assert penalties.get(0).getLivre().getId().equals(testLivre.getId());
    }

    @Test
    @DisplayName("Should only count PENDING penalties, not PAID")
    void testCountOnlyPendingPenalties() {
        // Save PENDING penalty
        penaltyRepository.save(testPenalty);

        // Save PAID penalty
        Penalty paidPenalty = new Penalty();
        paidPenalty.setUser(testUser);
        paidPenalty.setLivre(testLivre);
        paidPenalty.setPossession(new Possession());
        paidPenalty.setStatus(Penalty.PenaltyStatus.PAID);
        paidPenalty.setMontantTotal(new BigDecimal("5.00"));
        penaltyRepository.save(paidPenalty);

        Long count = penaltyRepository.countPendingPenaltiesForUser(testUser.getId());

        assert count == 1; // Only PENDING
    }

    @Test
    @DisplayName("Should sum only PENDING penalties, not PAID")
    void testTotalAmountOnlyPending() {
        testPenalty.setMontantTotal(new BigDecimal("10.00"));
        penaltyRepository.save(testPenalty);

        Penalty paidPenalty = new Penalty();
        paidPenalty.setUser(testUser);
        paidPenalty.setLivre(testLivre);
        paidPenalty.setStatus(Penalty.PenaltyStatus.PAID);
        paidPenalty.setMontantTotal(new BigDecimal("5.00"));
        penaltyRepository.save(paidPenalty);

        BigDecimal total = penaltyRepository.getTotalPendingAmountForUser(testUser.getId());

        assert total.compareTo(new BigDecimal("10.00")) == 0; // Only PENDING
    }
}
