const http = require("http");
const os = require("os");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === "/health/live") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "alive" }));
    return;
  }

  if (req.url === "/health/ready") {
    if (process.env.SIMULATE_NOT_READY === "true") {
      res.writeHead(503, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "not-ready" }));
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ready" }));
    return;
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      message: "Hello from Project Nimbus!",
      hostname: os.hostname(),
      path: req.url,
    })
  );
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("Nimbus API listening on port " + PORT);
});
