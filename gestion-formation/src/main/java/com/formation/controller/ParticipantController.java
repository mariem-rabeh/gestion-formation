package com.formation.controller;

import com.formation.model.Participant;
import com.formation.model.Profil;
import com.formation.model.Structure;
import com.formation.service.ParticipantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participants")
public class ParticipantController {

    private final ParticipantService participantService;

    public ParticipantController(ParticipantService participantService) {
        this.participantService = participantService;
    }

    // GET /api/participants
    @GetMapping
    public List<Participant> getAll() {
        return participantService.findAll();
    }

    // GET /api/participants/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Participant> getById(@PathVariable Long id) {
        return ResponseEntity.ok(participantService.findById(id));
    }

    // GET /api/participants/structures — dropdown frontend
    @GetMapping("/structures")
    public List<Structure> getStructures() {
        return participantService.findAllStructures();
    }

    // GET /api/participants/profils — dropdown frontend
    @GetMapping("/profils")
    public List<Profil> getProfils() {
        return participantService.findAllProfils();
    }

    // POST /api/participants
    @PostMapping
    public ResponseEntity<Participant> create(@RequestBody Participant participant) {
        return ResponseEntity.ok(participantService.save(participant));
    }

    // PUT /api/participants/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Participant> update(@PathVariable Long id,
                                               @RequestBody Participant participant) {
        return ResponseEntity.ok(participantService.update(id, participant));
    }

    // DELETE /api/participants/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        participantService.delete(id);
        return ResponseEntity.ok("Participant supprimé avec succès");
    }
}
