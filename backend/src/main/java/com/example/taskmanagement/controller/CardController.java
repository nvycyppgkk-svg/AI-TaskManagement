package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.request.CardCreateRequest;
import com.example.taskmanagement.dto.request.CardUpdateRequest;
import com.example.taskmanagement.dto.response.CardDetailResponse;
import com.example.taskmanagement.dto.response.CardSummaryResponse;
import com.example.taskmanagement.service.CardService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class CardController {

    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @GetMapping("/api/lists/{listId}/cards")
    public ResponseEntity<List<CardSummaryResponse>> getCardsByListId(
            @PathVariable Integer listId) {
        return ResponseEntity.ok(cardService.getCardsByListId(listId));
    }

    @GetMapping("/api/cards/{id}")
    public ResponseEntity<CardDetailResponse> getCardById(@PathVariable Integer id) {
        return ResponseEntity.ok(cardService.getCardById(id));
    }

    @PostMapping("/api/lists/{listId}/cards")
    public ResponseEntity<CardDetailResponse> createCard(
            @PathVariable Integer listId, @Valid @RequestBody CardCreateRequest request) {
        CardDetailResponse created = cardService.createCard(listId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/api/cards/{id}")
    public ResponseEntity<CardDetailResponse> updateCard(
            @PathVariable Integer id, @Valid @RequestBody CardUpdateRequest request) {
        return ResponseEntity.ok(cardService.updateCard(id, request));
    }

    @DeleteMapping("/api/cards/{id}")
    public ResponseEntity<Void> deleteCard(@PathVariable Integer id) {
        cardService.deleteCard(id);
        return ResponseEntity.noContent().build();
    }
}
