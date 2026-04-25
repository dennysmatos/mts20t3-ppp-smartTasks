const express = require('express')

const healthController = require('../controllers/healthController')

const router = express.Router()

/**
 * @swagger
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Check API availability
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
router.get('/', healthController.check)

module.exports = router
