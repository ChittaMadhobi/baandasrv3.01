module.exports = function (handler) {
  return async (req, res, next) => {
    try {
      // handler is always async and hence we need it here
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
}
