package com.palma.password_manager.security;

import javax.crypto.SecretKey;

public class AesKeyHolder {
    private final static ThreadLocal<SecretKey> localThread = new ThreadLocal<>();

    public static void set(SecretKey key){
        localThread.set(key);
    }

    public static SecretKey get(){
        return localThread.get();
    }

    public static void clear(){
        localThread.remove();
    }
}
