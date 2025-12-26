CREATE TRIGGER after_order_confirm
    AFTER UPDATE
    ON PublisherOrders
    FOR EACH ROW
BEGIN
    IF NEW.Status = 'COMPLETED' AND OLD.Status <> 'COMPLETED' THEN
    UPDATE Books
    SET NumberOfBooks = NumberOfBooks + NEW.Quantity
    WHERE BookID = NEW.BookID;
END IF;
END;



CREATE PROCEDURE CompletePublisherOrder(IN p_order_id INT)
BEGIN
UPDATE PublisherOrders
SET Status = 'COMPLETED'
WHERE PublisherOrderID = p_order_id;
END ;





