const express = require("express");
const { connection } = require("./config/database");
const errorHandler = require("./middlewares/errorhandler");
const fileupload = require("express-fileupload");
require("dotenv").config();
const app = express();
const cors = require("cors");
[];

app.use(express.json());
app.use(cors());

const port = 5000;
// database connection
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Server! id: " + connection.threadId);
});

app.use(
  fileupload({
    useTempFiles: true,
  })
);

// mount routers
app.use("/users/auth", require("./Auth/auth.route"));
app.use(
  "/users/verification/step",
  require("./VerificationSteps/verificationSteps.route")
);
app.use("/users", require("./UserProfiles/users.route"));
app.use("/admin", require("./Admin/admin.route"));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
