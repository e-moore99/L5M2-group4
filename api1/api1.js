const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
const test1 = {
    "model" : "Starlet",
    "year" : 1998
};

// takes the model and splits it into an array of letters


let result = [];
let output = 0;
const modelToNum = (model) => {
  console.log(model)
  let carModel = model.toLowerCase().split('');
  alphabet.map((letter, i) => {
    carModel.map((word, l) => {
      if (word === letter) {
        result.push((i + 1));
      }
    });
  }); 
for (let i = 0; i < result.length; i++) {
  output += result[i]
}
  return output
}

// console.log(model)
console.log(test1)
console.log(result)
console.log(output)

module.exports = { modelToNum }