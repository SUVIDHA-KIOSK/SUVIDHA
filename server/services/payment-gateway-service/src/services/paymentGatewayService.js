function getOverview() {
  return {
    provider: "SUVIDHA Payment Gateway Department",
    category: "payment-gateway",
    status: "active",
    lastUpdated: new Date().toISOString(),
  };
}

module.exports = {
  getOverview,
};
