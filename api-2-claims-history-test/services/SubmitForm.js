const readline = require("readline");
const { SendRequest } = require("./SendRequest");

module.exports = function SubmitForm() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const handleSubmit = async (text) => {
    console.log("Submitting...");
    try {
      const res = await SendRequest("/submit-claims-history", { text });
      if (res.ok) {
        console.log(`✅ Response: ${res.message}`);
      } else {
        console.log(`🚫 Response: ${res.message}`);
      }
    } catch (error) {
      console.log(`🚫📦 Submit failed: ${error.message}`);
    }
  };

  rl.question("Enter claims history: ", (input) => {
    handleSubmit(input);
    rl.close();
  });
};
