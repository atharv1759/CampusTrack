package com.campustrack.repository;

import com.campustrack.model.Contact;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends MongoRepository<Contact, String> {
    List<Contact> findByStatus(String status);
    List<Contact> findAllByOrderByCreatedAtDesc();
}
