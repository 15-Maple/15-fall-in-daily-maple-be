import { HTTP_STATUS, ERROR_MESSAGES } from "#constants";

import { HttpException } from "./http.exception.js";

export class ConflictException extends HttpException {
  constructor(message = ERROR_MESSAGES.CONFLICT, details = null) {
    super(HTTP_STATUS.CONFLICT, message, details);
  }
}
