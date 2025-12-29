# Online Bookstore System
**Database Systems Project - Fall 2025** *Faculty of Engineering, Alexandria University*

## 👥 Team Members

| Name | ID | Role |
| :--- | :--- | :--- |
| **Mohamed Atef** | 8660 | Customer Management & Security |
| **Eyad Mohamed** | 8744 | Frontend Development |
| **Abdelrahman Reda** | 8716 | Backend: Books Management & Publisher Orders |
| **Omar Adel** | 8746 | Backend: Cart & Customer Order Management |

---

## 📖 Project Overview
This project is a comprehensive **Online Bookstore System** designed to support two distinct user hierarchies: **Administrators** and **Customers**. It manages core relational entities including Books, Publishers, Stock Inventory, Orders, Sales Transactions, and User Accounts. 

A key focus of the implementation was ensuring **data integrity** and automating business logic through the use of **Database Triggers, Stored Procedures, and Integrity Constraints**.

---

## 🚀 Features & Implementation

### 1. User Authentication & Security
**Developer:** Mohamed Atef

The system implements a secure authentication layer. Access is strictly role-based, ensuring Customers cannot access Admin dashboards.
* **Registration Logic:** Captures user data and executes checks against the `Customer` table to ensure the `Email` and `Username` are unique.
* **Security:** Passwords are hashed before storage.
* **Session Management:** Generates session tokens persisting user ID and Role.

![Login Screen](<img width="502" height="670" alt="Screenshot from 2025-12-27 04-18-28" src="https://github.com/user-attachments/assets/3f743583-be02-4280-a433-7363571df74f" />
)
*Figure 1: User Login Interface*

![Register Screen](Screenshot%20from%202025-12-27%2003-57-10.png)
*Figure 2: Customer Registration Form*

![Database Verification](Screenshot%20from%202025-12-27%2004-00-37.png)
*Figure 3: Database Verification - Customer Record Insertion*

---

### 2. Customer Profile Management
**Developer:** Mohamed Atef

Users have full CRUD (Create, Read, Update, Delete) capabilities over their personal data, excluding their unique Username.

![Profile Overview](Screenshot%20from%202025-12-27%2004-38-03.png)
*Figure 4: User Profile Overview*

![Edit Profile](Screenshot%20from%202025-12-27%2004-38-20.png)
*Figure 5: Edit Profile Interface*

---

### 3. Book Search and Dynamic Browsing
**Developer:** Eyad Mohamed

The frontend provides a responsive interface for querying the database.
* **Query Construction:** Inputs are sanitized and converted into SQL `LIKE` queries (e.g., `SELECT * FROM Books WHERE Title LIKE '%query%'`).
* **Real-time Availability:** The interface binds directly to the `Stock_Quantity` column. If stock is 0, the "Add to Cart" button is disabled via frontend logic.

![Search Interface](Screenshot%20from%202025-12-27%2004-36-47.png)
*Figure 6: Book Search and Browsing Interface*

---

### 4. Shopping Cart & Order Management
**Developer:** Omar Adel

The shopping cart module manages the temporary state of selected items before the final transaction.
* **Transaction Atomicity (ACID):** The checkout process is wrapped in a database transaction. It simultaneously inserts into `Sales` and updates `Books` (`SET Stock = Stock - Qty`).
* **Constraint Enforcement:** A database `CHECK` constraint ensures `Stock_Quantity >= 0`. If a purchase exceeds available stock, the transaction rolls back.

![Shopping Cart](Screenshot%20from%202025-12-27%2004-37-14.png)
*Figure 7: Shopping Cart with Dynamic Total Calculation*

![Checkout](Screenshot%20from%202025-12-27%2004-37-42.png)
*Figure 8: Checkout Payment Interface*

---

### 5. Order History Analysis
**Developer:** Omar Adel

This view performs a `JOIN` operation between the `Sales`, `Books`, and `Customer` tables to reconstruct the historical data of specific transactions.

![Order History List](Screenshot%20from%202025-12-27%2004-39-03.png)
*Figure 9: Customer Order History Summary*

![Order Details](Screenshot%20from%202025-12-27%2004-37-52.png)
*Figure 10: Detailed View of a Specific Order*

---

### 6. Admin Books Management
**Developer:** Abdelrahman Reda

The admin dashboard provides high-level control over the bookstore's inventory, allowing filtering by Title, Author, or Category.

![Admin Category Filter](Screenshot%20from%202025-12-27%2004-07-30.png)
*Figure 11: Admin Dashboard - Filtering by Category*

![Admin Author Search](Screenshot%20from%202025-12-27%2004-18-53.png)
*Figure 12: Admin Dashboard - Searching by Author*

![Add Book](Screenshot%20from%202025-12-27%2004-29-06.jpg)
*Figure 13: Interface for Adding New Books*

![DB Books Table](Screenshot%20from%202025-12-27%2004-30-11.png)
*Figure 14: Database Verification - Books Table Population*

---

### 7. Automated Re-ordering (Trigger Implementation)
**Developer:** Abdelrahman Reda

This feature demonstrates the advanced use of **Database Triggers** to automate inventory maintenance.
* **Trigger Mechanism:** An `AFTER UPDATE` trigger on the `Books` table.
* **Condition:** `IF NEW.Stock_Quantity < NEW.Threshold`
* **Action:** Automatically inserts a row into `Publisher_Orders`.
* **Completion:** Admin confirmation updates the status and replenishes stock.

![Pending Orders](Screenshot%20from%202025-12-27%2004-33-45.png)
*Figure 15: Pending Publisher Orders (Automatically Generated by Trigger)*

![Completed Orders](Screenshot%20from%202025-12-27%2004-34-01.png)
*Figure 16: Completed Publisher Orders*
