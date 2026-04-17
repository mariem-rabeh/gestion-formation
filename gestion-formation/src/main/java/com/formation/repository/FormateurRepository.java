package com.formation.repository;

import com.formation.model.Formateur;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FormateurRepository extends JpaRepository<Formateur, Long> {

    // ✅ Charge l'employeur en JOIN (évite N+1 sur formateurs externes)
    @EntityGraph(attributePaths = {"employeur"})
    List<Formateur> findAll();

    @EntityGraph(attributePaths = {"employeur"})
    List<Formateur> findByType(String type);
}
