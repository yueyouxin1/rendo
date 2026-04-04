import { generateDomainStarterFromProfile } from "./lib/domain-starter-generator.js";

async function main() {
  const result = await generateDomainStarterFromProfile(
    "authoring/domain-starters/headless-agent/hello-world/profile.json",
  );
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
