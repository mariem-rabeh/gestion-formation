package com.formation.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

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
    private int duree;

    private double budget;

    private LocalDate dateDebut;

    private LocalDate dateFin;

    // ✅ EAGER obligatoire pour éviter "no session" lors de la sérialisation JSON
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "domaine_id", nullable = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Domaine domaine;

    // ✅ EAGER obligatoire
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "formateur_id", nullable = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Formateur formateur;

    // ✅ EAGER obligatoire
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "formation_participants",
            joinColumns = @JoinColumn(name = "formation_id"),
            inverseJoinColumns = @JoinColumn(name = "participant_id")
    )
    @JsonIgnoreProperties({"formations", "hibernateLazyInitializer", "handler"})
    private Set<Participant> participants = new HashSet<>();

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

    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }

    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }

    public Domaine getDomaine() { return domaine; }
    public void setDomaine(Domaine domaine) { this.domaine = domaine; }

    public Formateur getFormateur() { return formateur; }
    public void setFormateur(Formateur formateur) { this.formateur = formateur; }

    public Set<Participant> getParticipants() { return participants; }
    public void setParticipants(Set<Participant> participants) { this.participants = participants; }
}