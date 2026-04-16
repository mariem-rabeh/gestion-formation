package com.formation.controller;

import com.formation.model.Structure;
import com.formation.repository.StructureRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/structures")
public class StructureController {

    private final StructureRepository structureRepository;

    public StructureController(StructureRepository structureRepository) {
        this.structureRepository = structureRepository;
    }

    @GetMapping
    public List<Structure> getAll() {
        return structureRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Structure> create(@RequestBody Structure structure) {
        return ResponseEntity.ok(structureRepository.save(structure));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Structure> update(@PathVariable Long id, @RequestBody Structure updated) {
        Structure existing = structureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Structure non trouvée : " + id));
        existing.setLibelle(updated.getLibelle());
        return ResponseEntity.ok(structureRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        structureRepository.deleteById(id);
        return ResponseEntity.ok("Structure supprimée");
    }
}