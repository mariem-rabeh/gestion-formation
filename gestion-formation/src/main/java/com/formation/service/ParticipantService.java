package com.formation.service;

import com.formation.model.Participant;
import com.formation.model.Profil;
import com.formation.model.Structure;
import com.formation.repository.ParticipantRepository;
import com.formation.repository.ProfilRepository;
import com.formation.repository.StructureRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParticipantService {

    private final ParticipantRepository participantRepository;
    private final StructureRepository structureRepository;
    private final ProfilRepository profilRepository;

    public ParticipantService(ParticipantRepository participantRepository,
                               StructureRepository structureRepository,
                               ProfilRepository profilRepository) {
        this.participantRepository = participantRepository;
        this.structureRepository = structureRepository;
        this.profilRepository = profilRepository;
    }

    public List<Participant> findAll() {
        return participantRepository.findAll();
    }

    public Participant findById(Long id) {
        return participantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Participant non trouvé : " + id));
    }

    public Participant save(Participant participant) {
        // ✅ Validation email unique
        participantRepository.findByEmail(participant.getEmail()).ifPresent(p -> {
            throw new RuntimeException("Email déjà utilisé : " + participant.getEmail());
        });

        resolveRelations(participant);
        return participantRepository.save(participant);
    }

    public Participant update(Long id, Participant updated) {
        Participant existing = findById(id);

        // ✅ Vérifier email unique sauf pour le même participant
        participantRepository.findByEmail(updated.getEmail()).ifPresent(p -> {
            if (!p.getId().equals(id)) {
                throw new RuntimeException("Email déjà utilisé : " + updated.getEmail());
            }
        });

        existing.setNom(updated.getNom());
        existing.setPrenom(updated.getPrenom());
        existing.setEmail(updated.getEmail());
        existing.setTel(updated.getTel());
        existing.setStructure(updated.getStructure());
        existing.setProfil(updated.getProfil());

        resolveRelations(existing);
        return participantRepository.save(existing);
    }

    public void delete(Long id) {
        findById(id);
        participantRepository.deleteById(id);
    }

    // ✅ Résoudre les relations Structure et Profil depuis leurs IDs
    private void resolveRelations(Participant participant) {
        if (participant.getStructure() != null && participant.getStructure().getId() != null) {
            Structure structure = structureRepository.findById(participant.getStructure().getId())
                    .orElseThrow(() -> new RuntimeException("Structure non trouvée"));
            participant.setStructure(structure);
        }

        if (participant.getProfil() != null && participant.getProfil().getId() != null) {
            Profil profil = profilRepository.findById(participant.getProfil().getId())
                    .orElseThrow(() -> new RuntimeException("Profil non trouvé"));
            participant.setProfil(profil);
        }
    }

    // ✅ Pour les dropdowns frontend
    public List<Structure> findAllStructures() {
        return structureRepository.findAll();
    }

    public List<Profil> findAllProfils() {
        return profilRepository.findAll();
    }
}
