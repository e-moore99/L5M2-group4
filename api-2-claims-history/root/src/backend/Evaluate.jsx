// * receives input data and chains validation, cleanup, rating & responding

import { validateText } from "./components/ValidateText";
import { cleanText } from "./components/CleanText";
import { claimsRating } from "./components/ClaimsRating";
import { ratingResponse } from "./components/RatingResponse";

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
