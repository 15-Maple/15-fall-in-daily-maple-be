export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const PRISMA_ERROR = {
  UNIQUE_CONSTRAINT: "P2002",
  RECORD_NOT_FOUND: "P2025",
};

export const ERROR_MESSAGES = {
  BAD_REQUEST: "잘못된 요청입니다.",
  UNAUTHORIZED: "인증이 필요합니다.",
  FORBIDDEN: "권한이 없습니다.",
  NOT_FOUND: "요청하신 자원을 찾을 수 없습니다.",
  CONFLICT: "요청하신 데이터를 처리하는 중 충돌이 발생했습니다.",
  INTERNAL_SERVER_ERROR: "서버 내부 오류가 발생했습니다.",
  DUPLICATE_RESOURCE: "이미 존재하는 데이터입니다.",
  INVALID_JSON: "요청 본문(JSON) 형식이 올바르지 않습니다.",
  // 여러번 쓰이는 메시지가 생기면 추가
};
