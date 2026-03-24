package com.palma.password_manager.controller;

import com.palma.password_manager.model.PasswordEntry;
import com.palma.password_manager.model.User;
import com.palma.password_manager.service.PasswordEntryService;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.crypto.SecretKey;
import java.util.List;

@RestController
@RequestMapping("api/entries")
public class EntriesController {

    private final PasswordEntryService passwordEntryService;

    public EntriesController(PasswordEntryService passwordEntryService){
        this.passwordEntryService = passwordEntryService;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id){
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        this.passwordEntryService.deleteEntry(user, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping()
    public ResponseEntity<List<PasswordEntry>> getEntries(){
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(this.passwordEntryService.getAllEntriesByUser(user));
    }
}
