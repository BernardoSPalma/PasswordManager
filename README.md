# Password Manager

A full-stack password manager application built with security as a core principle. This project was developed as a portfolio piece to demonstrate knowledge of secure software development, cryptography, and modern web technologies.

## Tech Stack

**Backend:** Java 21, Spring Boot 3.5, Spring Security, Spring Data JPA
**Frontend:** React Native, TypeScript, Expo
**Database:** PostgreSQL
**Infrastructure:** Docker

## Security Architecture

Passwords are never stored in plain text. The application uses a two-layer security model:

- **Master password** is hashed with BCrypt and never stored — only a one-way hash is kept in the database
- **Stored passwords** are encrypted with AES-256-GCM, an authenticated encryption algorithm that guarantees both confidentiality and integrity
- **Encryption key** is never stored — it is derived from the master password at login time using PBKDF2 with HMAC-SHA256 (310,000 iterations as per OWASP 2024 recommendations)
- If the database is compromised, no passwords can be decrypted without knowing the master password

## Status

🚧 Currently in active development

- [x] Database setup and JPA entities
- [x] AES-256-GCM encryption service
- [x] User registration and authentication with JWT
- [x] Password entry CRUD operations
- [ ] React frontend
- [ ] Docker setup
- [ ] Production deployment
