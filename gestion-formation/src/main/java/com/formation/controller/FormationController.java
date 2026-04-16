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
}