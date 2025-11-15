package com.project_sgc_ultimate.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
