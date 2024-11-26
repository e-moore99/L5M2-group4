//const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";
const BACKEND_URL = "http://localhost:4000";
const ENDPOINT = "/submit-claims-history"; // delete slash if BACKEND_URL has one

// submission handler
async function submitForm(event) {
  event.preventDefault(); // classic

  const claimsInput = document.getElementById("claimsInput");
  const responseDiv = document.getElementById("responseDiv");
  const text = claimsInput.value;

  responseDiv.textContent = ""; // clears response display (divsplay?)

  try {
    const res = await fetch(`${BACKEND_URL}${ENDPOINT}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();

    if (res.ok) {
      responseDiv.textContent = `🎉 Response: ${data.message}`;
    } else {
      responseDiv.textContent = `🔥 Response: ${data.message}`;
    }
  } catch (error) {
    responseDiv.textContent = `Error on submit: ${error.message} `;
  }
}
