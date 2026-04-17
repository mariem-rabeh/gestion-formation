package com.formation.controller;

import com.formation.dto.PlanificationRequest;
import com.formation.model.Formation;
import com.formation.service.FormationService;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/formations")
public class FormationController {

    private final FormationService formationService;

    public FormationController(FormationService formationService) {
        this.formationService = formationService;
    }

    // ✅ @Transactional ici garantit que la session reste ouverte pendant la sérialisation JSON
    @Transactional(readOnly = true)
    @GetMapping
    public List<Formation> getAll() {
        return formationService.findAll();
    }

    @Transactional(readOnly = true)
    @GetMapping("/{id}")
    public ResponseEntity<Formation> getById(@PathVariable Long id) {
        return ResponseEntity.ok(formationService.findById(id));
    }

    @Transactional
    @PostMapping
    public ResponseEntity<Formation> create(@RequestBody Formation formation) {
        return ResponseEntity.ok(formationService.save(formation));
    }

    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<Formation> update(@PathVariable Long id,
                                            @RequestBody Formation formation) {
        return ResponseEntity.ok(formationService.update(id, formation));
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        formationService.delete(id);
        return ResponseEntity.ok("Formation supprimée avec succès");
    }

    @Transactional
    @PostMapping("/{id}/participants")
    public ResponseEntity<Formation> addParticipants(@PathVariable Long id,
                                                     @RequestBody List<Long> participantIds) {
        return ResponseEntity.ok(formationService.addParticipants(id, participantIds));
    }

    @Transactional
    @PutMapping("/{id}/participants")
    public ResponseEntity<Formation> setParticipants(@PathVariable Long id,
                                                     @RequestBody List<Long> participantIds) {
        return ResponseEntity.ok(formationService.setParticipants(id, participantIds));
    }

    @Transactional
    @DeleteMapping("/{id}/participants/{participantId}")
    public ResponseEntity<Formation> removeParticipant(@PathVariable Long id,
                                                       @PathVariable Long participantId) {
        return ResponseEntity.ok(formationService.removeParticipant(id, participantId));
    }

    @Transactional
    @PutMapping("/{id}/formateur/{formateurId}")
    public ResponseEntity<Formation> assignFormateur(@PathVariable Long id,
                                                     @PathVariable Long formateurId) {
        return ResponseEntity.ok(formationService.assignFormateur(id, formateurId));
    }

    @Transactional
    @PutMapping("/{id}/planifier")
    public ResponseEntity<Formation> planifier(@PathVariable Long id,
                                               @RequestBody PlanificationRequest req) {
        return ResponseEntity.ok(formationService.planifier(id, req));
    }
}