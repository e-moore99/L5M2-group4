const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// keywords as laid out in requirements, including some common variants
const keywords = [
  "collide",
  "collided",
  "collision",
  "collisions",
  "crash",
  "crashed",
  "crashes",
  "scratch",
  "scratched",
  "bump",
  "bumped",
  "bumps",
  "smash",
  "smashed",
  "smashes",
];

// this strips out punctuation & spaces, enforces lowercase on input data to avoid keyword array bloat but accept common cases
const cleanedText = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\sa-z]/g, "")
    .split(/\s+/); // should handle multi-spaces as well
};

// this counts the cleaned array of words
const claimsRating = (words) => {
  return words.reduce((count, word) => {
    if (keywords.includes(word)) {
      // compares array against each word for a match ...
      return count + 1; // ...adds 1 if true...
    }
    return count; // ...else do nothing if false
  }, 0); // initial count value
};
// thanks geeksforgeeks.org
