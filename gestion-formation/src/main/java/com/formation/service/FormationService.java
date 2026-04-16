package com.formation.service;

import com.formation.model.Formation;
import com.formation.repository.FormationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FormationService {

    private final FormationRepository formationRepository;

    public FormationService(FormationRepository formationRepository) {
        this.formationRepository = formationRepository;
    }

    // ✅ Récupérer toutes les formations
    public List<Formation> findAll() {
        return formationRepository.findAll();
    }

    // ✅ Récupérer une formation par ID
    public Formation findById(Long id) {
        return formationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formation non trouvée avec l'id : " + id));
    }

    // ✅ Créer une formation
    public Formation save(Formation formation) {
        return formationRepository.save(formation);
    }

    // ✅ Modifier une formation
    public Formation update(Long id, Formation updated) {
        Formation existing = findById(id);
        existing.setTitre(updated.getTitre());
        existing.setAnnee(updated.getAnnee());
        existing.setDuree(updated.getDuree());
        existing.setBudget(updated.getBudget());
        return formationRepository.save(existing);
    }

    // ✅ Supprimer une formation
    public void delete(Long id) {
        findById(id); // vérifie existence
        formationRepository.deleteById(id);
    }
}
