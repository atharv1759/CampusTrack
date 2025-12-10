package com.campustrack.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "users")
public class User {
    
    @Id
    private String id;
    
    // Role determines access level and required fields
    private String role; // student, staff, admin
    
    // Common fields
    private String fullName;
    
    @Indexed(unique = true, sparse = true)
    private String email;
    
    private String contactNumber;
    
    // Student-only
    @Indexed(unique = true, sparse = true)
    private String enrollmentNumber;
    
    private Integer semester;
    private Integer year;
    
    // Staff-only
    @Indexed(unique = true, sparse = true)
    private String staffId;
    
    private String department;
    
    private String password;
    
    private String resetPasswordToken;
    private Instant resetPasswordExpires;
    
    @CreatedDate
    private Instant createdAt;
    
    @LastModifiedDate
    private Instant updatedAt;
}
