package com.formation.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "formations")
public class Formation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le titre est obligatoire")
    @Column(nullable = false)
    private String titre;

    @NotNull(message = "L'année est obligatoire")
    private Integer annee;

    @Min(value = 1, message = "La durée doit être supérieure à 0")
    private int duree; // nombre de jours

    private double budget;

        
    public Formation() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public Integer getAnnee() { return annee; }
    public void setAnnee(Integer annee) { this.annee = annee; }

    public int getDuree() { return duree; }
    public void setDuree(int duree) { this.duree = duree; }

    public double getBudget() { return budget; }
    public void setBudget(double budget) { this.budget = budget; }
}