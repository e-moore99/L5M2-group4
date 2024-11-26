//config
//const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000"; // points to backend
const ENDPOINT = "/submit-claims-history"; // delete slash if BACKEND_URL has one

// fetch function
async function sendRequest(url, endpoint, payload) {
  const fullUrl = `${url}${endpoint}`;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };

  try {
    const res = await fetch(fullUrl, options);
    const data = await res.json();
    return { ok: res.ok, message: data.message };
  } catch (error) {
    console.error("Fetch error:", error);
    return { ok: false, message: "Error on fetch attempt." };
  }
}

// submission handler
async function submitForm(event) {
  event.preventDefault(); // classic

  const claimsInput = document.getElementById("claimsInput");
  const responseDiv = document.getElementById("responseDiv");
  const text = claimsInput.value;

  responseDiv.textContent = ""; // clears response display (divsplay?)

  const res = await sendRequest(BACKEND_URL, ENDPOINT, { text });

  if (res.ok) {
    responseDiv.textContent = `🎉 Response: ${data.message}`;
  } else {
    responseDiv.textContent = `🔥 Response: ${data.message}`;
  }
}
