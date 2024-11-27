// * subordinate of SubmitForm; sends data, serves response

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"; // ! update .env on deployment

export async function SendRequest(endpoint, payload) {
  // 🚦 formats the endpoint
  const fullUrl = `${BACKEND_URL}${endpoint}`;
  // 📦 formats the input data
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };

  // 🚚 sends data through to endpoint & unpacks response
  try {
    const res = await fetch(fullUrl, options);
    const data = await res.json();
    return { ok: res.ok, status: res.status, message: data.message };
  } catch (error) {
    console.error("Fetch error:", error);
    return { ok: false, message: "Error on fetch attempt." };
  }
}
