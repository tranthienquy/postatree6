import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API logs for diagnostics
  console.log("Express background server starting APIs...");

  // Proxy GET requests to bypass browser CORs
  app.get("/api/records", async (req, res) => {
    try {
      const appsScriptUrl = req.query.url as string;
      if (!appsScriptUrl || appsScriptUrl === "APPS_SCRIPT_URL_CHUA_CAU_HINH") {
        return res.status(400).json({ status: "error", message: "Google Apps Script URL has not been configured yet." });
      }

      console.log(`Proxying GET request to: ${appsScriptUrl}`);
      
      const response = await fetch(`${appsScriptUrl}?_cb=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`Google Sheets responded with HTTP status ${response.status}`);
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        throw new Error("Response from Apps Script could not be parsed as JSON: " + text.slice(0, 200));
      }

      res.json(data);
    } catch (error: any) {
      console.error("GET Proxy Error:", error);
      res.status(500).json({ status: "error", message: error.message || "Failed to fetch from Google Sheets server-side" });
    }
  });

  // Proxy POST requests to bypass browser CORs
  app.post("/api/records", async (req, res) => {
    try {
      const appsScriptUrl = req.query.url as string;
      if (!appsScriptUrl || appsScriptUrl === "APPS_SCRIPT_URL_CHUA_CAU_HINH") {
        return res.status(400).json({ status: "error", message: "Google Apps Script URL has not been configured yet." });
      }

      console.log(`Proxying POST request to: ${appsScriptUrl}`);
      const bodyData = req.body;

      const response = await fetch(appsScriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyData)
      });

      // Google Apps Script usually returns 200 or 302, but even if the fetch response status is handled, 
      // standard fetch handles redirect natively (redirect is 'follow' by default).
      let responseText = "";
      try {
        responseText = await response.text();
      } catch (e) {}

      res.json({ status: "ok", rawResponse: responseText.slice(0, 500) });
    } catch (error: any) {
      console.error("POST Proxy Error:", error);
      res.status(500).json({ status: "error", message: error.message || "Failed to post to Google Sheets server-side" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware in development or serve static in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
