package com.palma.password_manager.repository;

import com.palma.password_manager.model.PasswordEntry;
import com.palma.password_manager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PasswordEntryRepository extends JpaRepository<PasswordEntry, Long> {

    List<PasswordEntry> findByUser(User u);

}
