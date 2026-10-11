package com.example.taskmanagement.dto.response;

import com.example.taskmanagement.entity.Card;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class CardSummaryResponse {
    private final Integer id;
    private final String title;
    private final String priority;
    private final LocalDate dueDate;
    private final Integer position;
    private final LocalDateTime createdAt;
    private final List<LabelResponse> labels;

    public static CardSummaryResponse from(Card card) {
        List<LabelResponse> labelResponses =
                card.getLabels().stream().map(LabelResponse::from).collect(Collectors.toList());
        return new CardSummaryResponse(
                card.getId(),
                card.getTitle(),
                card.getPriority(),
                card.getDueDate(),
                card.getPosition(),
                card.getCreatedAt(),
                labelResponses);
    }

    private CardSummaryResponse(
            Integer id,
            String title,
            String priority,
            LocalDate dueDate,
            Integer position,
            LocalDateTime createdAt,
            List<LabelResponse> labels) {
        this.id = id;
        this.title = title;
        this.priority = priority;
        this.dueDate = dueDate;
        this.position = position;
        this.createdAt = createdAt;
        this.labels = labels;
    }

    public Integer getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getPriority() {
        return priority;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public Integer getPosition() {
        return position;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<LabelResponse> getLabels() {
        return labels;
    }
}
