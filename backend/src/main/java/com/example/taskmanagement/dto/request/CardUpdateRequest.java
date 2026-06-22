package com.example.taskmanagement.dto.request;

import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class CardUpdateRequest {

    @Size(max = 255, message = "タイトルは255文字以内で入力してください")
    private String title;

    private String description;

    private String priority;

    private LocalDate dueDate;

    private Integer listId;

    private Integer position;

    public String getTitle()       { return title; }
    public String getDescription() { return description; }
    public String getPriority()    { return priority; }
    public LocalDate getDueDate()  { return dueDate; }
    public Integer getListId()     { return listId; }
    public Integer getPosition()   { return position; }

    public void setTitle(String title)             { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setPriority(String priority)        { this.priority = priority; }
    public void setDueDate(LocalDate dueDate)       { this.dueDate = dueDate; }
    public void setListId(Integer listId)           { this.listId = listId; }
    public void setPosition(Integer position)       { this.position = position; }
}
