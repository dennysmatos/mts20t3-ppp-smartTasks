function check(_request, response) {
  return response.status(200).json({
    message: "API is running",
    data: {
      status: "ok"
    }
  });
}

module.exports = {
  check
};

