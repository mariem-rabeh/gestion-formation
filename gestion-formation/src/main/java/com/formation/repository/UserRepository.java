package com.formation.repository;

import com.formation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // ✅ JOIN FETCH roles : évite la double requête SELECT à chaque authentification
    //    (user SELECT + user_roles SELECT → fusionnés en une seule requête)
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);
}
