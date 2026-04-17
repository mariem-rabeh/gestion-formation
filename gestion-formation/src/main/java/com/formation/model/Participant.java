package com.formation.model;

import jakarta.persistence.*;

@Entity
@Table(name = "participants")
public class Participant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(unique = true)
    private String email;

    private String tel;

    @ManyToOne(fetch = FetchType.LAZY)          // ✅ LAZY : pas de SELECT séparé à chaque chargement
    @JoinColumn(name = "structure_id", nullable = false)
    private Structure structure;

    @ManyToOne(fetch = FetchType.LAZY)          // ✅ LAZY
    @JoinColumn(name = "profil_id", nullable = false)
    private Profil profil;

    public Participant() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTel() { return tel; }
    public void setTel(String tel) { this.tel = tel; }

    public Structure getStructure() { return structure; }
    public void setStructure(Structure structure) { this.structure = structure; }

    public Profil getProfil() { return profil; }
    public void setProfil(Profil profil) { this.profil = profil; }
}
