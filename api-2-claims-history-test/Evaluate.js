// * receives input data and chains validation, cleanup, rating & responding

import validateText from "./components/ValidateText.js";
import cleanText from "./components/CleanText.js";
import claimsRating from "./components/ClaimsRating.js";
import ratingResponse from "./components/RatingResponse.js";

export default function Evaluate(req, res) {
  // 📦➡️📄 extracts input text from request
  const { text } = req.body;

  // 📄❓👮‍♀️ stop invalid input & return an error, otherwise allow past
  const validationError = validateText(text);
  if (validationError) {
    return res.status(400).send({ message: validationError });
  }

  // 📄✂️ get rid of pesky egde-case generators
  const cleanInput = cleanText(text);

  // 📄🔬 count keywords as the rating
  const rating = claimsRating(cleanInput);

  // 📝 attach parameterised response depending on rating
  const message = ratingResponse(rating);

  // 📄➡️📦📢 chucks a response out the door
  return res.status(rating >= 6 ? 400 : 200).send({ message, rating });
}
