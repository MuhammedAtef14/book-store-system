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

<img width="502" height="670" alt="Screenshot from 2025-12-27 04-18-28" src="https://github.com/user-attachments/assets/13a60e3b-f165-4fa6-a897-e32b3424f338" />

*Figure 1: User Login Interface*

<img width="820" height="812" alt="Screenshot from 2025-12-27 03-57-10" src="https://github.com/user-attachments/assets/38565c87-0b92-454a-9d8b-bd5f8bad8ce2" />

*Figure 2: Customer Registration Form*

<img width="1350" height="74" alt="Screenshot from 2025-12-27 04-00-37" src="https://github.com/user-attachments/assets/de2e8d51-9916-4557-aa8f-a2928fd8557b" />

*Figure 3: Database Verification - Customer Record Insertion*

---

### 2. Customer Profile Management

Users have full CRUD (Create, Read, Update, Delete) capabilities over their personal data, excluding their unique Username.

<img width="1259" height="698" alt="Screenshot from 2025-12-27 04-38-03" src="https://github.com/user-attachments/assets/c75b0ab3-aefa-48e4-9a36-f1119dc4e2d2" />

*Figure 4: User Profile Overview*



<img width="1259" height="698" alt="Screenshot from 2025-12-27 04-38-20" src="https://github.com/user-attachments/assets/fdfca8e2-9658-4099-ac32-28860986b2b4" />

*Figure 5: Edit Profile Interface*

---

### 3. Book Search and Dynamic Browsing

The frontend provides a responsive interface for querying the database.
* **Query Construction:** Inputs are sanitized and converted into SQL `LIKE` queries (e.g., `SELECT * FROM Books WHERE Title LIKE '%query%'`).
* **Real-time Availability:** The interface binds directly to the `Stock_Quantity` column. If stock is 0, the "Add to Cart" button is disabled via frontend logic.

<img width="1259" height="754" alt="Screenshot from 2025-12-27 04-36-47" src="https://github.com/user-attachments/assets/8818315b-c945-4f9d-90c8-53873bb73b59" />

*Figure 6: Book Search and Browsing Interface*

---

### 4. Shopping Cart & Order Management

The shopping cart module manages the temporary state of selected items before the final transaction.
* **Transaction Atomicity (ACID):** The checkout process is wrapped in a database transaction. It simultaneously inserts into `Sales` and updates `Books` (`SET Stock = Stock - Qty`).
* **Constraint Enforcement:** A database `CHECK` constraint ensures `Stock_Quantity >= 0`. If a purchase exceeds available stock, the transaction rolls back.

<img width="1259" height="754" alt="Screenshot from 2025-12-27 04-37-14" src="https://github.com/user-attachments/assets/06f64180-815b-4802-981d-731c11878051" />

*Figure 7: Shopping Cart with Dynamic Total Calculation*



<img width="1259" height="897" alt="Screenshot from 2025-12-27 04-37-42" src="https://github.com/user-attachments/assets/6742e571-545c-49bd-8396-6ae59e6bd5ba" />

*Figure 8: Checkout Payment Interface*

---

### 5. Order History Analysis

This view performs a `JOIN` operation between the `Sales`, `Books`, and `Customer` tables to reconstruct the historical data of specific transactions.

<img width="1259" height="698" alt="Screenshot from 2025-12-27 04-39-03" src="https://github.com/user-attachments/assets/b273d665-1328-4242-bcc2-117b9125bb16" />

*Figure 9: Customer Order History Summary*



<img width="1259" height="676" alt="Screenshot from 2025-12-27 04-37-52" src="https://github.com/user-attachments/assets/e33f81df-1ac2-44d0-82c0-6280c4d53172" />

*Figure 10: Detailed View of a Specific Order*

---

### 6. Admin Books Management
**Developer:** Abdelrahman Reda

The admin dashboard provides high-level control over the bookstore's inventory, allowing filtering by Title, Author, or Category.

<img width="1260" height="930" alt="Screenshot from 2025-12-27 04-07-30" src="https://github.com/user-attachments/assets/f796e1aa-af33-42f8-bff2-1cd326f180de" />

*Figure 11: Admin Dashboard - Filtering by Category*



<img width="1263" height="781" alt="Screenshot from 2025-12-27 04-18-53" src="https://github.com/user-attachments/assets/64a91f48-5a50-425d-920e-a5f8e2a8b13e" />

*Figure 12: Admin Dashboard - Searching by Author*



<img width="1263" height="781" alt="Screenshot from 2025-12-27 04-29-06" src="https://github.com/user-attachments/assets/d5f4392b-58aa-4bb1-8a4c-a3e3479c552e" />

*Figure 13: Interface for Adding New Books*



<img width="1555" height="303" alt="Screenshot from 2025-12-27 04-30-11" src="https://github.com/user-attachments/assets/5659ec5f-81d5-4a1d-9eca-016dfcb5d389" />

*Figure 14: Database Verification - Books Table Population*

---

### 7. Automated Re-ordering (Trigger Implementation)

This feature demonstrates the advanced use of **Database Triggers** to automate inventory maintenance.
* **Trigger Mechanism:** An `AFTER UPDATE` trigger on the `Books` table.
* **Condition:** `IF NEW.Stock_Quantity < NEW.Threshold`
* **Action:** Automatically inserts a row into `Publisher_Orders`.
* **Completion:** Admin confirmation updates the status and replenishes stock.

<img width="628" height="696" alt="Screenshot from 2025-12-27 04-33-45" src="https://github.com/user-attachments/assets/9da805f7-1d93-4cdb-bf62-909bf3f668b5" />

*Figure 15: Pending Publisher Orders (Automatically Generated by Trigger)*



<img width="1248" height="407" alt="Screenshot from 2025-12-27 04-34-01" src="https://github.com/user-attachments/assets/d11b8e66-9335-484b-9636-2cacd6638c7e" />

*Figure 16: Completed Publisher Orders*


### 8. Admin Dashboard & Statistics

The system includes a comprehensive analytics dashboard that aggregates sales data to provide actionable insights for administrators. This module utilizes complex SQL aggregation queries (`SUM`, `COUNT`, `GROUP BY`) to generate real-time reports.

**Key Analytical Features:**
* **Total Sales Reports:** Calculates revenue for the previous month and allows specific date querying.
* **Top Customers:** Identifies the top 5 customers based on total purchase volume over the last 3 months.
* **Best-Selling Books:** Ranks the top 10 books by number of copies sold.


<img width="1259" height="604" alt="Screenshot from 2025-12-27 04-42-18" src="https://github.com/user-attachments/assets/9b2529c7-5c97-46ac-ab53-5f21cd90fc70" />

*Figure 17: Top sales and top customers in specific period of time*



<img width="1259" height="474" alt="Screenshot from 2025-12-27 04-42-10" src="https://github.com/user-attachments/assets/002989b5-b103-43c0-a2c1-c8e33bee3283" />

*Figure 18: Best Selling Books*
