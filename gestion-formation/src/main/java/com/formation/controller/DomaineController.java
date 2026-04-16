package com.formation.controller;

import com.formation.model.Domaine;
import com.formation.repository.DomaineRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/domaines")
public class DomaineController {
    private final DomaineRepository domaineRepository;

    public DomaineController(DomaineRepository domaineRepository) {
        this.domaineRepository = domaineRepository;
    }

    @GetMapping
    public List<Domaine> getAll() {
        return domaineRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Domaine> create(@RequestBody Domaine domaine) {
        return ResponseEntity.ok(domaineRepository.save(domaine));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Domaine> update(@PathVariable Long id, @RequestBody Domaine updated) {
        Domaine existing = domaineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Domaine non trouvé : " + id));
        existing.setLibelle(updated.getLibelle());
        return ResponseEntity.ok(domaineRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        domaineRepository.deleteById(id);
        return ResponseEntity.ok("Domaine supprimé");
    }
}