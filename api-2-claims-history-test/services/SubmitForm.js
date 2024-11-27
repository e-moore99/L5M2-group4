// * presents the input form and the response display

import { useState } from "react";
import { SendRequest } from "./SendRequest";

export default function SubmitForm() {
  const [text, setText] = useState(""); // 🚚📦 input data
  const [response, setResponse] = useState(""); // 📦📢 backend response

  const handleSubmit = async (event) => {
    event.preventDefault();
    setResponse("");

    try {
      const res = await SendRequest("/submit-claims-history", { text });
      if (res.ok) {
        setResponse(`✅ Response: ${res.message}`);
      } else {
        setResponse(`🚫 Response: ${res.message}`);
      }
    } catch (error) {
      setResponse(`🚫📦 Submit failed: ${error.message}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          required
          maxLength="1000"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter claims history"
          cols="50" // width
          rows="6" // height
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      <div>{response}</div>
    </div>
  );
}
