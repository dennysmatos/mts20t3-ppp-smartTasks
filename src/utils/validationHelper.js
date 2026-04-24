function getUnknownFields(payload, allowedFields) {
  return Object.keys(payload).filter((field) => !allowedFields.includes(field));
}

module.exports = {
  getUnknownFields
};

