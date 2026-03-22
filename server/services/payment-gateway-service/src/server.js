const app = require("./app");
const { port } = require("./config/env");

app.listen(port, () => {
  console.log(`Payment Gateway service listening on port ${port}`);
});
