import express from 'express';

import * as healthController from '../controllers/healthController.js';

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Verificar disponibilidade da API
 *     responses:
 *       200:
 *         description: API em execução
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
router.get('/', healthController.check);

export default router;
