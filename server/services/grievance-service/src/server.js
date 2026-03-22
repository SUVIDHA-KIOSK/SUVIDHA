const app = require("./app");
const { port } = require("./config/env");

app.listen(port, () => {
  console.log(`Grievance service listening on port ${port}`);
});
