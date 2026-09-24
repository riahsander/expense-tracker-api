const express = require("express");
const cors = require("cors");
const transactionRoutes = require("./src/routes/transactionRoutes");
const setupSwagger = require("./src/swagger/swaggerConfig"); // Importa a configuração

const app = express();

const rateLimit = require("express-rate-limit");

// Configuração do Limite de Requisições
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Janela de tempo: 15 minutos
  max: 100, // Limite máximo: cada IP pode fazer até 100 requisições por janela de 15 minutos
  standardHeaders: true, // Retorna informações de limite nos headers de resposta (RateLimit-*)
  legacyHeaders: false, // Desativa os headers antigos (X-RateLimit-*)
  message: {
    status: 429,
    error:
      "Muitas requisições feitas a partir deste IP, por favor tente novamente mais tarde.",
  },
});

// Aplicar o limitador globalmente em todas as rotas da API
app.use(limiter);

app.use(express.json());
app.use(cors());

setupSwagger(app);

app.get("/", (req, res) => {
  res.redirect("/docs");
});

app.use(transactionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}.`);
});
