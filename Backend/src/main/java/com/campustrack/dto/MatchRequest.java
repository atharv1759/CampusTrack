package com.campustrack.dto;

import lombok.Data;

@Data
public class MatchRequest {
    private String lostItemId;
    private String foundItemId;
}
