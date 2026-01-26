package com.svrms.dto;

import com.svrms.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private Role role;
}
