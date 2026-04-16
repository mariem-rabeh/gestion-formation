package com.formation.controller;

import com.formation.model.Employeur;
import com.formation.repository.EmployeurRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employeurs")
public class EmployeurController {

    private final EmployeurRepository employeurRepository;

    public EmployeurController(EmployeurRepository employeurRepository) {
        this.employeurRepository = employeurRepository;
    }

    @GetMapping
    public List<Employeur> getAll() {
        return employeurRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Employeur> create(@RequestBody Employeur employeur) {
        return ResponseEntity.ok(employeurRepository.save(employeur));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employeur> update(@PathVariable Long id, @RequestBody Employeur updated) {
        Employeur existing = employeurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employeur non trouvé : " + id));
        existing.setNomEmployeur(updated.getNomEmployeur());
        return ResponseEntity.ok(employeurRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        employeurRepository.deleteById(id);
        return ResponseEntity.ok("Employeur supprimé");
    }
}