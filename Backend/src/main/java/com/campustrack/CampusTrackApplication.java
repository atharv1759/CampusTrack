package com.campustrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

// Main application class for Campus Track Lost and Found System
@SpringBootApplication
@EnableMongoAuditing
public class CampusTrackApplication {
    // Entry point for the application
    public static void main(String[] args) {
        SpringApplication.run(CampusTrackApplication.class, args);
        System.out.println("Backend is running!");
    }
}
