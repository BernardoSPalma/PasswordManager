package com.palma.password_manager.service;

import com.palma.password_manager.dto.PasswordEntryDTO;
import com.palma.password_manager.model.PasswordEntry;
import com.palma.password_manager.model.User;
import com.palma.password_manager.repository.PasswordEntryRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PasswordEntryService {

    private final PasswordEntryRepository passwordEntryRepository;
    private final CryptoService cryptoService;
    
    public PasswordEntryService(CryptoService cryptoService, PasswordEntryRepository passwordEntryRepository){
        this.cryptoService = cryptoService;
        this.passwordEntryRepository = passwordEntryRepository;
    }

    public void createNewEntry(User user, String username, String password, String url, String notes, String serviceName, SecretKey key) throws Exception{
        byte[] encryptedUsername = cryptoService.encryptData(username.getBytes(StandardCharsets.UTF_8),key);
        byte[] encryptedPassword = cryptoService.encryptData(password.getBytes(StandardCharsets.UTF_8),key);
        byte[] encryptedNotes = notes != null ? cryptoService.encryptData(notes.getBytes(StandardCharsets.UTF_8),key) : null;
        PasswordEntry entry = createPasswordEntry(user, encryptedUsername, encryptedPassword, encryptedNotes, url, serviceName);
        passwordEntryRepository.save(entry);
    }

    public List<PasswordEntry> getAllEntriesByUser(User user){
        return passwordEntryRepository.findByUser(user);
    }

    public PasswordEntryDTO decryptEntry(User user, long entryId, SecretKey key) throws Exception{
        PasswordEntry dataToDecrypt = passwordEntryRepository.findById(entryId).orElseThrow(() -> new IllegalArgumentException("Entry not found"));
        checkEntryBelongToUser(user, dataToDecrypt);
        String username = new String(cryptoService.decryptData(dataToDecrypt.getUsernameEncrypted(),key), StandardCharsets.UTF_8);
        String password = new String(cryptoService.decryptData(dataToDecrypt.getPasswordEncrypted(),key),StandardCharsets.UTF_8);
        String notes  = dataToDecrypt.getNotesEncrypted() != null
                ? new String(cryptoService.decryptData(dataToDecrypt.getNotesEncrypted(),key),StandardCharsets.UTF_8)
                : null;
        return new PasswordEntryDTO(dataToDecrypt.getId(), dataToDecrypt.getName(), username, password, dataToDecrypt.getUrl(), notes, dataToDecrypt.getCreatedAt(), dataToDecrypt.getUpdatedAt());
    }

    public void updateEntry(User user, String newUsername, String newPassword, String newNotes, long entryId, SecretKey key) throws Exception{
        PasswordEntry dataToUpdate = passwordEntryRepository.findById(entryId).orElseThrow(() -> new IllegalArgumentException("Entry not found"));
        checkEntryBelongToUser(user, dataToUpdate);
        byte[] encryptedUsername = newUsername != null
                ? cryptoService.encryptData(newUsername.getBytes(StandardCharsets.UTF_8),key)
                :null;
        byte[] encryptedPassword = newPassword != null
                ? cryptoService.encryptData(newPassword.getBytes(StandardCharsets.UTF_8),key)
                : null;
        if(encryptedUsername != null){
            dataToUpdate.setUsernameEncrypted(encryptedUsername);
        }
        if(encryptedPassword != null){
            dataToUpdate.setPasswordEncrypted(encryptedPassword);
        }
        if(newNotes != null){
            if(newNotes.isEmpty()){
                dataToUpdate.setNotesEncrypted(null);
            }
            else{
                byte[] encryptedNotes = cryptoService.encryptData(newNotes.getBytes(StandardCharsets.UTF_8),key);
                dataToUpdate.setNotesEncrypted(encryptedNotes);
            }
        }
        dataToUpdate.setUpdatedAt(LocalDateTime.now());
        passwordEntryRepository.save(dataToUpdate);
    }

    public void deleteEntry(User user, Long entryId){
        PasswordEntry dataToDelete = passwordEntryRepository.findById(entryId).orElseThrow(() -> new IllegalArgumentException("Entry not found"));
        checkEntryBelongToUser(user,dataToDelete);
        passwordEntryRepository.delete(dataToDelete);
    }

    private void checkEntryBelongToUser(User user, PasswordEntry entry){
        if(!entry.getUser().getId().equals(user.getId())){
            throw new BadCredentialsException("This entrys does not belong to the user");
        }
    }

    private PasswordEntry createPasswordEntry(User user, byte[] encryptedUsername, byte[] encryptedPassword, byte[] encryptedNotes, String url, String serviceName){
        PasswordEntry entry = new PasswordEntry();
        entry.setUser(user);
        entry.setUsernameEncrypted(encryptedUsername);
        entry.setPasswordEncrypted(encryptedPassword);
        entry.setNotesEncrypted(encryptedNotes);
        entry.setUrl(url);
        entry.setName(serviceName);
        entry.setCreatedAt(LocalDateTime.now());
        entry.setUpdatedAt(LocalDateTime.now());
        return entry;
    }
}
