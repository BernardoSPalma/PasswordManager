package com.palma.password_manager.service;

import com.palma.password_manager.model.User;
import com.palma.password_manager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.LocalDateTime;

@Service
public class UserService {

    private final static int LOG_ROUNDS = 12;

    private final UserRepository userRepository;
    private final CryptoService cryptoService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(LOG_ROUNDS);

    @Autowired
    public UserService(UserRepository userRepository, CryptoService cryptoService){
        this.userRepository = userRepository;
        this.cryptoService = cryptoService;
    }

    public void register(String email, String password){
        checkNewEmail(email);
        byte[] userSalt = createSalt();
        String hashPassword = hashPassword(password);
        User user = createUser(email, hashPassword, userSalt);
        userRepository.save(user);
    }

    public SecretKey authenticate(String password, String email) throws Exception{
        User user = checkOldEmail(email);
        checkHashWithPassword(user.getPasswordHash(), password);
        return cryptoService.deriveAESKey(password.toCharArray(), user.getKdfSalt());
    }

    private User createUser(String email, String hashPassword, byte[] userSalt){
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(hashPassword);
        user.setKdfSalt(userSalt);
        user.setCreatedAt(LocalDateTime.now());
        return user;
    }

    private void checkNewEmail(String email){
        User user = userRepository.findByEmail(email);
        if(user != null){
            throw new IllegalArgumentException("Email already in use");
        }
    }

    private User checkOldEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("Email does not exists in DataBase");
        }
        return user;
    }

    private byte[] createSalt(){
        return cryptoService.generateSalt();
    }

    private String hashPassword(String password){
        return passwordEncoder.encode(password);
    }

    private void checkHashWithPassword(String hashPassword, String cleanPassword){
        if(!passwordEncoder.matches(cleanPassword, hashPassword)){
            throw new BadCredentialsException("Invalid Password");
        }
    }
}
