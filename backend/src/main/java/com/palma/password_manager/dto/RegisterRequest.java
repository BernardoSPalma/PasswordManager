package com.palma.password_manager.dto;

public class RegisterRequest {
    private final String email;
    private final String password;

    public RegisterRequest(String email, String password){
        this.email = email;
        this.password = password;
    }

    public String getEmail(){
        return this.email;
    }

    public String getPassword(){
        return this.password;
    }
}
