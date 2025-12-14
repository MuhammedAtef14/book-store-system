CREATE TABLE Authors (
                         AuthorID INT PRIMARY KEY AUTO_INCREMENT,
                         Name VARCHAR(255) NOT NULL
);


CREATE TABLE Publishers (
                            PublisherID INT PRIMARY KEY AUTO_INCREMENT,
                            Name VARCHAR(255) NOT NULL,
                            Address TEXT,
                            Phone VARCHAR(50)
);


CREATE TABLE Users (
                       UserID INT PRIMARY KEY AUTO_INCREMENT,
                       Username VARCHAR(255) NOT NULL,
                       Password VARCHAR(255) NOT NULL,
                       FirstName VARCHAR(100),
                       LastName VARCHAR(100),
                       Email VARCHAR(255),
                       Phone VARCHAR(50),
                       ShippingAddress TEXT,
                       Role ENUM('Admin', 'Customer') NOT NULL
);


CREATE TABLE BillingInfos (
                              BillingInfoID INT PRIMARY KEY AUTO_INCREMENT,
                              CardNumber VARCHAR(50) NOT NULL,
                              ExpirationDate DATE,
                              BillingAddress TEXT,
                              UserID INT NOT NULL,
                              FOREIGN KEY (UserID) REFERENCES Users(UserID)
);


CREATE TABLE Books (
                       BookID INT PRIMARY KEY AUTO_INCREMENT,
                       ISBN VARCHAR(20) UNIQUE,
                       Title VARCHAR(255) NOT NULL,
                       PublicationYear INT,
                       SellingPrice DECIMAL(10, 2),
                       Category VARCHAR(100),
                       NumberOfBooks INT,
                       MinimumQuantity INT,
                       PublisherID INT NOT NULL,
                       FOREIGN KEY (PublisherID) REFERENCES Publishers(PublisherID)
);


CREATE TABLE CustomerOrders (
                                CustomerOrderID INT PRIMARY KEY AUTO_INCREMENT,
                                OrderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
                                Status VARCHAR(50),
                                UserID INT NOT NULL,
                                FOREIGN KEY (UserID) REFERENCES Users(UserID)
);


CREATE TABLE BookAuthors (
                             BookID INT NOT NULL,
                             AuthorID INT NOT NULL,
                             PRIMARY KEY (BookID, AuthorID),
                             FOREIGN KEY (BookID) REFERENCES Books(BookID),
                             FOREIGN KEY (AuthorID) REFERENCES Authors(AuthorID)
);


CREATE TABLE PublisherOrders (
                                 PublisherOrderID INT PRIMARY KEY AUTO_INCREMENT,
                                 Quantity INT,
                                 Status VARCHAR(50),
                                 BookID INT NOT NULL,
                                 FOREIGN KEY (BookID) REFERENCES Books(BookID)
);

CREATE TABLE CustomerOrderItems (
                                    CustomerOrderID INT NOT NULL,
                                    BookID INT NOT NULL,
                                    Quantity INT,
                                    Price DECIMAL(10, 2),
                                    PRIMARY KEY (CustomerOrderID, BookID),
                                    FOREIGN KEY (CustomerOrderID) REFERENCES CustomerOrders(CustomerOrderID),
                                    FOREIGN KEY (BookID) REFERENCES Books(BookID)
);