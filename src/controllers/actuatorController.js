export const health = (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "AuthService",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};
