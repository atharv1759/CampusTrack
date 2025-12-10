package com.campustrack.controller;

import com.campustrack.dto.ContactRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import jakarta.mail.internet.MimeMessage;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String emailUser;
    
    // Process contact form submissions and send email
    @PostMapping
    public ResponseEntity<?> sendContactMail(@RequestBody ContactRequest request) {
        try {
            // Make sure all required fields are filled
            if (request.getName() == null || request.getEmail() == null || 
                request.getPhone() == null || request.getMessage() == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "All fields are required"));
            }
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom("CampusFind <" + emailUser + ">");
            helper.setReplyTo(request.getEmail());
            helper.setTo(emailUser);
            helper.setSubject("New Message from " + request.getName());
            helper.setText("Name: " + request.getName() + "\n" +
                    "Email: " + request.getEmail() + "\n" +
                    "Phone Number: " + request.getPhone() + "\n" +
                    "Message:\n" + request.getMessage(), false);
            
            mailSender.send(message);
            
            return ResponseEntity.ok(Map.of("message", "Message sent successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to send message", "error", e.getMessage()));
        }
    }
}
