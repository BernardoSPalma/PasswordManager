package com.palma.password_manager.service;

import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Arrays;

@Service
public class CryptoService {

    private final static int SALT_SIZE = 16;
    private final static int IV_SIZE = 12;
    private final static int KEY_SIZE = 256;
    private final static int PBKDF2_ITERATIONS = 310000;
    private final static int GCM_TAG_SIZE = 128;
    private final static String PBKDF2_ALGORTIHM = "PBKDF2WithHmacSHA256";
    private final static String AES_ALGORTIHM = "AES/GCM/NoPadding";

    public byte[] generateSalt(){
        byte[] salt = new byte[SALT_SIZE];
        new SecureRandom().nextBytes(salt);
        return salt;
    }

    public SecretKey deriveAESKey(char[] masterPassword, byte[] salt) throws Exception{
        PBEKeySpec pbeKeySpec = new PBEKeySpec(masterPassword, salt, PBKDF2_ITERATIONS, KEY_SIZE);
        SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(PBKDF2_ALGORTIHM);
        SecretKey secretKey = keyFactory.generateSecret(pbeKeySpec);
        return new SecretKeySpec(secretKey.getEncoded(), "AES");
    }

    private byte[] generateIV(){
        byte[] iv = new byte[IV_SIZE];
        new SecureRandom().nextBytes(iv);
        return iv;
    }

    public byte[] encryptData(byte[] data, SecretKey aesKey) throws Exception{
        byte[] iv = generateIV();
        //Cipher
        Cipher cipher = Cipher.getInstance(AES_ALGORTIHM);
        cipher.init(Cipher.ENCRYPT_MODE, aesKey, new GCMParameterSpec(GCM_TAG_SIZE,iv));
        byte[] encryptedData = cipher.doFinal(data);
        //Store IV and the data together on one byte array
        return concatenateIVandData(iv, encryptedData);
    }

    private byte[] concatenateIVandData(byte[] iv, byte[] encryptedData){
        byte[] finalResult = new byte[IV_SIZE + encryptedData.length];
        System.arraycopy(iv,0, finalResult, 0, IV_SIZE);
        System.arraycopy(encryptedData, 0, finalResult, IV_SIZE, encryptedData.length);
        return finalResult;
    }

    public byte[] decryptData(byte[] encryptedData, SecretKey aesKey) throws Exception{
        //Get IV and Data Separately
        byte[] iv = splitIV(encryptedData);
        byte[] data = splitData(encryptedData);
        //Cipher
        Cipher cipher = Cipher.getInstance(AES_ALGORTIHM);
        cipher.init(Cipher.DECRYPT_MODE, aesKey, new GCMParameterSpec(GCM_TAG_SIZE,iv));
        return cipher.doFinal(data);
    }

    private byte[] splitIV(byte[] encryptedData){
        return Arrays.copyOfRange(encryptedData, 0, IV_SIZE);
    }

    private byte[] splitData(byte[] encryptedData){
        return Arrays.copyOfRange(encryptedData, IV_SIZE, encryptedData.length);
    }
}
