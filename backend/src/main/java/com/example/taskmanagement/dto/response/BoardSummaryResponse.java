package com.example.taskmanagement.dto.response;

import com.example.taskmanagement.entity.Board;
import java.time.LocalDateTime;

public class BoardSummaryResponse {
    private final Integer id;
    private final String name;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public static BoardSummaryResponse from(Board board) {
        return new BoardSummaryResponse(
                board.getId(), board.getName(),
                board.getCreatedAt(), board.getUpdatedAt());
    }

    private BoardSummaryResponse(
            Integer id, String name, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
