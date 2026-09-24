const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../../database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar no SQLite3: ", err.message);
  } else {
    console.log("Conectado com sucesso no SQLite3");
  }
});

// 2. Cria a tabela de transações caso ela ainda não exista
db.serialize(() => {
  db.run(
    `
        CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        `,
    (err) => {
      if (err) {
        console.error("Falha ao criar tabela: ", err.message);
      } else {
        console.log("Tabela já existente.");
      }
    }
  );
});

module.exports = db;
