# Expense Tracker API

API RESTful para controle de finanças pessoais, feita com Node.js, Express e SQLite. Permite registrar receitas e despesas, listar, atualizar e remover transações e consultar o saldo.

- API em produção: https://expense-tracker-api-9l3l.onrender.com
- Documentação (Swagger): https://expense-tracker-api-9l3l.onrender.com/docs

## Tecnologias

Node.js 20.11.0, Express 5, SQLite (`sqlite3`), `cors`, `express-rate-limit`, `swagger-jsdoc` e `swagger-ui-express`.

## Estrutura

```
expense-tracker-api/
├── src/
│   ├── config/database.js
│   ├── controllers/transactionController.js
│   ├── helpers/validators.js
│   ├── routes/transactionRoutes.js
│   └── swagger/swaggerConfig.js
├── index.js
└── package.json
```

## Como executar

```bash
git clone https://github.com/riahsander/expense-tracker-api.git
cd expense-tracker-api
npm install
npm start
```

O servidor sobe em `http://localhost:3000` (ou na porta definida em `PORT`). Para desenvolvimento com recarregamento automático, use `npm run dev`. O arquivo `database.sqlite` e a tabela `transactions` são criados automaticamente.

## Endpoints

| Método | Rota                | Descrição                                                            |
| ------ | ------------------- | -------------------------------------------------------------------- |
| GET    | `/transactions`     | Lista transações (filtro opcional `?type=income` ou `?type=expense`) |
| POST   | `/transactions`     | Cria uma transação                                                   |
| PATCH  | `/transactions/:id` | Atualiza parcialmente uma transação                                  |
| DELETE | `/transactions/:id` | Remove uma transação                                                 |
| GET    | `/balance`          | Retorna receitas, despesas e saldo                                   |

### Criar transação

`POST /transactions`

```json
{
  "description": "Salário mensal",
  "amount": 3500.0,
  "type": "income",
  "category": "Trabalho"
}
```

Todos os campos são obrigatórios. `type` deve ser `income` ou `expense` e `amount` deve ser maior que zero. Resposta: `201` com a transação criada.

### Atualizar transação

`PATCH /transactions/:id` aceita qualquer combinação de `description`, `amount`, `type` e `category`. Resposta: `204`.

### Saldo

`GET /balance`

```json
{
  "income": 2200,
  "expense": 831,
  "balance": 1369
}
```

## Erros

As respostas de erro têm o formato `{ "error": "mensagem" }`.

| Status | Motivo                                                              |
| ------ | ------------------------------------------------------------------- |
| 400    | Dados inválidos ou campos ausentes                                  |
| 404    | Transação não encontrada (inclui IDs inexistentes ou não numéricos) |
| 429    | Limite excedido (100 requisições por IP a cada 15 minutos)          |
| 500    | Erro interno do servidor                                            |

## Observação

O SQLite grava em arquivo local. Em hospedagens com disco temporário, como o plano gratuito do Render, os dados podem ser perdidos a cada deploy ou reinício.

## Licença

ISC
