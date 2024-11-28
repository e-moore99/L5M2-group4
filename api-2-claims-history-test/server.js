// * server config

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Evaluate = require("./Evaluate");

dotenv.config();

// ! ⚠️ just for testing - PORT, FRONTEND_URL & FRONTEND_PORT will need to be refactored if deploying
const PORT = process.env.VITE_BACKEND_PORT || 0;
const FRONTEND_URL = process.env.VITE_FRONTEND_URL;
const FRONTEND_PORT = process.env.VITE_FRONTEND_PORT || 5173;
const ORIGIN = `${FRONTEND_URL}:${FRONTEND_PORT}`;

const app = express();
app.use(express.json());
app.use(cors({ origin: ORIGIN }));

app.post("/submit-claims-history", (req, res) => {
  Evaluate(req, res);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} & receiving requests from ${ORIGIN}`);
});

// ! for  Jest testing
module.exports = app;
