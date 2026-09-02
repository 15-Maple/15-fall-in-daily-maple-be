import { HTTP_STATUS, ERROR_MESSAGES } from "#constants";

import { HttpException } from "./http.exception.js";

export class NotFoundException extends HttpException {
  constructor(message = ERROR_MESSAGES.NOT_FOUND, details = null) {
    super(HTTP_STATUS.NOT_FOUND, message, details);
  }
}
