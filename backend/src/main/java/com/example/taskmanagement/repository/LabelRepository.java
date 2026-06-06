package com.example.taskmanagement.repository;

import com.example.taskmanagement.entity.Label;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LabelRepository extends JpaRepository<Label, Integer> {
}
