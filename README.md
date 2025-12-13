## 🚀 Prerequisites

You need **Docker** installed on your machine.
* **Windows/Mac:** Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
* **Linux:** Install `docker.io` and `docker-compose-plugin`.

---

## 🛠️ Quick Start (How to Run)

1.  **Clone/Download** this repository.
2.  Open your terminal in the project root folder.
3.  Run the following command to start the database:

    ```bash
    docker compose up -d
    ```
    *(Note: If `docker compose` doesn't work, try `docker-compose` with a hyphen).*

4.  **Wait 30 seconds.** On the first run, Docker will automatically execute our SQL migration scripts (`V1`, `V2`, `V3`) to build tables and insert test data.

---

## 🔌 Connection Details

Connect to the database using any tool (DBeaver, MySQL Workbench, IntelliJ IDEA, etc.):

| Setting | Value |
| :--- | :--- |
| **Host** | `localhost` |
| **Port** | `3306` (See Troubleshooting if this fails) |
| **Database** | `bookstore` |
| **Username** | `user` |
| **Password** | `password` |
| **Root User** | `root` / `rootpassword` |

---

## 📂 Project Structure

* `docker-compose.yml`: Configures the MySQL server.
* `sql/`: Contains our migration scripts.
    * `V1__Create_Schema.sql`: Creates tables (Books, Customers, Orders, etc.)
    * `V2__Add_Triggers.sql`: Adds logic for negative stock prevention and auto-ordering
    * `V3__Seed_Data.sql`: Inserts sample data (Alice, Bob, clean code book, etc.)

---

## ⚠️ Important: How to Reset Data

If you modify an SQL file or corrupt your data while testing, the database **will not update automatically**. You must "factory reset" it.

Run these commands to wipe the database and restart fresh:

```bash
# 1. Stop containers and DELETE the data volume
docker compose down -v

# 2. Start again (this re-runs the SQL scripts)
docker compose up -d
