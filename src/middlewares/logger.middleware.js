import pinoHttp from "pino-http";
import logger from "../config/logger.js";

const loggerMiddleware = pinoHttp({
    logger,
     customSuccessMessage(req, res) {
    return `${req.method} ${req.url} - ${res.statusCode} `;
  },

  customErrorMessage(req, res) {
    return `${req.method} ${req.url} - ${res.statusCode} }`;
  },

  serializers: {
    req() {
      return undefined;
    },

    res() {
      return undefined;
    },
  },
});

export default loggerMiddleware;