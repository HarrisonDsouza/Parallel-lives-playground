require("dotenv").config();
const express = require("express");
const cors = require("cors");
const teams = require("./routes/teams");
const clients = require("./routes/clients");
const portfolios = require("./routes/portfolios");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/teams", teams);
app.use("/api/clients", clients);
app.use("/api/portfolios", portfolios);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend running on ${port}`));
