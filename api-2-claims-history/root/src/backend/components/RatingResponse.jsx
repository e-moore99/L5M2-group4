// * attaches a (slightly more) descriptive response message to a rating. assumes rating is a whole number >= 0, so will need refactoring if rating is required to include decimals

const response = {
  none: "No claims keywords found.", // 0 keywords
  deny: "Risk Rating: 6 or more; review/deny cover.", // 6+ keywords
  accept: (rating) => `Risk Rating: ${rating}`, // 1 - 5 keywords
};

export default function ratingResponse(rating) {
  if (rating === 0) return response.none;
  if (rating >= 6) return response.deny;
  return response.accept(rating); // integrates rating value into the response message
}
