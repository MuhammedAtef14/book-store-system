ALTER TABLE Users
    ADD COLUMN EmailVerified BOOLEAN DEFAULT FALSE,
ADD COLUMN Enabled BOOLEAN DEFAULT FALSE;


CREATE TABLE EmailVerificationTokens (
        TokenID INT PRIMARY KEY AUTO_INCREMENT,
        Token VARCHAR(255) NOT NULL UNIQUE,
        UserID INT NOT NULL,
        ExpiryDate DATETIME NOT NULL,

       CONSTRAINT fk_email_verification_user
       FOREIGN KEY (UserID)
       REFERENCES Users(UserID)
       ON DELETE CASCADE
);
