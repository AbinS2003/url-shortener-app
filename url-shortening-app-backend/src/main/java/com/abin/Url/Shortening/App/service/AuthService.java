package com.abin.Url.Shortening.App.service;

import com.abin.Url.Shortening.App.security.JwtUtil;
import com.abin.Url.Shortening.App.model.User;
import com.abin.Url.Shortening.App.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepo;
    @Autowired private PasswordEncoder encoder;
    @Autowired private JwtUtil jwtUtil;

    public String signup(User user) {
        if (userRepo.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }
        user.setPassword(encoder.encode(user.getPassword()));
        userRepo.save(user);
        return jwtUtil.generateToken(user.getEmail());
    }

    public String login(String email, String password) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        if (!encoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        return jwtUtil.generateToken(email);
    }
}
