package com.campustrack.controller;

import com.campustrack.model.User;
import com.campustrack.repository.UserRepository;
import com.campustrack.repository.LostItemRepository;
import com.campustrack.repository.FoundItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private LostItemRepository lostItemRepository;
    
    @Autowired
    private FoundItemRepository foundItemRepository;
    
    // Get complete list of students with their reported items
    // Get complete list of students with their reported items
    @GetMapping("/students-details")
    public ResponseEntity<?> getAllStudentsWithItems(Authentication authentication) {
        try {
            // Check if user is admin before allowing access
            Object principal = authentication.getPrincipal();
            String role = (principal instanceof User) ? ((User) principal).getRole() : "admin";
            
            if (!"admin".equals(role)) {
                return ResponseEntity.status(403)
                        .body(Map.of("message", "Access denied. Admins only."));
            }
            
            List<User> students = userRepository.findAll().stream()
                    .filter(u -> "student".equals(u.getRole()))
                    .toList();
            
            List<Map<String, Object>> result = new ArrayList<>();
            for (User student : students) {
                Map<String, Object> studentData = new HashMap<>();
                studentData.put("id", student.getId());
                studentData.put("role", student.getRole());
                studentData.put("fullName", student.getFullName());
                studentData.put("email", student.getEmail());
                studentData.put("contactNumber", student.getContactNumber());
                studentData.put("enrollmentNumber", student.getEnrollmentNumber());
                studentData.put("semester", student.getSemester());
                studentData.put("year", student.getYear());
                studentData.put("department", student.getDepartment());
                studentData.put("createdAt", student.getCreatedAt());
                studentData.put("updatedAt", student.getUpdatedAt());
                
                var lostItems = lostItemRepository.findByUserEmailOrderByCreatedAtDesc(student.getEmail());
                var foundItems = foundItemRepository.findByUserEmailOrderByCreatedAtDesc(student.getEmail());
                
                studentData.put("lostItems", lostItems);
                studentData.put("foundItems", foundItems);
                
                result.add(studentData);
            }
            
            return ResponseEntity.ok(Map.of("students", result));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to fetch students and their items", 
                                "error", e.getMessage()));
        }
    }
    
    @GetMapping("/staff-details")
    public ResponseEntity<?> getAllStaffWithItems(Authentication authentication) {
        try {
            Object principal = authentication.getPrincipal();
            String role = (principal instanceof User) ? ((User) principal).getRole() : "admin";
            
            if (!"admin".equals(role)) {
                return ResponseEntity.status(403)
                        .body(Map.of("message", "Access denied. Admins only."));
            }
            
            List<User> staff = userRepository.findAll().stream()
                    .filter(u -> "staff".equals(u.getRole()))
                    .toList();
            
            List<Map<String, Object>> result = new ArrayList<>();
            for (User member : staff) {
                Map<String, Object> staffData = new HashMap<>();
                staffData.put("id", member.getId());
                staffData.put("role", member.getRole());
                staffData.put("fullName", member.getFullName());
                staffData.put("email", member.getEmail());
                staffData.put("contactNumber", member.getContactNumber());
                staffData.put("staffId", member.getStaffId());
                staffData.put("department", member.getDepartment());
                staffData.put("createdAt", member.getCreatedAt());
                staffData.put("updatedAt", member.getUpdatedAt());
                
                var lostItems = lostItemRepository.findByUserEmailOrderByCreatedAtDesc(member.getEmail());
                var foundItems = foundItemRepository.findByUserEmailOrderByCreatedAtDesc(member.getEmail());
                
                staffData.put("lostItems", lostItems);
                staffData.put("foundItems", foundItems);
                
                result.add(staffData);
            }
            
            return ResponseEntity.ok(Map.of("staff", result));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to fetch staff and their items", 
                                "error", e.getMessage()));
        }
    }
}
