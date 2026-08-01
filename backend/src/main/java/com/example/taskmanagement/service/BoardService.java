package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.request.BoardCreateRequest;
import com.example.taskmanagement.dto.request.BoardUpdateRequest;
import com.example.taskmanagement.dto.response.BoardDetailResponse;
import com.example.taskmanagement.dto.response.BoardListResponse;
import com.example.taskmanagement.dto.response.BoardSummaryResponse;
import com.example.taskmanagement.entity.Board;
import com.example.taskmanagement.exception.ResourceNotFoundException;
import com.example.taskmanagement.repository.BoardListRepository;
import com.example.taskmanagement.repository.BoardRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BoardService {

    private final BoardRepository boardRepository;
    private final BoardListRepository boardListRepository;

    public BoardService(BoardRepository boardRepository, BoardListRepository boardListRepository) {
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
        Board board =
                boardRepository
                        .findById(id)
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

    @Transactional
    public BoardSummaryResponse createBoard(BoardCreateRequest request) {
        LocalDateTime now = LocalDateTime.now();
        Board board = new Board();
        board.setName(request.getName());
        board.setCreatedAt(now);
        board.setUpdatedAt(now);
        Board saved = boardRepository.save(board);

        String[] defaultListNames = {"To Do", "進行中", "完了"};
        for (int i = 0; i < defaultListNames.length; i++) {
            com.example.taskmanagement.entity.BoardList list =
                    new com.example.taskmanagement.entity.BoardList();
            list.setBoard(saved);
            list.setName(defaultListNames[i]);
            list.setPosition(i);
            list.setCreatedAt(now);
            list.setUpdatedAt(now);
            boardListRepository.save(list);
        }

        return BoardSummaryResponse.from(saved);
    }

    @Transactional
    public BoardSummaryResponse updateBoard(Integer id, BoardUpdateRequest request) {
        Board board =
                boardRepository
                        .findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Board", id));
        board.setName(request.getName());
        board.setUpdatedAt(LocalDateTime.now());
        Board saved = boardRepository.save(board);
        return BoardSummaryResponse.from(saved);
    }

    @Transactional
    public void deleteBoard(Integer id) {
        if (!boardRepository.existsById(id)) {
            throw new ResourceNotFoundException("Board", id);
        }
        boardRepository.deleteById(id);
    }
}
