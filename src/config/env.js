const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "development-only-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h"
};

module.exports = env;

