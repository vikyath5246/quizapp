package com.assessment.quizapp.dto;

import com.assessment.quizapp.entity.User;

public class AuthResponse {
    private String token;
    private String username;
    private String role;
    private Long userId;

    public AuthResponse() {}

    public AuthResponse(String token, User user) {
        this.token = token;
        this.username = user.getUsername();
        this.role = user.getRole().name();
        this.userId = user.getId();
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
