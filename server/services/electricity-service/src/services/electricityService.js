function getUsageOverview() {
  return {
    provider: "SUVIDHA Electricity Board",
    planType: "domestic",
    currentMonthUnits: 0,
    amountDue: 0,
    currency: "INR",
    status: "no-readings",
  };
}

module.exports = {
  getUsageOverview,
};
