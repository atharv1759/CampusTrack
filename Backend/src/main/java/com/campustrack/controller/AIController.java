package com.campustrack.controller;

import com.campustrack.model.FoundItem;
import com.campustrack.model.LostItem;
import com.campustrack.model.Match;
import com.campustrack.model.User;
import com.campustrack.model.Notification;
import com.campustrack.repository.FoundItemRepository;
import com.campustrack.repository.LostItemRepository;
import com.campustrack.repository.MatchRepository;
import com.campustrack.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private FoundItemRepository foundItemRepository;

    @Autowired
    private LostItemRepository lostItemRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    // General chat with Gemini
    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String userMessage = request.get("message");
            String context = request.get("context");

            String systemPrompt = """
                You are a helpful AI assistant for Campus Track, a lost and found management system.
                Help users with:
                - How to use the website
                - Reporting lost/found items
                - Understanding the matching system
                - Troubleshooting common issues
                
                Be concise, friendly, and helpful. Keep responses under 150 words.
                """;

            String response = callGeminiAPI(systemPrompt + "\n\nUser: " + userMessage);

            return ResponseEntity.ok(Map.of("response", response));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "AI chat failed", "error", e.getMessage()));
        }
    }

    // Search for matching items based on user description
    @PostMapping("/search-item")
    public ResponseEntity<?> searchItem(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String description = request.get("description");
            String date = request.get("date");
            String time = request.get("time");
            String location = request.get("location");

            // Get all found items
            List<FoundItem> allFoundItems = foundItemRepository.findAll();

            // Use Gemini to find best matches
            String prompt = String.format("""
                I'm looking for a lost item with these details:
                Description: %s
                Date lost: %s
                Time: %s
                Location: %s
                
                Here are found items in the database (as JSON):
                %s
                
                Return ONLY the IDs of the top 3 matching items as a comma-separated list (e.g., "id1,id2,id3").
                If no good matches, return "NONE".
                Consider description similarity, location proximity, and date closeness.
                """, description, date, time, location, convertFoundItemsToJSON(allFoundItems));

            String geminiResponse = callGeminiAPI(prompt);
            
            List<FoundItem> matches = new ArrayList<>();
            if (!geminiResponse.trim().equals("NONE")) {
                String[] ids = geminiResponse.trim().split(",");
                for (String id : ids) {
                    foundItemRepository.findById(id.trim()).ifPresent(matches::add);
                    if (matches.size() >= 3) break;
                }
            }

            return ResponseEntity.ok(Map.of("matches", matches));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Search failed", "error", e.getMessage()));
        }
    }

    // Create AI-assisted match
    @PostMapping("/create-match")
    public ResponseEntity<?> createMatch(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            String foundItemId = request.get("foundItemId");
            String description = request.get("description");
            String date = request.get("date");
            String time = request.get("time");
            String location = request.get("location");

            // Get the found item
            FoundItem foundItem = foundItemRepository.findById(foundItemId)
                    .orElseThrow(() -> new RuntimeException("Found item not found"));

            // Create a lost item entry for the user
            LostItem lostItem = new LostItem();
            lostItem.setItemName(foundItem.getItemName());
            lostItem.setItemCategory(foundItem.getCategory());
            lostItem.setItemDescription(description);
            lostItem.setLocation(location);
            // Parse date string to LocalDate
            try {
                lostItem.setDateLost(LocalDate.parse(date));
            } catch (Exception e) {
                lostItem.setDateLost(LocalDate.now());
            }
            lostItem.setTimeRange(time);
            lostItem.setUserEmail(user.getEmail());
            lostItem.setUserName(user.getFullName());
            lostItem.setCreatedAt(Instant.now());
            lostItem = lostItemRepository.save(lostItem);

            // Create match
            Match match = new Match();
            match.setLostItemId(lostItem.getId());
            match.setFoundItemId(foundItemId);
            match.setStatus("ai_matched");
            match.setConfidenceScore(85);
            match.setHandoverStatus("pending");
            match.setCreatedAt(Instant.now());
            match = matchRepository.save(match);

            // Send notification to finder
            FoundItem finderItem = foundItem;
            Notification notification = new Notification();
            notification.setUserEmail(finderItem.getUserEmail());
            notification.setTitle("AI Match Found!");
            notification.setMessage("AI found a potential owner for your found item: " + finderItem.getItemName() + 
                    ". Tagged: 'Added by AI - Please confirm strictly before returning'");
            notification.setIsRead(false);
            notification.setCreatedAt(Instant.now());
            Map<String, Object> notifData = new HashMap<>();
            notifData.put("matchId", match.getId());
            notifData.put("type", "ai_match");
            notification.setData(notifData);
            notificationRepository.save(notification);

            // Send email to finder
            if (mailSender != null) {
                String emailBody = String.format("""
                    Hi %s,
                    
                    Good news! Our AI has found a potential owner for your found item.
                    
                    Item: %s
                    
                    ⚠️ IMPORTANT: This match was created by AI based on user description.
                    Please confirm the owner's identity strictly before returning the item.
                    
                    Go to your "My Matches" to review and contact the owner.
                    
                    Best regards,
                    Campus Track Team
                    """, finderItem.getUserName(), finderItem.getItemName());

                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(finderItem.getUserEmail());
                message.setSubject("AI Match Found - Please Verify Before Returning");
                message.setText(emailBody);
                mailSender.send(message);
            }

            return ResponseEntity.ok(Map.of(
                    "message", "Match created successfully",
                    "matchId", match.getId(),
                    "lostItemId", lostItem.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to create match", "error", e.getMessage()));
        }
    }

    // Call Gemini API
    private String callGeminiAPI(String prompt) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + geminiApiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = new HashMap<>();
            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> content = new HashMap<>();
            List<Map<String, String>> parts = new ArrayList<>();
            Map<String, String> part = new HashMap<>();
            part.put("text", prompt);
            parts.add(part);
            content.put("parts", parts);
            contents.add(content);
            requestBody.put("contents", contents);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);
            
            // Extract text from response
            if (response != null && response.containsKey("candidates")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (!candidates.isEmpty()) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> firstCandidate = candidates.get(0);
                    @SuppressWarnings("unchecked")
                    Map<String, Object> contentObj = (Map<String, Object>) firstCandidate.get("content");
                    @SuppressWarnings("unchecked")
                    List<Map<String, String>> partsObj = (List<Map<String, String>>) contentObj.get("parts");
                    if (!partsObj.isEmpty()) {
                        return partsObj.get(0).get("text");
                    }
                }
            }
            
            return "Sorry, I couldn't process that. Please try again.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Sorry, I'm having trouble connecting right now. Please try again later.";
        }
    }

    private String convertFoundItemsToJSON(List<FoundItem> items) {
        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < Math.min(items.size(), 20); i++) {
            FoundItem item = items.get(i);
            if (i > 0) json.append(",");
            json.append(String.format("""
                {"id":"%s","name":"%s","description":"%s","location":"%s","date":"%s","category":"%s"}
                """, 
                item.getId(),
                item.getItemName(),
                item.getItemDescription(),
                item.getPlaceFound(),
                item.getDateFound(),
                item.getCategory()
            ));
        }
        json.append("]");
        return json.toString();
    }
}
