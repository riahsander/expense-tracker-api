const express = require("express");
const cors = require("cors");
const transactionRoutes = require("./src/routes/transactionRoutes");
const setupSwagger = require("./src/swagger/swaggerConfig"); // Importa a configuração

const app = express();

app.use(express.json());
app.use(cors());

setupSwagger(app);

app.use(transactionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}.`);
});
