package com.palma.password_manager.dto;

public class UpdateEntryRequest {
    private final String username;
    private final String password;
    private final String notes;

    public UpdateEntryRequest(String username, String password, String notes) {
        this.username = username;
        this.password = password;
        this.notes = notes;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getNotes() {
        return notes;
    }
    
    
}
