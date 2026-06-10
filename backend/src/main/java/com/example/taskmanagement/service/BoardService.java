package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.response.BoardDetailResponse;
import com.example.taskmanagement.dto.response.BoardListResponse;
import com.example.taskmanagement.dto.response.BoardSummaryResponse;
import com.example.taskmanagement.entity.Board;
import com.example.taskmanagement.exception.ResourceNotFoundException;
import com.example.taskmanagement.repository.BoardListRepository;
import com.example.taskmanagement.repository.BoardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BoardService {

    private final BoardRepository boardRepository;
    private final BoardListRepository boardListRepository;

    public BoardService(BoardRepository boardRepository,
                        BoardListRepository boardListRepository) {
        this.boardRepository = boardRepository;
        this.boardListRepository = boardListRepository;
    }

    @Transactional(readOnly = true)
    public List<BoardSummaryResponse> getAllBoards() {
        return boardRepository.findAll().stream()
            .map(BoardSummaryResponse::from)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BoardDetailResponse getBoardById(Integer id) {
        Board board = boardRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Board", id));
        board.getLists().size();
        return BoardDetailResponse.from(board);
    }

    @Transactional(readOnly = true)
    public List<BoardListResponse> getListsByBoardId(Integer boardId) {
        if (!boardRepository.existsById(boardId)) {
            throw new ResourceNotFoundException("Board", boardId);
        }
        return boardListRepository.findByBoardIdOrderByPositionAsc(boardId).stream()
            .map(BoardListResponse::from)
            .collect(Collectors.toList());
    }
}
