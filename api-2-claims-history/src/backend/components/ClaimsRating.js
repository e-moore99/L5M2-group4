// * receives an input array & counts words that match keywords array

// '= new Set([])' indexes an array with unique elements into a hash table; this speeds up referencing vs an ordinary array because Set's index keys locate each unique element, so any functions that call the Set don't have to go through the whole array to look for an element; they just get given the key to where it is. still not ideal to hardcode keywords, but alternative is rapid NLP scope creep 🤬
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

export default function claimsRating(words) {
  // notes: 1️⃣
  return words.reduce((count, word) => {
    // 2️⃣
    if (keywordSet.has(word)) {
      // 3️⃣
      return count + 1;
    }

    // 4️⃣
    return count;
  }, 0); // 5️⃣
}
// 6️⃣
// thanks freecodecamp

/*
  notes: reduce()

  1️⃣ is forEach()'s antisocial, tally-obsessed sibling. where forEach() just iterates its logic over an array then carries on, reduce() iterates while clutching a tally board (the 'accumulator', here called 'count'). it updates this tally as it iterates, and when it's done, slams the door on the array, hands you the tally board, then walks off without a word.

  2️⃣ in muh code, i've tasked reduce() to check if the keywords array includes the current word in the input array

  3️⃣ if true, reduce() scratches one more line on the tally board

  4️⃣ if false, reduce() does nothing and moves on to the next word. once they've all been iterated on, it hands you final tally (the accumulator)

  5️⃣ reduce((accumulator, item) => { ... }, 0) <-- this zero is an optional value that dictates where the accumulator starts off

  6️⃣ don't worry future me, reduce() isn't destructive, just rude. the array it works over remains unharmed.
  */
