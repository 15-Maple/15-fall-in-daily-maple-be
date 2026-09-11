import jwt from "jsonwebtoken";

import { HttpException } from "#errors";

export const requireLogAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HttpException(401, "토큰이 없습니다.");
  }

  const token = authHeader.split(" ")[1];

  try {
    // 토큰 검사
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "maple-secret-key", // 임시 키를 상수처리 해둔것으로 반드시 env파일에 JWT_SECRET 값을 추가해 주세요.(실제 값은 다릅니다.)
    );

    req.logAuth = decoded;
    next();
  } catch (err) {
    console.error("🚨 [JWT 인증 에러]:", err.message);
    throw new HttpException(401, "유효하지 않거나 만료된 토큰입니다.");
  }
};
