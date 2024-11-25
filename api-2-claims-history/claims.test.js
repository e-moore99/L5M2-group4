const request = require("supertest");
const app = require("./claims");

/*
Requirements to test for: 

> Input must be a JSON obj containing 'text:' key with a string value.

1. Validation step: invalidate if
	- data missing (no 'text:' key)
	- empty
	- too large strings
	- non-string inputs
	- special characters and/or numbers.

1.a. Return error indicating why input is unacceptable; 'input required' or '... must not be empty', 'input exceeds maximum length'.

2. Clean up valid input for processing: trim -> lowercase -> split.

3. Keyword identification: find only predefined keywords: "collide", "crash", "scratch", "bump", and "smash". Include common variants with minor differences (tense or plural forms), i.e. "collided", "crashed", "bumps", "smashes"--though for simplicity we won't include all possible variants. Ignore all other words.

4. Counting keywords: return 'rating' value of 1-5 based on how many keywords were in supplied input, including repeats, i.e, 'I crashed, but the crash wasn't my fault' should return a rating of 2.

5. Evaluate unacceptable 'ratings': invalidate input if number of keywords falls outside 1-5 boundary.

4.b. Return error distinct from the first validation step to make clear error is related to the number of keywords found--none or too many.
*/

// ! these are test cases for possible input payloads

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

  // * note that the below tests will be rendered superfluous if a regex is used as part of the input validation step, but we'll keep these in and not use regex to focus on the remit of the mission--demonstrate TDD

  // invalid: no numbers or special characters
  it("should return 'Input must be text only.' if there are numbers in input", async () => {
    const response = await request(app)
      .post("/endpoint-goes-here⚠️")
      .send({ text: "Been in 1 crash back in 4 March 2024." }); // could be split into two tests, one for a number and another for special characters

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Input must be text only.");
  });
});
