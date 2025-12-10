package com.campustrack.controller;

import com.campustrack.model.Notification;
import com.campustrack.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import jakarta.mail.internet.MimeMessage;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notify")
public class NotificationController {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String emailUser;
    
    // Handle both fetching notifications and sending email notifications
    @PostMapping("/user")
    public ResponseEntity<?> handleNotification(@RequestBody Map<String, Object> request) {
        try {
            // If request has email but no 'to' field, user wants to fetch their notifications
            if (request.containsKey("email") && !request.containsKey("to")) {
                String userEmail = (String) request.get("email");
                List<Notification> notifications = notificationRepository
                        .findByUserEmailOrderByCreatedAtDesc(userEmail);
                return ResponseEntity.ok(Map.of("notifications", notifications));
            }
            
            // Otherwise this is sending email notification about a match
            String to = (String) request.get("to");
            if (to == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Lost user email is required"));
            }
            
            @SuppressWarnings("unchecked")
            Map<String, Object> lostItem = (Map<String, Object>) request.get("lostItem");
            @SuppressWarnings("unchecked")
            Map<String, Object> foundItem = (Map<String, Object>) request.get("foundItem");
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom("\"CampusFind\" <" + emailUser + ">");
            helper.setTo(to);
            helper.setSubject("Found Item Matching Your Lost Item: " + lostItem.get("itemName"));
            
            String htmlContent = "<h3>Found Item Details</h3>" +
                    "<p><strong>Name:</strong> " + foundItem.get("itemName") + "</p>" +
                    "<p><strong>Description:</strong> " + foundItem.get("itemDescription") + "</p>" +
                    "<p><strong>Place Found:</strong> " + foundItem.get("placeFound") + "</p>" +
                    "<p><strong>Date Found:</strong> " + foundItem.get("dateFound") + "</p>";
            
            String imageUrl = (String) foundItem.get("image");
            if (imageUrl != null && !imageUrl.isEmpty()) {
                htmlContent += "<p><img src=\"" + imageUrl + "\" width=\"300\" style=\"display:block;\"/></p>";
            }
            
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            
            return ResponseEntity.ok(Map.of("message", "Notification sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to send email", "error", e.getMessage()));
        }
    }
}
