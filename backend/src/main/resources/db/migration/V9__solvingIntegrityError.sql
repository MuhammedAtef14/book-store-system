
ALTER TABLE CartItems
DROP FOREIGN KEY CartItems_ibfk_1;

ALTER TABLE CartItems
DROP FOREIGN KEY CartItems_ibfk_2;


ALTER TABLE CartItems
    ADD CONSTRAINT CartItems_ibfk_1
        FOREIGN KEY (cart_id)
            REFERENCES Carts(cart_id)
            ON DELETE CASCADE;

ALTER TABLE CartItems
    ADD CONSTRAINT CartItems_ibfk_2
        FOREIGN KEY (book_id)
            REFERENCES Books(BookID)
            ON DELETE CASCADE;
