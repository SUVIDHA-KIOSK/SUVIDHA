function getOverview() {
  return {
    provider: "SUVIDHA Grievance Department",
    category: "grievance",
    status: "active",
    lastUpdated: new Date().toISOString(),
  };
}

module.exports = {
  getOverview,
};
