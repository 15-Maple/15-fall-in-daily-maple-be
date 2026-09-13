import * as authService from "#services/auth.service.js";

// 로그 비밀번호 검증 및 토큰 발급
export const verifyLogPassword = async (req, res) => {
  const { logId, password } = res.locals.validated.body;

  // 비밀번호 검증 및 토큰 발급(서비스)
  const token = await authService.verifyAndGenerateToken(logId, password);

  res.status(200).json({
    success: true,
    message: "인증 성공",
    data: { token },
  });
};
