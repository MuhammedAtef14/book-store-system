package org.bookstore.bookstore.services.Authintication;


import lombok.AllArgsConstructor;
import org.bookstore.bookstore.entities.RefreshToken;
import org.bookstore.bookstore.entities.User;
import org.bookstore.bookstore.exceptions.BusinessException;
import org.bookstore.bookstore.repositories.RefreshTokenRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
        refreshToken.setExpiryDate(LocalDateTime.now().plusHours(5));

        refreshTokenRepository.save(refreshToken);

        return  refreshToken;
    }

    public RefreshToken isValid(String token)
    {
        var refreshToken= refreshTokenRepository.findByToken(token)
                .orElseThrow(()->new BusinessException("Invalid token (does not exist in db)"));
        //System.out.println("am hereee");

        if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Refresh token expired");
        }

        return refreshToken;
    }

    public void delete(RefreshToken refreshToken)
    {
        refreshTokenRepository.deleteAllByUserId(refreshToken.getUser().getUserId());
    }


    public void logoutAllDevices(Integer userId)
    {
        refreshTokenRepository.deleteAllByUserId(userId);
    }

}
