package com.palma.password_manager.dto;

import com.palma.password_manager.model.User;

import java.time.LocalDateTime;

public class PasswordEntryDTO {

    private Long id;
    private String name;
    private String username;
    private String password;
    private String url;
    private String notes;
    private LocalDateTime createdAt, updatedAt;

    public PasswordEntryDTO(long id, String name, String username, String password, String url, String notes, LocalDateTime createdAt, LocalDateTime updatedAt){
        this.id = id;
        this.name = name;
        this.username = username;
        this.password = password;
        this.url = url;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getUsername() {
        return username;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
