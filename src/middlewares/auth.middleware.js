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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.logAuth = decoded;
    next();
  } catch (err) {
    console.error("🚨 [JWT 인증 에러]:", err.message);
    throw new HttpException(401, "유효하지 않거나 만료된 토큰입니다.");
  }
};
