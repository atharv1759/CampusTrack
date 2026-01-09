package com.campustrack.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

// Stores matches between lost and found items
@Data
@Document(collection = "matches")
public class Match {
    
    @Id
    private String id;
    
    private String lostItemId;
    private String foundItemId;
    private String status = "pending"; // Can be: pending, claimed, or rejected
    private Integer confidenceScore; // Match confidence percentage (0-100)
    private String handoverStatus = "pending"; // pending, submitted_by_finder, received_by_owner
    
    @CreatedDate
    private Instant createdAt;
}
