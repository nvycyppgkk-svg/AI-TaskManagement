package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.request.LabelCreateRequest;
import com.example.taskmanagement.dto.response.CardDetailResponse;
import com.example.taskmanagement.dto.response.LabelResponse;
import com.example.taskmanagement.entity.Card;
import com.example.taskmanagement.entity.Label;
import com.example.taskmanagement.exception.ResourceNotFoundException;
import com.example.taskmanagement.repository.CardRepository;
import com.example.taskmanagement.repository.LabelRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LabelService {

    private final LabelRepository labelRepository;
    private final CardRepository cardRepository;

    public LabelService(LabelRepository labelRepository, CardRepository cardRepository) {
        this.labelRepository = labelRepository;
        this.cardRepository = cardRepository;
    }

    @Transactional(readOnly = true)
    public List<LabelResponse> getAllLabels() {
        return labelRepository.findAll().stream()
                .map(LabelResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public LabelResponse createLabel(LabelCreateRequest request) {
        Label label = new Label();
        label.setName(request.getName());
        label.setColor(request.getColor());
        label.setCreatedAt(LocalDateTime.now());
        return LabelResponse.from(labelRepository.save(label));
    }

    @Transactional
    public void deleteLabel(Integer id) {
        if (!labelRepository.existsById(id)) {
            throw new ResourceNotFoundException("Label", id);
        }
        labelRepository.deleteById(id);
    }

    @Transactional
    public CardDetailResponse attachLabel(Integer cardId, Integer labelId) {
        Card card =
                cardRepository
                        .findByIdWithLabels(cardId)
                        .orElseThrow(() -> new ResourceNotFoundException("Card", cardId));
        Label label =
                labelRepository
                        .findById(labelId)
                        .orElseThrow(() -> new ResourceNotFoundException("Label", labelId));

        boolean alreadyAttached =
                card.getLabels().stream().anyMatch(existing -> existing.getId().equals(labelId));
        if (!alreadyAttached) {
            card.getLabels().add(label);
            card.setUpdatedAt(LocalDateTime.now());
            cardRepository.save(card);
        }
        return CardDetailResponse.from(card);
    }

    @Transactional
    public CardDetailResponse detachLabel(Integer cardId, Integer labelId) {
        Card card =
                cardRepository
                        .findByIdWithLabels(cardId)
                        .orElseThrow(() -> new ResourceNotFoundException("Card", cardId));
        if (!labelRepository.existsById(labelId)) {
            throw new ResourceNotFoundException("Label", labelId);
        }

        boolean removed = card.getLabels().removeIf(existing -> existing.getId().equals(labelId));
        if (removed) {
            card.setUpdatedAt(LocalDateTime.now());
            cardRepository.save(card);
        }
        return CardDetailResponse.from(card);
    }
}
