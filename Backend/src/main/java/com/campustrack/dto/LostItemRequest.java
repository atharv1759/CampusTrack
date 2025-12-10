package com.campustrack.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class LostItemRequest {
    private String itemName;
    private String itemDescription;
    private LocalDate dateLost;
    private String timeRange;
    private String location;
    private String itemCategory;
    private String identificationMark;
}
