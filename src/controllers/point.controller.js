import { getPoint } from "#service/point.service.js";

//현재포인트조회
export const getPointCtr = async (req, res) => {
  const logId = Number(req.params.logId);

  const point = await getPoint(logId);

  res.status(200).json({
    success: true,
    data: point,
  });
};
