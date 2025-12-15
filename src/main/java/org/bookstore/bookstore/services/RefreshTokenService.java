package org.bookstore.bookstore.services;


import lombok.AllArgsConstructor;
import org.bookstore.bookstore.entities.RefreshToken;
import org.bookstore.bookstore.entities.User;
import org.bookstore.bookstore.repositories.RefreshTokenRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@AllArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshToken create(User user , String deviceId,String userAgent)
    {
        RefreshToken refreshToken= new RefreshToken();
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setUser(user);
        refreshToken.setDeviceId(deviceId);
        refreshToken.setUserAgent(userAgent);
        refreshToken.setExpiryDate(LocalDateTime.now().plusMinutes(3));

        refreshTokenRepository.save(refreshToken);

        return  refreshToken;
    }

    public RefreshToken isValid(String token)
    {
        var refreshToken= refreshTokenRepository.findByToken(token)
                .orElseThrow(()->new RuntimeException("Invalid token (does not exist in db)"));

        if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new RuntimeException("Refresh token expired");
        }

        return refreshToken;
    }


    public void logoutAllDevices(User user)
    {
        refreshTokenRepository.deleteAllByUserId(user.getUserId());
    }

}
