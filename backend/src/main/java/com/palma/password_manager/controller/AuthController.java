package com.palma.password_manager.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palma.password_manager.dto.AuthResponse;
import com.palma.password_manager.dto.LoginRequest;
import com.palma.password_manager.dto.RegisterRequest;
import com.palma.password_manager.security.JwtService;
import com.palma.password_manager.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService){
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> registerEndPoint(@RequestBody RegisterRequest registerRequest){
        this.userService.register(registerRequest.getEmail(),registerRequest.getPassword());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginEndPoint(@RequestBody LoginRequest loginRequest) throws Exception{
        this.userService.authenticate(loginRequest.getPassword(), loginRequest.getEmail());
        return ResponseEntity.ok(new AuthResponse(jwtService.generateToken(loginRequest.getEmail())));
    }
}
