# Expense & Budget Tracker

A full-stack expense and budget tracking application built using HTML, CSS, JavaScript, Node.js, Express.js, and SQLite. The application allows users to manage expenses, organize them into categories, and track monthly budgets through a simple and user-friendly interface.

---

## Selected Project Idea

**Project Idea 5 – Expense & Budget Tracker**

A small finance tracker for recording expenses, categories, monthly budgets, and spending summaries.

---

## Team Members and Roles

| Name | Role |
|------|------|
| Osam Sami | Team Lead / Git Manager |
| Salman | Frontend Engineer |
| Sameer | Backend/API Engineer |
| Inshrah Mumtaz | Database Engineer |
| Laiba Patel | QA / Documentation / Reviewer |

---

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- SQLite

### Version Control
- Git
- GitHub

---

## Features

### Core Features

*To be updated after development is completed.*

### Bonus Features

*To be updated if any bonus features are implemented.*

---

## Application Screenshots

### Login Page:
The login page provides a clean interface for users to access the Expense & Budget Tracker.

<img width="1537" height="763" alt="image" src="https://github.com/user-attachments/assets/5a77273d-715d-4181-8653-91f6482f3985" />

### Dashboard:
The dashboard displays an overview of the user's financial information, including total balance, monthly income, expenses, savings, recent transactions, and expense breakdown charts.

<img width="1542" height="792" alt="image" src="https://github.com/user-attachments/assets/e3abacc0-ef1d-46c9-aab9-ec390c6990b4" />

---

## Database Schema

The application uses **SQLite** as its database. The database is designed to store users, expense categories, financial transactions, and monthly budgets.

### Tables

#### 1. Users
Stores registered user information.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | TEXT | User's full name |
| email | TEXT | Unique email address |
| password_hash | TEXT | Encrypted password |
| created_at | DATETIME | Account creation timestamp |

---

#### 2. Categories
Stores expense and income categories.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | TEXT | Category name (Food, Travel, etc.) |

---

#### 3. Transactions
Stores all income and expense records.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| user_id | INTEGER | References the Users table |
| amount | REAL | Transaction amount |
| category_id | INTEGER | References the Categories table |
| date | DATE | Transaction date |
| description | TEXT | Optional transaction description |
| type | TEXT | Transaction type (Income or Expense) |

---

#### 4. Budgets
Stores monthly spending limits for each category.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| user_id | INTEGER | References the Users table |
| category_id | INTEGER | References the Categories table |
| month | TEXT | Budget month |
| limit_amount | REAL | Maximum budget amount |

---

### Table Relationships

- One user can have multiple transactions.
- One user can create multiple monthly budgets.
- Each transaction belongs to one category.
- Each budget is assigned to one category.

---

## Database Setup

### Create the Database

Execute the provided `schema.sql` file to create all required database tables.

### Seed the Database

Execute the `seed.sql` file to insert sample data, including:

- Sample users
- Expense categories
- Transactions
- Monthly budgets

The sample data allows the application to be tested immediately after setup.

---

### Sample Seed Data

The database includes sample records such as:

- **Users:** Salman and Ali
- **Categories:** Food, Travel, Utilities, Shopping
- **Transactions:** Expense and income records
- **Budgets:** Monthly budget limits for different categories


---

## Installation & Setup

### Clone the Repository

```bash
git clone <repository-link>
```

### Install Dependencies

```bash
npm install
```

### Run the Application

```bash
npm start
```

> These commands will be updated if the final setup process changes.

---

## GitHub Workflow Summary

*This section will include examples of GitHub Issues, branches, commits, Pull Requests, reviews, merges, and issue closures after development is completed.*

---

## Known Limitations

*This section will be updated after project completion.*

---

## Future Improvements

*Potential future enhancements will be added after the project is completed.*
