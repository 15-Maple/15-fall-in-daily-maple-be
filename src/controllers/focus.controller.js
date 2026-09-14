import * as focusService from "#services/focus.service.js";

export const createRecord = async (req, res) => {
  const { logId } = req.logAuth;
  const { targetSeconds } = res.locals.validated.body;

  // 생성(서비스 호출)
  const result = await focusService.createFocusSession(logId, targetSeconds);

  // 응답
  res.status(201).json({
    success: true,
    message: "생성",
    data: result,
  });
};

export const getRecord = async (req, res) => {
  const { logId } = req.logAuth;

  // 조회(서비스 호출)
  const record = await focusService.getFocusSession(logId);

  // 응답
  res.status(200).json({
    success: true,
    message: "조회 성공",
    data: record,
  });
};

export const deleteRecord = async (req, res) => {
  const { logId } = req.logAuth;

  // 삭제(서비스 호출)
  const record = await focusService.getFocusSession(logId);

  if (record) {
    await focusService.deleteFocusSession(logId);
  }

  // 응답
  res.status(200).json({
    success: true,
    message: "삭제 성공",
    data: null,
  });
};

export const finishFocusSession = async (req, res) => {
  const { logId } = req.logAuth;

  const result = await focusService.finishAndGiveReward(logId);

  res.status(200).json({
    success: true,
    message: "집중 완료 및 포인트 지급 성공",
    data: result,
  });
};
