package com.palma.password_manager.controller;

import com.palma.password_manager.dto.CreateEntryRequest;
import com.palma.password_manager.dto.PasswordEntryDTO;
import com.palma.password_manager.dto.UpdateEntryRequest;
import com.palma.password_manager.model.PasswordEntry;
import com.palma.password_manager.model.User;
import com.palma.password_manager.security.AesKeyHolder;
import com.palma.password_manager.service.PasswordEntryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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
        User user = getAuthenticatedUser();
        this.passwordEntryService.deleteEntry(user, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping()
    public ResponseEntity<List<PasswordEntry>> getEntries(){
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(this.passwordEntryService.getAllEntriesByUser(user));
    }

    @PostMapping()
    public ResponseEntity<Void> createEntry(@RequestBody CreateEntryRequest createEntryRequest) throws Exception{
        User user = getAuthenticatedUser();
        this.passwordEntryService.createNewEntry(user,createEntryRequest.getUsername(),createEntryRequest.getPassword(),createEntryRequest.getUrl(),createEntryRequest.getNotes(),createEntryRequest.getServiceName(), AesKeyHolder.get());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PasswordEntryDTO> getEntry(@PathVariable Long id) throws Exception{
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(this.passwordEntryService.decryptEntry(user, id, AesKeyHolder.get()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateEntry(@PathVariable Long id, @RequestBody UpdateEntryRequest updateEntryRequest) throws Exception{
        User user = getAuthenticatedUser();
        this.passwordEntryService.updateEntry(user, updateEntryRequest.getUsername(),updateEntryRequest.getPassword(),updateEntryRequest.getNotes(),id,AesKeyHolder.get());
        return ResponseEntity.noContent().build();
    }

    private User getAuthenticatedUser(){
        return (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
