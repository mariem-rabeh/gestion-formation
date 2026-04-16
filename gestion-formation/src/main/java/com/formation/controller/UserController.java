package com.formation.controller;

import com.formation.dto.CreateUserRequest;
import com.formation.model.User;
import com.formation.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET /api/admin/users
    @GetMapping
    public List<User> getAll() {
        return userService.findAll();
    }

    // GET /api/admin/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    // POST /api/admin/users — créer un user avec un rôle
    @PostMapping
    public ResponseEntity<User> create(@RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(userService.create(request));
    }

    // PUT /api/admin/users/{id}/role — changer le rôle d'un user
    @PutMapping("/{id}/role")
    public ResponseEntity<User> updateRole(@PathVariable Long id,
                                           @RequestParam String role) {
        return ResponseEntity.ok(userService.updateRole(id, role));
    }

    // PUT /api/admin/users/{id}
    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id,
                                       @RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(userService.update(id, request));
    }

    // DELETE /api/admin/users/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.ok("Utilisateur supprimé avec succès");
    }
}