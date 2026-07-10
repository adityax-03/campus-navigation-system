function sanitizeObject(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;

  for (const key of Object.keys(obj)) {
    if (key.startsWith("$")) {
      delete obj[key];
      continue;
    }
    if (key.includes(".")) {
      delete obj[key];
      continue;
    }
    if (typeof obj[key] === "object") {
      sanitizeObject(obj[key]);
    }
    if (typeof obj[key] === "string" && obj[key].startsWith("$")) {
      obj[key] = obj[key].replace(/^\$/, "");
    }
  }

  return obj;
}

const mongoSanitize = (req, res, next) => {
  if (req.body) {
    sanitizeObject(req.body);
  }
  if (req.params) {
    sanitizeObject(req.params);
  }
  next();
};

module.exports = mongoSanitize;
