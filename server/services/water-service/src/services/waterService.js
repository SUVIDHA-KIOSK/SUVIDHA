function getOverview() {
  return {
    provider: "SUVIDHA Water Department",
    category: "water",
    status: "active",
    lastUpdated: new Date().toISOString(),
  };
}

module.exports = {
  getOverview,
};
