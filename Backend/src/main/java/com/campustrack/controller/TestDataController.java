package com.campustrack.controller;

import com.campustrack.model.User;
import com.campustrack.repository.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// Test endpoint to create test data
@RestController
@RequestMapping("/api/test")
public class TestDataController {
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/create-test-user")
    public ResponseEntity<?> createTestUser() {
        try {
            // Create a test student user
            User testUser = new User();
            testUser.setRole("student");
            testUser.setFullName("Test Student");
            testUser.setEmail("test@student.com");
            testUser.setContactNumber("1234567890");
            testUser.setEnrollmentNumber("TEST123");
            testUser.setSemester(5);
            testUser.setYear(3);
            testUser.setDepartment("Computer Science");
            testUser.setPassword(BCrypt.hashpw("password123", BCrypt.gensalt()));
            
            User saved = userRepository.save(testUser);
            
            return ResponseEntity.ok(Map.of(
                "message", "Test user created successfully!",
                "user", Map.of(
                    "id", saved.getId(),
                    "email", saved.getEmail(),
                    "fullName", saved.getFullName(),
                    "role", saved.getRole()
                )
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "error", e.getMessage(),
                "type", e.getClass().getName(),
                "cause", e.getCause() != null ? e.getCause().getMessage() : "No cause"
            ));
        }
    }
    
    @GetMapping("/users/count")
    public ResponseEntity<?> countUsers() {
        try {
            long count = userRepository.count();
            return ResponseEntity.ok(Map.of(
                "totalUsers", count,
                "message", "Total users in database"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", e.getMessage()
            ));
        }
    }
}
