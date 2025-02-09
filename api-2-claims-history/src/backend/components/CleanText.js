// * strips input down to nothing but a lowercase text array

export default function cleanText(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\sa-z]/g, "") // removes all but lowercase letters & spaces
    .replace(/\s+/g, " ") // collapses multispaces (\s+)
    .split(" ")
    .filter((word) => word !== ""); // intervenes if cleanup results in empty string
}
