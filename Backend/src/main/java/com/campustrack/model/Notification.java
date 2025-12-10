package com.campustrack.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.Map;

// Model for storing user notifications about matches
@Data
@Document(collection = "notifications")
public class Notification {
    
    @Id
    private String id;
    
    private String userEmail;
    private String title;
    private String message;
    private Map<String, Object> data;
    private Boolean isRead = false;
    
    @CreatedDate
    private Instant createdAt;
}
