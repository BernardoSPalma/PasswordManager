package com.palma.password_manager.dto;

public class UpdateEntryRequest {
    private final String username;
    private final String password;
    private final String url;
    private final String notes;

    public UpdateEntryRequest(String username, String password, String url, String notes) {
        this.username = username;
        this.password = password;
        this.url = url;
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

    public String getUrl(){
        return url;
    }
    
    
}
