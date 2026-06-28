package com.example.taskmanagement.repository;

import com.example.taskmanagement.entity.BoardList;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardListRepository extends JpaRepository<BoardList, Integer> {

    List<BoardList> findByBoardIdOrderByPositionAsc(Integer boardId);
}
