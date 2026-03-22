function getOverview() {
  return {
    provider: "SUVIDHA Document Department",
    category: "document",
    status: "active",
    lastUpdated: new Date().toISOString(),
  };
}

module.exports = {
  getOverview,
};
