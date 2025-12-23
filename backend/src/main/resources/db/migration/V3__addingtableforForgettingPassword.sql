create table ForgetPasswordTokens
(
    email      varchar(255) null,
    expiryDate DATETIME     null,
    OTP        varchar(255) null,
    constraint ChangePasswordTokens_pk
        unique (email),
    constraint ChangePasswordTokens_Users_Email_fk
        foreign key (email) references Users (Email)
            on update cascade on delete cascade
);

