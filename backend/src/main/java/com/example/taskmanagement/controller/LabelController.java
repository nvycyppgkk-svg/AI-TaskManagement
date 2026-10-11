package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.request.LabelCreateRequest;
import com.example.taskmanagement.dto.response.CardDetailResponse;
import com.example.taskmanagement.dto.response.LabelResponse;
import com.example.taskmanagement.service.LabelService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class LabelController {

    private final LabelService labelService;

    public LabelController(LabelService labelService) {
        this.labelService = labelService;
    }

    @GetMapping("/api/labels")
    public ResponseEntity<List<LabelResponse>> getAllLabels() {
        return ResponseEntity.ok(labelService.getAllLabels());
    }

    @PostMapping("/api/labels")
    public ResponseEntity<LabelResponse> createLabel(
            @Valid @RequestBody LabelCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(labelService.createLabel(request));
    }

    @DeleteMapping("/api/labels/{id}")
    public ResponseEntity<Void> deleteLabel(@PathVariable Integer id) {
        labelService.deleteLabel(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/cards/{cardId}/labels/{labelId}")
    public ResponseEntity<CardDetailResponse> attachLabel(
            @PathVariable Integer cardId, @PathVariable Integer labelId) {
        return ResponseEntity.ok(labelService.attachLabel(cardId, labelId));
    }

    @DeleteMapping("/api/cards/{cardId}/labels/{labelId}")
    public ResponseEntity<CardDetailResponse> detachLabel(
            @PathVariable Integer cardId, @PathVariable Integer labelId) {
        return ResponseEntity.ok(labelService.detachLabel(cardId, labelId));
    }
}
