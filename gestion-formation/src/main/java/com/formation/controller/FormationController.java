package com.formation.controller;

import com.formation.model.Formation;
import com.formation.service.FormationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/formations")
public class FormationController {

    private final FormationService formationService;

    public FormationController(FormationService formationService) {
        this.formationService = formationService;
    }

    // GET /api/formations
    @GetMapping
    public List<Formation> getAll() {
        return formationService.findAll();
    }

    // GET /api/formations/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Formation> getById(@PathVariable Long id) {
        return ResponseEntity.ok(formationService.findById(id));
    }

    // POST /api/formations
    @PostMapping
    public ResponseEntity<Formation> create(@RequestBody Formation formation) {
        return ResponseEntity.ok(formationService.save(formation));
    }

    // PUT /api/formations/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Formation> update(@PathVariable Long id,
                                            @RequestBody Formation formation) {
        return ResponseEntity.ok(formationService.update(id, formation));
    }

    // DELETE /api/formations/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        formationService.delete(id);
        return ResponseEntity.ok("Formation supprimée avec succès");
    }

    // ✅ POST /api/formations/{id}/participants — ajouter participants
    @PostMapping("/{id}/participants")
    public ResponseEntity<Formation> addParticipants(@PathVariable Long id,
                                                     @RequestBody List<Long> participantIds) {
        return ResponseEntity.ok(formationService.addParticipants(id, participantIds));
    }

    // ✅ PUT /api/formations/{id}/participants — remplacer tous les participants
    @PutMapping("/{id}/participants")
    public ResponseEntity<Formation> setParticipants(@PathVariable Long id,
                                                     @RequestBody List<Long> participantIds) {
        return ResponseEntity.ok(formationService.setParticipants(id, participantIds));
    }

    // ✅ DELETE /api/formations/{id}/participants/{participantId}
    @DeleteMapping("/{id}/participants/{participantId}")
    public ResponseEntity<Formation> removeParticipant(@PathVariable Long id,
                                                       @PathVariable Long participantId) {
        return ResponseEntity.ok(formationService.removeParticipant(id, participantId));
    }

    // ✅ PUT /api/formations/{id}/formateur/{formateurId} — assigner formateur
    @PutMapping("/{id}/formateur/{formateurId}")
    public ResponseEntity<Formation> assignFormateur(@PathVariable Long id,
                                                     @PathVariable Long formateurId) {
        return ResponseEntity.ok(formationService.assignFormateur(id, formateurId));
    }
}