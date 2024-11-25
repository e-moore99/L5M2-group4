const request = require("supertest");
const app = require("./claims");

describe("claims keyword detection API", () => {
  // test in case empty or accidentally sent data
  it("should return an error for null inputs", async () => {
    const response = await request(app).post("/endpoint-goes-here⚠️").send({ text: null });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid input text."); // the text field should be 'required' and this shouldn't be a normal return
  });

  // ideal input: keywords are "collide", "crash", "scratch", "bump", and "smash", assuming variants such as tense or plural versions are counted
  it("should return a risk rating for 1-5 keywords", async () => {
    const response = await request(app)
      .post("/endpoint-goes-here⚠️")
      .send({
        text: "My only claim was a crash into my house's garage door that left a scratch on my car. There are no other crashes.",
      });

    expect(response.status).toBe(200);
    expect(response.body.rating).toBe(3); // "crash" "scratch" & "crashes" are all valid
  });

  // valid but not ideal: non-keywords that declare claim history, or misspelled keyword
  it("should return a risk rating for 1-5 keywords that match exactly, excluding similar but misspelled words", async () => {
    const response = await request(app).post("/endpoint-goes-here⚠️").send({
      text: "I drove my ute into the median, smnashed into a trailer, and scratched against the safety barreir.",
    });

    expect(response.status).toBe(200);
    expect(response.body.rating).toBe(1); // "drove" & "smnashed" are invalid
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
    const response = await request(app)
      .post("/endpoint-goes-here⚠️")
      .send({
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
  // invalid: no numbers or special characters
  it("should return 'Input must be text only.' if there are numbers or special characters", async () => {
    const response = await request(app).post("/endpoint-goes-here⚠️").send({ text: "Been in 1 crash back in March/" }); // could be a good idea to split this into two tests, one for a number and another for special characters

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Input must be text only.");
  });
});
