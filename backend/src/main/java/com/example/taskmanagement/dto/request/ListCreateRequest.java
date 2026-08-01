package com.example.taskmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ListCreateRequest {

    @NotBlank(message = "リスト名は必須です")
    @Size(max = 255, message = "リスト名は255文字以内で入力してください")
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
