class appError extends Error {
  constructor(message = "error", status = 500) {
    super(message);
    this.status = status;
  }
}

export default appError;
