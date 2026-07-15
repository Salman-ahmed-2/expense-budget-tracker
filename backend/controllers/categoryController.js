const db = require('../config/db');

// GET /categories
exports.getCategories = (req, res) => {
  db.all('SELECT * FROM categories ORDER BY name', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to retrieve categories' });
    }
    res.json(rows);
  });
};

// POST /categories
exports.addCategory = (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }
  db.run('INSERT INTO categories (name) VALUES (?)', [name], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to add category' });
    }
    res.status(201).json({ id: this.lastID, name });
  });
};
