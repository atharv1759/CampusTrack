package com.campustrack.repository;

import com.campustrack.model.LostItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LostItemRepository extends MongoRepository<LostItem, String> {
    List<LostItem> findByUserEmailOrderByCreatedAtDesc(String userEmail);
    List<LostItem> findAllByOrderByCreatedAtDesc();
}
