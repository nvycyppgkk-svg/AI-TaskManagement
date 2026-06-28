package com.example.taskmanagement.dto.response;

import com.example.taskmanagement.entity.Board;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class BoardDetailResponse {
    private final Integer id;
    private final String name;
    private final List<BoardListResponse> lists;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public static BoardDetailResponse from(Board board) {
        List<BoardListResponse> listResponses =
                board.getLists().stream().map(BoardListResponse::from).collect(Collectors.toList());
        return new BoardDetailResponse(
                board.getId(),
                board.getName(),
                listResponses,
                board.getCreatedAt(),
                board.getUpdatedAt());
    }

    private BoardDetailResponse(
            Integer id,
            String name,
            List<BoardListResponse> lists,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.lists = lists;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public List<BoardListResponse> getLists() {
        return lists;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
