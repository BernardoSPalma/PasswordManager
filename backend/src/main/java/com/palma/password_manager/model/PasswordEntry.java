package com.palma.password_manager.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "password_entries")
public class PasswordEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private byte[] usernameEncrypted;

    @Column(nullable = false)
    private byte[] passwordEncrypted;

    private String url;

    private byte[] notesEncrypted;

    private LocalDateTime createdAt, updatedAt;

    @ManyToOne
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "fk_password_entries_user"))
    private User user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getUsernameEncrypted() {
        return usernameEncrypted;
    }

    public void setUsernameEncrypted(byte[] usernameEncrypted) {
        this.usernameEncrypted = usernameEncrypted;
    }

    public byte[] getPasswordEncrypted() {
        return passwordEncrypted;
    }

    public void setPasswordEncrypted(byte[] passwordEncrypted) {
        this.passwordEncrypted = passwordEncrypted;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public byte[] getNotesEncrypted() {
        return notesEncrypted;
    }

    public void setNotesEncrypted(byte[] notesEncrypted) {
        this.notesEncrypted = notesEncrypted;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
