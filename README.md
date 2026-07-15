# Expense & Budget Tracker
## Project Idea 5

A full-stack expense tracking web application built using **HTML, CSS, JavaScript, Node.js, Express.js, and SQLite**.

The application allows users to record and manage transactions, organize expenses into categories, and store financial data using a database-backed system.

This project was developed as part of **Assignment 3 — Mini Web Application with Database** for the **CODOC (PRIVATE) LIMITED Intern Development Programme**.

---

# Team Members and Roles

| Name | Role |
|------|------|
| Osam Sami | Team Lead / Git Manager |
| Salman | Frontend Engineer |
| Sameer | Backend/API Engineer |
| Inshrah Mumtaz | Database Engineer |
| Laiba Patel | QA / Documentation / Reviewer |

---

# Technologies Used

| Category | Technologies |
|----------|--------------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | SQLite |
| Version Control | Git, GitHub |

---

# Features

## Completed Features

- SQLite database integration with persistent data storage
- Database schema containing:
  - Users
  - Categories
  - Transactions
  - Budgets
- Express.js backend connected with SQLite
- REST API implementation for transactions
- Transaction CRUD operations:
  - Create transactions
  - View transactions
  - Update transactions
  - Delete transactions
- Database seed data for testing
- Organized project structure with separate frontend, backend, and database folders

---

## Features In Progress

- Transaction management user interface
- Search and filtering functionality
- Client-side form validation
- Additional frontend improvements

---

## Bonus Features

The following bonus features were planned but not completed due to time constraints:

- Budget exceeded alerts
- Monthly financial reports
- CSV/PDF transaction export
- Advanced dashboard analytics
- Additional visualizations

---

# Application Screenshots

## Transaction Management Interface

Screenshot showing the transaction management page and user interaction flow.

<img width="1532" height="788" alt="image" src="https://github.com/user-attachments/assets/70289754-6ea1-4ef9-9c70-2017b8d0e52d" />

## Reports Interface

The reports interface demonstrates the planned financial summary layout, including income and expense comparisons and visual representations of transaction data.

<img width="1537" height="797" alt="image" src="https://github.com/user-attachments/assets/9dad2082-1f78-4097-9b83-0f88829fdf1c" />

---

# Database Schema

The application uses **SQLite** as its database.

The database stores user information, transaction categories, financial transactions, and monthly budgets.

## Database Tables

---

## Users

Stores registered user information.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary Key |
| name | TEXT | User's full name |
| email | TEXT | Unique email address |
| password_hash | TEXT | Encrypted password |
| created_at | DATETIME | Account creation timestamp |

---

## Categories

Stores available income and expense categories.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary Key |
| name | TEXT | Category name |

---

## Transactions

Stores income and expense records.

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

## Budgets

Stores monthly budget limits.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary Key |
| user_id | INTEGER | References Users table |
| category_id | INTEGER | References Categories table |
| month | TEXT | Budget month |
| limit_amount | REAL | Monthly budget limit |

---

# Database Relationships

- One user can have multiple transactions.
- One user can have multiple budgets.
- Each transaction belongs to one category.
- Each budget belongs to one category.

---

# Database Setup

Navigate to the database folder:

```bash
cd database
```

Create database tables:

```bash
sqlite3 expense_tracker.db < schema.sql
```

Insert sample data:

```bash
sqlite3 expense_tracker.db < seed.sql
```

The seed data contains:

- Sample users
- Categories
- Transactions
- Monthly budgets

This allows the application to be tested immediately after setup.

---

# Project Structure

```
expense-budget-tracker/

├── frontend/          # Frontend files
├── backend/           # Express server, APIs, controllers
├── database/          # schema.sql and seed.sql
├── docs/              # Screenshots and documentation
├── README.md
├── package.json
└── .gitignore
```

---

# Installation & Setup

## Clone the Repository

```bash
git clone <repository-link>
```

## Navigate to Project Directory

```bash
cd expense-budget-tracker
```

## Install Backend Dependencies

```bash
cd backend
npm install
```

## Run Backend Server

```bash
npm start
```

The frontend can be accessed from the frontend directory.

---

# GitHub Workflow Summary

The project followed the required GitHub collaboration workflow:

```
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

Workflow practices followed:

- GitHub Issues were created before starting tasks.
- Each task was developed on a separate branch.
- Commits followed meaningful prefixes:
  - feat:
  - fix:
  - docs:
  - chore:
- Pull Requests were created before merging changes.
- Pull Requests were reviewed by team members.
- Rebase and merge strategy was used.
- Main branch protection rules were enabled to prevent direct pushes.

---

# GitHub Workflow Examples

| Task | Issue | Branch | Pull Request |
|---|---|---|---|
| Database Schema | #16 | issue-16-database-schema | PR #32 |
| README Documentation | #15 | issue-15-readme | PR #33 |
| Testing | #31 | issue-31-testing | PR #34 |

---

# Testing

Testing was performed to verify application functionality.

The following areas were tested:

- Transaction CRUD operations
- Database persistence
- REST API endpoints
- API responses
- Error handling
- Frontend functionality

Testing was performed manually using API requests and application checks.

Any bugs identified during testing were tracked through GitHub Issues.

---

# Known Limitations

- Authentication and authorization were not completed due to time constraints.
- Dashboard analytics were not implemented.
- Budget management features remain incomplete.
- Search and filtering functionality requires further development.
- Automated testing was not added.

---

# Future Improvements

Potential future improvements include:

- Complete user authentication system
- Add transaction search and filtering
- Implement budget tracking features
- Add budget exceeded alerts
- Create financial dashboards and analytics
- Export transactions as CSV/PDF
- Add automated testing
- Improve mobile responsiveness

---

# License

This project was developed as part of **Assignment 3 — Mini Web Application with Database** for the **CODOC (PRIVATE) LIMITED Intern Development Programme**.

---

# Acknowledgements

Developed collaboratively by the Expense & Budget Tracker team as part of the CODOC (PRIVATE) LIMITED Intern Development Programme.
