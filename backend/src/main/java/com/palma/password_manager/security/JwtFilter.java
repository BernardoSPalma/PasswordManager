package com.palma.password_manager.security;

import com.palma.password_manager.model.User;
import com.palma.password_manager.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final static String AUTH_HEADER_ID = "Bearer ";

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Autowired
    public JwtFilter (JwtService jwtService, UserRepository userRepository){
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header =request.getHeader("Authorization");
        if(header == null || !header.startsWith(AUTH_HEADER_ID)){
            filterChain.doFilter(request, response);
            return;
        }
        String token = header.substring(AUTH_HEADER_ID.length());
        if(!jwtService.isTokenValid(token)){
            filterChain.doFilter(request, response);
            return;
        }
        String email = jwtService.extractEmail(token);
        User user = userRepository.findByEmail(email);
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);
        filterChain.doFilter(request, response);
    }
}
