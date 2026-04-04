import { createServer } from "node:http";
import { getRuntimeConfig } from "../../../packages/config/src/index.js";
import { createRuntimeSnapshot } from "../../../packages/domain/src/index.js";

const config = getRuntimeConfig();

const server = createServer((request, response) => {
  const url = request.url ?? "/";
  const snapshot = createRuntimeSnapshot();

  if (url === "/health") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(snapshot, null, 2));
    return;
  }

  if (url === "/hello") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ message: snapshot.greeting }, null, 2));
    return;
  }

  response.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
  response.end(
    [
      "Rendo Hello World Starter",
      "",
      snapshot.greeting,
      `runtime mode: ${config.runtimeMode}`,
      `provider mode: ${config.providerMode}`,
      "health endpoint: /health",
      "hello endpoint: /hello"
    ].join("\n"),
  );
});

server.listen(config.port, () => {
  console.log(`hello-world runtime listening on http://127.0.0.1:${config.port}`);
});
