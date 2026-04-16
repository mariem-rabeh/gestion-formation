package com.formation.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO pour la planification d'une formation :
 * - assigner un formateur
 * - définir les dates de début/fin
 * - définir la liste des participants
 */
public class PlanificationRequest {

    private Long formateurId;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private List<Long> participantIds;

    public PlanificationRequest() {}

    public Long getFormateurId() { return formateurId; }
    public void setFormateurId(Long formateurId) { this.formateurId = formateurId; }

    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }

    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }

    public List<Long> getParticipantIds() { return participantIds; }
    public void setParticipantIds(List<Long> participantIds) { this.participantIds = participantIds; }
}