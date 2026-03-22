function getOverview() {
  return {
    provider: "SUVIDHA Waste Management Department",
    category: "waste-management",
    status: "active",
    lastUpdated: new Date().toISOString(),
  };
}

module.exports = {
  getOverview,
};
