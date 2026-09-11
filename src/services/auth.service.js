import jwt from "jsonwebtoken";

import { prisma } from "#db";
import { HttpException } from "#errors";
import { comparePassword } from "#utils";

export const verifyAndGenerateToken = async (logId, password) => {
  // 로그 정보 확인
  const log = await prisma.log.findUnique({
    where: { id: Number(logId) },
  });

  if (!log) {
    throw new HttpException(404, "존재하지 않는 로그입니다.");
  }

  // 비밀번호 검증
  const isMatch = await comparePassword(password, log.password);
  if (!isMatch) {
    throw new HttpException(401, "비밀번호가 일치하지 않습니다.");
  }

  // 비밀번호가 맞으면 JWT 발급
  const token = jwt.sign(
    { logId: log.id },
    process.env.JWT_SECRET || "maple-secret-key", // 임시 키를 상수처리 해둔것으로 반드시 env파일에 JWT_SECRET 값을 추가해 주세요.(실제 값은 다릅니다.)
    { expiresIn: "3h" },
  );

  return token;
};
