// ---------------------------------------------------------------
// Helpers: centralizam as validações e o tratamento de erro,
// evitando repetir o mesmo código em cada rota.
// ---------------------------------------------------------------
const VALID_TYPES = ["income", "expense"];

function isValidText(value) {
  return typeof value === "string" && value.trim() !== "";
}

// Retorna o número se for válido e positivo; caso contrário, null.
function parseAmount(value) {
  if (typeof value !== "number" && typeof value !== "string") return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// Loga o erro real no servidor e devolve uma mensagem genérica ao cliente.
function handleDbError(res, err) {
  console.error(err);
  return res.status(500).json({ error: "Erro interno do servidor." });
}

module.exports = {
  VALID_TYPES,
  isValidText,
  parseAmount,
  handleDbError,
};
