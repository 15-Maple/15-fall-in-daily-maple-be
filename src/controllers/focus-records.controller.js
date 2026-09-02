import * as focusService from "#services/focus-records.service.js";

export const getRecords = async (req, res) => {
  // 에러는 Express 5가 캐치해서 에러 미들웨어로 던져주기 때문에 특별한 처리가 없다면 try catch를 사용하지 않아도 됨
  const records = await focusService.getFocusRecords();

  // 응답 예시입니다.
  res.status(200).json({
    success: true,
    message: "목록 조회 성공",
    data: {
      items: records,
      pagination: {},
    },
  });
};
