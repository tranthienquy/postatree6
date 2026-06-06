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
      
      const response = await fetch(`${appsScriptUrl}?_cb=${Date.now()}`, {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9,vi;q=0.8"
        },
        redirect: "follow"
      });

      if (!response.ok) {
        throw new Error(`Google Sheets responded with HTTP status ${response.status}`);
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        console.error("Failed to parse Apps Script response. Logging first 2000 characters of content:");
        console.error(text.slice(0, 2000));
        throw new Error(`Google Apps Script did not return JSON. It returned HTML/Text instead. This typically means the Web App deployment is configured incorrectly (e.g. not accessible by 'Anyone') or there is a script execution error in getActiveSpreadsheet(). Response preview: ${text.slice(0, 250)}`);
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
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        body: JSON.stringify(bodyData),
        redirect: "follow"
      });

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
