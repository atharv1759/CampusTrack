package com.campustrack.controller;

import com.campustrack.dto.FoundItemRequest;
import com.campustrack.model.User;
import com.campustrack.service.FoundItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

// Handles all found item submissions with image uploads
@RestController
@RequestMapping("/api/found-items")
public class FoundItemController {
    
    @Autowired
    private FoundItemService foundItemService;
    
    @PostMapping
    public ResponseEntity<?> reportFoundItem(@RequestParam("itemName") String itemName,
                                            @RequestParam("itemDescription") String itemDescription,
                                            @RequestParam("placeFound") String placeFound,
                                            @RequestParam("timeFound") String timeFound,
                                            @RequestParam("dateFound") String dateFound,
                                            @RequestParam("category") String category,
                                            @RequestParam("image") MultipartFile imageFile,
                                            Authentication authentication) {
        try {
            if (imageFile == null || imageFile.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Image is mandatory"));
            }
            
            FoundItemRequest request = new FoundItemRequest();
            request.setItemName(itemName);
            request.setItemDescription(itemDescription);
            request.setPlaceFound(placeFound);
            request.setTimeFound(timeFound);
            request.setDateFound(java.time.LocalDate.parse(dateFound));
            request.setCategory(category);
            
            User user = (User) authentication.getPrincipal();
            var foundItem = foundItemService.reportFoundItem(request, imageFile, user);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Found item reported successfully", "foundItem", foundItem));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to report found item", "error", e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getFoundItems() {
        try {
            var items = foundItemService.getFoundItems();
            return ResponseEntity.ok(Map.of("items", items));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch found items", "error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFoundItem(@PathVariable String id, 
                                            Authentication authentication) {
        try {
            Object principal = authentication.getPrincipal();
            String role = (principal instanceof User) ? ((User) principal).getRole() : "admin";
            
            if (!"admin".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Access denied. Admins only."));
            }
            
            foundItemService.deleteFoundItem(id);
            return ResponseEntity.ok(Map.of("message", "Found item deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to delete found item", "error", e.getMessage()));
        }
    }
}
