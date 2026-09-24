const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Expense Tracker API",
      version: "1.0.0",
      description:
        "API RESTful desenvolvida em Node.js e Express para controle de finanças pessoais com SQLite.",
    },
    servers: [
      {
        url: "https://expense-tracker-api-9l3l.onrender.com",
        description: "Servidor de Produção (Render)",
      },
      {
        url: "http://localhost:3000",
        description: "Servidor Local",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  // Rota onde a documentação visual estará disponível
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(
    "📄 Documentação Swagger disponível em: http://localhost:3000/docs"
  );
}

module.exports = setupSwagger;
