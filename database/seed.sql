-- Users
INSERT INTO users (name, email, password_hash)
VALUES
('Salman', 'salman@example.com', 'hashed_password_123'),
('Ali', 'ali@example.com', 'hashed_password_456');

-- Categories
INSERT INTO categories (name)
VALUES
('Food'),
('Travel'),
('Utilities'),
('Shopping');

-- Transactions
INSERT INTO transactions (user_id, amount, category_id, date, description, type)
VALUES
(1, 500.00, 1, '2026-07-14', 'Lunch', 'Expense'),
(1, 250.00, 2, '2026-07-13', 'Bus Fare', 'Expense'),
(2, 1200.00, 3, '2026-07-12', 'Electricity Bill', 'Expense'),
(1, 3000.00, 4, '2026-07-10', 'Clothes Shopping', 'Expense'),
(2, 15000.00, 1, '2026-07-01', 'Monthly Salary', 'Income');

-- Budgets
INSERT INTO budgets (user_id, category_id, month, limit_amount)
VALUES
(1, 1, 'July', 10000),
(2, 2, 'July', 5000);