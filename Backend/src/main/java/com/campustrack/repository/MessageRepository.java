package com.campustrack.repository;

import com.campustrack.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    // Find all messages in a specific match conversation
    List<Message> findByMatchIdOrderByCreatedAtAsc(String matchId);
    
    // Find all unread messages for a user
    List<Message> findByReceiverEmailAndReadFalseOrderByCreatedAtDesc(String receiverEmail);
    
    // Count unread messages for a user
    long countByReceiverEmailAndReadFalse(String receiverEmail);
}
