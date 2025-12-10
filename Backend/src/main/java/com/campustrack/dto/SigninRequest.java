package com.campustrack.dto;

import lombok.Data;

@Data
public class SigninRequest {
    private String role;
    private String email;
    private String password;
}
