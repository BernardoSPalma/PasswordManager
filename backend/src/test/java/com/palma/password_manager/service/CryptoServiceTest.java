package com.palma.password_manager.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;

public class CryptoServiceTest {

    private CryptoService cryptoService;

    @BeforeEach
    void SetUp(){
        cryptoService = new CryptoService();
    }

    //GenerateSalt tests
    @Test
    void saltShouldHave16Bytes(){
        byte[] salt = cryptoService.generateSalt();
        assertEquals(16, salt.length);
    }

    @Test
    void twoSaltsShouldBeDifferent(){
        byte[] salt1 = cryptoService.generateSalt();
        byte[] salt2 = cryptoService.generateSalt();
        assertFalse(Arrays.equals(salt1,salt2));
    }

    //DeriveAESKey tests
    @Test
    void KeyShouldNotBeNull() throws Exception{
        byte[] salt = cryptoService.generateSalt();
        SecretKey aesKey = cryptoService.deriveAESKey("password".toCharArray(),salt);
        assertNotNull(aesKey);
    }

    @Test
    void derivedKeyShouldHaveAesAlgorithm() throws Exception{
        byte[] salt = cryptoService.generateSalt();
        SecretKey key = cryptoService.deriveAESKey("password".toCharArray(), salt);
        assertEquals("AES", key.getAlgorithm());
    }

    @Test
    void samePasswordAndSaltShouldGenerateSameKey() throws Exception{
        byte[] salt = cryptoService.generateSalt();
        SecretKey key1 = cryptoService.deriveAESKey("password".toCharArray(),salt);
        SecretKey key2 = cryptoService.deriveAESKey("password".toCharArray(),salt);
        assertArrayEquals(key1.getEncoded(), key2.getEncoded());
    }

    @Test
    void diferentSaltsShouldGenerateDiferentKeys() throws Exception{
        byte[] salt1 = cryptoService.generateSalt();
        byte[] salt2 = cryptoService.generateSalt();
        SecretKey key1 = cryptoService.deriveAESKey("password".toCharArray(),salt1);
        SecretKey key2 = cryptoService.deriveAESKey("password".toCharArray(),salt2);
        assertFalse(Arrays.equals(key1.getEncoded(), key2.getEncoded()));
    }

    //Encrypt tests
    @Test
    void encryptedDataShouldNotBeTheSameAsOriginals() throws Exception{
        byte[] salt = cryptoService.generateSalt();
        SecretKey key = cryptoService.deriveAESKey("password".toCharArray(),salt);
        byte[] original = "OriginalData".getBytes(StandardCharsets.UTF_8);
        byte[] encrypted = cryptoService.encryptData(original, key);
        assertFalse(Arrays.equals(original, encrypted));
    }

    @Test
    void encryptDataTwiceShouldResultInDiferentResults() throws Exception{
        byte[] salt = cryptoService.generateSalt();
        SecretKey key = cryptoService.deriveAESKey("password".toCharArray(),salt);
        byte[] original = "OriginalData".getBytes(StandardCharsets.UTF_8);
        byte[] encrypted1 = cryptoService.encryptData(original, key);
        byte[] encrypted2 = cryptoService.encryptData(original, key);
        assertFalse(Arrays.equals(encrypted1,encrypted2));
    }

    //Decrypt tests
    @Test
    void decryptShoudReturnTheSameResult() throws Exception{
        byte[] salt = cryptoService.generateSalt();
        SecretKey key = cryptoService.deriveAESKey("password".toCharArray(),salt);
        String original = "OriginalData";
        byte[] encrypted = cryptoService.encryptData(original.getBytes(StandardCharsets.UTF_8), key);
        byte[] decrypted = cryptoService.decryptData(encrypted, key);
        assertEquals(original, new String(decrypted, StandardCharsets.UTF_8));
    }

    @Test
    void decryptWithWrongKeyShouldThrowException() throws Exception{
        byte[] salt1 = cryptoService.generateSalt();
        byte[] salt2 = cryptoService.generateSalt();
        SecretKey correctKey = cryptoService.deriveAESKey("password".toCharArray(), salt1);
        SecretKey wrongKey = cryptoService.deriveAESKey("password".toCharArray(), salt2);
        byte[] encrypted = cryptoService.encryptData("OriginalData".getBytes(StandardCharsets.UTF_8), correctKey);
        assertThrows(Exception.class, () -> cryptoService.decryptData(encrypted, wrongKey));
    }

    @Test
    void decryptWithWrongPasswordShouldThrowException() throws Exception{
        byte[] salt = cryptoService.generateSalt();
        SecretKey correctKey = cryptoService.deriveAESKey("correctPassword".toCharArray(), salt);
        SecretKey wrongKey = cryptoService.deriveAESKey("wrongPassword".toCharArray(), salt);
        byte[] encrypted = cryptoService.encryptData("OriginalData".getBytes(StandardCharsets.UTF_8), correctKey);
        assertThrows(Exception.class, () -> cryptoService.decryptData(encrypted, wrongKey));
    }


}
