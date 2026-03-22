const app = require("./app");
const { port } = require("./config/env");

app.listen(port, () => {
  console.log(`Electricity service listening on port ${port}`);
});
