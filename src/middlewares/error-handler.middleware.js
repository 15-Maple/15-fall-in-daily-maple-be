import { HTTP_STATUS, PRISMA_ERROR, ERROR_MESSAGES } from "#constants";
import { env } from "#env";
import { HttpException } from "#errors";
import { Prisma } from "#generated/prisma/client.ts";

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error("🚨 [서버 에러 로그]:", err);

  let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const responseBody = {
    success: false,
    message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  };

  // JSON 파싱 에러
  if (
    err instanceof SyntaxError &&
    err.status === HTTP_STATUS.BAD_REQUEST &&
    "body" in err
  ) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    responseBody.message = ERROR_MESSAGES.INVALID_JSON; // 👈 상수 적용!
  }
  // 커스텀 HttpException 에러
  else if (err instanceof HttpException) {
    statusCode = err.statusCode;
    responseBody.message = err.message;
    if (err.details) {
      responseBody.errors = err.details;
    }
  }
  // Prisma 데이터베이스 에러
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === PRISMA_ERROR.UNIQUE_CONSTRAINT) {
      statusCode = HTTP_STATUS.CONFLICT;
      responseBody.message = ERROR_MESSAGES.DUPLICATE_RESOURCE;
    } else if (err.code === PRISMA_ERROR.RECORD_NOT_FOUND) {
      statusCode = HTTP_STATUS.NOT_FOUND;
      responseBody.message = ERROR_MESSAGES.NOT_FOUND;
    }

    if (env.NODE_ENV !== "production") {
      responseBody.prismaCode = err.code;
    }
  }

  // 개발 환경 상세 스택
  if (env.NODE_ENV !== "production") {
    responseBody.stack = err.stack;
    if (!(err instanceof HttpException)) {
      responseBody.name = err.name;
    }
  }

  return res.status(statusCode).json(responseBody);
};
