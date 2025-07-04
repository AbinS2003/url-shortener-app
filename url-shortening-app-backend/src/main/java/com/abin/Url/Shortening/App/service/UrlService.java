package com.abin.Url.Shortening.App.service;

import com.abin.Url.Shortening.App.model.Url;
import com.abin.Url.Shortening.App.model.User;
import com.abin.Url.Shortening.App.repository.UrlRepository;
import com.abin.Url.Shortening.App.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;


@Service
public class UrlService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private UrlRepository repo;


    public Url createUrl(Url url) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (repo.countByUser(user) >= 5) {
            throw new RuntimeException("URL limit reached (max 5)");
        }

        url.setUser(user);
        url.setShortUrl(generateShortUrl());
        url.setCreatedAt(LocalDateTime.now());

        return repo.save(url);
    }

    private String generateShortUrl() {
        return UUID.randomUUID().toString().substring(0, 8);
    }


    public Page<Url> getUrls(User user, String search, Pageable pageable) {

        if (search == null || search.isBlank()) {
            return repo.findAllByUser(user, pageable);
        } else {
            return repo.searchByUserAndTitleOrOriginalUrl(user, search, pageable);
        }
    }
    public Optional<Url> getUrlById(Long id) {
        return repo.findById(id);
    }



    public Url updateUrl(Long id, Url updatedUrl) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Url existingUrl = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("URL not found"));

        if (!existingUrl.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        existingUrl.setTitle(updatedUrl.getTitle());
        existingUrl.setOriginalUrl(updatedUrl.getOriginalUrl());


        return repo.save(existingUrl);
    }

    public void deleteUrl(Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Url url = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("URL not found"));

        if (!url.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        repo.delete(url);
    }
}
