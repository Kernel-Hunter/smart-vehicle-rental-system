package com.svrms.exception;

public class ApiException extends RuntimeException {
    public ApiException(String message) {
        super(message);
    }
}
