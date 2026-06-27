# Library Management System

A RESTful backend application for managing a Library Management System built with **Node.js**, **Express.js**, and **MySQL**. The system supports role-based authentication with JWT and provides separate functionalities for Librarians and Members.

---

# Features

## Authentication

- Member Registration
- User Login
- JWT Authentication
- Password Hashing using bcrypt
- Role-Based Authorization (Librarian & Member)

---

## Librarian Features

### Members

- Get All Members
- Delete Member

### Books

- Add Book
- Get All Books
- Get Book By ID
- Update Book
- Delete Book

---

## Member Features

- View Available Books
- Borrow Book
- Return Book
- View My Borrowed Books

---

## Business Rules

- Members can register only as **Member**
- Librarian accounts are created directly in the database
- Members cannot borrow unavailable books
- Members cannot borrow the same book twice without returning it
- Members can only return books they have borrowed
- Available quantity decreases when borrowing
- Available quantity increases when returning
- Librarians cannot borrow or return books
- Members cannot manage books or members

---

# 🛠 Tech Stack

- Backend: Node.js
- Framework: Express.js
- Database: MySQL
- Authentication: JWT
- Password Hashing: bcrypt

---

# 📂 Project Structure

```
library-management
│
├── config
│   └── db.js
│
├── controllers
│   ├── authController.js
│   ├── bookController.js
│   ├── borrowController.js
│   └── memberController.js
│
├── middleware
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── routes
│   ├── authRoutes.js
│   ├── bookRoutes.js
│   └── memberRoutes.js
│
├── database
│   ├── createDatabase.js
│   ├── createTables.js
│
├── .env
├── .gitignore
├── app.js
├── server.js
├── package.json
└── README.md
```

---

# 🗄 Database Schema

## Users

| Field | Type |
|--------|------|
| id | INT |
| name | VARCHAR(100) |
| email | VARCHAR(100) |
| password | VARCHAR(255) |
| role | ENUM(member, librarian) |
| created_at | TIMESTAMP |

---

## Books

| Field | Type |
|--------|------|
| id | INT |
| title | VARCHAR(200) |
| author | VARCHAR(200) |
| isbn | VARCHAR(20) |
| category | VARCHAR(100) |
| quantity | INT |
| availableQuantity | INT |
| created_at | TIMESTAMP |

---

## Borrow Records

| Field | Type |
|--------|------|
| id | INT |
| user_id | INT |
| book_id | INT |
| borrow_date | TIMESTAMP |
| return_date | TIMESTAMP |
| status | ENUM(borrowed, returned) |
| created_at | TIMESTAMP |

---

# ⚙ Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_db

JWT_SECRET=your_secret_key
```

---

# 📦 Installation

Clone the repository

```bash
git clone https://github.com/04Bharathi/library-management-backend.git
```

Move into the project

```bash
cd library-management
```

Install dependencies

```bash
npm install
```

Start the server

```bash
npm start
```

or

```bash
npm run dev
```

---

# Database Setup

Create the database

```bash
node database/createDatabase.js
```

Create tables

```bash
node database/createTables.js
```

---

# 🔐 Authentication APIs

## Register

```
POST /api/auth/register
```

Request

```json
{
    "name":"John",
    "email":"john@gmail.com",
    "password":"123456"
}
```

---

## Login

```
POST /api/auth/login
```

Request

```json
{
    "email":"john@gmail.com",
    "password":"123456"
}
```

---

# 👨‍💼 Member APIs

## Get All Members

```
GET /api/members
```

Authorization

```
Librarian
```

---

## Delete Member

```
DELETE /api/members/:id
```

Authorization

```
Librarian
```

---

# 📚 Book APIs

## Add Book

```
POST /api/books
```

Authorization

```
Librarian
```

---

## Get All Books

```
GET /api/books
```

Authorization

```
Member / Librarian
```

---

## Get Book Details

```
GET /api/books/:id
```

---

## Update Book

```
PUT /api/books/:id
```

Authorization

```
Librarian
```

---

## Delete Book

```
DELETE /api/books/:id
```

Authorization

```
Librarian
```

---

# 📖 Borrow APIs

## Borrow Book

```
POST /api/books/:id/borrow
```

Authorization

```
Member
```

---

## Return Book

```
POST /api/books/:id/return
```

Authorization

```
Member
```

---

## My Borrowed Books

```
GET /api/members/me/books
```

Authorization

```
Member
```

---

# ✅ Validation

The application validates:

- Required fields
- Duplicate email
- Email format
- Password length
- Negative quantity
- Invalid IDs
- Book availability
- Duplicate borrow requests

---

# 🔒 Authorization

## Member

Can

- View Books
- Borrow Books
- Return Books
- View Borrow History

Cannot

- Add Books
- Update Books
- Delete Books
- Delete Members

---

## Librarian

Can

- Manage Members
- Manage Books

Cannot

- Borrow Books
- Return Books

---

# 📌 HTTP Status Codes

| Status | Description |
|----------|------------|
| 200 | Success |
| 201 | Resource Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

# Future Improvements

- Pagination
- Search Books
- Filter Books
- Refresh Token Authentication
- Fine Calculation
- Book Reservation
- Email Notifications

---

# Author

**Bharathi**
