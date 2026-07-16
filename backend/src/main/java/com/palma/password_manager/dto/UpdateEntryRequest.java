package com.palma.password_manager.dto;

public class UpdateEntryRequest {
    private final String username;
    private final String label;
    private final String password;
    private final String url;
    private final String notes;

    public UpdateEntryRequest(String username, String label, String password, String url, String notes) {
        this.username = username;
        this.label = label;
        this.password = password;
        this.url = url;
        this.notes = notes;
    }

    public String getUsername() {
        return username;
    }

    public String getLabel(){
        return label;
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
