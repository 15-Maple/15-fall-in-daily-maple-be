import { HttpException } from "#errors";

/**
 * Zod 스키마를 이용한 요청 데이터 검증 미들웨어
 * @param {import('zod').AnyZodObject} schema - 객체 형태의 Zod 스키마
 * @param {"body" | "query" | "params"} [target="body"] - 검증할 객체의 위치 (기본값: "body")
 * @returns {Function} Express 미들웨어 함수
 */
export const validate =
  (schema, target = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[target]);

    // 검증 실패
    if (!result.success) {
      const errorObj = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        errorObj[field] = issue.message;
      });

      return next(
        new HttpException(
          400,
          `입력값이 검증에 실패했습니다. (${target})`,
          errorObj,
        ),
      );
    }

    // 검증 성공
    // Zod 검증 및 변환이 완료된 데이터를 저장합니다.
    // 컨트롤러에서는 원본 req 데이터 대신
    // res.locals.validated[target]을 사용합니다.
    res.locals.validated = res.locals.validated || {};
    res.locals.validated[target] = result.data;
    next();
  };
