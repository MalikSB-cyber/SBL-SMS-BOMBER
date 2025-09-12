export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    // Parse body manually (Vercel fix)
    const body = await new Promise((resolve) => {
      let data = "";
      req.on("data", (chunk) => { data += chunk; });
      req.on("end", () => {
        try {
          resolve(JSON.parse(data || "{}"));
        } catch {
          resolve({});
        }
      });
    });

    const { number } = body;

    if (!number) {
      return res.status(400).json({ error: "Number is required" });
    }

    // Forward request to external API
    const response = await fetch(
      `https://shadowscriptz.xyz/public_apis/smsbomberapi.php?num=${number}`
    );

    const data = await response.text();

    return res.status(200).json({ success: true, result: data });
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
  }
