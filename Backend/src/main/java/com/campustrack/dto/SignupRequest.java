package com.campustrack.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String role;
    private String fullName;
    private String email;
    private String contactNumber;
    private String enrollmentNumber;
    private Integer semester;
    private Integer year;
    private String staffId;
    private String department;
    private String password;
}
