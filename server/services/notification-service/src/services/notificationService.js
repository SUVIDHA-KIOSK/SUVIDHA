function getOverview() {
  return {
    provider: "SUVIDHA Notification Department",
    category: "notification",
    status: "active",
    lastUpdated: new Date().toISOString(),
  };
}

module.exports = {
  getOverview,
};
