package com.campustrack.controller;

import com.campustrack.model.User;
import com.campustrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserRepository userRepository;
    
    // Get total count of all users - admin only
    @GetMapping("/total")
    public ResponseEntity<?> getTotalUsers(Authentication authentication) {
        try {
            Object principal = authentication.getPrincipal();
            String role = (principal instanceof User) ? ((User) principal).getRole() : "admin";
            
            if (!"admin".equals(role)) {
                return ResponseEntity.status(403)
                        .body(Map.of("message", "Access denied"));
            }
            
            long totalUsers = userRepository.count();
            return ResponseEntity.ok(Map.of("totalUsers", totalUsers));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to fetch total users", "error", e.getMessage()));
        }
    }
    
    // Get user statistics - admin only
    @GetMapping("/stats")
    public ResponseEntity<?> getUserStats(Authentication authentication) {
        try {
            Object principal = authentication.getPrincipal();
            String role = (principal instanceof User) ? ((User) principal).getRole() : "admin";
            
            if (!"admin".equals(role)) {
                return ResponseEntity.status(403)
                        .body(Map.of("message", "Access denied"));
            }
            
            long students = userRepository.countByRole("student");
            long staff = userRepository.countByRole("staff");
            return ResponseEntity.ok(Map.of("totalStudents", students, "totalStaff", staff));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to fetch user stats", "error", e.getMessage()));
        }
    }
}
