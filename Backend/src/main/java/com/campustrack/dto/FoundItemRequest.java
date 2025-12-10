package com.campustrack.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class FoundItemRequest {
    private String itemName;
    private String itemDescription;
    private String placeFound;
    private String timeFound;
    private LocalDate dateFound;
    private String category;
}
