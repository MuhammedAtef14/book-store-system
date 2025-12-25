DELIMITER
//

-- ======================================================
-- 1. Prevent negative stock when updating a book
-- ======================================================
CREATE TRIGGER before_book_update
    BEFORE UPDATE
    ON Books
    FOR EACH ROW
BEGIN
    IF NEW.NumberOfBooks < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock cannot be negative!';
END IF;
END;
//

-- ======================================================
-- 2. Automatically place order when stock falls below threshold
-- ======================================================
CREATE TRIGGER after_book_update
    AFTER UPDATE
    ON Books
    FOR EACH ROW
BEGIN
    DECLARE order_quantity INT DEFAULT 10; -- predefined order quantity

    IF OLD.NumberOfBooks >= OLD.MinimumQuantity AND NEW.NumberOfBooks < NEW.MinimumQuantity THEN
        INSERT INTO PublisherOrders (BookID, Quantity, Status)
        VALUES (NEW.BookID, order_quantity, 'Pending');
END IF;
END;
//

-- ======================================================
-- 3. Confirm Publisher Order and update Book stock
-- ======================================================
CREATE TRIGGER after_order_confirm
    AFTER UPDATE
    ON PublisherOrders
    FOR EACH ROW
BEGIN
    IF NEW.Status = 'Confirmed' AND OLD.Status <> 'Confirmed' THEN
    UPDATE Books
    SET NumberOfBooks = NumberOfBooks + NEW.Quantity
    WHERE BookID = NEW.BookID;
END IF;
END;
//

-- ======================================================
-- 4. Update CustomerOrder TotalPrice automatically
-- ======================================================
CREATE TRIGGER after_order_item_insert
    AFTER INSERT
    ON CustomerOrderItems
    FOR EACH ROW
BEGIN
    UPDATE CustomerOrders
    SET TotalPrice = TotalPrice + NEW.Price * NEW.Quantity
    WHERE CustomerOrderID = NEW.CustomerOrderID;
END;
//

-- ======================================================
-- 5. Deduct Book stock when a customer places an order
-- ======================================================
CREATE TRIGGER after_customer_order_item
    AFTER INSERT
    ON CustomerOrderItems
    FOR EACH ROW
BEGIN
    UPDATE Books
    SET NumberOfBooks = NumberOfBooks - NEW.Quantity
    WHERE BookID = NEW.BookID;

    IF (
    SELECT NumberOfBooks
    FROM Books
    WHERE BookID = NEW.BookID) < 0 THEN
        SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Cannot complete order. Not enough stock!';
END IF;
END;
//

-- ======================================================
-- 6. Clear Cart on User Logout (simulate deletion)
-- ======================================================
CREATE TRIGGER before_user_delete
    BEFORE DELETE
    ON Users
    FOR EACH ROW
BEGIN
    DELETE
    FROM CartItems
    WHERE cart_id IN (SELECT cart_id FROM Carts WHERE user_id = OLD.UserID);

    DELETE FROM Carts WHERE user_id = OLD.UserID;
END;
//

-- ======================================================
-- 7. Enforce allowed categories on Books
-- ======================================================
CREATE TRIGGER before_book_insert
    BEFORE INSERT
    ON Books
    FOR EACH ROW
BEGIN
    IF NEW.Category NOT IN ('Science', 'Art', 'Religion', 'History', 'Geography', 'Fantasy', 'Dystopian', 'Technology', 'Classic', 'Education', 'Science Fiction') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid book category!';
END IF;
END;
//

CREATE TRIGGER before_book_update_category
    BEFORE UPDATE
    ON Books
    FOR EACH ROW
BEGIN
    IF NEW.Category NOT IN ('Science', 'Art', 'Religion', 'History', 'Geography', 'Fantasy', 'Dystopian', 'Technology', 'Classic', 'Education', 'Science Fiction') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid book category!';
END IF;
END;
//

DELIMITER ;
