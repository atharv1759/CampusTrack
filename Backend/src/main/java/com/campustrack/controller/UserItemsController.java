package com.campustrack.controller;

import com.campustrack.model.User;
import com.campustrack.model.LostItem;
import com.campustrack.model.FoundItem;
import com.campustrack.model.Match;
import com.campustrack.service.LostItemService;
import com.campustrack.service.FoundItemService;
import com.campustrack.repository.MatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/items")
public class UserItemsController {
    
    @Autowired
    private LostItemService lostItemService;
    
    @Autowired
    private FoundItemService foundItemService;
    
    @Autowired
    private MatchRepository matchRepository;
    
    // Fetch all lost items reported by current user
    @GetMapping("/my-lost-items")
    public ResponseEntity<?> getMyLostItems(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            List<LostItem> items = lostItemService.getMyLostItems(user.getEmail());
            
            // Add handover status to each item
            List<Map<String, Object>> itemsWithStatus = items.stream().map(item -> {
                Map<String, Object> itemData = new HashMap<>();
                itemData.put("_id", item.getId());
                itemData.put("itemName", item.getItemName());
                itemData.put("itemCategory", item.getItemCategory());
                itemData.put("itemDescription", item.getItemDescription());
                itemData.put("dateLost", item.getDateLost());
                itemData.put("timeRange", item.getTimeRange());
                itemData.put("location", item.getLocation());
                itemData.put("identificationMark", item.getIdentificationMark());
                itemData.put("userEmail", item.getUserEmail());
                itemData.put("userName", item.getUserName());
                itemData.put("createdAt", item.getCreatedAt());
                
                // Check if there's a match with handover status
                List<Match> matches = matchRepository.findByLostItemIdOrderByCreatedAtDesc(item.getId());
                String status = "pending";
                
                for (Match match : matches) {
                    if ("received_by_owner".equals(match.getHandoverStatus())) {
                        status = "received";
                        break;
                    }
                }
                
                itemData.put("status", status);
                return itemData;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(Map.of("items", itemsWithStatus));
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
            List<FoundItem> items = foundItemService.getMyFoundItems(user.getEmail());
            
            // Add handover status to each item
            List<Map<String, Object>> itemsWithStatus = items.stream().map(item -> {
                Map<String, Object> itemData = new HashMap<>();
                itemData.put("_id", item.getId());
                itemData.put("itemName", item.getItemName());
                itemData.put("category", item.getCategory());
                itemData.put("itemDescription", item.getItemDescription());
                itemData.put("dateFound", item.getDateFound());
                itemData.put("timeFound", item.getTimeFound());
                itemData.put("placeFound", item.getPlaceFound());
                itemData.put("image", item.getImage());
                itemData.put("userEmail", item.getUserEmail());
                itemData.put("userName", item.getUserName());
                itemData.put("createdAt", item.getCreatedAt());
                
                // Check if there's a match with handover status
                List<Match> matches = matchRepository.findByFoundItemIdOrderByCreatedAtDesc(item.getId());
                String status = "pending";
                
                for (Match match : matches) {
                    if ("received_by_owner".equals(match.getHandoverStatus())) {
                        status = "submitted";
                        break;
                    }
                }
                
                itemData.put("status", status);
                return itemData;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(Map.of("items", itemsWithStatus));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to fetch found items", "error", e.getMessage()));
        }
    }
}
