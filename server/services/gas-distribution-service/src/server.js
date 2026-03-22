const app = require("./app");
const { port } = require("./config/env");

app.listen(port, () => {
  console.log(`Gas Distribution service listening on port ${port}`);
});
