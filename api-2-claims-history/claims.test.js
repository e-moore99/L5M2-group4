const request = require("supertest");
const app = require("./claims");

// ! these are unit tests for each function in claims.js

const {} = require("./claims");

// returns array without punctuation, capitals or numbers
describe("cleanedText function", () => {
  it("should convert text to lowercase and remove punctuation", () => {
    const input = "CraSH! Sma4sh3, sM4sh, Collided? coll.ide";
    const expected = ["crash", "smash", "smsh", "collided", "collide"];
    expect(app.cleanedText(input)).toEqual(expected);
  });
});

// returns a count of how many input elements match an element in the keyword array as 'rating'
describe("claimsRating function", () => {
  it("should count elements that equal those in the keyword array while ignoring all else", () => {
    const input = ["i", "crashed", "bucket", "smash", "smsh", "collided", "collide", "collider"];
    const rating = app.claimsRating(input);
    expect(rating).toEqual(4);
  });
  it("should count valid elements even if they are repeated", () => {
    const input = ["crash", "crash", "smash", "crash", "scratched"];
    const rating = app.claimsRating(input);
    expect(rating).toEqual(5);
  });
  it("should return a count of 0 if an array is sent but no keywords match", () => {
    const input = ["apple", "mango", "banana"];
    const rating = app.claimsRating(input);
    expect(rating).toEqual(0);
  });
});

describe("ratingResponse function", () => {
  it("should return a 'Risk Rating: (rating)' if the rating equals 1 to 5", () => {
    const ratingLow = 1;
    const responseLow = app.ratingResponse(ratingLow);
    expect(responseLow).toContain("Risk Rating: 1");

    const ratingMid = 3;
    const responseMid = app.ratingResponse(ratingMid);
    expect(responseMid).toContain("Risk Rating: 3");

    const ratingHigh = 5;
    const responseHigh = app.ratingResponse(ratingHigh);
    expect(responseHigh).toContain("Risk Rating: 5");
  });

  it("should return 'No claims keywords detected' if the rating equals 0", () => {
    const ratingNone = 0;
    const responseNone = app.ratingResponse(ratingNone);
    expect(responseNone).toContain("No claims keywords detected.");
  });

  it("should return 'Risk Rating: 6 or more; review/deny cover' if the rating is more than 5", () => {
    const ratingTooHigh = 6;
    const responseTooHigh = app.ratingResponse(ratingTooHigh);
    expect(responseTooHigh).toContain("Risk Rating: 6 or more; review/deny cover.");

    const ratingInsane = 12;
    const responseInsane = app.ratingResponse(ratingInsane);
    expect(responseInsane).toContain("Risk Rating: 6 or more; review/deny cover.");
  });
});

// ! these are API tests for possible input payloads

describe("claims keyword detection API", () => {
  // ideal input: keywords are "collide", "crash", "scratch", "bump", and "smash", assuming variants such as tense or plural versions are counted
  it("should return a risk rating for 1-5 keywords", async () => {
    const response = await request(app).post("/endpoint-goes-here⚠️").send({
      text: "My only claim was a crash into my house's garage door that left a scratch on my car. There are no other crashes.",
    });

    expect(response.status).toBe(200);
    expect(response.body.rating).toBe(3); // "crash" "scratch" & "crashes" are all valid
  });

  // valid but not ideal: non-keywords that declare claim history, or misspelled keyword
  it("should return a risk rating for 1-5 keywords that match exactly, excluding similar but misspelled words", async () => {
    const response = await request(app).post("/endpoint-goes-here⚠️").send({
      text: "I drove my ute into the median, smashed into a trailer, and scrached against the safety barreir",
    });

    expect(response.status).toBe(200);
    expect(response.body.rating).toBe(1); // "drove" & "scrached" are invalid
  });

  // invalid: sent correct data type & acceptable input, but no keywords present
  it("should return 'No claims keywords found' if there are 0 keywords", async () => {
    const response = await request(app)
      .post("/endpoint-goes-here⚠️")
      .send({ text: "Actually, I've had seven at-fault accident claims in the past month." });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("No claims keywords found.");
  });

  // invalid: detected keywords > 5
  it("should return, '6 or more claims keywords found; decline cover' if there are 6+ keywords", async () => {
    const response = await request(app).post("/endpoint-goes-here⚠️").send({
      text: "There was a crash, saw two cars collide, not just bump but smash, also my cat scratched me. But yeah, boom! Crash, smash! Wasn't me though.",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("6 or more claims keywords found; decline cover.");
  });

  // invalid: correct data type but nonsensical content
  it("should return, 'No claims keywords found.' if input is garbage", async () => {
    const response = await request(app).post("/endpoint-goes-here⚠️").send({ text: "sadasfadaasf cthulhufhtagn" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("No claims keywords found.");
  });

  // * below can be made redundant--retain or use regex?

  // invalid: no numbers or special characters
  it("should return 'Input must be text only.' if there are numbers in input", async () => {
    const response = await request(app)
      .post("/endpoint-goes-here⚠️")
      .send({ text: "Been in 1 crash back in 4 March 2024." }); // could be split into two tests, one for a number and another for special characters

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Input must be text only.");
  });
});
