package com.formation.service;

import com.formation.model.*;
import com.formation.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class FormationService {

    private final FormationRepository formationRepository;
    private final FormateurRepository formateurRepository;
    private final DomaineRepository domaineRepository;
    private final ParticipantRepository participantRepository;

    public FormationService(FormationRepository formationRepository,
                            FormateurRepository formateurRepository,
                            DomaineRepository domaineRepository,
                            ParticipantRepository participantRepository) {
        this.formationRepository = formationRepository;
        this.formateurRepository = formateurRepository;
        this.domaineRepository = domaineRepository;
        this.participantRepository = participantRepository;
    }

    public List<Formation> findAll() {
        return formationRepository.findAll();
    }

    public Formation findById(Long id) {
        return formationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formation non trouvée avec l'id : " + id));
    }

    public Formation save(Formation formation) {
        resolveRelations(formation);
        return formationRepository.save(formation);
    }

    public Formation update(Long id, Formation updated) {
        Formation existing = findById(id);
        existing.setTitre(updated.getTitre());
        existing.setAnnee(updated.getAnnee());
        existing.setDuree(updated.getDuree());
        existing.setBudget(updated.getBudget());
        existing.setDateDebut(updated.getDateDebut());
        existing.setDateFin(updated.getDateFin());

        // Formateur
        if (updated.getFormateur() != null && updated.getFormateur().getId() != null) {
            Formateur formateur = formateurRepository.findById(updated.getFormateur().getId())
                    .orElseThrow(() -> new RuntimeException("Formateur non trouvé"));
            existing.setFormateur(formateur);
        } else {
            existing.setFormateur(null);
        }

        // Domaine
        if (updated.getDomaine() != null && updated.getDomaine().getId() != null) {
            Domaine domaine = domaineRepository.findById(updated.getDomaine().getId())
                    .orElseThrow(() -> new RuntimeException("Domaine non trouvé"));
            existing.setDomaine(domaine);
        } else {
            existing.setDomaine(null);
        }

        return formationRepository.save(existing);
    }

    public void delete(Long id) {
        findById(id);
        formationRepository.deleteById(id);
    }

    // ✅ Ajouter des participants à une formation
    @Transactional
    public Formation addParticipants(Long formationId, List<Long> participantIds) {
        Formation formation = findById(formationId);

        Set<Participant> participants = participantIds.stream()
                .map(pid -> participantRepository.findById(pid)
                        .orElseThrow(() -> new RuntimeException("Participant non trouvé : " + pid)))
                .collect(Collectors.toSet());

        formation.getParticipants().addAll(participants);
        return formationRepository.save(formation);
    }

    // ✅ Remplacer la liste complète des participants
    @Transactional
    public Formation setParticipants(Long formationId, List<Long> participantIds) {
        Formation formation = findById(formationId);

        Set<Participant> participants = participantIds.stream()
                .map(pid -> participantRepository.findById(pid)
                        .orElseThrow(() -> new RuntimeException("Participant non trouvé : " + pid)))
                .collect(Collectors.toSet());

        formation.setParticipants(participants);
        return formationRepository.save(formation);
    }

    // ✅ Retirer un participant d'une formation
    @Transactional
    public Formation removeParticipant(Long formationId, Long participantId) {
        Formation formation = findById(formationId);
        formation.getParticipants().removeIf(p -> p.getId().equals(participantId));
        return formationRepository.save(formation);
    }

    // ✅ Assigner un formateur à une formation
    @Transactional
    public Formation assignFormateur(Long formationId, Long formateurId) {
        Formation formation = findById(formationId);
        Formateur formateur = formateurRepository.findById(formateurId)
                .orElseThrow(() -> new RuntimeException("Formateur non trouvé : " + formateurId));
        formation.setFormateur(formateur);
        return formationRepository.save(formation);
    }

    private void resolveRelations(Formation formation) {
        if (formation.getFormateur() != null && formation.getFormateur().getId() != null) {
            Formateur formateur = formateurRepository.findById(formation.getFormateur().getId())
                    .orElseThrow(() -> new RuntimeException("Formateur non trouvé"));
            formation.setFormateur(formateur);
        }

        if (formation.getDomaine() != null && formation.getDomaine().getId() != null) {
            Domaine domaine = domaineRepository.findById(formation.getDomaine().getId())
                    .orElseThrow(() -> new RuntimeException("Domaine non trouvé"));
            formation.setDomaine(domaine);
        }
    }
}