const express = require("express");
const cors = require("cors");

const alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
const regExModel = /[^a-zA-Z0-9\s]/;
const regExYear = /^[1-2]\d{3}/;

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api1", (req, res) => {
  let result = [];
  let output = 0;
  let insuranceCost = 0;
  let model = req.body.model;
  let year = req.body.year;
  // let carModel = model.toLowerCase().split('');
  // insert function here
  console.log(`model: ` + model);
  if (!regExYear.test(String(year))) {
    console.log("error");
    return res.sendStatus(400).send("error: invalid model input");
  }
  //  else 
   if (regExModel.test(model)) {
    // regex is designed for strings so the String() is to run the year through it in an accepted format
    console.log("error");
    return res.sendStatus(400).send("error: invalid year input");
  }
  //  else {
  let carModel = model.toLowerCase().split("");
  alphabet.map((letter, i) => {
    carModel.map((word, l) => {
      if (word === letter) {
        result.push(i + 1);
      }
    });
  });
  for (let i = 0; i < result.length; i++) {
    output += result[i];
  }
    // console.log(output);
    insuranceCost = output * 100 + year;
    console.log(`insurance cost` + insuranceCost);
  // }
  res.send(
    `The premium estimate for your ${year} ${model} is $${insuranceCost}.`
  );
  const body = req.body;
  console.log(body);
  res.json(body);
});

// console.log(model)
// console.log(test1)
// console.log(`insurance cost`+ insuranceCost)

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});

module.exports = app;
