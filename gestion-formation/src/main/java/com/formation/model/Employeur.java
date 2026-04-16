package com.formation.model;

import jakarta.persistence.*;

@Entity
@Table(name = "employeurs")
public class Employeur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomEmployeur;

    public Employeur() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNomEmployeur() { return nomEmployeur; }
    public void setNomEmployeur(String nomEmployeur) { this.nomEmployeur = nomEmployeur; }
}
