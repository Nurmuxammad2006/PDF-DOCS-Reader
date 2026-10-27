package com.example.pdfdocsopener.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            CorsConfigurationSource corsConfigurationSource
    ) throws Exception {
        http
                // Enable CORS so Spring Security doesn't block preflight OPTIONS requests
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                // Disable CSRF since this is a REST API interacting with a React frontend / Telegram Mini App
                .csrf(csrf -> csrf.disable())
                // Configure endpoint authorization rules
                .authorizeHttpRequests(auth -> auth
                        // Allow all requests to /api/files/** endpoints (upload and fetch) without authentication
                        .requestMatchers("/api/files/**").permitAll()
                        .requestMatchers("/api/settings/**").permitAll()
                        // Uploaded documents are served to the file viewer
                        .requestMatchers("/uploads/**").permitAll()
                        // Any other requests require authentication (if any)
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}