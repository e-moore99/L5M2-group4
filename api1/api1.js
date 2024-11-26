const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
let regExModel = /[^a-zA-Z0-9\s]/
// const test1 = {
//     "model" : "Starlet",
//     "year" : 1998
// };

let result = [];
let output = 0;
let insuranceCost = 0;
const modelToNum = (model, year) => {
  console.log(`model: `+model)
  if (model.search(regExModel) != -1) {
    console.log("error") 
    return "error"
  } else {
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
}

// console.log(model)
// console.log(test1)
console.log(`insurance cost`+ insuranceCost)

module.exports = { modelToNum }