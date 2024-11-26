const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// keywords as laid out in requirements, including some common variants
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

// ! function that chains together validation, cleanup, rating & response steps
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
  const message = rating === 0 ? response.none : rating >= 6 ? response.deny : response.accept(rating);

  // chucks a response out the door
  return res.status(rating >= 6 ? 400 : 200).send({ message, rating });
};

// checks if data is empty or otherwise unacceptable, returns error if so, otherwise does nothing
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

// strips out numbers, punctuation & spaces, enforces lowercase
const cleanText = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\sa-z]/g, "")
    .split(/\s+/); // should handle multi-spaces as well
};

// counts the cleaned input array
const claimsRating = (words) => {
  // reduce() is forEach()'s brusque scorekeeper sibling. just like forEach(), reduce() iterates its set logic over an array's (above param 'words') elements (in this case, 'word') to ultimately return a single accumulator value ('count'), 'reducing' the array down to one value once its iterations are done
  return words.reduce((count, word) => {
    // as for its iterations: first, we task reduce() to hold up the keywords array and check if it includes any element matching a value in the input array
    if (keywords.includes(word)) {
      // if true, then we've asked reduce to modify its accumulator 'count' in this way:
      return count + 1;
    }

    // if false, reduce() does nothing and just returns 'count' as it was
    return count;

    // and then it iterates until all array elements have had the logic we put in reduce() applied to it
  }, 0); // reduce((accumulator, item) => { ... }, 0) <-- this zero is an optional value that dictates where the accumulator starts off
};
// thanks freecodecamp

// formats response to send back to frontend
const ratingResponse = (rating) => {
  if (rating === 0) {
  }
};
