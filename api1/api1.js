const express = require("express");
const cors = require("cors");

const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
const regExModel = /[^a-zA-Z0-9\s]/;
let regExYear = /^[1-2][0-9][0-9][0-9]/;
let result = [];
let output = 0;
let insuranceCost = 0;

const app = express();
app.use(express.json())
app.use(cors());

app.post("/api1", (req,res) => {
  let model = req.body.model;
  let year = JSON.parse(req.body.year);
  // let carModel = model.toLowerCase().split('');
  // insert function here
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
  console.log(output)
  insuranceCost = (output *100) + year;
  console.log(`insurance cost`+insuranceCost)
}
res.send(`The premium estimate for your ${year} ${model} is $${insuranceCost}.`)
const body = req.body;
console.log(body)
res.json(body)
})

// const modelToNum = (model, year) => {
//   console.log(`model: `+model)
//   if (model.search(regExModel) != -1) {
//     console.log("error") 
//     return "error"
//   } else {
//   let carModel = model.toLowerCase().split('');
//   alphabet.map((letter, i) => {
//     carModel.map((word, l) => {
//       if (word === letter) {
//         result.push((i + 1));
//       }
//     });
//   }); 
// for (let i = 0; i < result.length; i++) {
//   output += result[i]
// }
// insuranceCost = output *100 + year;
// console.log(`insurance cost`+insuranceCost)
//   return insuranceCost
// }
// }

// console.log(model)
// console.log(test1)
console.log(`insurance cost`+ insuranceCost)

// module.exports = { modelToNum }

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`)
})