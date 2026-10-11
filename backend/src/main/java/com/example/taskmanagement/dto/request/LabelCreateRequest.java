package com.example.taskmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class LabelCreateRequest {

    @NotBlank(message = "ラベル名は必須です")
    @Size(max = 255, message = "ラベル名は255文字以内で入力してください")
    private String name;

    @NotBlank(message = "色は必須です")
    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "色は#RRGGBB形式で指定してください")
    private String color;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
