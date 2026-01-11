package com.campustrack.repository;

import com.campustrack.model.Match;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchRepository extends MongoRepository<Match, String> {
    Optional<Match> findByLostItemIdAndFoundItemId(String lostItemId, String foundItemId);
    List<Match> findByLostItemIdOrderByCreatedAtDesc(String lostItemId);
    List<Match> findByFoundItemIdOrderByCreatedAtDesc(String foundItemId);
}
