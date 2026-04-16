package com.formation.repository;

import com.formation.model.Formation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FormationRepository extends JpaRepository<Formation, Long> {
    List<Formation> findByAnnee(Integer annee);
    List<Formation> findByTitreContainingIgnoreCase(String titre);
}
