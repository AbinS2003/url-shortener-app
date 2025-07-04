package com.abin.Url.Shortening.App.repository;

import com.abin.Url.Shortening.App.model.Url;
import com.abin.Url.Shortening.App.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UrlRepository extends JpaRepository<Url, Long> {
    Page<Url> findAllByUser(User user, Pageable pageable);
    @Query("SELECT u FROM Url u WHERE u.user = :user AND (LOWER(u.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.originalUrl) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Url> searchByUserAndTitleOrOriginalUrl(@Param("user") User user, @Param("search") String search, Pageable pageable);
    long countByUser(User user);
    Optional<Url> findByShortUrl(String shortUrl);

}