package com.campustrack.controller;

import com.campustrack.model.User;
import com.campustrack.service.LostItemService;
import com.campustrack.service.FoundItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/items")
public class UserItemsController {
    
    @Autowired
    private LostItemService lostItemService;
    
    @Autowired
    private FoundItemService foundItemService;
    
    // Fetch all lost items reported by current user
    @GetMapping("/my-lost-items")
    public ResponseEntity<?> getMyLostItems(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            var items = lostItemService.getMyLostItems(user.getEmail());
            return ResponseEntity.ok(Map.of("items", items));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to fetch lost items", "error", e.getMessage()));
        }
    }
    
    // Fetch all found items submitted by current user
    @GetMapping("/my-found-items")
    public ResponseEntity<?> getMyFoundItems(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            var items = foundItemService.getMyFoundItems(user.getEmail());
            return ResponseEntity.ok(Map.of("items", items));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to fetch found items", "error", e.getMessage()));
        }
    }
}
