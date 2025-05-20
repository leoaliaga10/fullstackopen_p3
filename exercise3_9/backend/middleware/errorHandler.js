const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError" || error.number === "CastError") {
    return response.status(400).send({ error: "malformatted name" });
  } else if (
    error.name === "ValidationError" ||
    error.number === "ValidationError"
  ) {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};
export default errorHandler;
