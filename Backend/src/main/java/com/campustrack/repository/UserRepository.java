package com.campustrack.repository;

import com.campustrack.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmailAndRole(String email, String role);
    Optional<User> findByEmail(String email);
    Optional<User> findByResetPasswordTokenAndResetPasswordExpiresGreaterThan(
        String token, Instant now);
    long countByRole(String role);
}
