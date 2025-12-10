package com.campustrack.service;

import com.campustrack.dto.*;
import com.campustrack.model.User;
import com.campustrack.repository.UserRepository;
import com.campustrack.security.JwtUtil;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HexFormat;

// Service layer for handling all authentication related operations
@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${admin.password}")
    private String adminPassword;
    
    @Value("${frontend.url}")
    private String frontendUrl;
    
    @Value("${spring.mail.username}")
    private String emailFrom;
    
    // Handle user registration - students and staff only
    public MessageResponse signup(SignupRequest request) {
        // Prevent admin signup through regular flow
        if ("admin".equals(request.getRole())) {
            throw new RuntimeException("Admin cannot signup");
        }
        
        User user = new User();
        user.setRole(request.getRole());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setContactNumber(request.getContactNumber());
        user.setEnrollmentNumber(request.getEnrollmentNumber());
        user.setSemester(request.getSemester());
        user.setYear(request.getYear());
        user.setStaffId(request.getStaffId());
        user.setDepartment(request.getDepartment());
        user.setPassword(BCrypt.hashpw(request.getPassword(), BCrypt.gensalt()));
        
        userRepository.save(user);
        return new MessageResponse("User registered successfully");
    }
    
    // Login functionality for all user types
    public AuthResponse signin(SigninRequest request) {
        // Special handling for admin login
        if ("admin".equals(request.getRole())) {
            if (!adminPassword.equals(request.getPassword())) {
                throw new RuntimeException("Invalid admin password");
            }
            String token = jwtUtil.generateAdminToken();
            return new AuthResponse("Admin signed in", token);
        }
        
        User user = userRepository.findByEmailAndRole(request.getEmail(), request.getRole())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!BCrypt.checkpw(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        String token = jwtUtil.generateToken(user.getId(), user.getRole());
        return new AuthResponse("Signin successful", token);
    }
    
    public MessageResponse forgotPassword(String email) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);
        String resetToken = HexFormat.of().formatHex(bytes);
        
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        String hashedToken = HexFormat.of().formatHex(digest.digest(resetToken.getBytes()));
        
        user.setResetPasswordToken(hashedToken);
        user.setResetPasswordExpires(Instant.now().plus(10, ChronoUnit.MINUTES));
        userRepository.save(user);
        
        String resetUrl = frontendUrl + "/reset-password/" + resetToken;
        
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom("CampusFind Team <" + emailFrom + ">");
        helper.setTo(user.getEmail());
        helper.setSubject("Password Reset Link");
        helper.setText("<p>Click <a href=\"" + resetUrl + "\">here</a> to reset your password. This link expires in 10 minutes.</p>", true);
        
        mailSender.send(message);
        
        return new MessageResponse("Reset link sent to your email!");
    }
    
    public MessageResponse resetPassword(String token, String newPassword) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        String hashedToken = HexFormat.of().formatHex(digest.digest(token.getBytes()));
        
        User user = userRepository.findByResetPasswordTokenAndResetPasswordExpiresGreaterThan(
                hashedToken, Instant.now())
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));
        
        user.setPassword(BCrypt.hashpw(newPassword, BCrypt.gensalt()));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpires(null);
        userRepository.save(user);
        
        return new MessageResponse("Password reset successful");
    }
}
