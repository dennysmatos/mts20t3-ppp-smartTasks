const express = require("express");

const authRoutes = require("./routes/authRoutes");
const healthRoutes = require("./routes/healthRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/health", healthRoutes);
app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);

app.use(errorMiddleware);

module.exports = app;
