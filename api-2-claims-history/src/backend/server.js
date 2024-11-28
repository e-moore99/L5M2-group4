// turns off the linting because i know the code works, i don't care what the linter thinks
/* eslint-disable */

// * server config

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Evaluate from "./Evaluate.js";

dotenv.config();

// ! ⚠️ just for testing - PORT, FRONTEND_URL & FRONTEND_PORT will need to be refactored if deploying
const PORT = process.env.VITE_BACKEND_PORT || 4000;
const FRONTEND_URL = process.env.VITE_FRONTEND_URL;
const FRONTEND_PORT = process.env.VITE_FRONTEND_PORT || 5173;
const ORIGIN = `${FRONTEND_URL}:${FRONTEND_PORT}`;

const app = express();
app.use(express.json());
app.use(cors({ origin: ORIGIN }));

app.post("/submit-claims-history", (req, res) => {
  Evaluate(req, res); // calls Evaluate to handle requests
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} & receiving requests from ${ORIGIN}`);
});

// ! for  Jest testing
// module.exports = { app };
// export default app;
