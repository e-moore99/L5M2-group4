// * strips input down to nothing but a lowercase text array

module.exports = function cleanText(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\sa-z]/g, "")
    .replace(/\s+/g, " ")
    .split(" ")
    .filter((word) => word !== "");
};
