const request = require("supertest");
const app = require("./claims");

// ! these are unit tests for function in claims.js

const { cleanText, claimsRating, ratingResponse } = require("./claims");

// returns array without capitals, punctuation, numbers or spaces
describe("cleanText function", () => {
  it("should convert input to lowercase then remove punctuation, symbols, numerals and spaces", () => {
    const input = "CraSH! Sma4sh3, sM4sh, Collided? coll.ide";
    const expected = ["crash", "smash", "smsh", "collided", "collide"];
    expect(cleanText(input)).toEqual(expected);
  });
});

// counts input elements that match keyword array & returns that as a rating
describe("claimsRating function", () => {
  it("should count elements that equal those in the keyword array while ignoring all else", () => {
    const input = ["i", "crashed", "bucket", "smash", "smsh", "collided", "collide", "collider"];
    const rating = claimsRating(input);
    expect(rating).toEqual(4);
  });
  it("should count valid elements even if they are repeated", () => {
    const input = ["crash", "crash", "smash", "crash", "scratched"];
    const rating = claimsRating(input);
    expect(rating).toEqual(5);
  });
  it("should return a count of 0 if an array is sent but no keywords match", () => {
    const input = ["apple", "mango", "banana"];
    const rating = claimsRating(input);
    expect(rating).toEqual(0);
  });
});

// matches the generated rating to a descriptive response
describe("ratingResponse function", () => {
  it("should return a 'Risk Rating: (rating)' if the rating equals 1 to 5", () => {
    const ratingLow = 1;
    const responseLow = ratingResponse(ratingLow);
    expect(responseLow).toContain("Risk Rating: 1");

    const ratingMid = 3;
    const responseMid = ratingResponse(ratingMid);
    expect(responseMid).toContain("Risk Rating: 3");

    const ratingHigh = 5;
    const responseHigh = ratingResponse(ratingHigh);
    expect(responseHigh).toContain("Risk Rating: 5");
  });

  it("should return 'No claims keywords found' if the rating equals 0", () => {
    const ratingNone = 0;
    const responseNone = ratingResponse(ratingNone);
    expect(responseNone).toContain("No claims keywords found.");
  });

  it("should return 'Risk Rating: 6 or more; review/deny cover' if the rating is more than 5", () => {
    const ratingTooHigh = 6;
    const responseTooHigh = ratingResponse(ratingTooHigh);
    expect(responseTooHigh).toContain("Risk Rating: 6 or more; review/deny cover.");

    const ratingInsane = 12;
    const responseInsane = ratingResponse(ratingInsane);
    expect(responseInsane).toContain("Risk Rating: 6 or more; review/deny cover.");
  });
});

// ! these are API tests for possible input payloads

describe("claims keyword detection API", () => {
  // ideal input: keywords are "collide", "crash", "scratch", "bump", and "smash", assuming variants such as tense or plural versions are counted
  it("should return a risk rating for 1-5 keywords", async () => {
    const response = await request(app).post("/submit-claims-history").send({
      text: "My only claim was a crash into my house's garage door that left a scratch on my car. There are no other crashes.",
    });

    expect(response.status).toBe(200);
    expect(response.body.rating).toBe(3); // "crash" "scratch" & "crashes" are all valid
  });

  // valid but not ideal: non-keywords that declare claim history, or misspelled keyword
  it("should return a risk rating for 1-5 keywords that match exactly, excluding misspelled words", async () => {
    const response = await request(app).post("/submit-claims-history").send({
      text: "I drove my ute into the median, smashed into a trailer, and scrached against the safety barreir",
    });

    expect(response.status).toBe(200);
    expect(response.body.rating).toBe(1); // "smashed" is the only valid keyword
  });

  // invalid: sent correct data type & acceptable input, but no keywords present
  it("should return 'No claims keywords found' if there are 0 keywords", async () => {
    const response = await request(app)
      .post("/submit-claims-history")
      .send({ text: "Actually, I've had seven at-fault accident claims in the past month." });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("No claims keywords found.");
  });

  // invalid: detected keywords > 5
  it("should return, '6 or more claims keywords found; decline cover' if there are 6+ keywords", async () => {
    const response = await request(app).post("/submit-claims-history").send({
      text: "There was a crash, saw two cars collide, not just bump but smash, also my cat scratched me. But yeah, boom! Crash, smash! Wasn't me though.",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Risk Rating: 6 or more; review/deny cover.");
  });

  // invalid: correct data type but nonsensical content
  it("should return, 'No claims keywords found.' if input is garbage", async () => {
    const response = await request(app).post("/submit-claims-history").send({ text: "sadasfadaasf cthulhufhtagn" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("No claims keywords found.");
  });

  // ? below can be made redundant--retain or use regex?
  // * regex

  // // invalid: no numbers or special characters
  // it("should return 'Input must be text only.' if there are numbers in input", async () => {
  //   const response = await request(app)
  //     .post("/submit-claims-history")
  //     .send({ text: "Been in 1 crash back in 4 March 2024." }); // could be split into two tests, one for a number and another for special characters

  //   expect(response.status).toBe(400);
  //   expect(response.body.message).toBe("Input must be text only.");
  // });
});
