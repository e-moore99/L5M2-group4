const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
const test1 = {
    "model" : "Starlet",
    "year" : 1998
};

// takes the model and splits it into an array of letters


let result = [];
let output = 0;
let insuranceCost = 0;
const modelToNum = (model, year) => {
  console.log(`model: `+model)
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
insuranceCost = output *100 + year;
console.log(`insurance cost`+insuranceCost)
  return insuranceCost
}

// console.log(model)
// console.log(test1)
console.log(`insurance cost`+ insuranceCost)

module.exports = { modelToNum }