package com.example.taskmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class CardCreateRequest {

    @NotBlank(message = "タイトルは必須です")
    @Size(max = 255, message = "タイトルは255文字以内で入力してください")
    private String title;

    private String description;

    private String priority;

    private LocalDate dueDate;

    public String getTitle()       { return title; }
    public String getDescription() { return description; }
    public String getPriority()    { return priority; }
    public LocalDate getDueDate()  { return dueDate; }

    public void setTitle(String title)             { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setPriority(String priority)        { this.priority = priority; }
    public void setDueDate(LocalDate dueDate)       { this.dueDate = dueDate; }
}
