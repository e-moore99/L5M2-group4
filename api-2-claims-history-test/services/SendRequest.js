// * subordinate of SubmitForm; sends data, serves response

const BACKEND_URL = process.env.VITE_BACKEND_URL || "http://localhost:4000"; // ! update .env on deployment

module.exports = async function SendRequest(endpoint, payload) {
  const fullUrl = `${BACKEND_URL}${endpoint}`;

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };

  try {
    const res = await fetch(fullUrl, options);
    const data = await res.json();
    return { ok: res.ok, status: res.status, message: data.message };
  } catch (error) {
    console.error("Fetch error:", error);
    return { ok: false, message: "Error on fetch attempt." };
  }
};
