package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.request.ListCreateRequest;
import com.example.taskmanagement.dto.request.ListUpdateRequest;
import com.example.taskmanagement.dto.response.BoardListResponse;
import com.example.taskmanagement.service.ListService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class ListController {

    private final ListService listService;

    public ListController(ListService listService) {
        this.listService = listService;
    }

    @PostMapping("/api/boards/{boardId}/lists")
    public ResponseEntity<BoardListResponse> createList(
            @PathVariable Integer boardId, @Valid @RequestBody ListCreateRequest request) {
        BoardListResponse created = listService.createList(boardId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/api/lists/{id}")
    public ResponseEntity<BoardListResponse> updateList(
            @PathVariable Integer id, @Valid @RequestBody ListUpdateRequest request) {
        return ResponseEntity.ok(listService.updateList(id, request));
    }

    @DeleteMapping("/api/lists/{id}")
    public ResponseEntity<Void> deleteList(@PathVariable Integer id) {
        listService.deleteList(id);
        return ResponseEntity.noContent().build();
    }
}
