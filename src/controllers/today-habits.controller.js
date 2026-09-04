import { BadRequestException } from "#errors";
import * as habitService from "#services/today-habits.service.js";

export const getTodayHabits = async (req, res) => {
  const logId = Number(req.params.logId);

  console.log(`logId= ${logId}`);

  if (!Number.isInteger(logId) || logId <= 0) {
    throw new BadRequestException("올바르지 않는 로그 아이디입니다.");
  }

  // 에러는 Express 5가 캐치해서 에러 미들웨어로 던져주기 때문에 특별한 처리가 없다면 try catch를 사용하지 않아도 됨
  const items = await habitService.getTodayHabits(logId);

  // 응답 예시입니다.
  res.status(200).json({
    success: true,
    message: "오늘의 습관목록 조회 성공",
    data: { items },
  });
};
