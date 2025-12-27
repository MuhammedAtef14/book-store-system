CREATE TRIGGER after_book_update
    AFTER UPDATE
    ON Books
    FOR EACH ROW
BEGIN
    DECLARE order_quantity INT DEFAULT 10; -- predefined order quantity

    IF OLD.NumberOfBooks >= OLD.MinimumQuantity AND NEW.NumberOfBooks < NEW.MinimumQuantity THEN
        INSERT INTO PublisherOrders (BookID, Quantity, Status)
        VALUES (NEW.BookID, order_quantity, 'PENDING');
END IF;
END;


CREATE PROCEDURE UpdateBookDetails(
    IN p_bookId INT,
    IN p_title VARCHAR(255),
    IN p_year INT,
    IN p_price DECIMAL(10, 2),
    IN p_category VARCHAR(100)
)
BEGIN
UPDATE Books
SET Title = p_title,
    PublicationYear = p_year,
    SellingPrice = p_price,
    Category = p_category
WHERE BookID = p_bookId;
END ;




