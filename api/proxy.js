// Vercel serverless function with CORS headers
export default async function handler(req, res) {
  // Allow your own Vercel app origin (and localhost for testing)
  const allowedOrigins = [
    "https://goat-tutor-vercel-gehv6xnz6-goattutor-ngs-projects.vercel.app",
    "http://localhost:3000"
  ];
  const origin = req.headers.origin || "";

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigins.includes(origin) ? origin : "");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  // Only POST allowed
  if (req.method !== "POST") {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigins.includes(origin) ? origin : "");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigins.includes(origin) ? origin : "");
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const deepseekRes = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(req.body)
    });

    const data = await deepseekRes.json();

    // Set CORS header for the actual response
    res.setHeader("Access-Control-Allow-Origin", allowedOrigins.includes(origin) ? origin : "");
    res.status(200).json(data);
  } catch (err) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigins.includes(origin) ? origin : "");
    res.status(502).json({ error: "Proxy error" });
  }
}
