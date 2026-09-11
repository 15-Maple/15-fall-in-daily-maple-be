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
export const getLogById = async (req, res) => {
  const logId = Number(req.params.logId);
  const log = await logService.getLogById(logId);

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

export const deleteLog = async (req, res) => {
  const { logId } = res.locals.validated.params;

  // 삭제(서비스 호출)
  const log = await logService.getLogById(logId);

  if (log) {
    await logService.deleteLog(logId);
  }

  // 응답
  res.status(200).json({
    success: true,
    message: "로그 삭제 성공",
    data: null,
  });
};

// export const verifyPassword = async (req, res) => {
//   const logId = Number(res.locals.validated.params.logId);
//   const { password } = res.locals.validated.body;

//   const result = await logService.verifyPassword(logId, password);

//   res.status(200).json({
//     success: true,
//     message: "비밀번호 확인 성공",
//     data: result,
//   });
// };
