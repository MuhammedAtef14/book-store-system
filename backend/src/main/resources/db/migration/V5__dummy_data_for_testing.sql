-- =============================================
-- 1. Insert Publishers (WITH EXPLICIT IDs)
-- =============================================
INSERT INTO Publishers (PublisherID, Name, Address, Phone) VALUES
                                                               (1, 'Penguin Random House', '1745 Broadway, New York, NY', '+1-212-782-9000'),
                                                               (2, 'HarperCollins', '195 Broadway, New York, NY', '+1-212-207-7000'),
                                                               (3, 'O Reilly Media', '1005 Gravenstein Hwy N, Sebastopol, CA', '+1-707-827-7000'),
                                                               (4, 'Addison-Wesley Professional', '501 Boylston St, Boston, MA', '+1-617-671-3000'),
                                                               (5, 'MIT Press', '1 Rogers St, Cambridge, MA', '+1-617-253-5646');

-- =============================================
-- 2. Insert Authors (WITH EXPLICIT IDs)
-- =============================================
INSERT INTO Authors (AuthorID, Name) VALUES
                                         (1, 'J.K. Rowling'),
                                         (2, 'George Orwell'),
                                         (3, 'Robert C. Martin'),
                                         (4, 'F. Scott Fitzgerald'),
                                         (5, 'Erich Gamma'),
                                         (6, 'Richard Helm'),
                                         (7, 'Ralph Johnson'),
                                         (8, 'John Vlissides'),
                                         (9, 'Frank Herbert'),
                                         (10, 'Thomas H. Cormen');

-- =============================================
-- 3. Insert Books (Now safe because IDs 1-5 are guaranteed)
-- =============================================
INSERT INTO Books (BookID, ISBN, Title, PublicationYear, SellingPrice, Category, NumberOfBooks, MinimumQuantity, PublisherID) VALUES
                                                                                                                                  (1, '978-0439708180', 'Harry Potter and the Sorcerers Stone', 1997, 20.00, 'Fantasy', 100, 10, 1),
                                                                                                                                  (2, '978-0451524935', '1984', 1949, 15.50, 'Dystopian', 50, 5, 1),
                                                                                                                                  (3, '978-0132350884', 'Clean Code', 2008, 45.00, 'Technology', 30, 2, 3),
                                                                                                                                  (4, '978-0743273565', 'The Great Gatsby', 1925, 12.99, 'Classic', 75, 5, 2),
                                                                                                                                  (5, '978-0201633610', 'Design Patterns', 1994, 54.99, 'Technology', 40, 5, 4),
                                                                                                                                  (6, '978-0441013593', 'Dune', 1965, 18.00, 'Science Fiction', 150, 20, 1),
                                                                                                                                  (7, '978-0262033848', 'Introduction to Algorithms', 2009, 95.00, 'Education', 20, 10, 5),
                                                                                                                                  (8, '978-0743273577', 'The Great Gatsby (Limited)', 1925, 250.00, 'Classic', 2, 5, 2);

-- =============================================
-- 4. Users (WITH EXPLICIT IDs)
-- =============================================
INSERT INTO Users (UserID, Username, Password, FirstName, LastName, Email, Phone, Role, email_verified, Enabled) VALUES
                                                                                                                     (1, 'admin_user', '$2a$10$DOWSDz/mFpMvqqiz.7417.FLT51F.5/12345abcdef12345abcde', 'Admin', 'User', 'admin@bookstore.com', '1234567890', 'ADMIN', 1, 1),
                                                                                                                     (2, 'john_doe', '$2a$10$DOWSDz/mFpMvqqiz.7417.FLT51F.5/12345abcdef12345abcde', 'John', 'Doe', 'john.doe@example.com', '0987654321', 'CUSTOMER', 1, 1),
                                                                                                                     (3, 'jane_smith', '$2a$10$DOWSDz/mFpMvqqiz.7417.FLT51F.5/12345abcdef12345abcde', 'Jane', 'Smith', 'jane.smith@example.com', '5551234567', 'CUSTOMER', 0, 1),
                                                                                                                     (4, 'new_user_1', '$2a$10$DOWSDz/mFpMvqqiz.7417.FLT51F.5/12345abcdef12345abcde', 'New', 'User', 'newbie@example.com', '1112223333', 'CUSTOMER', 0, 1),
                                                                                                                     (5, 'book_worm', '$2a$10$DOWSDz/mFpMvqqiz.7417.FLT51F.5/12345abcdef12345abcde', 'Sarah', 'Connor', 'sarah@skynet.com', '9998887777', 'CUSTOMER', 1, 1);