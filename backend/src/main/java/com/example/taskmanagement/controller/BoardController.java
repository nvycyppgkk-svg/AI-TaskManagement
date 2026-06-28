package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.response.BoardDetailResponse;
import com.example.taskmanagement.dto.response.BoardListResponse;
import com.example.taskmanagement.dto.response.BoardSummaryResponse;
import com.example.taskmanagement.service.BoardService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/boards")
public class BoardController {

    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping
    public ResponseEntity<List<BoardSummaryResponse>> getAllBoards() {
        return ResponseEntity.ok(boardService.getAllBoards());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardDetailResponse> getBoardById(@PathVariable Integer id) {
        return ResponseEntity.ok(boardService.getBoardById(id));
    }

    @GetMapping("/{boardId}/lists")
    public ResponseEntity<List<BoardListResponse>> getListsByBoardId(
            @PathVariable Integer boardId) {
        return ResponseEntity.ok(boardService.getListsByBoardId(boardId));
    }
}
