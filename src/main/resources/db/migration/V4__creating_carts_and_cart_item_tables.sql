CREATE TABLE Carts (
                       cart_id INT AUTO_INCREMENT PRIMARY KEY,
                       user_id INT,
                       FOREIGN KEY (user_id) REFERENCES Users(UserID)
);


CREATE TABLE CartItems (
                            cart_id INT NOT NULL,
                            book_id INT NOT NULL,
                            quantity INT DEFAULT 1,
                            PRIMARY KEY (cart_id, book_id),
                            FOREIGN KEY (cart_id) REFERENCES Carts(cart_id),
                            FOREIGN KEY (book_id) REFERENCES Books(BookID)
);






