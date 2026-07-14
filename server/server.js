const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static client files
app.use(express.static(path.join(__dirname, '../client')));

const expensesRouter = require('./routes/expenses');
app.use('/api/expenses', expensesRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
