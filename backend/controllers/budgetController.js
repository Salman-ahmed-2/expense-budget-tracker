const db = require('../config/db');

// GET /budgets
exports.getBudgets = (req, res) => {
  const query = `
    SELECT b.*, c.name as category_name
    FROM budgets b
    LEFT JOIN categories c ON b.category_id = c.id
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to retrieve budgets' });
    }
    res.json(rows);
  });
};

// POST /budgets
exports.addBudget = (req, res) => {
  const { category_id, month, limit_amount } = req.body;
  const user_id = 1; // Default user for now

  if (!category_id || !month || !limit_amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO budgets (user_id, category_id, month, limit_amount)
    VALUES (?, ?, ?, ?)
  `;
  db.run(query, [user_id, category_id, month, limit_amount], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to add budget' });
    }
    res.status(201).json({ id: this.lastID, user_id, category_id, month, limit_amount });
  });
};

// PUT /budgets/:id
exports.updateBudget = (req, res) => {
  const id = req.params.id;
  const { category_id, month, limit_amount } = req.body;

  const query = `
    UPDATE budgets
    SET category_id = ?, month = ?, limit_amount = ?
    WHERE id = ?
  `;
  db.run(query, [category_id, month, limit_amount, id], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to update budget' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.json({ message: 'Budget updated', id, category_id, month, limit_amount });
  });
};

// DELETE /budgets/:id
exports.deleteBudget = (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM budgets WHERE id = ?', id, function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to delete budget' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.json({ message: 'Budget deleted', id });
  });
};
