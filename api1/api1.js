const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
const test1 = {
    "model" : "Starlet",
    "year" : 1998
};

// takes the model and splits it into an array of letters
let model = test1.model.toLowerCase().split('');

let result = [];

alphabet.map((letter, i) => {
    model.map((word, l) => {
      if (word === letter) {
        result.push((i = i + 1));
      }
    });
  });

  let output = 0;
for (let i = 0; i < result.length; i++) {
    output += result[i]
}

const modelToNum = () => {
    const value = alphabet.map(letter=>{
        const isIncl = model.includes(letter);
        return isIncl = letter[i+1]
    })
    console.log(value)
    console.log(isIncl)
}

console.log(model)
console.log(test1)
console.log(result)
console.log(output)

// module.exports = 