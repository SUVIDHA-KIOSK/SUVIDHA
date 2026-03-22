const app = require("./app");
const { port } = require("./config/env");

app.listen(port, () => {
  console.log(`Water service listening on port ${port}`);
});
