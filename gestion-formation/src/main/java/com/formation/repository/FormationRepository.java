package com.formation.repository;

import com.formation.model.Formation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FormationRepository extends JpaRepository<Formation, Long> {

    // ✅ Liste des formations avec domaine + formateur (sans participants)
    //    Utilisé pour les listes/tableaux → graph léger
    @EntityGraph("Formation.withFormateurAndDomaine")
    List<Formation> findAll();

    // ✅ Détail d'une formation avec TOUT chargé en une seule requête
    //    Utilisé pour la page de détail → graph complet
    @EntityGraph("Formation.withAll")
    Optional<Formation> findById(Long id);

    // ✅ Recherche par année avec graph léger
    @EntityGraph("Formation.withFormateurAndDomaine")
    List<Formation> findByAnnee(Integer annee);

    // ✅ Recherche par titre avec graph léger
    @EntityGraph("Formation.withFormateurAndDomaine")
    List<Formation> findByTitreContainingIgnoreCase(String titre);

    // ✅ Requête JPQL alternative si besoin de contrôle total
    //    (remplace findAll si @NamedEntityGraph non souhaité)
    @Query("""
        SELECT DISTINCT f FROM Formation f
        LEFT JOIN FETCH f.domaine
        LEFT JOIN FETCH f.formateur ft
        LEFT JOIN FETCH ft.employeur
    """)
    List<Formation> findAllWithFormateurAndDomaine();
}
