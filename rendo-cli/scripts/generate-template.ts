import { generateTemplateFromProfile } from "./lib/template-generator.js";

async function main() {
  const profileRef = process.argv[2];
  if (!profileRef) {
    throw new Error(
      "profile ref is required, for example: base/starter/application/application-base-starter",
    );
  }

  const result = await generateTemplateFromProfile(`shared/authoring/templates/${profileRef}/profile.json`);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

