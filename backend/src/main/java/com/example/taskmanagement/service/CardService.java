package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.request.CardCreateRequest;
import com.example.taskmanagement.dto.response.CardDetailResponse;
import com.example.taskmanagement.dto.response.CardSummaryResponse;
import com.example.taskmanagement.entity.BoardList;
import com.example.taskmanagement.entity.Card;
import com.example.taskmanagement.exception.ResourceNotFoundException;
import com.example.taskmanagement.repository.BoardListRepository;
import com.example.taskmanagement.repository.CardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CardService {

    private final CardRepository cardRepository;
    private final BoardListRepository boardListRepository;

    public CardService(CardRepository cardRepository,
                       BoardListRepository boardListRepository) {
        this.cardRepository = cardRepository;
        this.boardListRepository = boardListRepository;
    }

    @Transactional(readOnly = true)
    public List<CardSummaryResponse> getCardsByListId(Integer listId) {
        if (!boardListRepository.existsById(listId)) {
            throw new ResourceNotFoundException("List", listId);
        }
        return cardRepository.findByBoardListIdOrderByPositionAsc(listId).stream()
            .map(CardSummaryResponse::from)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CardDetailResponse getCardById(Integer id) {
        Card card = cardRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Card", id));
        card.getLabels().size();
        return CardDetailResponse.from(card);
    }

    @Transactional
    public CardDetailResponse createCard(Integer listId, CardCreateRequest request) {
        BoardList boardList = boardListRepository.findById(listId)
            .orElseThrow(() -> new ResourceNotFoundException("List", listId));

        int nextPosition = cardRepository.findFirstByBoardListIdOrderByPositionDesc(listId)
            .map(card -> card.getPosition() + 1)
            .orElse(0);

        LocalDateTime now = LocalDateTime.now();
        Card card = new Card(
            boardList,
            request.getTitle(),
            request.getDescription(),
            request.getPriority(),
            request.getDueDate(),
            nextPosition,
            now,
            now
        );

        Card saved = cardRepository.save(card);
        return CardDetailResponse.from(saved);
    }
}
