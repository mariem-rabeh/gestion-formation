package com.formation.controller;

import com.formation.model.Profil;
import com.formation.repository.ProfilRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profils")
public class ProfilController {

    private final ProfilRepository profilRepository;

    public ProfilController(ProfilRepository profilRepository) {
        this.profilRepository = profilRepository;
    }

    @GetMapping
    public List<Profil> getAll() {
        return profilRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Profil> create(@RequestBody Profil profil) {
        return ResponseEntity.ok(profilRepository.save(profil));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Profil> update(@PathVariable Long id, @RequestBody Profil updated) {
        Profil existing = profilRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profil non trouvé : " + id));
        existing.setLibelle(updated.getLibelle());
        return ResponseEntity.ok(profilRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        profilRepository.deleteById(id);
        return ResponseEntity.ok("Profil supprimé");
    }
}