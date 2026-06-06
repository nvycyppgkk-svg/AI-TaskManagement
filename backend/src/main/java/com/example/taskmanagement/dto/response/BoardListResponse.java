package com.example.taskmanagement.dto.response;

import com.example.taskmanagement.entity.BoardList;
import java.time.LocalDateTime;

public class BoardListResponse {
    private final Integer id;
    private final String name;
    private final Integer position;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public static BoardListResponse from(BoardList boardList) {
        return new BoardListResponse(
            boardList.getId(), boardList.getName(), boardList.getPosition(),
            boardList.getCreatedAt(), boardList.getUpdatedAt()
        );
    }

    private BoardListResponse(Integer id, String name, Integer position,
                               LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getId()              { return id; }
    public String getName()             { return name; }
    public Integer getPosition()        { return position; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
