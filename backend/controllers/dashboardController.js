const db = require('../config/db');

// GET /dashboard/summary
exports.getSummary = (req, res) => {
  const queries = {
    totalIncome: `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'Income'`,
    totalExpenses: `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'Expense'`,
    transactionCount: `SELECT COUNT(*) as count FROM transactions`,
    recentTransactions: `
      SELECT t.*, c.name as category_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      ORDER BY t.date DESC
      LIMIT 10
    `,
    expensesByCategory: `
      SELECT c.name as category, COALESCE(SUM(t.amount), 0) as total
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.type = 'Expense'
      GROUP BY c.name
      ORDER BY total DESC
    `,
    budgetStatus: `
      SELECT b.*, c.name as category_name,
        COALESCE((
          SELECT SUM(t.amount) FROM transactions t 
          WHERE t.category_id = b.category_id AND t.type = 'Expense'
        ), 0) as spent
      FROM budgets b
      LEFT JOIN categories c ON b.category_id = c.id
    `,
  };

  const result = {};

  db.get(queries.totalIncome, [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    result.totalIncome = row.total;

    db.get(queries.totalExpenses, [], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      result.totalExpenses = row.total;

      db.get(queries.transactionCount, [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        result.transactionCount = row.count;

        db.all(queries.recentTransactions, [], (err, rows) => {
          if (err) return res.status(500).json({ error: err.message });
          result.recentTransactions = rows;

          db.all(queries.expensesByCategory, [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            result.expensesByCategory = rows;

            db.all(queries.budgetStatus, [], (err, rows) => {
              if (err) return res.status(500).json({ error: err.message });
              result.budgetStatus = rows;

              result.balance = result.totalIncome - result.totalExpenses;
              result.netSavings = result.totalIncome - result.totalExpenses;

              res.json(result);
            });
          });
        });
      });
    });
  });
};
