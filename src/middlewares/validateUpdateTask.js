const AppError = require("../utils/AppError");
const { allowedStatus } = require("../services/taskService");

function validateUpdateTask(request, _response, next) {
  const { title, description, status } = request.body;
  const errors = [];
  const allowedFields = ["title", "description", "status"];
  const receivedFields = Object.keys(request.body);
  const hasAtLeastOneAllowedField = receivedFields.some((field) => allowedFields.includes(field));

  if (receivedFields.length === 0 || !hasAtLeastOneAllowedField) {
    return next(new AppError("Validation error", 400, ["at least one valid field must be provided"]));
  }

  if (Object.hasOwn(request.body, "title")) {
    if (typeof title !== "string" || !title.trim()) {
      errors.push("title cannot be empty");
    }
  }

  if (Object.hasOwn(request.body, "description")) {
    if (typeof description !== "string" || !description.trim()) {
      errors.push("description cannot be empty");
    }
  }

  if (Object.hasOwn(request.body, "status")) {
    if (typeof status !== "string" || !status.trim()) {
      errors.push("status cannot be empty");
    } else if (!allowedStatus.includes(status)) {
      errors.push("status must be one of: pending, in_progress, done");
    }
  }

  if (errors.length > 0) {
    return next(new AppError("Validation error", 400, errors));
  }

  return next();
}

module.exports = validateUpdateTask;
