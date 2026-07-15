const db = require('../config/db');

// GET /transactions
exports.getTransactions = (req, res) => {
  const query = `
    SELECT t.*, c.name as category_name
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to retrieve transactions' });
    }
    res.json(rows);
  });
};

// POST /transactions
exports.addTransaction = (req, res) => {
  const { amount, category_id, date, description, type } = req.body;
  const user_id = 1; // Default user for now

  if (!amount || !category_id || !date || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO transactions (user_id, amount, category_id, date, description, type)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [user_id, amount, category_id, date, description, type];

  db.run(query, params, function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to add transaction' });
    }
    res.status(201).json({ id: this.lastID, user_id, amount, category_id, date, description, type });
  });
};

// PUT /transactions/:id
exports.updateTransaction = (req, res) => {
  const id = req.params.id;
  const { amount, category_id, date, description, type } = req.body;

  const query = `
    UPDATE transactions
    SET amount = ?, category_id = ?, date = ?, description = ?, type = ?
    WHERE id = ?
  `;
  const params = [amount, category_id, date, description, type, id];

  db.run(query, params, function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to update transaction' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction updated successfully', id, amount, category_id, date, description, type });
  });
};

// DELETE /transactions/:id
exports.deleteTransaction = (req, res) => {
  const id = req.params.id;

  const query = `DELETE FROM transactions WHERE id = ?`;
  db.run(query, id, function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to delete transaction' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully', id });
  });
};
