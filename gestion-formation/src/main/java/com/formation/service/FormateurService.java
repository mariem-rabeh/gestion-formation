package com.formation.service;

import com.formation.model.Employeur;
import com.formation.model.Formateur;
import com.formation.repository.EmployeurRepository;
import com.formation.repository.FormateurRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FormateurService {

    private final FormateurRepository formateurRepository;
    private final EmployeurRepository employeurRepository;

    public FormateurService(FormateurRepository formateurRepository,
                            EmployeurRepository employeurRepository) {
        this.formateurRepository = formateurRepository;
        this.employeurRepository = employeurRepository;
    }

    public List<Formateur> findAll() {
        return formateurRepository.findAll();
    }

    public Formateur findById(Long id) {
        return formateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formateur non trouvé : " + id));
    }

    public Formateur save(Formateur formateur) {
        // ✅ Si externe, vérifier que l'employeur existe
        if ("externe".equalsIgnoreCase(formateur.getType()) && formateur.getEmployeur() != null) {
            Long empId = formateur.getEmployeur().getId();
            Employeur employeur = employeurRepository.findById(empId)
                    .orElseThrow(() -> new RuntimeException("Employeur non trouvé : " + empId));
            formateur.setEmployeur(employeur);
        } else {
            // ✅ Si interne, pas d'employeur
            formateur.setEmployeur(null);
        }
        return formateurRepository.save(formateur);
    }

    public Formateur update(Long id, Formateur updated) {
        Formateur existing = findById(id);
        existing.setNom(updated.getNom());
        existing.setPrenom(updated.getPrenom());
        existing.setEmail(updated.getEmail());
        existing.setTel(updated.getTel());
        existing.setType(updated.getType());

        if ("externe".equalsIgnoreCase(updated.getType()) && updated.getEmployeur() != null) {
            Long empId = updated.getEmployeur().getId();
            Employeur employeur = employeurRepository.findById(empId)
                    .orElseThrow(() -> new RuntimeException("Employeur non trouvé : " + empId));
            existing.setEmployeur(employeur);
        } else {
            existing.setEmployeur(null);
        }

        return formateurRepository.save(existing);
    }

    public void delete(Long id) {
        findById(id);
        formateurRepository.deleteById(id);
    }

    // ✅ Récupérer tous les employeurs (pour le dropdown frontend)
    public List<Employeur> findAllEmployeurs() {
        return employeurRepository.findAll();
    }
}
