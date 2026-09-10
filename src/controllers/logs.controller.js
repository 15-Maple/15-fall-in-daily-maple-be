import * as logService from "#services/logs.service.js";

export const createLog = async (req, res) => {
  // 에러는 Express 5가 캐치해서 에러 미들웨어로 던져주기 때문에 특별한 처리가 없다면 try catch를 사용하지 않아도 됨
  // const log = await logService.createLog(req.body);
  const log = await logService.createLog(res.locals.validated.body);

  // 응답
  res.status(201).json({
    success: true,
    message: "로그 생성 성공",
    data: log,
  });
};

// GET :id
export const getLog = async (req, res) => {
  const logId = Number(req.params.logId);
  const log = await logService.getLog(logId);

  // 응답
  res.status(200).json({
    success: true,
    message: "로그 조회 성공",
    data: log,
  });
};

// PATCH
export const updateLog = async (req, res) => {
  const logId = Number(res.locals.validated.params.logId);
  const logData = res.locals.validated.body;
  const updatedLog = await logService.updateLog(logId, logData);

  // 응답
  res.status(200).json({
    success: true,
    message: "로그 수정 성공",
    data: updatedLog,
  });
};
