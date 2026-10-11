package com.example.taskmanagement.repository;

import com.example.taskmanagement.entity.Card;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CardRepository extends JpaRepository<Card, Integer> {

    List<Card> findByBoardListIdOrderByPositionAsc(Integer listId);

    Optional<Card> findFirstByBoardListIdOrderByPositionDesc(Integer listId);

    @Query(
            "SELECT DISTINCT c FROM Card c LEFT JOIN FETCH c.labels WHERE c.boardList.id = :listId"
                    + " ORDER BY c.position ASC")
    List<Card> findByBoardListIdWithLabels(@Param("listId") Integer listId);

    @Query("SELECT c FROM Card c LEFT JOIN FETCH c.labels WHERE c.id = :id")
    Optional<Card> findByIdWithLabels(@Param("id") Integer id);
}
