create table Authors
(
    AuthorID int auto_increment
        primary key,
    Name     varchar(255) not null
);

create table Publishers
(
    PublisherID int auto_increment
        primary key,
    Name        varchar(255) not null,
    Address     text         null,
    Phone       varchar(50)  null
);

create table Books
(
    BookID          int auto_increment
        primary key,
    ISBN            varchar(20)    null,
    Title           varchar(255)   not null,
    PublicationYear int            null,
    SellingPrice    decimal(10, 2) null,
    Category        varchar(100)   null,
    NumberOfBooks   int            null,
    MinimumQuantity int            null,
    PublisherID     int            not null,
    constraint ISBN
        unique (ISBN),
    constraint Books_ibfk_1
        foreign key (PublisherID) references Publishers (PublisherID)
);

create table BookAuthors
(
    BookID   int not null,
    AuthorID int not null,
    primary key (BookID, AuthorID),
    constraint BookAuthors_ibfk_1
        foreign key (BookID) references Books (BookID),
    constraint BookAuthors_ibfk_2
        foreign key (AuthorID) references Authors (AuthorID)
);

create index AuthorID
    on BookAuthors (AuthorID);

create index PublisherID
    on Books (PublisherID);

create table PublisherOrders
(
    PublisherOrderID int auto_increment
        primary key,
    Quantity         int         null,
    Status           varchar(50) null,
    BookID           int         not null,
    constraint PublisherOrders_ibfk_1
        foreign key (BookID) references Books (BookID)
);

create index BookID
    on PublisherOrders (BookID);

create table Users
(
    UserID          int auto_increment
        primary key,
    Username        varchar(255)                         not null,
    Password        varchar(255)                         not null,
    FirstName       varchar(100)                         null,
    LastName        varchar(100)                         null,
    Email           varchar(255)                         not null,
    Phone           varchar(50)                          null,
    ShippingAddress text                                 null,
    Role            enum ('Admin', 'Customer')           not null,
    email_verified  tinyint(1) default 0                 null,
    Enabled         tinyint(1) default 0                 null,
    created_at      datetime   default CURRENT_TIMESTAMP not null,
    constraint uq_users_email
        unique (Email)
);

create table BillingInfos
(
    BillingInfoID  int auto_increment
        primary key,
    CardNumber     varchar(50) not null,
    ExpirationDate date        null,
    BillingAddress text        null,
    UserID         int         not null,
    constraint BillingInfos_ibfk_1
        foreign key (UserID) references Users (UserID)
);

create index UserID
    on BillingInfos (UserID);

create table CustomerOrders
(
    CustomerOrderID int auto_increment
        primary key,
    OrderDate       datetime default CURRENT_TIMESTAMP null,
    Status          varchar(50)                        null,
    UserID          int                                not null,
    constraint CustomerOrders_ibfk_1
        foreign key (UserID) references Users (UserID)
);

create table CustomerOrderItems
(
    CustomerOrderID int            not null,
    BookID          int            not null,
    Quantity        int            null,
    Price           decimal(10, 2) null,
    primary key (CustomerOrderID, BookID),
    constraint CustomerOrderItems_ibfk_1
        foreign key (CustomerOrderID) references CustomerOrders (CustomerOrderID),
    constraint CustomerOrderItems_ibfk_2
        foreign key (BookID) references Books (BookID)
);

create index BookID
    on CustomerOrderItems (BookID);

create index UserID
    on CustomerOrders (UserID);

create table EmailVerificationTokens
(
    TokenID    int auto_increment
        primary key,
    Token      varchar(255) not null,
    UserID     int          not null,
    ExpiryDate datetime     not null,
    constraint Token
        unique (Token),
    constraint fk_email_verification_user
        foreign key (UserID) references Users (UserID)
            on delete cascade
);

create table RefreshTokens
(
    RefreshTokenID int auto_increment
        primary key,
    Token          varchar(255) not null,
    UserID         int          not null,
    DeviceID       varchar(255) null,
    UserAgent      text         null,
    ExpiryDate     datetime     not null,
    constraint Token
        unique (Token),
    constraint fk_refresh_user
        foreign key (UserID) references Users (UserID)
            on delete cascade
);

CREATE TABLE IF NOT EXISTS flyway_schema_history
(
    installed_rank int                                 not null
        primary key,
    version        varchar(50)                         null,
    description    varchar(200)                        not null,
    type           varchar(20)                         not null,
    script         varchar(1000)                       not null,
    checksum       int                                 null,
    installed_by   varchar(100)                        not null,
    installed_on   timestamp default CURRENT_TIMESTAMP not null,
    execution_time int                                 not null,
    success        tinyint(1)                          not null
);



