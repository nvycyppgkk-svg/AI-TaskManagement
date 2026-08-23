package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.request.ListCreateRequest;
import com.example.taskmanagement.dto.request.ListUpdateRequest;
import com.example.taskmanagement.dto.response.BoardListResponse;
import com.example.taskmanagement.entity.Board;
import com.example.taskmanagement.entity.BoardList;
import com.example.taskmanagement.exception.ResourceNotFoundException;
import com.example.taskmanagement.repository.BoardListRepository;
import com.example.taskmanagement.repository.BoardRepository;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ListService {

    private final BoardRepository boardRepository;
    private final BoardListRepository boardListRepository;

    public ListService(BoardRepository boardRepository, BoardListRepository boardListRepository) {
        this.boardRepository = boardRepository;
        this.boardListRepository = boardListRepository;
    }

    @Transactional
    public BoardListResponse createList(Integer boardId, ListCreateRequest request) {
        Board board =
                boardRepository
                        .findById(boardId)
                        .orElseThrow(() -> new ResourceNotFoundException("Board", boardId));

        int nextPosition = boardListRepository.findByBoardIdOrderByPositionAsc(boardId).size();

        LocalDateTime now = LocalDateTime.now();
        BoardList list = new BoardList();
        list.setBoard(board);
        list.setName(request.getName());
        list.setPosition(nextPosition);
        list.setCreatedAt(now);
        list.setUpdatedAt(now);

        BoardList saved = boardListRepository.save(list);
        return BoardListResponse.from(saved);
    }

    @Transactional
    public BoardListResponse updateList(Integer id, ListUpdateRequest request) {
        BoardList list =
                boardListRepository
                        .findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("List", id));

        list.setName(request.getName());
        list.setUpdatedAt(LocalDateTime.now());

        BoardList saved = boardListRepository.save(list);
        return BoardListResponse.from(saved);
    }

    @Transactional
    public void deleteList(Integer id) {
        if (!boardListRepository.existsById(id)) {
            throw new ResourceNotFoundException("List", id);
        }
        boardListRepository.deleteById(id);
    }
}
