package com.campustrack.controller;

import com.campustrack.model.Notification;
import com.campustrack.model.User;
import com.campustrack.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.mail.internet.MimeMessage;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class NotificationController {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String emailUser;
    
    // Get all notifications for current user
    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            List<Notification> notifications = notificationRepository
                    .findByUserEmailOrderByCreatedAtDesc(user.getEmail());
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to fetch notifications", "error", e.getMessage()));
        }
    }
    
    // Mark single notification as read
    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable String id,
                                       Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Optional<Notification> notificationOpt = notificationRepository.findById(id);
            
            if (!notificationOpt.isPresent()) {
                return ResponseEntity.status(404)
                        .body(Map.of("message", "Notification not found"));
            }
            
            Notification notification = notificationOpt.get();
            
            // Verify user owns this notification
            if (!notification.getUserEmail().equals(user.getEmail())) {
                return ResponseEntity.status(403)
                        .body(Map.of("message", "Unauthorized"));
            }
            
            notification.setIsRead(true);
            notificationRepository.save(notification);
            
            return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to mark as read", "error", e.getMessage()));
        }
    }
    
    // Mark all notifications as read
    @PutMapping("/notifications/read-all")
    public ResponseEntity<?> markAllAsRead(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            List<Notification> notifications = notificationRepository
                    .findByUserEmailOrderByCreatedAtDesc(user.getEmail());
            
            for (Notification notification : notifications) {
                if (!notification.getIsRead()) {
                    notification.setIsRead(true);
                    notificationRepository.save(notification);
                }
            }
            
            return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to mark all as read", "error", e.getMessage()));
        }
    }
    
    // Legacy endpoint for email notifications (kept for backward compatibility)
    @PostMapping("/notify/user")
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
