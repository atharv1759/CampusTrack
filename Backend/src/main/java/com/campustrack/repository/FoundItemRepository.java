package com.campustrack.repository;

import com.campustrack.model.FoundItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoundItemRepository extends MongoRepository<FoundItem, String> {
    List<FoundItem> findByUserEmailOrderByCreatedAtDesc(String userEmail);
    List<FoundItem> findAllByOrderByCreatedAtDesc();
}
