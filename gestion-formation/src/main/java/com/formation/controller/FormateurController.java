package com.formation.controller;

import com.formation.model.Employeur;
import com.formation.model.Formateur;
import com.formation.service.FormateurService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/formateurs")
public class FormateurController {

    private final FormateurService formateurService;

    public FormateurController(FormateurService formateurService) {
        this.formateurService = formateurService;
    }

    // GET /api/formateurs
    @GetMapping
    public List<Formateur> getAll() {
        return formateurService.findAll();
    }

    // GET /api/formateurs/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Formateur> getById(@PathVariable Long id) {
        return ResponseEntity.ok(formateurService.findById(id));
    }

    // GET /api/formateurs/employeurs — pour le dropdown frontend
    @GetMapping("/employeurs")
    public List<Employeur> getEmployeurs() {
        return formateurService.findAllEmployeurs();
    }

    // POST /api/formateurs
    @PostMapping
    public ResponseEntity<Formateur> create(@RequestBody Formateur formateur) {
        return ResponseEntity.ok(formateurService.save(formateur));
    }

    // PUT /api/formateurs/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Formateur> update(@PathVariable Long id,
                                             @RequestBody Formateur formateur) {
        return ResponseEntity.ok(formateurService.update(id, formateur));
    }

    // DELETE /api/formateurs/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        formateurService.delete(id);
        return ResponseEntity.ok("Formateur supprimé avec succès");
    }
}
