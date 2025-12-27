package com.campustrack.controller;

import com.campustrack.dto.LostItemRequest;
import com.campustrack.model.User;
import com.campustrack.service.LostItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

// Controller for managing lost item reports with image uploads
@RestController
@RequestMapping("/api/lost-items")
public class LostItemController {
    
    @Autowired
    private LostItemService lostItemService;
    
    @PostMapping
    public ResponseEntity<?> reportLostItem(@RequestParam("itemName") String itemName,
                                           @RequestParam("itemDescription") String itemDescription,
                                           @RequestParam("dateLost") String dateLost,
                                           @RequestParam("timeRange") String timeRange,
                                           @RequestParam("location") String location,
                                           @RequestParam("itemCategory") String itemCategory,
                                           @RequestParam(value = "identificationMark", required = false) String identificationMark,
                                           @RequestParam(value = "image", required = false) MultipartFile imageFile,
                                           Authentication authentication) {
        try {
            if (itemName == null || itemDescription == null || 
                dateLost == null || timeRange == null || 
                location == null || itemCategory == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Please fill all required fields"));
            }
            
            LostItemRequest request = new LostItemRequest();
            request.setItemName(itemName);
            request.setItemDescription(itemDescription);
            request.setDateLost(java.time.LocalDate.parse(dateLost));
            request.setTimeRange(timeRange);
            request.setLocation(location);
            request.setItemCategory(itemCategory);
            request.setIdentificationMark(identificationMark);
            
            User user = (User) authentication.getPrincipal();
            var lostItem = lostItemService.reportLostItem(request, imageFile, user);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Lost item reported successfully", "lostItem", lostItem));
        } catch (Exception e) {
            e.printStackTrace(); // Print full stack trace to console
            System.err.println("ERROR in reportLostItem: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to report lost item", "error", e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getLostItems() {
        try {
            var items = lostItemService.getLostItems();
            return ResponseEntity.ok(Map.of("items", items));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch lost items", "error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLostItem(@PathVariable String id, 
                                           Authentication authentication) {
        try {
            Object principal = authentication.getPrincipal();
            String role = (principal instanceof User) ? ((User) principal).getRole() : "admin";
            
            if (!"admin".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Access denied. Admins only."));
            }
            
            lostItemService.deleteLostItem(id);
            return ResponseEntity.ok(Map.of("message", "Lost item deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to delete lost item", "error", e.getMessage()));
        }
    }
}
