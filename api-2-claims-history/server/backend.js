const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../src")));

// TODO: update Azure's .env

// configuration
const ORIGIN = process.env.FRONTEND_URL || "http://localhost:3000";
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: ORIGIN,
  })
);

const server = app.listen(PORT, () => {
  const port = server.address().port; // checks what port was assigned or is currently set
  console.log(`server listening on port ${port}`);
});

// moved to claims.js
// const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";
// const ENDPOINT = "/submit-claims-history"; // delete slash if BACKEND_URL has one

// keywords as laid out in requirements, including some common variants. not ideal, but alternative is rapid scope creep
const keywords = [
  "collide", // required
  "collided",
  "collision",
  "collisions",
  "crash", // required
  "crashed",
  "crashes",
  "scratch", // required
  "scratched",
  "bump", // required
  "bumped",
  "bumps",
  "smash", // required
  "smashed",
  "smashes",
];

// parameterised responses for easier refactoring
const response = {
  none: "No claims keywords found.", // 0 keywords
  deny: "Risk Rating: 6 or more; review/deny cover.", // 6+ keywords
  accept: (rating) => `Risk Rating: ${rating}`, // 1 - 5 keywords
};

// ! functions

// * submission handler - moved to claims.js, keeping here because i'm sentimental

// async function submitForm(event) {
//   event.preventDefault(); // classic

//   const claimsInput = document.getElementById("claimsInput");
//   const responseDiv = document.getElementById("responseDiv");
//   const text = claimsInput.value;

//   responseDiv.textContent = ""; // clears response display (divsplay?)

//   try {
//     const res = await fetch(`${BACKEND_URL}${ENDPOINT}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ text }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       responseDiv.textContent = `🎉 Response: ${data.message}`;
//     } else {
//       responseDiv.textContent = `🔥 Response: ${data.message}`;
//     }
//   } catch (error) {
//     responseDiv.textContent = `Error on submit: ${error.message} `;
//   }
// }

// parent function that chains together validation, cleanup, rating & response steps
const evaluate = (req, res) => {
  // extracts input text from request
  const { text } = req.body;

  // stop invalid input & return an error, otherwise allow past
  const validationError = validateText(text);
  if (validationError) {
    return res.status(400).send({ message: validationError });
  }

  // get rid of pesky egde-case generators
  const cleanInput = cleanText(text);

  // count keywords as the rating
  const rating = claimsRating(cleanInput);

  // attach parameterised response depending on rating
  const message = ratingResponse(rating);

  // chucks a response out the door
  return res.status(rating >= 6 ? 400 : 200).send({ message, rating });
};

// child: checks if data is empty or otherwise unacceptable, returns error if so, otherwise does nothing
const validateText = (text) => {
  if (!text) {
    return "Missing input.";
  }
  if (text.trim() === "") {
    return "Empty input is not allowed.";
  }
  if (text.length > 1000) {
    return "Input exceeds character limit of 1000.";
  }
  return null; // 🐧'you didn't see anything'🐧🐧
};

// child: enforces lowercase; strips out numbers, punctuation & special characters; collapses double spaces; then filters out input if all that remains is empty space. this should address common edge cases without creating keyword bloat
const cleanText = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\sa-z]/g, "") // removes unacceptable characters
    .replace(/\s+/g, " ") // collapses double spaces (\s+) into one space
    .split(" ") // splits words
    .filter((word) => word !== ""); // intervenes if character removal resulted in an empty string
};

// child: counts how many words in the cleaned input array match the keywords array
const claimsRating = (words) => {
  // reduce() is forEach()'s antisocial, tally-obsessed sibling. where forEach() just iterates its logic over an array then carries on, reduce() iterates while clutching a tally board (the 'accumulator', here called 'count'). it updates this tally as it iterates, and when it's done, slams the door on the array, hands you the tally board, then walks off without a word.
  return words.reduce((count, word) => {
    // in muh code, i've tasked reduce() to check if the keywords array includes the current word in the input array
    if (keywords.includes(word)) {
      // if true, reduce() scratches one more line on the tally board:
      return count + 1;
    }

    // if false, reduce() does nothing and moves on to the next word. once they've all been iterated on, it hands you final tally (the accumulator)
    return count;
  }, 0); // reduce((accumulator, item) => { ... }, 0) <-- this zero is an optional value that dictates where the accumulator starts off
};
// disclaimer: don't worry future me, reduce() isn't destructive, just very rude. the array it works over remains unharmed.
// thanks freecodecamp

// child: attaches a response message to the rating
const ratingResponse = (rating) => {
  if (rating === 0) return response.none;
  if (rating >= 6) return response.deny;
  return response.accept(rating); // Call the dynamic response function
};

// * can be refactored later if shifting from inline to modular scripts; this'll do for now

app.post("/submit-claims-history", evaluate);

// ! ⚠️ for testing functions
module.exports = { app, server, cleanText, claimsRating, ratingResponse };
