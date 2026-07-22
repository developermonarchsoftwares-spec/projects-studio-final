var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// api/contact.js
var contact_exports = {};
__export(contact_exports, {
  default: () => handler
});
import nodemailer from "file:///D:/graphician%20studio/new%20one/projects-studio-final/node_modules/nodemailer/lib/nodemailer.js";
function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}
async function readRequestBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const rawBody = Buffer.concat(chunks).toString("utf8");
  return rawBody ? JSON.parse(rawBody) : {};
}
async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed" });
  }
  const smtpPassword = process.env.GMAIL_SMTP_PASS;
  if (!smtpPassword) {
    return sendJson(res, 500, { error: "Gmail SMTP password is not configured" });
  }
  try {
    const { name = "", email = "", subject = "", message = "" } = await readRequestBody(req);
    if (!name || !email || !subject || !message) {
      return sendJson(res, 400, { error: "Name, email, subject, and message are required" });
    }
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: SMTP_USER,
        pass: smtpPassword
      }
    });
    await transporter.verify();
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${safeSubject}</title>
  </head>
  <body style="margin:0; padding:0; background:#050505; font-family:Arial, Helvetica, sans-serif; color:#ffffff;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#050505; padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; background:#111111; border:1px solid rgba(255,255,255,0.16); border-radius:20px; overflow:hidden;">
            <tr>
              <td style="padding:28px 30px; background:linear-gradient(135deg,#ed1d24 0%,#111111 58%,#000000 100%);">
                <div style="display:inline-block; padding:8px 12px; background:#ed1d24; color:#ffffff; font-size:20px; line-height:1; font-weight:800; letter-spacing:-0.02em;">GRAPHICIAN</div>
                <div style="display:inline-block; padding:8px 0 8px 8px; color:#ffffff; font-size:20px; line-height:1; font-weight:800;">STUDIOS</div>
                <p style="margin:14px 0 0; color:rgba(255,255,255,0.82); font-size:13px; letter-spacing:0.12em; text-transform:uppercase;">New Website Enquiry</p>
                <h1 style="margin:12px 0 0; color:#ffffff; font-size:28px; line-height:1.18; font-weight:700;">Contact Form Submission</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 30px 8px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding:16px 0; border-bottom:1px solid rgba(255,255,255,0.12);">
                      <div style="color:#ed1d24; font-size:12px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase;">Name</div>
                      <div style="margin-top:7px; color:#ffffff; font-size:18px; line-height:1.45; font-weight:700;">${safeName}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px 0; border-bottom:1px solid rgba(255,255,255,0.12);">
                      <div style="color:#ed1d24; font-size:12px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase;">Email</div>
                      <div style="margin-top:7px; color:#ffffff; font-size:16px; line-height:1.45;"><a href="mailto:${safeEmail}" style="color:#ffffff; text-decoration:none;">${safeEmail}</a></div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px 0; border-bottom:1px solid rgba(255,255,255,0.12);">
                      <div style="color:#ed1d24; font-size:12px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase;">Subject</div>
                      <div style="margin-top:7px; color:#ffffff; font-size:18px; line-height:1.45; font-weight:700;">${safeSubject}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px 0 8px;">
                      <div style="color:#ed1d24; font-size:12px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase;">Message</div>
                      <div style="margin-top:10px; padding:18px; background:#050505; border:1px solid rgba(255,255,255,0.12); border-radius:14px; color:rgba(255,255,255,0.9); font-size:15px; line-height:1.65;">${safeMessage}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 30px 30px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:rgba(237,29,36,0.12); border:1px solid rgba(237,29,36,0.3); border-radius:14px;">
                  <tr>
                    <td style="padding:16px 18px; color:rgba(255,255,255,0.78); font-size:13px; line-height:1.55;">
                      Reply directly to this email to respond to <strong style="color:#ffffff;">${safeName}</strong>.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
    await transporter.sendMail({
      from: `"Graphician Studios Website" <${SMTP_USER}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject,
      html,
      text: [
        "New Website Enquiry",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message
      ].join("\n")
    });
    return sendJson(res, 200, { ok: true });
  } catch (error) {
    console.error("Gmail SMTP send failed", {
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response
    });
    return sendJson(res, 500, { error: "Email could not be sent" });
  }
}
var SMTP_USER, TO_EMAIL;
var init_contact = __esm({
  "api/contact.js"() {
    SMTP_USER = "graphicianstudios@gmail.com";
    TO_EMAIL = "Graphicianstudios@gmail.com";
  }
});

// vite.config.js
import { defineConfig, loadEnv } from "file:///D:/graphician%20studio/new%20one/projects-studio-final/node_modules/vite/dist/node/index.js";
import react from "file:///D:/graphician%20studio/new%20one/projects-studio-final/node_modules/@vitejs/plugin-react/dist/index.js";
function contactApiDevServer() {
  return {
    name: "contact-api-dev-server",
    apply: "serve",
    configResolved(config) {
      const env = loadEnv(config.mode, config.root, "");
      process.env.GMAIL_SMTP_PASS = process.env.GMAIL_SMTP_PASS || env.GMAIL_SMTP_PASS;
    },
    configureServer(server) {
      server.middlewares.use("/api/contact", async (req, res, next) => {
        if (req.method !== "POST") return next();
        try {
          const chunks = [];
          for await (const chunk of req) {
            chunks.push(chunk);
          }
          const rawBody = Buffer.concat(chunks).toString("utf8");
          req.body = rawBody ? JSON.parse(rawBody) : {};
          const { default: handler2 } = await Promise.resolve().then(() => (init_contact(), contact_exports));
          await handler2(req, res);
        } catch (error) {
          console.error("Local contact API failed", error);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Email could not be sent" }));
        }
      });
    }
  };
}
var vite_config_default = defineConfig({
  plugins: [react(), contactApiDevServer()],
  base: "/",
  esbuild: {
    drop: ["console", "debugger"]
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1200,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three/")) return "three";
          if (id.includes("@react-three/fiber") || id.includes("@react-three/drei")) return "fiber";
          if (id.includes("framer-motion")) return "framer";
          if (id.includes("@tsparticles")) return "tsparticles";
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/") || id.includes("react-router-dom")) return "vendor";
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYXBpL2NvbnRhY3QuanMiLCAidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxncmFwaGljaWFuIHN0dWRpb1xcXFxuZXcgb25lXFxcXHByb2plY3RzLXN0dWRpby1maW5hbFxcXFxhcGlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGdyYXBoaWNpYW4gc3R1ZGlvXFxcXG5ldyBvbmVcXFxccHJvamVjdHMtc3R1ZGlvLWZpbmFsXFxcXGFwaVxcXFxjb250YWN0LmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9ncmFwaGljaWFuJTIwc3R1ZGlvL25ldyUyMG9uZS9wcm9qZWN0cy1zdHVkaW8tZmluYWwvYXBpL2NvbnRhY3QuanNcIjtpbXBvcnQgbm9kZW1haWxlciBmcm9tICdub2RlbWFpbGVyJ1xyXG5cclxuY29uc3QgU01UUF9VU0VSID0gJ2dyYXBoaWNpYW5zdHVkaW9zQGdtYWlsLmNvbSdcclxuY29uc3QgVE9fRU1BSUwgPSAnR3JhcGhpY2lhbnN0dWRpb3NAZ21haWwuY29tJ1xyXG5cclxuZnVuY3Rpb24gZXNjYXBlSHRtbCh2YWx1ZSkge1xyXG4gIHJldHVybiBTdHJpbmcodmFsdWUpXHJcbiAgICAucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxyXG4gICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxyXG4gICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKVxyXG4gICAgLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKVxyXG4gICAgLnJlcGxhY2UoLycvZywgJyYjMzk7JylcclxufVxyXG5cclxuZnVuY3Rpb24gc2VuZEpzb24ocmVzLCBzdGF0dXMsIHBheWxvYWQpIHtcclxuICByZXMuc3RhdHVzQ29kZSA9IHN0YXR1c1xyXG4gIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJylcclxuICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiByZWFkUmVxdWVzdEJvZHkocmVxKSB7XHJcbiAgaWYgKHJlcS5ib2R5ICYmIHR5cGVvZiByZXEuYm9keSA9PT0gJ29iamVjdCcpIHJldHVybiByZXEuYm9keVxyXG4gIGlmICh0eXBlb2YgcmVxLmJvZHkgPT09ICdzdHJpbmcnKSByZXR1cm4gSlNPTi5wYXJzZShyZXEuYm9keSlcclxuXHJcbiAgY29uc3QgY2h1bmtzID0gW11cclxuICBmb3IgYXdhaXQgKGNvbnN0IGNodW5rIG9mIHJlcSkge1xyXG4gICAgY2h1bmtzLnB1c2goY2h1bmspXHJcbiAgfVxyXG5cclxuICBjb25zdCByYXdCb2R5ID0gQnVmZmVyLmNvbmNhdChjaHVua3MpLnRvU3RyaW5nKCd1dGY4JylcclxuICByZXR1cm4gcmF3Qm9keSA/IEpTT04ucGFyc2UocmF3Qm9keSkgOiB7fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgcmVzKSB7XHJcbiAgaWYgKHJlcS5tZXRob2QgIT09ICdQT1NUJykge1xyXG4gICAgcmVzLnNldEhlYWRlcignQWxsb3cnLCAnUE9TVCcpXHJcbiAgICByZXR1cm4gc2VuZEpzb24ocmVzLCA0MDUsIHsgZXJyb3I6ICdNZXRob2Qgbm90IGFsbG93ZWQnIH0pXHJcbiAgfVxyXG5cclxuICBjb25zdCBzbXRwUGFzc3dvcmQgPSBwcm9jZXNzLmVudi5HTUFJTF9TTVRQX1BBU1NcclxuXHJcbiAgaWYgKCFzbXRwUGFzc3dvcmQpIHtcclxuICAgIHJldHVybiBzZW5kSnNvbihyZXMsIDUwMCwgeyBlcnJvcjogJ0dtYWlsIFNNVFAgcGFzc3dvcmQgaXMgbm90IGNvbmZpZ3VyZWQnIH0pXHJcbiAgfVxyXG5cclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBuYW1lID0gJycsIGVtYWlsID0gJycsIHN1YmplY3QgPSAnJywgbWVzc2FnZSA9ICcnIH0gPSBhd2FpdCByZWFkUmVxdWVzdEJvZHkocmVxKVxyXG5cclxuICAgIGlmICghbmFtZSB8fCAhZW1haWwgfHwgIXN1YmplY3QgfHwgIW1lc3NhZ2UpIHtcclxuICAgICAgcmV0dXJuIHNlbmRKc29uKHJlcywgNDAwLCB7IGVycm9yOiAnTmFtZSwgZW1haWwsIHN1YmplY3QsIGFuZCBtZXNzYWdlIGFyZSByZXF1aXJlZCcgfSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0cmFuc3BvcnRlciA9IG5vZGVtYWlsZXIuY3JlYXRlVHJhbnNwb3J0KHtcclxuICAgICAgaG9zdDogJ3NtdHAuZ21haWwuY29tJyxcclxuICAgICAgcG9ydDogNDY1LFxyXG4gICAgICBzZWN1cmU6IHRydWUsXHJcbiAgICAgIGF1dGg6IHtcclxuICAgICAgICB1c2VyOiBTTVRQX1VTRVIsXHJcbiAgICAgICAgcGFzczogc210cFBhc3N3b3JkLFxyXG4gICAgICB9LFxyXG4gICAgfSlcclxuXHJcbiAgICBhd2FpdCB0cmFuc3BvcnRlci52ZXJpZnkoKVxyXG5cclxuICAgIGNvbnN0IHNhZmVOYW1lID0gZXNjYXBlSHRtbChuYW1lKVxyXG4gICAgY29uc3Qgc2FmZUVtYWlsID0gZXNjYXBlSHRtbChlbWFpbClcclxuICAgIGNvbnN0IHNhZmVTdWJqZWN0ID0gZXNjYXBlSHRtbChzdWJqZWN0KVxyXG4gICAgY29uc3Qgc2FmZU1lc3NhZ2UgPSBlc2NhcGVIdG1sKG1lc3NhZ2UpLnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpXHJcbiAgICBjb25zdCBodG1sID0gYDwhZG9jdHlwZSBodG1sPlxyXG48aHRtbD5cclxuICA8aGVhZD5cclxuICAgIDxtZXRhIGNoYXJzZXQ9XCJ1dGYtOFwiPlxyXG4gICAgPG1ldGEgbmFtZT1cInZpZXdwb3J0XCIgY29udGVudD1cIndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xXCI+XHJcbiAgICA8dGl0bGU+JHtzYWZlU3ViamVjdH08L3RpdGxlPlxyXG4gIDwvaGVhZD5cclxuICA8Ym9keSBzdHlsZT1cIm1hcmdpbjowOyBwYWRkaW5nOjA7IGJhY2tncm91bmQ6IzA1MDUwNTsgZm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjsgY29sb3I6I2ZmZmZmZjtcIj5cclxuICAgIDx0YWJsZSByb2xlPVwicHJlc2VudGF0aW9uXCIgd2lkdGg9XCIxMDAlXCIgY2VsbHNwYWNpbmc9XCIwXCIgY2VsbHBhZGRpbmc9XCIwXCIgc3R5bGU9XCJiYWNrZ3JvdW5kOiMwNTA1MDU7IHBhZGRpbmc6MjhweCAxMnB4O1wiPlxyXG4gICAgICA8dHI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCI+XHJcbiAgICAgICAgICA8dGFibGUgcm9sZT1cInByZXNlbnRhdGlvblwiIHdpZHRoPVwiMTAwJVwiIGNlbGxzcGFjaW5nPVwiMFwiIGNlbGxwYWRkaW5nPVwiMFwiIHN0eWxlPVwibWF4LXdpZHRoOjY0MHB4OyBiYWNrZ3JvdW5kOiMxMTExMTE7IGJvcmRlcjoxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjE2KTsgYm9yZGVyLXJhZGl1czoyMHB4OyBvdmVyZmxvdzpoaWRkZW47XCI+XHJcbiAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJwYWRkaW5nOjI4cHggMzBweDsgYmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCNlZDFkMjQgMCUsIzExMTExMSA1OCUsIzAwMDAwMCAxMDAlKTtcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmlubGluZS1ibG9jazsgcGFkZGluZzo4cHggMTJweDsgYmFja2dyb3VuZDojZWQxZDI0OyBjb2xvcjojZmZmZmZmOyBmb250LXNpemU6MjBweDsgbGluZS1oZWlnaHQ6MTsgZm9udC13ZWlnaHQ6ODAwOyBsZXR0ZXItc3BhY2luZzotMC4wMmVtO1wiPkdSQVBISUNJQU48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmlubGluZS1ibG9jazsgcGFkZGluZzo4cHggMCA4cHggOHB4OyBjb2xvcjojZmZmZmZmOyBmb250LXNpemU6MjBweDsgbGluZS1oZWlnaHQ6MTsgZm9udC13ZWlnaHQ6ODAwO1wiPlNUVURJT1M8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxwIHN0eWxlPVwibWFyZ2luOjE0cHggMCAwOyBjb2xvcjpyZ2JhKDI1NSwyNTUsMjU1LDAuODIpOyBmb250LXNpemU6MTNweDsgbGV0dGVyLXNwYWNpbmc6MC4xMmVtOyB0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2U7XCI+TmV3IFdlYnNpdGUgRW5xdWlyeTwvcD5cclxuICAgICAgICAgICAgICAgIDxoMSBzdHlsZT1cIm1hcmdpbjoxMnB4IDAgMDsgY29sb3I6I2ZmZmZmZjsgZm9udC1zaXplOjI4cHg7IGxpbmUtaGVpZ2h0OjEuMTg7IGZvbnQtd2VpZ2h0OjcwMDtcIj5Db250YWN0IEZvcm0gU3VibWlzc2lvbjwvaDE+XHJcbiAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgIDx0ZCBzdHlsZT1cInBhZGRpbmc6MjhweCAzMHB4IDhweDtcIj5cclxuICAgICAgICAgICAgICAgIDx0YWJsZSByb2xlPVwicHJlc2VudGF0aW9uXCIgd2lkdGg9XCIxMDAlXCIgY2VsbHNwYWNpbmc9XCIwXCIgY2VsbHBhZGRpbmc9XCIwXCI+XHJcbiAgICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJwYWRkaW5nOjE2cHggMDsgYm9yZGVyLWJvdHRvbToxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjEyKTtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJjb2xvcjojZWQxZDI0OyBmb250LXNpemU6MTJweDsgZm9udC13ZWlnaHQ6NzAwOyBsZXR0ZXItc3BhY2luZzowLjE0ZW07IHRleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTtcIj5OYW1lPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDo3cHg7IGNvbG9yOiNmZmZmZmY7IGZvbnQtc2l6ZToxOHB4OyBsaW5lLWhlaWdodDoxLjQ1OyBmb250LXdlaWdodDo3MDA7XCI+JHtzYWZlTmFtZX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwicGFkZGluZzoxNnB4IDA7IGJvcmRlci1ib3R0b206MXB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsMC4xMik7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiY29sb3I6I2VkMWQyNDsgZm9udC1zaXplOjEycHg7IGZvbnQtd2VpZ2h0OjcwMDsgbGV0dGVyLXNwYWNpbmc6MC4xNGVtOyB0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2U7XCI+RW1haWw8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJtYXJnaW4tdG9wOjdweDsgY29sb3I6I2ZmZmZmZjsgZm9udC1zaXplOjE2cHg7IGxpbmUtaGVpZ2h0OjEuNDU7XCI+PGEgaHJlZj1cIm1haWx0bzoke3NhZmVFbWFpbH1cIiBzdHlsZT1cImNvbG9yOiNmZmZmZmY7IHRleHQtZGVjb3JhdGlvbjpub25lO1wiPiR7c2FmZUVtYWlsfTwvYT48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwicGFkZGluZzoxNnB4IDA7IGJvcmRlci1ib3R0b206MXB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsMC4xMik7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiY29sb3I6I2VkMWQyNDsgZm9udC1zaXplOjEycHg7IGZvbnQtd2VpZ2h0OjcwMDsgbGV0dGVyLXNwYWNpbmc6MC4xNGVtOyB0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2U7XCI+U3ViamVjdDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6N3B4OyBjb2xvcjojZmZmZmZmOyBmb250LXNpemU6MThweDsgbGluZS1oZWlnaHQ6MS40NTsgZm9udC13ZWlnaHQ6NzAwO1wiPiR7c2FmZVN1YmplY3R9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cInBhZGRpbmc6MTZweCAwIDhweDtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJjb2xvcjojZWQxZDI0OyBmb250LXNpemU6MTJweDsgZm9udC13ZWlnaHQ6NzAwOyBsZXR0ZXItc3BhY2luZzowLjE0ZW07IHRleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTtcIj5NZXNzYWdlPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDoxMHB4OyBwYWRkaW5nOjE4cHg7IGJhY2tncm91bmQ6IzA1MDUwNTsgYm9yZGVyOjFweCBzb2xpZCByZ2JhKDI1NSwyNTUsMjU1LDAuMTIpOyBib3JkZXItcmFkaXVzOjE0cHg7IGNvbG9yOnJnYmEoMjU1LDI1NSwyNTUsMC45KTsgZm9udC1zaXplOjE1cHg7IGxpbmUtaGVpZ2h0OjEuNjU7XCI+JHtzYWZlTWVzc2FnZX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgPHRkIHN0eWxlPVwicGFkZGluZzoxOHB4IDMwcHggMzBweDtcIj5cclxuICAgICAgICAgICAgICAgIDx0YWJsZSByb2xlPVwicHJlc2VudGF0aW9uXCIgd2lkdGg9XCIxMDAlXCIgY2VsbHNwYWNpbmc9XCIwXCIgY2VsbHBhZGRpbmc9XCIwXCIgc3R5bGU9XCJiYWNrZ3JvdW5kOnJnYmEoMjM3LDI5LDM2LDAuMTIpOyBib3JkZXI6MXB4IHNvbGlkIHJnYmEoMjM3LDI5LDM2LDAuMyk7IGJvcmRlci1yYWRpdXM6MTRweDtcIj5cclxuICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cInBhZGRpbmc6MTZweCAxOHB4OyBjb2xvcjpyZ2JhKDI1NSwyNTUsMjU1LDAuNzgpOyBmb250LXNpemU6MTNweDsgbGluZS1oZWlnaHQ6MS41NTtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIFJlcGx5IGRpcmVjdGx5IHRvIHRoaXMgZW1haWwgdG8gcmVzcG9uZCB0byA8c3Ryb25nIHN0eWxlPVwiY29sb3I6I2ZmZmZmZjtcIj4ke3NhZmVOYW1lfTwvc3Ryb25nPi5cclxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICA8L3RkPlxyXG4gICAgICA8L3RyPlxyXG4gICAgPC90YWJsZT5cclxuICA8L2JvZHk+XHJcbjwvaHRtbD5gXHJcblxyXG4gICAgYXdhaXQgdHJhbnNwb3J0ZXIuc2VuZE1haWwoe1xyXG4gICAgICBmcm9tOiBgXCJHcmFwaGljaWFuIFN0dWRpb3MgV2Vic2l0ZVwiIDwke1NNVFBfVVNFUn0+YCxcclxuICAgICAgdG86IFRPX0VNQUlMLFxyXG4gICAgICByZXBseVRvOiBlbWFpbCxcclxuICAgICAgc3ViamVjdCxcclxuICAgICAgaHRtbCxcclxuICAgICAgdGV4dDogW1xyXG4gICAgICAgICdOZXcgV2Vic2l0ZSBFbnF1aXJ5JyxcclxuICAgICAgICAnJyxcclxuICAgICAgICBgTmFtZTogJHtuYW1lfWAsXHJcbiAgICAgICAgYEVtYWlsOiAke2VtYWlsfWAsXHJcbiAgICAgICAgYFN1YmplY3Q6ICR7c3ViamVjdH1gLFxyXG4gICAgICAgICcnLFxyXG4gICAgICAgICdNZXNzYWdlOicsXHJcbiAgICAgICAgbWVzc2FnZSxcclxuICAgICAgXS5qb2luKCdcXG4nKSxcclxuICAgIH0pXHJcblxyXG4gICAgcmV0dXJuIHNlbmRKc29uKHJlcywgMjAwLCB7IG9rOiB0cnVlIH0pXHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ0dtYWlsIFNNVFAgc2VuZCBmYWlsZWQnLCB7XHJcbiAgICAgIGNvZGU6IGVycm9yLmNvZGUsXHJcbiAgICAgIGNvbW1hbmQ6IGVycm9yLmNvbW1hbmQsXHJcbiAgICAgIHJlc3BvbnNlQ29kZTogZXJyb3IucmVzcG9uc2VDb2RlLFxyXG4gICAgICByZXNwb25zZTogZXJyb3IucmVzcG9uc2UsXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIHNlbmRKc29uKHJlcywgNTAwLCB7IGVycm9yOiAnRW1haWwgY291bGQgbm90IGJlIHNlbnQnIH0pXHJcbiAgfVxyXG59XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcZ3JhcGhpY2lhbiBzdHVkaW9cXFxcbmV3IG9uZVxcXFxwcm9qZWN0cy1zdHVkaW8tZmluYWxcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGdyYXBoaWNpYW4gc3R1ZGlvXFxcXG5ldyBvbmVcXFxccHJvamVjdHMtc3R1ZGlvLWZpbmFsXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9ncmFwaGljaWFuJTIwc3R1ZGlvL25ldyUyMG9uZS9wcm9qZWN0cy1zdHVkaW8tZmluYWwvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXHJcblxyXG5mdW5jdGlvbiBjb250YWN0QXBpRGV2U2VydmVyKCkge1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiAnY29udGFjdC1hcGktZGV2LXNlcnZlcicsXHJcbiAgICBhcHBseTogJ3NlcnZlJyxcclxuICAgIGNvbmZpZ1Jlc29sdmVkKGNvbmZpZykge1xyXG4gICAgICBjb25zdCBlbnYgPSBsb2FkRW52KGNvbmZpZy5tb2RlLCBjb25maWcucm9vdCwgJycpXHJcbiAgICAgIHByb2Nlc3MuZW52LkdNQUlMX1NNVFBfUEFTUyA9IHByb2Nlc3MuZW52LkdNQUlMX1NNVFBfUEFTUyB8fCBlbnYuR01BSUxfU01UUF9QQVNTXHJcbiAgICB9LFxyXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xyXG4gICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKCcvYXBpL2NvbnRhY3QnLCBhc3luYyAocmVxLCByZXMsIG5leHQpID0+IHtcclxuICAgICAgICBpZiAocmVxLm1ldGhvZCAhPT0gJ1BPU1QnKSByZXR1cm4gbmV4dCgpXHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBjb25zdCBjaHVua3MgPSBbXVxyXG4gICAgICAgICAgZm9yIGF3YWl0IChjb25zdCBjaHVuayBvZiByZXEpIHtcclxuICAgICAgICAgICAgY2h1bmtzLnB1c2goY2h1bmspXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY29uc3QgcmF3Qm9keSA9IEJ1ZmZlci5jb25jYXQoY2h1bmtzKS50b1N0cmluZygndXRmOCcpXHJcbiAgICAgICAgICByZXEuYm9keSA9IHJhd0JvZHkgPyBKU09OLnBhcnNlKHJhd0JvZHkpIDoge31cclxuXHJcbiAgICAgICAgICBjb25zdCB7IGRlZmF1bHQ6IGhhbmRsZXIgfSA9IGF3YWl0IGltcG9ydCgnLi9hcGkvY29udGFjdC5qcycpXHJcbiAgICAgICAgICBhd2FpdCBoYW5kbGVyKHJlcSwgcmVzKVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdMb2NhbCBjb250YWN0IEFQSSBmYWlsZWQnLCBlcnJvcilcclxuICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwXHJcbiAgICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpXHJcbiAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6ICdFbWFpbCBjb3VsZCBub3QgYmUgc2VudCcgfSkpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW3JlYWN0KCksIGNvbnRhY3RBcGlEZXZTZXJ2ZXIoKV0sXHJcbiAgYmFzZTogJy8nLFxyXG4gIGVzYnVpbGQ6IHtcclxuICAgIGRyb3A6IFsnY29uc29sZScsICdkZWJ1Z2dlciddLFxyXG4gIH0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIHRhcmdldDogJ2VzMjAyMCcsXHJcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXHJcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEyMDAsXHJcbiAgICBtaW5pZnk6ICdlc2J1aWxkJyxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgbWFudWFsQ2h1bmtzKGlkKSB7XHJcbiAgICAgICAgICAvLyBUaHJlZS5qcyBjb3JlIFx1MjAxNCBsYXJnZSwgc2hhcmVkIGFjcm9zcyBhbGwgMy1EIHNjZW5lc1xyXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvdGhyZWUvJykpIHJldHVybiAndGhyZWUnXHJcbiAgICAgICAgICAvLyBSZWFjdC1UaHJlZS1GaWJlciAvIERyZWkgXHUyMDE0IGxvYWRlZCBvbmx5IHdoZW4gYSAzLUQgc2NlbmUgbW91bnRzXHJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ0ByZWFjdC10aHJlZS9maWJlcicpIHx8IGlkLmluY2x1ZGVzKCdAcmVhY3QtdGhyZWUvZHJlaScpKSByZXR1cm4gJ2ZpYmVyJ1xyXG4gICAgICAgICAgLy8gRnJhbWVyLW1vdGlvbiBcdTIwMTQgYW5pbWF0aW9uIGxpYnJhcnlcclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnZnJhbWVyLW1vdGlvbicpKSByZXR1cm4gJ2ZyYW1lcidcclxuICAgICAgICAgIC8vIHRzUGFydGljbGVzIGVuZ2luZSAmIFJlYWN0IGludGVncmF0aW9uc1xyXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdAdHNwYXJ0aWNsZXMnKSkgcmV0dXJuICd0c3BhcnRpY2xlcydcclxuICAgICAgICAgIC8vIFJlYWN0IGNvcmUgXHUyMDE0IGFsd2F5cyBuZWVkZWRcclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL3JlYWN0LycpIHx8IGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvcmVhY3QtZG9tLycpIHx8IGlkLmluY2x1ZGVzKCdyZWFjdC1yb3V0ZXItZG9tJykpIHJldHVybiAndmVuZG9yJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFB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
