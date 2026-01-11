package com.campustrack.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;

// Model class for items that users have found and reported
@Data
@Document(collection = "founditems")
public class FoundItem {
    
    @Id
    private String id;
    
    private String itemName;
    private String itemDescription;
    private String placeFound;
    private String timeFound;
    private LocalDate dateFound;
    private String category;
    private String userName;
    private String userEmail;
    private String image;
    private String status = "pending"; // pending or claimed
    
    @CreatedDate
    private Instant createdAt;
    
    @LastModifiedDate
    private Instant updatedAt;
}
