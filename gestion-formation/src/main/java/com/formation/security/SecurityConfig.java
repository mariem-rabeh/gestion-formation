package com.formation.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174", "http://localhost:5175"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        // ✅ Auth publique
                        .requestMatchers("/api/auth/**").permitAll()

                        // ✅ Gestion users — ADMIN uniquement
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // ✅ Stats — RESPONSABLE et ADMIN
                        .requestMatchers("/api/stats/**").hasAnyRole("RESPONSABLE", "ADMIN")

                        // ✅ Tables secondaires — lecture USER/ADMIN, écriture ADMIN
                        // GET accessible par tous les connectés, POST/PUT/DELETE réservés ADMIN
                        .requestMatchers("/api/domaines/**").hasAnyRole("USER", "ADMIN", "RESPONSABLE")
                        .requestMatchers("/api/profils/**").hasAnyRole("USER", "ADMIN", "RESPONSABLE")
                        .requestMatchers("/api/structures/**").hasAnyRole("USER", "ADMIN", "RESPONSABLE")
                        .requestMatchers("/api/employeurs/**").hasAnyRole("USER", "ADMIN", "RESPONSABLE")

                        // ✅ Formations, Formateurs, Participants — USER et ADMIN
                        .requestMatchers("/api/formations/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/formateurs/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/participants/**").hasAnyRole("USER", "ADMIN")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter,
                        org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}