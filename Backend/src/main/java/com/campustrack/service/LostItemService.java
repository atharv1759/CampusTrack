package com.campustrack.service;

import com.campustrack.dto.LostItemRequest;
import com.campustrack.model.LostItem;
import com.campustrack.model.User;
import com.campustrack.repository.LostItemRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class LostItemService {
    
    @Autowired
    private LostItemRepository lostItemRepository;
    
    @Autowired
    private Cloudinary cloudinary;
    
    @Autowired
    private AutoMatchService autoMatchService;
    
    // Process new lost item report from user with optional image
    public LostItem reportLostItem(LostItemRequest request, MultipartFile imageFile, User user) throws IOException {
        LostItem lostItem = new LostItem();
        lostItem.setItemName(request.getItemName());
        lostItem.setItemDescription(request.getItemDescription());
        lostItem.setDateLost(request.getDateLost());
        lostItem.setTimeRange(request.getTimeRange());
        lostItem.setLocation(request.getLocation());
        lostItem.setUserName(user.getFullName());
        lostItem.setUserEmail(user.getEmail());
        lostItem.setItemCategory(request.getItemCategory());
        lostItem.setIdentificationMark(request.getIdentificationMark());
        
        // Upload image to Cloudinary if provided
        if (imageFile != null && !imageFile.isEmpty()) {
            @SuppressWarnings("rawtypes")
            Map uploadResult = cloudinary.uploader().upload(imageFile.getBytes(),
                    ObjectUtils.asMap("folder", "lost-found-items"));
            lostItem.setItemImage((String) uploadResult.get("url"));
        }
        
        LostItem savedItem = lostItemRepository.save(lostItem);
        
        // Automatically check for matches with found items
        try {
            autoMatchService.checkMatchesForLostItem(savedItem);
        } catch (Exception e) {
            System.err.println("Auto-match failed: " + e.getMessage());
        }
        
        return savedItem;
    }
    
    // Fetch all lost items sorted by newest first
    public List<LostItem> getLostItems() {
        return lostItemRepository.findAllByOrderByCreatedAtDesc();
    }
    
    // Remove lost item from database
    public void deleteLostItem(String id) {
        lostItemRepository.deleteById(id);
    }
    
    // Get all lost items reported by specific user
    public List<LostItem> getMyLostItems(String userEmail) {
        return lostItemRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);
    }
}
