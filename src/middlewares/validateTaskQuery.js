const AppError = require("../utils/AppError");
const { allowedStatus } = require("../services/taskService");
const { getUnknownFields } = require("../utils/validationHelper");

function validateTaskQuery(request, _response, next) {
  const errors = [];
  const allowedFields = ["status", "search"];
  const unknownFields = getUnknownFields(request.query, allowedFields);
  const { status, search } = request.query;

  if (unknownFields.length > 0) {
    errors.push(`unknown query params are not allowed: ${unknownFields.join(", ")}`);
  }

  if (typeof status === "string" && status.trim() && !allowedStatus.includes(status.trim())) {
    errors.push("status query must be one of: pending, in_progress, done");
  }

  if (Object.hasOwn(request.query, "search")) {
    if (typeof search !== "string" || !search.trim()) {
      errors.push("search query cannot be empty");
    }
  }

  if (errors.length > 0) {
    return next(new AppError("Validation error", 400, errors));
  }

  return next();
}

module.exports = validateTaskQuery;
