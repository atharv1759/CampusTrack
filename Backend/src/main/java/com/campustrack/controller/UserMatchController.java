package com.campustrack.controller;

import com.campustrack.model.*;
import com.campustrack.repository.*;
import com.campustrack.service.MatchService;
import com.campustrack.service.AutoMatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

// API for users to view their matches
@RestController
@RequestMapping("/api/user/matches")
public class UserMatchController {
    
    @Autowired
    private MatchRepository matchRepository;
    
    @Autowired
    private LostItemRepository lostItemRepository;
    
    @Autowired
    private FoundItemRepository foundItemRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private MatchService matchService;
    
    @Autowired
    private AutoMatchService autoMatchService;
    
    // Get all matches for current user
    @GetMapping
    public ResponseEntity<?> getMyMatches(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            String userEmail = user.getEmail();
            
            // Find all lost items by user
            List<LostItem> myLostItems = lostItemRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);
            List<FoundItem> myFoundItems = foundItemRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);
            
            List<Map<String, Object>> allMatches = new ArrayList<>();
            
            // Get matches for each lost item
            for (LostItem lostItem : myLostItems) {
                List<Match> matches = matchRepository.findByLostItemIdOrderByCreatedAtDesc(lostItem.getId());
                for (Match match : matches) {
                    Optional<FoundItem> foundItem = foundItemRepository.findById(match.getFoundItemId());
                    if (foundItem.isPresent()) {
                        Map<String, Object> matchData = new HashMap<>();
                        matchData.put("matchId", match.getId());
                        matchData.put("type", "lost"); // User lost the item
                        matchData.put("myItem", lostItem);
                        matchData.put("matchedItem", foundItem.get());
                        matchData.put("confidence", match.getConfidenceScore());
                        matchData.put("status", match.getStatus());
                        matchData.put("handoverStatus", match.getHandoverStatus());
                        matchData.put("createdAt", match.getCreatedAt());
                        allMatches.add(matchData);
                    }
                }
            }
            
            // Get matches for each found item
            for (FoundItem foundItem : myFoundItems) {
                List<Match> matches = matchRepository.findByFoundItemIdOrderByCreatedAtDesc(foundItem.getId());
                for (Match match : matches) {
                    Optional<LostItem> lostItem = lostItemRepository.findById(match.getLostItemId());
                    if (lostItem.isPresent()) {
                        Map<String, Object> matchData = new HashMap<>();
                        matchData.put("matchId", match.getId());
                        matchData.put("type", "found"); // User found the item
                        matchData.put("myItem", foundItem);
                        matchData.put("matchedItem", lostItem.get());
                        matchData.put("confidence", match.getConfidenceScore());
                        matchData.put("status", match.getStatus());
                        matchData.put("handoverStatus", match.getHandoverStatus());
                        matchData.put("createdAt", match.getCreatedAt());
                        allMatches.add(matchData);
                    }
                }
            }
            
            // Sort by creation date (newest first)
            allMatches.sort((a, b) -> {
                java.time.Instant timeA = (java.time.Instant) a.get("createdAt");
                java.time.Instant timeB = (java.time.Instant) b.get("createdAt");
                return timeB.compareTo(timeA);
            });
            
            return ResponseEntity.ok(Map.of(
                "message", "Matches retrieved successfully",
                "matches", allMatches,
                "totalMatches", allMatches.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to fetch matches", "error", e.getMessage()));
        }
    }
    
    // Confirm match (user says "yes, this is my item")
    @PostMapping("/{matchId}/confirm")
    public ResponseEntity<?> confirmMatch(@PathVariable String matchId, 
                                         Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            matchService.claimMatch(matchId, user.getEmail());
            return ResponseEntity.ok(Map.of("message", "Match confirmed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to confirm match", "error", e.getMessage()));
        }
    }
    
    // Reject match (user says "no, this is not my item")
    @PostMapping("/{matchId}/reject")
    public ResponseEntity<?> rejectMatch(@PathVariable String matchId, 
                                        Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            matchService.rejectMatch(matchId, user.getEmail());
            return ResponseEntity.ok(Map.of("message", "Match rejected successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to reject match", "error", e.getMessage()));
        }
    }
    
    // Manual trigger for AI matching (if auto-match failed)
    @PostMapping("/find-matches")
    public ResponseEntity<?> findMatches(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            String userEmail = user.getEmail();
            
            int matchesFound = 0;
            
            // Find all lost items by user and check for matches
            List<LostItem> myLostItems = lostItemRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);
            for (LostItem lostItem : myLostItems) {
                matchesFound += autoMatchService.checkMatchesForLostItem(lostItem);
            }
            
            // Find all found items by user and check for matches
            List<FoundItem> myFoundItems = foundItemRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);
            for (FoundItem foundItem : myFoundItems) {
                matchesFound += autoMatchService.checkMatchesForFoundItem(foundItem);
            }
            
            return ResponseEntity.ok(Map.of(
                "message", "AI matching completed",
                "matchesFound", matchesFound
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to find matches", "error", e.getMessage()));
        }
    }
    
    // Mark match as claimed (item returned)
    @PostMapping("/{matchId}/claimed")
    public ResponseEntity<?> markAsClaimed(@PathVariable String matchId, 
                                           Authentication authentication) {
        try {
            Optional<Match> matchOpt = matchRepository.findById(matchId);
            if (!matchOpt.isPresent()) {
                return ResponseEntity.status(404).body(Map.of("message", "Match not found"));
            }
            
            Match match = matchOpt.get();
            match.setStatus("claimed");
            matchRepository.save(match);
            
            // Update the status of both lost and found items
            Optional<LostItem> lostItemOpt = lostItemRepository.findById(match.getLostItemId());
            if (lostItemOpt.isPresent()) {
                LostItem lostItem = lostItemOpt.get();
                lostItem.setStatus("claimed");
                lostItemRepository.save(lostItem);
            }
            
            Optional<FoundItem> foundItemOpt = foundItemRepository.findById(match.getFoundItemId());
            if (foundItemOpt.isPresent()) {
                FoundItem foundItem = foundItemOpt.get();
                foundItem.setStatus("claimed");
                foundItemRepository.save(foundItem);
            }
            
            return ResponseEntity.ok(Map.of("message", "Item marked as claimed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to mark as claimed", "error", e.getMessage()));
        }
    }
    
    // Mark item as submitted by finder
    @PostMapping("/{matchId}/submit")
    public ResponseEntity<?> markAsSubmitted(@PathVariable String matchId,
                                             Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Optional<Match> matchOpt = matchRepository.findById(matchId);
            
            if (!matchOpt.isPresent()) {
                return ResponseEntity.status(404).body(Map.of("message", "Match not found"));
            }
            
            Match match = matchOpt.get();
            
            // Verify user is the finder
            Optional<FoundItem> foundItemOpt = foundItemRepository.findById(match.getFoundItemId());
            if (!foundItemOpt.isPresent() || !foundItemOpt.get().getUserEmail().equals(user.getEmail())) {
                return ResponseEntity.status(403).body(Map.of("message", "Unauthorized"));
            }
            
            match.setHandoverStatus("submitted_by_finder");
            matchRepository.save(match);
            
            return ResponseEntity.ok(Map.of("message", "Item marked as submitted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to mark as submitted", "error", e.getMessage()));
        }
    }
    
    // Mark item as received by owner
    @PostMapping("/{matchId}/receive")
    public ResponseEntity<?> markAsReceived(@PathVariable String matchId,
                                            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Optional<Match> matchOpt = matchRepository.findById(matchId);
            
            if (!matchOpt.isPresent()) {
                return ResponseEntity.status(404).body(Map.of("message", "Match not found"));
            }
            
            Match match = matchOpt.get();
            
            // Verify user is the owner (lost item)
            Optional<LostItem> lostItemOpt = lostItemRepository.findById(match.getLostItemId());
            if (!lostItemOpt.isPresent() || !lostItemOpt.get().getUserEmail().equals(user.getEmail())) {
                return ResponseEntity.status(403).body(Map.of("message", "Unauthorized"));
            }
            
            LostItem lostItem = lostItemOpt.get();
            
            // Get found item details
            Optional<FoundItem> foundItemOpt = foundItemRepository.findById(match.getFoundItemId());
            if (!foundItemOpt.isPresent()) {
                return ResponseEntity.status(404).body(Map.of("message", "Found item not found"));
            }
            
            FoundItem foundItem = foundItemOpt.get();
            
            // Get finder user details
            Optional<User> finderOpt = userRepository.findByEmail(foundItem.getUserEmail());
            
            match.setHandoverStatus("received_by_owner");
            match.setStatus("completed"); // Mark match as completed
            matchRepository.save(match);
            
            // Send congratulatory emails to both users
            sendHandoverCompletionEmails(lostItem, foundItem, finderOpt.orElse(null), user, match);
            
            return ResponseEntity.ok(Map.of("message", "Item marked as received successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to mark as received", "error", e.getMessage()));
        }
    }
    
    // Send congratulatory emails after successful handover
    private void sendHandoverCompletionEmails(LostItem lostItem, FoundItem foundItem, User finder, User owner, Match match) {
        try {
            // Email to the FINDER (who submitted the item)
            if (finder != null) {
                String finderSubject = "🎉 Item Successfully Returned - Thank You!";
                String finderBody = String.format("""
                    Hi %s,
                    
                    Congratulations! The owner has confirmed receiving the item you submitted. Thank you for your honesty and effort in returning the lost item!
                    
                    📦 Item Handover Details:
                    
                    Found Item: %s
                    Description: %s
                    Found At: %s
                    Found On: %s
                    
                    Returned To:
                    - Name: %s
                    - Email: %s
                    - Contact: %s
                    
                    Lost Item Details:
                    - Item: %s
                    - Description: %s
                    
                    Match Confidence: %d%%
                    
                    ✅ Status: Handover Complete - Owner Confirmed Receipt
                    
                    Thank you for being a responsible member of our campus community! Your act of kindness has helped reunite someone with their lost item.
                    
                    View Match Details: %s/user-dashboard/my-matches
                    
                    Best regards,
                    Campus Track Team
                    """,
                    finder.getFullName() != null ? finder.getFullName() : "Finder",
                    foundItem.getItemName() != null ? foundItem.getItemName() : "Item",
                    foundItem.getItemDescription() != null ? foundItem.getItemDescription() : "No description provided",
                    foundItem.getPlaceFound() != null ? foundItem.getPlaceFound() : "Not specified",
                    foundItem.getDateFound() != null ? foundItem.getDateFound().toString() : "Not specified",
                    owner.getFullName() != null ? owner.getFullName() : "Owner",
                    owner.getEmail() != null ? owner.getEmail() : "Not available",
                    owner.getContactNumber() != null ? owner.getContactNumber() : "Not available",
                    lostItem.getItemName() != null ? lostItem.getItemName() : "Item",
                    lostItem.getItemDescription() != null ? lostItem.getItemDescription() : "No description provided",
                    match.getConfidenceScore(),
                    System.getenv("FRONTEND_URL") != null ? System.getenv("FRONTEND_URL") : "http://localhost:5173"
                );
                
                autoMatchService.sendSimpleEmail(finder.getEmail(), finderSubject, finderBody);
            }
            
            // Email to the OWNER (who received the item)
            String ownerSubject = "🎉 Congratulations! You Have Received Your Item";
            String ownerBody = String.format("""
                Hi %s,
                
                Congratulations! You have successfully received your lost item. We're happy to help you reunite with your belongings!
                
                📦 Item Received:
                
                Your Lost Item: %s
                Description: %s
                Lost At: %s
                Lost On: %s
                
                Received From:
                - Finder: %s
                - Contact: %s
                
                Found Item Details:
                - Item: %s
                - Description: %s
                - Found At: %s
                - Found On: %s
                
                Match Confidence: %d%%
                
                ✅ Status: Handover Complete - Item Received Successfully
                
                Thank you for using Campus Track! We're glad we could help you recover your lost item. Don't forget to thank the finder for their honesty and effort.
                
                View Match Details: %s/user-dashboard/my-matches
                
                Best regards,
                Campus Track Team
                """,
                owner.getFullName() != null ? owner.getFullName() : "User",
                lostItem.getItemName() != null ? lostItem.getItemName() : "Item",
                lostItem.getItemDescription() != null ? lostItem.getItemDescription() : "No description provided",
                lostItem.getLocation() != null ? lostItem.getLocation() : "Not specified",
                lostItem.getDateLost() != null ? lostItem.getDateLost().toString() : "Not specified",
                finder != null && finder.getFullName() != null ? finder.getFullName() : "Finder",
                finder != null && finder.getContactNumber() != null ? finder.getContactNumber() : "Not available",
                foundItem.getItemName() != null ? foundItem.getItemName() : "Item",
                foundItem.getItemDescription() != null ? foundItem.getItemDescription() : "No description provided",
                foundItem.getPlaceFound() != null ? foundItem.getPlaceFound() : "Not specified",
                foundItem.getDateFound() != null ? foundItem.getDateFound().toString() : "Not specified",
                match.getConfidenceScore(),
                System.getenv("FRONTEND_URL") != null ? System.getenv("FRONTEND_URL") : "http://localhost:5173"
            );
            
            autoMatchService.sendSimpleEmail(owner.getEmail(), ownerSubject, ownerBody);
            
        } catch (Exception e) {
            System.err.println("Failed to send handover completion emails: " + e.getMessage());
        }
    }
    
    // Send message in match conversation
    @PostMapping("/{matchId}/messages")
    public ResponseEntity<?> sendMessage(@PathVariable String matchId,
                                        @RequestBody Map<String, String> payload,
                                        Authentication authentication) {
        try {
            User sender = (User) authentication.getPrincipal();
            String messageText = payload.get("message");
            
            if (messageText == null || messageText.trim().isEmpty()) {
                return ResponseEntity.status(400).body(Map.of("message", "Message cannot be empty"));
            }
            
            // Get match to find the other user
            Optional<Match> matchOpt = matchRepository.findById(matchId);
            if (!matchOpt.isPresent()) {
                return ResponseEntity.status(404).body(Map.of("message", "Match not found"));
            }
            
            Match match = matchOpt.get();
            Optional<LostItem> lostItem = lostItemRepository.findById(match.getLostItemId());
            Optional<FoundItem> foundItem = foundItemRepository.findById(match.getFoundItemId());
            
            if (!lostItem.isPresent() || !foundItem.isPresent()) {
                return ResponseEntity.status(404).body(Map.of("message", "Items not found"));
            }
            
            // Determine receiver
            String receiverEmail;
            String receiverName;
            
            if (sender.getEmail().equals(lostItem.get().getUserEmail())) {
                // Sender is the one who lost the item, receiver is the finder
                receiverEmail = foundItem.get().getUserEmail();
                receiverName = foundItem.get().getUserName();
            } else {
                // Sender is the finder, receiver is the one who lost
                receiverEmail = lostItem.get().getUserEmail();
                receiverName = lostItem.get().getUserName();
            }
            
            Message message = new Message(
                matchId,
                sender.getEmail(),
                sender.getFullName(),
                receiverEmail,
                receiverName,
                messageText
            );
            
            messageRepository.save(message);
            
            // Create notification for receiver
            try {
                Notification notification = new Notification();
                notification.setUserEmail(receiverEmail);
                notification.setTitle("💬 New Message from " + sender.getFullName());
                notification.setMessage(messageText.length() > 50 ? 
                    messageText.substring(0, 50) + "..." : messageText);
                notification.setData(Map.of(
                    "matchId", matchId,
                    "type", "new_message",
                    "senderName", sender.getFullName(),
                    "senderEmail", sender.getEmail()
                ));
                notificationRepository.save(notification);
            } catch (Exception e) {
                System.err.println("Failed to create message notification: " + e.getMessage());
            }
            
            return ResponseEntity.ok(Map.of(
                "message", "Message sent successfully",
                "data", message
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to send message", "error", e.getMessage()));
        }
    }
    
    // Get messages for a match
    @GetMapping("/{matchId}/messages")
    public ResponseEntity<?> getMessages(@PathVariable String matchId,
                                        Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            List<Message> messages = messageRepository.findByMatchIdOrderByCreatedAtAsc(matchId);
            
            // Mark messages as read if user is the receiver
            for (Message msg : messages) {
                if (msg.getReceiverEmail().equals(user.getEmail()) && !msg.isRead()) {
                    msg.setRead(true);
                    messageRepository.save(msg);
                }
            }
            
            return ResponseEntity.ok(Map.of(
                "message", "Messages retrieved successfully",
                "messages", messages
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to fetch messages", "error", e.getMessage()));
        }
    }
}
