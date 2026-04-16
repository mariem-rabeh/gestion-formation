package com.formation.service;

import com.formation.dto.CreateUserRequest;
import com.formation.model.Role;
import com.formation.model.User;
import com.formation.repository.RoleRepository;
import com.formation.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé : " + id));
    }

    public User create(CreateUserRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email déjà utilisé : " + request.getEmail());
        }

        String roleName = request.getRole() != null ? request.getRole() : "ROLE_USER";
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Rôle non trouvé : " + roleName));

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Set.of(role));

        return userRepository.save(user);
    }

    public User update(Long id, CreateUserRequest request) {
        User existing = findById(id);

        // Vérifier email unique sauf pour le même user
        userRepository.findByEmail(request.getEmail()).ifPresent(u -> {
            if (!u.getId().equals(id)) {
                throw new RuntimeException("Email déjà utilisé : " + request.getEmail());
            }
        });

        existing.setEmail(request.getEmail());

        // Ne changer le mot de passe que s'il est fourni
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getRole() != null) {
            Role role = roleRepository.findByName(request.getRole())
                    .orElseThrow(() -> new RuntimeException("Rôle non trouvé : " + request.getRole()));
            existing.setRoles(Set.of(role));
        }

        return userRepository.save(existing);
    }

    public User updateRole(Long id, String roleName) {
        User user = findById(id);
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Rôle non trouvé : " + roleName));
        user.setRoles(Set.of(role));
        return userRepository.save(user);
    }

    public void delete(Long id) {
        findById(id);
        userRepository.deleteById(id);
    }
}