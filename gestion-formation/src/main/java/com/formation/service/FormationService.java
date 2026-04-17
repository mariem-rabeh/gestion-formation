package com.formation.service;

import com.formation.dto.PlanificationRequest;
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

    // ✅ @Transactional pour garder la session ouverte pendant la sérialisation JSON
    @Transactional(readOnly = true)
    public List<Formation> findAll() {
        return formationRepository.findAll();
    }

    // ✅ @Transactional pour garder la session ouverte
    @Transactional(readOnly = true)
    public Formation findById(Long id) {
        return formationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formation non trouvée avec l'id : " + id));
    }

    @Transactional
    public Formation save(Formation formation) {
        resolveRelations(formation);
        return formationRepository.save(formation);
    }

    @Transactional
    public Formation update(Long id, Formation updated) {
        Formation existing = findById(id);
        existing.setTitre(updated.getTitre());
        existing.setAnnee(updated.getAnnee());
        existing.setDuree(updated.getDuree());
        existing.setBudget(updated.getBudget());
        existing.setDateDebut(updated.getDateDebut());
        existing.setDateFin(updated.getDateFin());

        if (updated.getFormateur() != null && updated.getFormateur().getId() != null) {
            Formateur formateur = formateurRepository.findById(updated.getFormateur().getId())
                    .orElseThrow(() -> new RuntimeException("Formateur non trouvé"));
            existing.setFormateur(formateur);
        } else {
            existing.setFormateur(null);
        }

        if (updated.getDomaine() != null && updated.getDomaine().getId() != null) {
            Domaine domaine = domaineRepository.findById(updated.getDomaine().getId())
                    .orElseThrow(() -> new RuntimeException("Domaine non trouvé"));
            existing.setDomaine(domaine);
        } else {
            existing.setDomaine(null);
        }

        return formationRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        findById(id);
        formationRepository.deleteById(id);
    }

    // ─── Participants ──────────────────────────────────────────────────────────

    @Transactional
    public Formation addParticipants(Long formationId, List<Long> participantIds) {
        Formation formation = findById(formationId);
        Set<Participant> toAdd = resolveParticipants(participantIds);
        formation.getParticipants().addAll(toAdd);
        return formationRepository.save(formation);
    }

    @Transactional
    public Formation setParticipants(Long formationId, List<Long> participantIds) {
        Formation formation = findById(formationId);
        formation.setParticipants(resolveParticipants(participantIds));
        return formationRepository.save(formation);
    }

    @Transactional
    public Formation removeParticipant(Long formationId, Long participantId) {
        Formation formation = findById(formationId);
        formation.getParticipants().removeIf(p -> p.getId().equals(participantId));
        return formationRepository.save(formation);
    }

    // ─── Formateur ─────────────────────────────────────────────────────────────

    @Transactional
    public Formation assignFormateur(Long formationId, Long formateurId) {
        Formation formation = findById(formationId);
        Formateur formateur = formateurRepository.findById(formateurId)
                .orElseThrow(() -> new RuntimeException("Formateur non trouvé : " + formateurId));
        formation.setFormateur(formateur);
        return formationRepository.save(formation);
    }

    // ─── Planification tout-en-un ──────────────────────────────────────────────

    @Transactional
    public Formation planifier(Long formationId, PlanificationRequest req) {
        Formation formation = findById(formationId);

        if (req.getFormateurId() != null) {
            Formateur formateur = formateurRepository.findById(req.getFormateurId())
                    .orElseThrow(() -> new RuntimeException("Formateur non trouvé : " + req.getFormateurId()));
            formation.setFormateur(formateur);
        }

        if (req.getDateDebut() != null) formation.setDateDebut(req.getDateDebut());
        if (req.getDateFin() != null)   formation.setDateFin(req.getDateFin());

        if (formation.getDateDebut() != null && formation.getDateFin() != null
                && formation.getDateFin().isBefore(formation.getDateDebut())) {
            throw new RuntimeException("La date de fin doit être postérieure à la date de début");
        }

        if (req.getParticipantIds() != null) {
            formation.setParticipants(resolveParticipants(req.getParticipantIds()));
        }

        return formationRepository.save(formation);
    }

    // ─── Helpers ───────────────────────────────────────────────────────────────

    private Set<Participant> resolveParticipants(List<Long> ids) {
        return ids.stream()
                .map(pid -> participantRepository.findById(pid)
                        .orElseThrow(() -> new RuntimeException("Participant non trouvé : " + pid)))
                .collect(Collectors.toSet());
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