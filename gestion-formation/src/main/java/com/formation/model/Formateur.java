package com.formation.model;

import jakarta.persistence.*;

@Entity
@Table(name = "formateurs")
public class Formateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    private String email;

    private String tel;

    @Column(nullable = false)
    private String type; // "interne" ou "externe"

    @ManyToOne(fetch = FetchType.LAZY)          // ✅ LAZY : null si formateur interne, pas de JOIN inutile
    @JoinColumn(name = "employeur_id", nullable = true)
    private Employeur employeur;

    public Formateur() {}

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

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Employeur getEmployeur() { return employeur; }
    public void setEmployeur(Employeur employeur) { this.employeur = employeur; }
}
