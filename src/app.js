const express = require("express");
const swaggerUi = require("swagger-ui-express");

const authRoutes = require("./routes/authRoutes");
const swaggerSpec = require("./docs/swagger");
const healthRoutes = require("./routes/healthRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");
const notFoundMiddleware = require("./middlewares/notFoundMiddleware");

const app = express();

app.use(express.json());

app.get("/docs.json", (_request, response) => {
  return response.status(200).json(swaggerSpec);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/auth", authRoutes);
app.use("/health", healthRoutes);
app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
