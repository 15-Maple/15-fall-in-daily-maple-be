import { HTTP_STATUS, ERROR_MESSAGES } from "#constants";

import { HttpException } from "./http.exception.js";

export class BadRequestException extends HttpException {
  constructor(message = ERROR_MESSAGES.BAD_REQUEST, details = null) {
    super(HTTP_STATUS.BAD_REQUEST, message, details);
  }
}
