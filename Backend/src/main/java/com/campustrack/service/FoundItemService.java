package com.campustrack.service;

import com.campustrack.dto.FoundItemRequest;
import com.campustrack.model.FoundItem;
import com.campustrack.model.User;
import com.campustrack.repository.FoundItemRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class FoundItemService {
    
    @Autowired
    private FoundItemRepository foundItemRepository;
    
    @Autowired
    private Cloudinary cloudinary;
    
    @Autowired
    private AutoMatchService autoMatchService;
    
    // Handle found item submission with image upload to cloud
    public FoundItem reportFoundItem(FoundItemRequest request, MultipartFile imageFile, User user) throws IOException {
        // Upload image to Cloudinary storage
        @SuppressWarnings("rawtypes")
        Map uploadResult = cloudinary.uploader().upload(imageFile.getBytes(),
                ObjectUtils.asMap("folder", "lost-found-items"));
        
        FoundItem foundItem = new FoundItem();
        foundItem.setItemName(request.getItemName());
        foundItem.setItemDescription(request.getItemDescription());
        foundItem.setPlaceFound(request.getPlaceFound());
        foundItem.setTimeFound(request.getTimeFound());
        foundItem.setDateFound(request.getDateFound());
        foundItem.setCategory(request.getCategory());
        foundItem.setUserName(user.getFullName());
        foundItem.setUserEmail(user.getEmail());
        foundItem.setImage((String) uploadResult.get("url"));
        
        FoundItem savedItem = foundItemRepository.save(foundItem);
        
        // Automatically check for matches with lost items
        try {
            autoMatchService.checkMatchesForFoundItem(savedItem);
        } catch (Exception e) {
            System.err.println("Auto-match failed: " + e.getMessage());
        }
        
        return savedItem;
    }
    
    // Retrieve all found items ordered by date
    public List<FoundItem> getFoundItems() {
        return foundItemRepository.findAllByOrderByCreatedAtDesc();
    }
    
    // Delete found item entry from database
    public void deleteFoundItem(String id) {
        foundItemRepository.deleteById(id);
    }
    
    // Get found items submitted by particular user
    public List<FoundItem> getMyFoundItems(String userEmail) {
        return foundItemRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);
    }
}
