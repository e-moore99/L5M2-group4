// * checks if data is not in the payload, is empty, or is too long; returns error if so, otherwise does nothing

const maxLength = 1000;

module.exports = function validateText(text) {
  if (!text) {
    return "Missing input.";
  }
  if (text.trim() === "") {
    return "Empty input is not allowed.";
  }
  if (text.length > maxLength) {
    return `Input exceeds character limit of ${maxLength}.`;
  }
  return null;
};
