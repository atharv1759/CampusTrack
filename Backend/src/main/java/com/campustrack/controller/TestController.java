package com.campustrack.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

// Test endpoint to check MongoDB connection
@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @Autowired
    private MongoTemplate mongoTemplate;
    
    @GetMapping("/db")
    public ResponseEntity<?> testDatabase() {
        try {
            // Try to get database stats
            String dbName = mongoTemplate.getDb().getName();
            return ResponseEntity.ok(Map.of(
                "status", "connected",
                "database", dbName,
                "message", "MongoDB connection successful!"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "status", "error",
                "message", e.getMessage()
            ));
        }
    }
}
