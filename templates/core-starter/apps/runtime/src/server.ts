import { createServer } from "node:http";
import { getRuntimeConfig } from "../../../packages/config/src/index.js";
import { createRuntimeSnapshot } from "../../../packages/domain/src/index.js";

const config = getRuntimeConfig();

const server = createServer((request, response) => {
  const url = request.url ?? "/";

  if (url === "/health") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(createRuntimeSnapshot(), null, 2));
    return;
  }

  response.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
  response.end(
    [
      "Rendo Core Starter",
      "",
      `runtime mode: ${config.runtimeMode}`,
      `provider mode: ${config.providerMode}`,
      "health endpoint: /health",
    ].join("\n"),
  );
});

server.listen(config.port, () => {
  console.log(`core runtime listening on http://127.0.0.1:${config.port}`);
});
