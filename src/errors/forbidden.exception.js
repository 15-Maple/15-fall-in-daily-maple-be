import { HTTP_STATUS, ERROR_MESSAGES } from "#constants";

import { HttpException } from "./http.exception.js";

export class ForbiddenException extends HttpException {
  constructor(message = ERROR_MESSAGES.FORBIDDEN, details = null) {
    super(HTTP_STATUS.FORBIDDEN, message, details);
  }
}
