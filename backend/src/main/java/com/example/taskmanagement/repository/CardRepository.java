package com.example.taskmanagement.repository;

import com.example.taskmanagement.entity.Card;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardRepository extends JpaRepository<Card, Integer> {

    List<Card> findByBoardListIdOrderByPositionAsc(Integer listId);

    Optional<Card> findFirstByBoardListIdOrderByPositionDesc(Integer listId);
}
