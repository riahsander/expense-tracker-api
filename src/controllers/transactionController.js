const db = require("../config/database");
const {
  VALID_TYPES,
  isValidText,
  parseAmount,
  handleDbError,
} = require("../helpers/validators");

// POST /transactions
function createTransaction(req, res) {
  const { description, amount, type, category } = req.body;

  if (!isValidText(description) || !isValidText(category) || !type) {
    return res.status(400).json({
      error: "Campos obrigatórios: description, amount, type e category.",
    });
  }

  const value = parseAmount(amount);
  if (value === null) {
    return res
      .status(400)
      .json({ error: "O campo 'amount' deve ser um número positivo." });
  }

  if (!VALID_TYPES.includes(type)) {
    return res
      .status(400)
      .json({ error: "O tipo de transação deve ser 'income' ou 'expense'." });
  }

  const query = `INSERT INTO transactions (description, amount, type, category) VALUES (?, ?, ?, ?)`;
  const params = [description.trim(), value, type, category.trim()];

  db.run(query, params, function (err) {
    if (err) return handleDbError(res, err);

    return res.status(201).json({
      id: this.lastID,
      description: description.trim(),
      amount: value,
      type,
      category: category.trim(),
    });
  });
}

// GET /transactions
function getTransactions(req, res) {
  const { type } = req.query;
  let query = `SELECT * FROM transactions`;
  let params = [];

  if (type) {
    if (!VALID_TYPES.includes(type)) {
      return res
        .status(400)
        .json({ error: "O tipo de transação deve ser 'income' ou 'expense'." });
    }
    query += ` WHERE type = ?`;
    params.push(type);
  }

  query += ` ORDER BY id DESC`;

  db.all(query, params, (err, rows) => {
    if (err) return handleDbError(res, err);
    return res.json(rows);
  });
}

// GET /balance
function getBalance(req, res) {
  const query = `SELECT type, SUM(amount) as total FROM transactions GROUP BY type`;

  db.all(query, [], (err, rows) => {
    if (err) return handleDbError(res, err);

    let income = 0;
    let expense = 0;

    rows.forEach((row) => {
      if (row.type === "income") income = row.total;
      if (row.type === "expense") expense = row.total;
    });

    const balance = income - expense;

    return res.json({ income, expense, balance });
  });
}

// DELETE /transactions/:id
function deleteTransaction(req, res) {
  const id = req.params.id;

  const query = `DELETE FROM transactions WHERE id = ?`;

  db.run(query, [id], function (err) {
    if (err) return handleDbError(res, err);

    if (this.changes === 0) {
      return res
        .status(404)
        .json({ error: `Nenhuma transação encontrada com o ID ${id}.` });
    }

    return res.status(204).send();
  });
}

// PATCH /transactions/:id
function patchTransaction(req, res) {
  const id = req.params.id;

  const { description, amount, type, category } = req.body;
  const fields = [];
  const params = [];

  if (description !== undefined) {
    if (!isValidText(description)) {
      return res
        .status(400)
        .json({ error: "O campo 'description' não pode ser vazio." });
    }
    fields.push("description = ?");
    params.push(description.trim());
  }

  if (amount !== undefined) {
    const value = parseAmount(amount);
    if (value === null) {
      return res
        .status(400)
        .json({ error: "O campo 'amount' deve ser um número positivo." });
    }
    fields.push("amount = ?");
    params.push(value);
  }

  if (type !== undefined) {
    if (!VALID_TYPES.includes(type)) {
      return res
        .status(400)
        .json({ error: "O campo 'type' deve ser 'income' ou 'expense'." });
    }
    fields.push("type = ?");
    params.push(type);
  }

  if (category !== undefined) {
    if (!isValidText(category)) {
      return res
        .status(400)
        .json({ error: "O campo 'category' não pode ser vazio." });
    }
    fields.push("category = ?");
    params.push(category.trim());
  }

  if (fields.length === 0) {
    return res
      .status(400)
      .json({ error: "Envie pelo menos um campo para atualizar." });
  }

  params.push(id);
  const query = `UPDATE transactions SET ${fields.join(",")} WHERE id = ?`;

  db.run(query, params, function (err) {
    if (err) return handleDbError(res, err);

    if (this.changes === 0) {
      return res.status(404).json({ error: "Transação não encontrada." });
    }

    return res.status(204).send();
  });
}

module.exports = {
  createTransaction,
  getTransactions,
  getBalance,
  deleteTransaction,
  patchTransaction,
};
