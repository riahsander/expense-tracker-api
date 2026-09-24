const express = require("express");
const router = express.Router();
const controller = require("../controllers/transactionController");

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Lista todas as transações
 *     description: Retorna uma lista de transações cadastradas. Permite filtrar opcionalmente por tipo.
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         required: false
 *         description: Filtrar por tipo de transação (income ou expense)
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso.
 *       400:
 *         description: Tipo de transação inválido.
 */
router.get("/transactions", controller.getTransactions);

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Cria uma nova transação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - amount
 *               - type
 *               - category
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Salário mensal"
 *               amount:
 *                 type: number
 *                 example: 3500.00
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: "income"
 *               category:
 *                 type: string
 *                 example: "Trabalho"
 *     responses:
 *       201:
 *         description: Transação criada com sucesso.
 *       400:
 *         description: Dados inválidos ou campos faltando.
 */
router.post("/transactions", controller.createTransaction);

/**
 * @swagger
 * /balance:
 *   get:
 *     summary: Exibe o saldo financeiro
 *     description: Retorna o total de receitas, total de despesas e o saldo líquido atual.
 *     responses:
 *       200:
 *         description: Saldo calculado com sucesso.
 */
router.get("/balance", controller.getBalance);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Remove uma transação
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da transação
 *     responses:
 *       204:
 *         description: Transação removida com sucesso (sem conteúdo).
 *       400:
 *         description: ID inválido.
 *       404:
 *         description: Transação não encontrada.
 */
router.delete("/transactions/:id", controller.deleteTransaction);

/**
 * @swagger
 * /transactions/{id}:
 *   patch:
 *     summary: Atualiza parcialmente uma transação
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da transação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *     responses:
 *       204:
 *         description: Transação atualizada com sucesso.
 *       400:
 *         description: Dados ou ID inválidos.
 *       404:
 *         description: Transação não encontrada.
 */
router.patch("/transactions/:id", controller.patchTransaction);

module.exports = router;
