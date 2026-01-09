package com.campustrack.controller;

import com.campustrack.dto.ContactRequest;
import com.campustrack.model.Contact;
import com.campustrack.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {
    
    @Autowired
    private ContactRepository contactRepository;
    
    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String emailUsername;
    
    // Process contact form submissions and send email
    @PostMapping
    public ResponseEntity<?> submitContact(@RequestBody ContactRequest request) {
        try {
            // Make sure all required fields are filled
            if (request.getName() == null || request.getEmail() == null || 
                request.getPhone() == null || request.getMessage() == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "All fields are required"));
            }
            
            // Send email to support team
            if (mailSender != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(emailUsername);
                message.setTo(emailUsername); // Send to your support email
                message.setReplyTo(request.getEmail()); // User can reply directly to sender
                message.setSubject("New Contact Form Submission - Campus Track");
                message.setText(String.format("""
                    Message:
                    %s
                    
                    From: %s
                    Email: %s
                    Phone: %s
                    ---
                    This message was sent via the Campus Track contact form.
                    Reply to this email to respond directly to the user.
                    """,
                    request.getMessage(),
                    request.getName(),
                    request.getEmail(),
                    request.getPhone()
                ));
                
                mailSender.send(message);
            }
            
            // Optional: Still save to database as backup/history
            Contact contact = new Contact();
            contact.setName(request.getName());
            contact.setEmail(request.getEmail());
            contact.setPhone(request.getPhone());
            contact.setMessage(request.getMessage());
            contactRepository.save(contact);
            
            return ResponseEntity.ok(Map.of("message", "Message sent successfully! We'll get back to you soon."));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to send message", "error", e.getMessage()));
        }
    }
    
    // Get all contact messages (for admin)
    @GetMapping
    public ResponseEntity<?> getAllContacts() {
        try {
            List<Contact> contacts = contactRepository.findAllByOrderByCreatedAtDesc();
            return ResponseEntity.ok(contacts);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to fetch contacts", "error", e.getMessage()));
        }
    }
    
    // Mark contact as read (for admin)
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable String id) {
        try {
            Contact contact = contactRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Contact not found"));
            contact.setStatus("read");
            contactRepository.save(contact);
            return ResponseEntity.ok(Map.of("message", "Marked as read"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to update contact", "error", e.getMessage()));
        }
    }
    
    // Delete contact (for admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContact(@PathVariable String id) {
        try {
            contactRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Contact deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to delete contact", "error", e.getMessage()));
        }
    }
}
