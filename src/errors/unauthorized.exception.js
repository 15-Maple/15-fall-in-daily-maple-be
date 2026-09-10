import { HTTP_STATUS, ERROR_MESSAGES } from "#constants";

import { HttpException } from "./http.exception.js";

export class UnauthorizedException extends HttpException {
  constructor(message = ERROR_MESSAGES.UNAUTHORIZED, details = null) {
    super(HTTP_STATUS.UNAUTHORIZED, message, details);
  }
}
