package com.campustrack.controller;

import com.campustrack.model.LostItem;
import com.campustrack.model.FoundItem;
import com.campustrack.repository.LostItemRepository;
import com.campustrack.repository.FoundItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

// AI-powered matching algorithm using text similarity
@RestController
@RequestMapping("/api/clip")
public class ClipController {
    
    @Autowired
    private LostItemRepository lostItemRepository;
    
    @Autowired
    private FoundItemRepository foundItemRepository;
    
    // Core matching algorithm - compares descriptions and finds similarities
    @PostMapping("/match")
    public ResponseEntity<?> matchWithCLIP() {
        try {
            List<LostItem> lostItems = lostItemRepository.findAll();
            List<FoundItem> foundItems = foundItemRepository.findAll();
            
            if (lostItems.isEmpty() || foundItems.isEmpty()) {
                return ResponseEntity.ok(Map.of("message", "No items to match", "matches", List.of()));
            }
            
            List<Map<String, Object>> results = new ArrayList<>();
            
            double NAME_SIM_THRESHOLD = 0.5;
            double TEXT_SIM_THRESHOLD = 0.4;
            double BOOST_FACTOR = 0.1;
            double NAME_WEIGHT = 0.6;
            double TEXT_WEIGHT = 0.4;
            int HIGH_CONF_THRESHOLD = 70;
            
            for (LostItem lost : lostItems) {
                String lostName = lost.getItemName() != null ? lost.getItemName().toLowerCase() : "";
                String lostText = buildTextDescription(lost).toLowerCase();
                List<String> boostWords = extractWords(lost.getIdentificationMark());
                
                for (FoundItem found : foundItems) {
                    String foundName = found.getItemName() != null ? found.getItemName().toLowerCase() : "";
                    String foundText = (found.getItemDescription() != null ? found.getItemDescription() : "").toLowerCase();
                    
                    double nameScore = calculateSimilarity(lostName, foundName);
                    if (nameScore < NAME_SIM_THRESHOLD) continue;
                    
                    double textScore = calculateSimilarity(lostText, foundText);
                    
                    // Boost score for matching identification marks
                    List<String> matches = boostWords.stream()
                            .filter(foundText::contains)
                            .collect(Collectors.toList());
                    
                    if (!matches.isEmpty()) {
                        textScore += BOOST_FACTOR * matches.size();
                        textScore = Math.min(textScore, 1.0);
                    }
                    
                    double finalScore = nameScore * NAME_WEIGHT + textScore * TEXT_WEIGHT;
                    
                    int nameScorePercent = (int) Math.round(nameScore * 100);
                    int textScorePercent = (int) Math.round(textScore * 100);
                    int finalScorePercent = (int) Math.round(finalScore * 100);
                    
                    if (finalScorePercent > TEXT_SIM_THRESHOLD * 100) {
                        Map<String, Object> match = new HashMap<>();
                        match.put("lostItem", lost);
                        match.put("foundItem", found);
                        match.put("finalScore", finalScorePercent);
                        match.put("nameScore", nameScorePercent);
                        match.put("textScore", textScorePercent);
                        match.put("boostWordsMatched", matches);
                        match.put("highConfidence", finalScorePercent >= HIGH_CONF_THRESHOLD);
                        results.add(match);
                    }
                }
            }
            
            results.sort((a, b) -> 
                Integer.compare((Integer) b.get("finalScore"), (Integer) a.get("finalScore")));
            
            return ResponseEntity.ok(Map.of("message", "Matching complete", "matches", results));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Text similarity model failed", "error", e.getMessage()));
        }
    }
    
    private String buildTextDescription(LostItem lost) {
        StringBuilder sb = new StringBuilder();
        if (lost.getItemDescription() != null) sb.append(lost.getItemDescription()).append(" ");
        if (lost.getItemCategory() != null) sb.append(lost.getItemCategory()).append(" ");
        if (lost.getIdentificationMark() != null) sb.append(lost.getIdentificationMark());
        return sb.toString();
    }
    
    private List<String> extractWords(String text) {
        if (text == null) return List.of();
        return Arrays.stream(text.toLowerCase().split("\\W+"))
                .filter(w -> !w.isEmpty())
                .collect(Collectors.toList());
    }
    
    // Simple Jaccard similarity for text matching
    private double calculateSimilarity(String text1, String text2) {
        if (text1 == null || text2 == null || text1.isEmpty() || text2.isEmpty()) {
            return 0.0;
        }
        
        Set<String> words1 = new HashSet<>(Arrays.asList(text1.split("\\s+")));
        Set<String> words2 = new HashSet<>(Arrays.asList(text2.split("\\s+")));
        
        Set<String> intersection = new HashSet<>(words1);
        intersection.retainAll(words2);
        
        Set<String> union = new HashSet<>(words1);
        union.addAll(words2);
        
        if (union.isEmpty()) return 0.0;
        
        return (double) intersection.size() / union.size();
    }
}
