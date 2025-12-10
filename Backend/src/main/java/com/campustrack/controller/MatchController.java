package com.campustrack.controller;

import com.campustrack.dto.MatchRequest;
import com.campustrack.model.User;
import com.campustrack.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// Manages the matching process between lost and found items
@RestController
@RequestMapping("/api")
public class MatchController {
    
    @Autowired
    private MatchService matchService;
    
    @PostMapping("/match")
    public ResponseEntity<?> matchItems(@RequestBody MatchRequest request, 
                                       Authentication authentication) {
        try {
            Object principal = authentication.getPrincipal();
            String role = (principal instanceof User) ? ((User) principal).getRole() : "admin";
            
            if (!"admin".equals(role)) {
                return ResponseEntity.status(403)
                        .body(Map.of("message", "Access denied. Admins only."));
            }
            
            if (request.getLostItemId() == null || request.getFoundItemId() == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "lostItemId and foundItemId are required"));
            }
            
            var match = matchService.matchItems(request);
            return ResponseEntity.ok(Map.of("message", "Items matched & user notified", "match", match));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to match items", "error", e.getMessage()));
        }
    }
    
    @PostMapping("/match/{matchId}/claim")
    public ResponseEntity<?> claimMatch(@PathVariable String matchId, 
                                       Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            var match = matchService.claimMatch(matchId, user.getEmail());
            return ResponseEntity.ok(Map.of("message", "Item successfully claimed", "match", match));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to claim item", "error", e.getMessage()));
        }
    }
    
    @PostMapping("/match/{matchId}/reject")
    public ResponseEntity<?> rejectMatch(@PathVariable String matchId, 
                                        Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            var match = matchService.rejectMatch(matchId, user.getEmail());
            return ResponseEntity.ok(Map.of("message", "Match rejected successfully", "match", match));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to reject match", "error", e.getMessage()));
        }
    }
}
