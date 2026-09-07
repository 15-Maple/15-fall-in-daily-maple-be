import { getPoint } from "#service/point.service.js";

export const getPointCtr = async (req, res) => {
  const logId = Number(req.params.logId);

  const point = await getPoint(logId);

  res.status(200).json({
    success: true,
    data: point,
  });
};
