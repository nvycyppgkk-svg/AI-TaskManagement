package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.request.CardCreateRequest;
import com.example.taskmanagement.dto.request.CardUpdateRequest;
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
import java.util.ArrayList;
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

    @Transactional
    public CardDetailResponse updateCard(Integer id, CardUpdateRequest request) {
        Card card = cardRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Card", id));

        if (request.getTitle() != null) {
            card.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            card.setDescription(request.getDescription());
        }
        if (request.getPriority() != null) {
            card.setPriority(request.getPriority());
        }
        if (request.getDueDate() != null) {
            card.setDueDate(request.getDueDate());
        }
        boolean listChanged = request.getListId() != null && !request.getListId().equals(card.getBoardList().getId());
        if (listChanged || request.getPosition() != null) {
            Integer targetListId = listChanged ? request.getListId() : card.getBoardList().getId();
            BoardList targetList = listChanged
                ? boardListRepository.findById(targetListId)
                    .orElseThrow(() -> new ResourceNotFoundException("List", targetListId))
                : card.getBoardList();

            reorderCard(card, targetList, request.getPosition());
        }

        card.setUpdatedAt(LocalDateTime.now());

        Card saved = cardRepository.save(card);
        return CardDetailResponse.from(saved);
    }

    private void reorderCard(Card card, BoardList targetList, Integer requestedPosition) {
        boolean movingList = !targetList.getId().equals(card.getBoardList().getId());

        List<Card> targetCards = cardRepository.findByBoardListIdOrderByPositionAsc(targetList.getId()).stream()
            .filter(c -> !c.getId().equals(card.getId()))
            .collect(Collectors.toCollection(ArrayList::new));

        int insertIndex = requestedPosition == null
            ? targetCards.size()
            : Math.max(0, Math.min(requestedPosition, targetCards.size()));
        targetCards.add(insertIndex, card);

        for (int i = 0; i < targetCards.size(); i++) {
            targetCards.get(i).setPosition(i);
        }

        if (movingList) {
            card.setBoardList(targetList);
        }

        cardRepository.saveAll(targetCards);
    }
}
