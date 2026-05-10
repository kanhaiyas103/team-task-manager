const { validationResult } = require("express-validator");

const ApiError = require("../utils/ApiError");

const validateRequest = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array().map((error) => ({
    field: error.path,
    message: error.msg,
  }));

  throw new ApiError(400, "Validation failed", errors);
};

module.exports = validateRequest;
