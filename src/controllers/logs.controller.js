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

// GET (로그 전체 조회)
export const getLogs = async (req, res) => {
  const logs = await logService.getLogs();

  res.status(200).json({
    success: true,
    data: {
      items: logs,
    },
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
  const { logId } = req.logAuth;
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
  const { logId } = req.logAuth;

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

// 로그 이름 조회
export const nameCheck = async (req, res) => {
  const { name: logName } = res.locals.validated.query;

  // 로그 이름 (서비스 호출)
  const isNameExist = await logService.nameCheckService(logName);
  // 중복 되는 이름이면 service에서 true 리턴 -> isNameExist == true

  res.status(200).json({
    success: true,
    message: isNameExist
      ? "로그 이름 중복입니다."
      : "사용 가능한 로그 이름입니다.",
    data: isNameExist,
  });
};
