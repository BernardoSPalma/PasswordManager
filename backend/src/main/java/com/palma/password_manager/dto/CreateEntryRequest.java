package com.palma.password_manager.dto;

public class CreateEntryRequest {
    private final String username;
    private final String label;
    private final String password;
    private final String url;
    private final String notes;
    private final String serviceName;

    public CreateEntryRequest(String username, String label, String password, String url, String notes, String serviceName){
        this.username = username;
        this.label = label;
        this.password = password;
        this.url = url;
        this.notes = notes;
        this.serviceName = serviceName;
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

    public String getUrl() {
        return url;
    }

    public String getNotes() {
        return notes;
    }

    public String getServiceName() {
        return serviceName;
    }

    
}
