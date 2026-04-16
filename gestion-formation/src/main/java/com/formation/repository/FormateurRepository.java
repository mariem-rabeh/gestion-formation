package com.formation.repository;

import com.formation.model.Formateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FormateurRepository extends JpaRepository<Formateur, Long> {
    List<Formateur> findByType(String type); // findByType("interne") ou findByType("externe")
}
