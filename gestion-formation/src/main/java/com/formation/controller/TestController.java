package com.formation.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {

    // ✅ Accessible par tout utilisateur connecté
    @GetMapping("/test")
    public String test(Authentication authentication) {
        return "Connecté : " + authentication.getName()
                + " | Rôles : " + authentication.getAuthorities();
    }

    // ✅ Accessible uniquement par ROLE_ADMIN
    @GetMapping("/admin/test")
    public String adminTest(Authentication authentication) {
        return "Bienvenue Admin : " + authentication.getName();
    }

    // ✅ Accessible uniquement par ROLE_USER
    @GetMapping("/user/test")
    public String userTest(Authentication authentication) {
        return "Bienvenue User : " + authentication.getName();
    }
}