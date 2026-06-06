package com.example.taskmanagement.dto.response;

import com.example.taskmanagement.entity.Label;

public class LabelResponse {
    private final Integer id;
    private final String name;
    private final String color;

    public static LabelResponse from(Label label) {
        return new LabelResponse(label.getId(), label.getName(), label.getColor());
    }

    private LabelResponse(Integer id, String name, String color) {
        this.id = id;
        this.name = name;
        this.color = color;
    }

    public Integer getId()  { return id; }
    public String getName() { return name; }
    public String getColor(){ return color; }
}
