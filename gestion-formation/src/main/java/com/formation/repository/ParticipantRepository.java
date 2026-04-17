package com.formation.repository;

import com.formation.model.Participant;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {

    // ✅ Charge profil + structure en une seule requête JOIN (évite N+1)
    @EntityGraph(attributePaths = {"profil", "structure"})
    List<Participant> findAll();

    // ✅ Idem pour findByEmail
    @EntityGraph(attributePaths = {"profil", "structure"})
    Optional<Participant> findByEmail(String email);
}
