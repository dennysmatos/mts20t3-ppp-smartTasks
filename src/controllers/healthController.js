function check(_request, response) {
  return response.status(200).json({
    message: 'API em execução',
    data: {
      status: 'ok',
    },
  });
}

export { check };
