package com.formation.controller;

import com.formation.model.Formation;
import com.formation.model.Participant;
import com.formation.repository.FormationRepository;
import com.formation.repository.ParticipantRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final FormationRepository formationRepository;
    private final ParticipantRepository participantRepository;

    public StatsController(FormationRepository formationRepository,
                           ParticipantRepository participantRepository) {
        this.formationRepository = formationRepository;
        this.participantRepository = participantRepository;
    }

    // ─── 1. Participants par année ─────────────────────────────────────────
    @Transactional(readOnly = true)
    @GetMapping("/participants-par-annee")
    public List<Map<String, Object>> participantsParAnnee() {
        List<Formation> formations = formationRepository.findAll();
        Map<Integer, Long> map = new TreeMap<>();
        for (Formation f : formations) {
            if (f.getAnnee() != null) {
                long count = f.getParticipants() != null ? f.getParticipants().size() : 0L;
                map.merge(f.getAnnee(), count, Long::sum);
            }
        }
        return map.entrySet().stream()
                .map(e -> Map.of("annee", (Object) e.getKey(), "total", e.getValue()))
                .collect(Collectors.toList());
    }

    // ─── 2. Participants par formation ────────────────────────────────────
    @Transactional(readOnly = true)
    @GetMapping("/participants-par-formation")
    public List<Map<String, Object>> participantsParFormation() {
        return formationRepository.findAll().stream()
                .map(f -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("formation", f.getTitre());
                    m.put("annee", f.getAnnee());
                    // ✅ Correction : cast explicite en Long pour éviter ClassCastException
                    m.put("total", f.getParticipants() != null ? (long) f.getParticipants().size() : 0L);
                    return m;
                })
                // ✅ Correction : comparateur typé Long (plus de cast Object → Long)
                .sorted((a, b) -> Long.compare((Long) b.get("total"), (Long) a.get("total")))
                .collect(Collectors.toList());
    }

    // ─── 3. Participants par profil (%) ───────────────────────────────────
    @Transactional(readOnly = true)
    @GetMapping("/participants-par-profil")
    public List<Map<String, Object>> participantsParProfil() {
        List<Participant> participants = participantRepository.findAll();
        long total = participants.size();
        Map<String, Long> map = new LinkedHashMap<>();
        for (Participant p : participants) {
            String profil = p.getProfil() != null ? p.getProfil().getLibelle() : "Inconnu";
            map.merge(profil, 1L, Long::sum);
        }
        return map.entrySet().stream()
                .map(e -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("profil", e.getKey());
                    m.put("total", e.getValue());                          // Long ✅
                    m.put("pourcentage", total > 0
                            ? Math.round(e.getValue() * 100.0 / total * 10) / 10.0
                            : 0.0);
                    return m;
                })
                .sorted((a, b) -> Long.compare((Long) b.get("total"), (Long) a.get("total")))
                .collect(Collectors.toList());
    }

    // ─── 4. Participants par structure ────────────────────────────────────
    @Transactional(readOnly = true)
    @GetMapping("/participants-par-structure")
    public List<Map<String, Object>> participantsParStructure() {
        List<Participant> participants = participantRepository.findAll();
        Map<String, Long> map = new LinkedHashMap<>();
        for (Participant p : participants) {
            String structure = p.getStructure() != null ? p.getStructure().getLibelle() : "Inconnu";
            map.merge(structure, 1L, Long::sum);
        }
        return map.entrySet().stream()
                .map(e -> Map.of("structure", (Object) e.getKey(), "total", e.getValue())) // Long ✅
                .sorted((a, b) -> Long.compare((Long) b.get("total"), (Long) a.get("total")))
                .collect(Collectors.toList());
    }

    // ─── 5. Comparaison 2 années ──────────────────────────────────────────
    @Transactional(readOnly = true)
    @GetMapping("/comparaison-annees")
    public Map<String, Object> comparaisonAnnees(
            @RequestParam Integer annee1,
            @RequestParam Integer annee2) {

        List<Formation> formations = formationRepository.findAll();

        long participants1 = formations.stream()
                .filter(f -> annee1.equals(f.getAnnee()))
                .mapToLong(f -> f.getParticipants() != null ? f.getParticipants().size() : 0L)
                .sum();

        long participants2 = formations.stream()
                .filter(f -> annee2.equals(f.getAnnee()))
                .mapToLong(f -> f.getParticipants() != null ? f.getParticipants().size() : 0L)
                .sum();

        long formations1 = formations.stream().filter(f -> annee1.equals(f.getAnnee())).count();
        long formations2 = formations.stream().filter(f -> annee2.equals(f.getAnnee())).count();

        double budgetTotal1 = formations.stream()
                .filter(f -> annee1.equals(f.getAnnee()))
                .mapToDouble(Formation::getBudget).sum();

        double budgetTotal2 = formations.stream()
                .filter(f -> annee2.equals(f.getAnnee()))
                .mapToDouble(Formation::getBudget).sum();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("annee1", annee1);
        result.put("annee2", annee2);
        result.put("participants1", participants1);
        result.put("participants2", participants2);
        result.put("formations1", formations1);
        result.put("formations2", formations2);
        result.put("budget1", budgetTotal1);
        result.put("budget2", budgetTotal2);
        result.put("evolutionParticipants",
                participants1 > 0
                        ? Math.round((participants2 - participants1) * 100.0 / participants1 * 10) / 10.0
                        : 0.0);
        return result;
    }

    // ─── 6. Résumé global ─────────────────────────────────────────────────
    @Transactional(readOnly = true)
    @GetMapping("/resume")
    public Map<String, Object> resume() {
        List<Formation> formations = formationRepository.findAll();
        long totalParticipants = participantRepository.count();
        long totalFormations = formations.size();
        double budgetTotal = formations.stream().mapToDouble(Formation::getBudget).sum();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalFormations", totalFormations);
        result.put("totalParticipants", totalParticipants);
        result.put("budgetTotal", budgetTotal);
        return result;
    }
}