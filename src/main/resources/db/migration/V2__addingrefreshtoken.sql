ALTER TABLE Users
    MODIFY Email VARCHAR(255) NOT NULL;

ALTER TABLE Users
    ADD CONSTRAINT uq_users_email UNIQUE (Email);


CREATE TABLE RefreshTokens (
                               RefreshTokenID INT PRIMARY KEY AUTO_INCREMENT,
                               Token VARCHAR(255) NOT NULL UNIQUE,
                               UserID INT NOT NULL,
                               DeviceID VARCHAR(255),
                               UserAgent TEXT,
                               ExpiryDate DATETIME NOT NULL,

                               CONSTRAINT fk_refresh_user
                                   FOREIGN KEY (UserID)
                                       REFERENCES Users(UserID)
                                       ON DELETE CASCADE
);

