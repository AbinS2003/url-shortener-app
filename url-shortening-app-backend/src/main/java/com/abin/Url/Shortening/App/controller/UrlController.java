package com.abin.Url.Shortening.App.controller;

import com.abin.Url.Shortening.App.model.Url;
import com.abin.Url.Shortening.App.model.User;
import com.abin.Url.Shortening.App.repository.UserRepository;
import com.abin.Url.Shortening.App.service.UrlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

//@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/urls")
public class UrlController {

    @Autowired
    private UrlService urlService;

    @Autowired
    private UserRepository userRepository;

    // Create a new short URL
    @PostMapping
    public ResponseEntity<?> createUrl(@RequestBody Url url) {
        try {
            Url created = urlService.createUrl(url);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // List URLs with pagination and optional search by title or original URL
    @GetMapping
    public ResponseEntity<?> listUrls(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Url> urls = urlService.getUrls(userOpt.get(), search, pageable);
        return ResponseEntity.ok(urls);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getUrlById(@PathVariable Long id) {
        Optional<Url> urlOptional = urlService.getUrlById(id);
        if (urlOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(urlOptional.get());
    }


    // Update a URL by id
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUrl(@PathVariable Long id, @RequestBody Url urlDetails) {
        try {
            Url updatedUrl = urlService.updateUrl(id, urlDetails);
            return ResponseEntity.ok(updatedUrl);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete a URL by id
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUrl(@PathVariable Long id) {
        try {
            urlService.deleteUrl(id);
            return ResponseEntity.ok("Deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
