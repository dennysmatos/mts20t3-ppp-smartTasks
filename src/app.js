import express from 'express'
import swaggerUi from 'swagger-ui-express'

import authRoutes from './routes/authRoutes.js'
import healthRoutes from './routes/healthRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import userRoutes from './routes/userRoutes.js'
import swaggerSpec from './docs/swagger.js'
import errorMiddleware from './middlewares/errorMiddleware.js'
import notFoundMiddleware from './middlewares/notFoundMiddleware.js'

const app = express()

app.use(express.json())

app.get('/docs.json', (_request, response) => {
   return response.status(200).json(swaggerSpec)
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/auth', authRoutes)
app.use('/health', healthRoutes)
app.use('/tasks', taskRoutes)
app.use('/users', userRoutes)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app
