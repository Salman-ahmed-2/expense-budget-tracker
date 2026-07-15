# Expense & Budget Tracker
### Project Idea 5

A full-stack expense and budget tracking web application built using **HTML, CSS, JavaScript, Node.js, Express.js, and SQLite**. The application allows users to manage expenses, organize them into categories, set monthly budgets, and monitor spending through a simple and user-friendly interface.

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

| Category | Technologies |
|----------|--------------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | SQLite |
| Version Control | Git, GitHub |

---

## Features

### Core Features

*This section will be updated after development is completed.*

### Bonus Features

*This section will be updated if any bonus features are implemented.*

---

## Application Screenshots

### Login Page

The login page provides users with a secure interface to access the application.

<img width="1536" height="788" alt="image" src="https://github.com/user-attachments/assets/b91afaf1-61db-4fbf-83cf-f99800348a0d" />


---

### Dashboard

The dashboard provides an overview of balances, income, expenses, budgets, recent transactions, and financial insights.

<img width="1537" height="793" alt="image" src="https://github.com/user-attachments/assets/3db7865b-da35-4c07-bef2-dcb68021a73e" />



---

## Database Schema

The application uses **SQLite** as its database. It stores user information, transaction categories, financial transactions, and monthly budgets.

### Database Tables

#### Users

Stores registered user information.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary Key |
| name | TEXT | User's full name |
| email | TEXT | Unique email address |
| password_hash | TEXT | Encrypted password |
| created_at | DATETIME | Account creation timestamp |

---

#### Categories

Stores available income and expense categories.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary Key |
| name | TEXT | Category name |

---

#### Transactions

Stores all income and expense records.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary Key |
| user_id | INTEGER | References Users table |
| amount | REAL | Transaction amount |
| category_id | INTEGER | References Categories table |
| date | DATE | Transaction date |
| description | TEXT | Transaction description |
| type | TEXT | Income or Expense |

---

#### Budgets

Stores monthly budget limits for each category.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary Key |
| user_id | INTEGER | References Users table |
| category_id | INTEGER | References Categories table |
| month | TEXT | Budget month |
| limit_amount | REAL | Monthly budget limit |

### Database Relationships

- One user can have multiple transactions.
- One user can have multiple budgets.
- Each transaction belongs to one category.
- Each budget belongs to one category.

---

## Database Setup

1. Run the **schema.sql** file to create all database tables.
2. Run the **seed.sql** file to populate the database with sample data.

The seed data includes:

- Sample users
- Categories
- Transactions
- Monthly budgets

This allows the application to be tested immediately after setup.

---

## Project Structure

```text
expense-budget-tracker/
├── client/          # Frontend files
├── server/          # Backend files
├── database/        # schema.sql and seed.sql
├── docs/            # Screenshots and documentation
├── README.md
├── package.json
└── .gitignore
```

---

## Installation & Setup

### Clone the Repository

```bash
git clone <repository-link>
```

### Navigate to the Project Directory

```bash
cd expense-budget-tracker
```

### Install Dependencies

```bash
npm install
```

### Run the Application

```bash
npm start
```

> **Note:** These commands may be updated if the final project structure changes.

---

## GitHub Workflow Summary

The project follows the GitHub collaboration workflow required by the CODOC Intern Development Programme.

```text
Issue
   ↓
Branch
   ↓
Commit(s)
   ↓
Pull Request
   ↓
Code Review
   ↓
Merge
   ↓
Issue Closed
```

Examples of GitHub Issues, branches, commits, Pull Requests, reviews, and merges will be added after project completion.

---

## Known Limitations

*This section will be updated after testing the completed application.*

---

## Future Improvements

Potential future enhancements include:

- User authentication and authorization
- Budget notifications and alerts
- Export transactions as CSV or PDF
- Advanced search and filtering
- Improved financial reports and analytics
- Additional dashboard visualizations
- Mobile responsiveness enhancements

---

## License

This project was developed as part of **Assignment 3** for the **CODOC (PRIVATE) LIMITED Intern Development Programme**.

---

## Acknowledgements

Developed collaboratively by the Expense & Budget Tracker team as part of the CODOC (PRIVATE) LIMITED Intern Development Programme.
