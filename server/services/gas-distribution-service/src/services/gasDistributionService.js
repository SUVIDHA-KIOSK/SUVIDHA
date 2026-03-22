function getOverview() {
  return {
    provider: "SUVIDHA Gas Distribution Department",
    category: "gas-distribution",
    status: "active",
    lastUpdated: new Date().toISOString(),
  };
}

module.exports = {
  getOverview,
};
