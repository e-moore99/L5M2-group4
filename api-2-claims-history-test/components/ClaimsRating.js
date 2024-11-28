// * receives an input array & counts words that match keywords array

const keywordSet = new Set([
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
]);
// thanks geeksforgeeks

module.exports = function claimsRating(words) {
  return words.reduce((count, word) => {
    if (keywordSet.has(word)) {
      return count + 1;
    }

    return count;
  }, 0);
};
