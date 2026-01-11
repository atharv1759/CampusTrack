package com.campustrack.service;

import com.campustrack.model.FoundItem;
import com.campustrack.model.LostItem;
import com.campustrack.model.Match;
import com.campustrack.model.Notification;
import com.campustrack.repository.FoundItemRepository;
import com.campustrack.repository.LostItemRepository;
import com.campustrack.repository.MatchRepository;
import com.campustrack.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AutoMatchService {
    
    @Autowired
    private LostItemRepository lostItemRepository;
    
    @Autowired
    private FoundItemRepository foundItemRepository;
    
    @Autowired
    private MatchRepository matchRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;
    
    private static final double NAME_SIM_THRESHOLD = 0.3;  // Lowered from 0.5 to 0.3 for more flexibility
    private static final double TEXT_SIM_THRESHOLD = 0.2;  // Lowered from 0.4 to 0.2
    private static final double BOOST_FACTOR = 0.15;       // Increased from 0.1 to reward matching details
    private static final double NAME_WEIGHT = 0.6;
    private static final double TEXT_WEIGHT = 0.4;
    private static final int AUTO_NOTIFY_THRESHOLD = 60;   // Lowered from 75 to 60 for more matches
    
    // Check for matches when a new lost item is reported
    public int checkMatchesForLostItem(LostItem lostItem) {
        int matchesFound = 0;
        List<FoundItem> foundItems = foundItemRepository.findAll();
        List<Map<String, Object>> matches = findMatches(List.of(lostItem), foundItems);
        
        for (Map<String, Object> match : matches) {
            int confidence = (Integer) match.get("finalScore");
            if (confidence >= AUTO_NOTIFY_THRESHOLD) {
                createMatchAndNotify(lostItem, (FoundItem) match.get("foundItem"), confidence);
                matchesFound++;
            }
        }
        return matchesFound;
    }
    
    // Check for matches when a new found item is reported
    public int checkMatchesForFoundItem(FoundItem foundItem) {
        int matchesFound = 0;
        List<LostItem> lostItems = lostItemRepository.findAll();
        List<Map<String, Object>> matches = findMatches(lostItems, List.of(foundItem));
        
        for (Map<String, Object> match : matches) {
            int confidence = (Integer) match.get("finalScore");
            if (confidence >= AUTO_NOTIFY_THRESHOLD) {
                createMatchAndNotify((LostItem) match.get("lostItem"), foundItem, confidence);
                matchesFound++;
            }
        }
        return matchesFound;
    }
    
    // Core matching algorithm
    private List<Map<String, Object>> findMatches(List<LostItem> lostItems, List<FoundItem> foundItems) {
        List<Map<String, Object>> results = new ArrayList<>();
        
        for (LostItem lost : lostItems) {
            String lostName = lost.getItemName() != null ? lost.getItemName().toLowerCase() : "";
            String lostText = buildTextDescription(lost).toLowerCase();
            List<String> boostWords = extractWords(lost.getIdentificationMark());
            
            for (FoundItem found : foundItems) {
                String foundName = found.getItemName() != null ? found.getItemName().toLowerCase() : "";
                String foundText = buildTextDescription(found).toLowerCase();
                
                // First check: Category match (optional but boosts score)
                boolean categoryMatch = false;
                if (lost.getItemCategory() != null && found.getCategory() != null) {
                    categoryMatch = lost.getItemCategory().equalsIgnoreCase(found.getCategory());
                }
                
                double nameScore = calculateSimilarity(lostName, foundName);
                if (nameScore < NAME_SIM_THRESHOLD && !categoryMatch) continue; // Skip if name too different and no category match
                
                double textScore = calculateSimilarity(lostText, foundText);
                
                // Boost score for matching category
                if (categoryMatch) {
                    textScore += 0.2; // 20% boost for same category
                    textScore = Math.min(textScore, 1.0);
                }
                
                // Boost score for matching identification marks
                List<String> matches = boostWords.stream()
                        .filter(foundText::contains)
                        .collect(Collectors.toList());
                
                if (!matches.isEmpty()) {
                    textScore += BOOST_FACTOR * matches.size();
                    textScore = Math.min(textScore, 1.0);
                }
                
                double finalScore = nameScore * NAME_WEIGHT + textScore * TEXT_WEIGHT;
                int finalScorePercent = (int) Math.round(finalScore * 100);
                
                if (finalScorePercent > TEXT_SIM_THRESHOLD * 100) {
                    Map<String, Object> match = new HashMap<>();
                    match.put("lostItem", lost);
                    match.put("foundItem", found);
                    match.put("finalScore", finalScorePercent);
                    results.add(match);
                }
            }
        }
        
        results.sort((a, b) -> 
            Integer.compare((Integer) b.get("finalScore"), (Integer) a.get("finalScore")));
        
        return results;
    }
    
    // Create match record and send email notifications
    private void createMatchAndNotify(LostItem lostItem, FoundItem foundItem, int confidence) {
        // Check if match already exists
        Optional<Match> existingMatch = matchRepository
                .findByLostItemIdAndFoundItemId(lostItem.getId(), foundItem.getId());
        
        if (existingMatch.isPresent()) {
            return; // Skip if already matched
        }
        
        // Create match record
        Match match = new Match();
        match.setLostItemId(lostItem.getId());
        match.setFoundItemId(foundItem.getId());
        match.setStatus("pending");
        match.setConfidenceScore(confidence);
        matchRepository.save(match);
        
        // Create notifications for both users
        createMatchNotification(lostItem, foundItem, confidence, "lost", match.getId());
        createMatchNotification(lostItem, foundItem, confidence, "found", match.getId());
        
        // Send email notifications
        sendMatchNotification(lostItem, foundItem, confidence, "lost");
        sendMatchNotification(lostItem, foundItem, confidence, "found");
    }
    
    // Create notification in database
    private void createMatchNotification(LostItem lostItem, FoundItem foundItem, int confidence, String userType, String matchId) {
        try {
            Notification notification = new Notification();
            
            if ("lost".equals(userType)) {
                notification.setUserEmail(lostItem.getUserEmail());
                notification.setTitle("🎉 Match Found for Your Lost Item!");
                notification.setMessage(String.format(
                    "We found a potential match (%d%% confidence) for your lost item '%s'. Check your matches to view details.",
                    confidence,
                    lostItem.getItemName()
                ));
                notification.setData(Map.of(
                    "matchId", matchId,
                    "type", "match_found",
                    "itemName", lostItem.getItemName(),
                    "confidence", confidence
                ));
            } else {
                notification.setUserEmail(foundItem.getUserEmail());
                notification.setTitle("🎉 Match Found for Your Found Item!");
                notification.setMessage(String.format(
                    "The item you found '%s' matches someone's lost item (%d%% confidence). Check your matches to view details.",
                    foundItem.getItemName(),
                    confidence
                ));
                notification.setData(Map.of(
                    "matchId", matchId,
                    "type", "match_found",
                    "itemName", foundItem.getItemName(),
                    "confidence", confidence
                ));
            }
            
            notificationRepository.save(notification);
        } catch (Exception e) {
            System.err.println("Failed to create notification: " + e.getMessage());
        }
    }
    
    // Send email notification to user about match
    private void sendMatchNotification(LostItem lostItem, FoundItem foundItem, int confidence, String userType) {
        if (mailSender == null) return;
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            
            if ("lost".equals(userType)) {
                message.setTo(lostItem.getUserEmail());
                message.setSubject("🎉 Great News! We Found a Match for Your Lost Item");
                message.setText(String.format(
                    "Hi %s,\n\n" +
                    "Good news! We found a potential match for your lost item:\n\n" +
                    "Your Lost Item: %s\n" +
                    "Match Confidence: %d%%\n\n" +
                    "Found Item Details:\n" +
                    "- Item: %s\n" +
                    "- Description: %s\n" +
                    "- Found At: %s\n" +
                    "- Found By: %s\n" +
                    "- Contact: %s\n\n" +
                    "View full details: %s/user-dashboard/my-matches\n\n" +
                    "Please contact the finder to arrange pickup.\n\n" +
                    "Best regards,\n" +
                    "Campus Track Team",
                    lostItem.getUserName(),
                    lostItem.getItemName(),
                    confidence,
                    foundItem.getItemName(),
                    foundItem.getItemDescription() != null ? foundItem.getItemDescription() : "No description provided",
                    foundItem.getPlaceFound() != null ? foundItem.getPlaceFound() : "Not specified",
                    foundItem.getUserName(),
                    foundItem.getUserEmail(),
                    frontendUrl
                ));
            } else {
                message.setTo(foundItem.getUserEmail());
                message.setSubject("✅ Your Found Item Matches Someone's Lost Item!");
                message.setText(String.format(
                    "Hi %s,\n\n" +
                    "Great news! The item you found matches someone's lost item:\n\n" +
                    "Your Found Item: %s\n" +
                    "Match Confidence: %d%%\n\n" +
                    "Lost Item Details:\n" +
                    "- Item: %s\n" +
                    "- Description: %s\n" +
                    "- Lost By: %s\n" +
                    "- Contact: %s\n\n" +
                    "View full details: %s/user-dashboard/my-matches\n\n" +
                    "The owner will contact you to arrange pickup.\n\n" +
                    "Thank you for helping reunite lost items!\n\n" +
                    "Best regards,\n" +
                    "Campus Track Team",
                    foundItem.getUserName(),
                    foundItem.getItemName(),
                    confidence,
                    lostItem.getItemName(),
                    lostItem.getItemDescription() != null ? lostItem.getItemDescription() : "No description provided",
                    lostItem.getUserName(),
                    lostItem.getUserEmail(),
                    frontendUrl
                ));
            }
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
    
    // Public method to send emails from other services/controllers
    public void sendSimpleEmail(String to, String subject, String body) {
        try {
            if (mailSender == null) {
                System.err.println("Mail sender not configured");
                return;
            }
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(System.getenv("EMAIL_USERNAME"));
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
    
    // Build text description from item fields
    private String buildTextDescription(LostItem item) {
        StringBuilder sb = new StringBuilder();
        if (item.getItemName() != null) sb.append(item.getItemName()).append(" ");
        if (item.getItemDescription() != null) sb.append(item.getItemDescription()).append(" ");
        if (item.getLocation() != null) sb.append(item.getLocation()).append(" ");
        if (item.getItemCategory() != null) sb.append(item.getItemCategory()).append(" ");
        return sb.toString();
    }
    
    // Build text description from found item fields
    private String buildTextDescription(FoundItem item) {
        StringBuilder sb = new StringBuilder();
        if (item.getItemName() != null) sb.append(item.getItemName()).append(" ");
        if (item.getItemDescription() != null) sb.append(item.getItemDescription()).append(" ");
        if (item.getPlaceFound() != null) sb.append(item.getPlaceFound()).append(" ");
        if (item.getCategory() != null) sb.append(item.getCategory()).append(" ");
        return sb.toString();
    }
    
    // Extract words from identification mark
    private List<String> extractWords(String text) {
        if (text == null || text.isEmpty()) return List.of();
        return Arrays.stream(text.toLowerCase().split("\\W+"))
                .filter(w -> w.length() > 2)
                .collect(Collectors.toList());
    }
    
    // Calculate similarity between two strings using Jaccard index
    private double calculateSimilarity(String a, String b) {
        if (a == null || b == null || a.isEmpty() || b.isEmpty()) return 0.0;
        
        Set<String> setA = new HashSet<>(Arrays.asList(a.split("\\s+")));
        Set<String> setB = new HashSet<>(Arrays.asList(b.split("\\s+")));
        
        Set<String> intersection = new HashSet<>(setA);
        intersection.retainAll(setB);
        
        Set<String> union = new HashSet<>(setA);
        union.addAll(setB);
        
        return union.isEmpty() ? 0.0 : (double) intersection.size() / union.size();
    }
}
