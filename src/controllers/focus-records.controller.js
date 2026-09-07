import { HttpException } from "#errors";
import * as focusService from "#services/focus-records.service.js";

// 예시를 위해 임시로 만들어둔 컨트롤러 입니다.
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

export const createRecord = async (req, res) => {
  // ⭐️ validate 미들웨어를 거친 데이터는 검증 및 변환이 완료된 res.locals.validated의 값을 사용해야 합니다.
  // res.locals.validated.body, res.locals.validated.query 등
  // 변환이 되지 않은 경우: req.body, req.query를 사용하여도 되지만, res.locals.validated을 사용하는 것을 추천합니다.
  const { logId, targetSeconds, status } = res.locals.validated.body;

  // 생성 로직(서비스 호출)

  // 응답 예시입니다.
  res.status(201).json({
    success: true,
    message: "생성",
    data: {},
  });
};

export const updateRecord = async (req, res) => {
  const { id } = req.params;

  // ⭐️ validate 미들웨어를 거친 데이터는 검증 및 변환이 완료된 res.locals.validated의 값을 사용해야 합니다.
  // res.locals.validated.body, res.locals.validated.query 등
  // 변환이 되지 않은 경우: req.body, req.query를 사용하여도 되지만, res.locals.validated을 사용하는 것을 추천합니다.
  const validatedBody = res.locals.validated.body;

  if (Object.keys(validatedBody).length === 0) {
    throw new HttpException("수정할 데이터를 하나 이상 입력해 주세요", 400);
  }

  // 업데이트 로직(서비스 호출)

  // 응답 예시입니다.
  res.status(200).json({
    success: true,
    message: "업데이트 성공",
    data: {}, // 호출 결과를 넣음
  });
};
