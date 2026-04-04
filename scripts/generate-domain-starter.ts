import { generateDomainStarterFromProfile } from "./lib/domain-starter-generator.js";

async function main() {
  const profileRef = process.argv[2];
  if (!profileRef) {
    throw new Error("profile ref is required, for example: headless-agent/hello-world");
  }

  const result = await generateDomainStarterFromProfile(
    `authoring/domain-starters/${profileRef}/profile.json`,
  );

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
