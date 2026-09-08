import * as homeService from "#services/home.service.js";

export const getHomeLogs = async (req, res) => {
  const logs = await homeService.getHomeLogs();

  res.status(200).json({
    success: true,
    data: {
      items: logs,
    },
  });
};
