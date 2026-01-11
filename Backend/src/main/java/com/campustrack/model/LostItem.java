package com.campustrack.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;

// Model class for items that users have lost
@Data
@Document(collection = "lostitems")
public class LostItem {
    
    @Id
    private String id;
    
    private String itemName;
    private String itemDescription;
    private LocalDate dateLost;
    private String timeRange;
    private String location;
    private String userName;
    private String userEmail;
    private String itemCategory;
    private String identificationMark;
    private String itemImage;  // URL of uploaded image from Cloudinary
    private String status = "pending"; // pending or claimed
    
    @CreatedDate
    private Instant createdAt;
    
    @LastModifiedDate
    private Instant updatedAt;
}
