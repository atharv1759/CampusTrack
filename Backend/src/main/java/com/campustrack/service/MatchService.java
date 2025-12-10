package com.campustrack.service;

import com.campustrack.dto.MatchRequest;
import com.campustrack.model.*;
import com.campustrack.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

// Service for handling matches between lost and found items
@Service
public class MatchService {
    
    @Autowired
    private MatchRepository matchRepository;
    
    @Autowired
    private LostItemRepository lostItemRepository;
    
    @Autowired
    private FoundItemRepository foundItemRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    // Create new match between lost and found item
    public Match matchItems(MatchRequest request) {
        LostItem lostItem = lostItemRepository.findById(request.getLostItemId())
                .orElseThrow(() -> new RuntimeException("Lost item not found"));
        FoundItem foundItem = foundItemRepository.findById(request.getFoundItemId())
                .orElseThrow(() -> new RuntimeException("Found item not found"));
        
        Match match = new Match();
        match.setLostItemId(request.getLostItemId());
        match.setFoundItemId(request.getFoundItemId());
        match.setStatus("pending");
        
        Match savedMatch = matchRepository.save(match);
        
        // Send notification
        Notification notification = new Notification();
        notification.setUserEmail(lostItem.getUserEmail());
        notification.setTitle("A found item may match your lost item");
        notification.setMessage("Admin has matched a found item with your lost item \"" + lostItem.getItemName() + "\".");
        Map<String, Object> data = new HashMap<>();
        data.put("lostItemId", request.getLostItemId());
        data.put("foundItemId", request.getFoundItemId());
        data.put("matchId", savedMatch.getId());
        notification.setData(data);
        notificationRepository.save(notification);
        
        return savedMatch;
    }
    
    public Match claimMatch(String matchId, String userEmail) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
        
        LostItem lostItem = lostItemRepository.findById(match.getLostItemId())
                .orElseThrow(() -> new RuntimeException("Lost item not found"));
        
        if (!lostItem.getUserEmail().equals(userEmail)) {
            throw new RuntimeException("You cannot claim this item");
        }
        
        if ("claimed".equals(match.getStatus())) {
            throw new RuntimeException("This match has already been claimed");
        }
        
        if ("rejected".equals(match.getStatus())) {
            throw new RuntimeException("This match was already rejected. No actions allowed.");
        }
        
        match.setStatus("claimed");
        Match savedMatch = matchRepository.save(match);
        
        // Notify admin
        Notification notification = new Notification();
        notification.setUserEmail("admin");
        notification.setTitle("Item Claimed");
        notification.setMessage("User " + userEmail + " has claimed their matched item.");
        Map<String, Object> data = new HashMap<>();
        data.put("matchId", matchId);
        data.put("lostItemId", match.getLostItemId());
        data.put("foundItemId", match.getFoundItemId());
        notification.setData(data);
        notificationRepository.save(notification);
        
        return savedMatch;
    }
    
    public Match rejectMatch(String matchId, String userEmail) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
        
        LostItem lostItem = lostItemRepository.findById(match.getLostItemId())
                .orElseThrow(() -> new RuntimeException("Lost item not found"));
        
        if (!lostItem.getUserEmail().equals(userEmail)) {
            throw new RuntimeException("You cannot reject this match");
        }
        
        if (!"pending".equals(match.getStatus())) {
            throw new RuntimeException("This match is already processed");
        }
        
        match.setStatus("rejected");
        Match savedMatch = matchRepository.save(match);
        
        // Notify admin
        Notification notification = new Notification();
        notification.setUserEmail("admin");
        notification.setTitle("Match Rejected");
        notification.setMessage("User " + userEmail + " has rejected the match.");
        Map<String, Object> data = new HashMap<>();
        data.put("matchId", matchId);
        data.put("lostItemId", match.getLostItemId());
        data.put("foundItemId", match.getFoundItemId());
        notification.setData(data);
        notificationRepository.save(notification);
        
        return savedMatch;
    }
}
