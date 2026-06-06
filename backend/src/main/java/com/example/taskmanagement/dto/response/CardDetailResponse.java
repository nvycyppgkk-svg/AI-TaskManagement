package com.example.taskmanagement.dto.response;

import com.example.taskmanagement.entity.Card;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class CardDetailResponse {
    private final Integer id;
    private final Integer listId;
    private final String title;
    private final String description;
    private final String priority;
    private final LocalDate dueDate;
    private final Integer position;
    private final List<LabelResponse> labels;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public static CardDetailResponse from(Card card) {
        List<LabelResponse> labelResponses = card.getLabels().stream()
            .map(LabelResponse::from)
            .collect(Collectors.toList());
        return new CardDetailResponse(
            card.getId(),
            card.getBoardList().getId(),
            card.getTitle(),
            card.getDescription(),
            card.getPriority(),
            card.getDueDate(),
            card.getPosition(),
            labelResponses,
            card.getCreatedAt(),
            card.getUpdatedAt()
        );
    }

    private CardDetailResponse(Integer id, Integer listId, String title, String description,
                                String priority, LocalDate dueDate, Integer position,
                                List<LabelResponse> labels,
                                LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.listId = listId;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.position = position;
        this.labels = labels;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getId()                 { return id; }
    public Integer getListId()             { return listId; }
    public String getTitle()               { return title; }
    public String getDescription()         { return description; }
    public String getPriority()            { return priority; }
    public LocalDate getDueDate()          { return dueDate; }
    public Integer getPosition()           { return position; }
    public List<LabelResponse> getLabels() { return labels; }
    public LocalDateTime getCreatedAt()    { return createdAt; }
    public LocalDateTime getUpdatedAt()    { return updatedAt; }
}
