package com.example.taskmanagement.repository;

import com.example.taskmanagement.entity.BoardList;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BoardListRepository extends JpaRepository<BoardList, Integer> {

    List<BoardList> findByBoardIdOrderByPositionAsc(Integer boardId);
}
