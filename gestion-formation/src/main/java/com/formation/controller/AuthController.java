package com.formation.controller;

import com.formation.model.Role;
import com.formation.model.User;
import com.formation.repository.RoleRepository;
import com.formation.repository.UserRepository;
import com.formation.security.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(UserRepository userRepository,
                          RoleRepository roleRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public String register(@RequestBody User user,
                           @RequestParam(defaultValue = "ROLE_USER") String role) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Role assignedRole = roleRepository.findByName(role)
                .orElseThrow(() -> new RuntimeException("Role not found: " + role));

        user.setRoles(Set.of(assignedRole));
        userRepository.save(user);

        return "User registered with role: " + role;
    }

    @PostMapping("/login")
    public String login(@RequestBody User request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // ✅ On passe l'objet User complet pour inclure les rôles dans le token
        return jwtUtils.generateToken(user);
    }
}