// * receives input data and chains validation, cleanup, rating & responding

// import validateText from "./components/ValidateText.js";
// import cleanText from "./components/CleanText.js";
// import claimsRating from "./components/ClaimsRating.js";
// import ratingResponse from "./components/RatingResponse.js";

const { validateText, cleanText, claimsRating, ratingResponse } = require("./components");

module.exports = function Evaluate(req, res) {
  const { text } = req.body;

  const validationError = validateText(text);
  if (validationError) {
    return res.status(400).send({ message: validationError });
  }
  const cleanInput = cleanText(text);
  const rating = claimsRating(cleanInput);
  const message = ratingResponse(rating);
  return res.status(rating >= 6 ? 400 : 200).send({ message, rating });
};
