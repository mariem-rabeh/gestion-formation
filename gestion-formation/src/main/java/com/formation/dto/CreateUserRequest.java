package com.formation.dto;

public class CreateUserRequest {
    private String email;
    private String password;
    private String role; // ex: "ROLE_ADMIN" ou "ROLE_USER"

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}