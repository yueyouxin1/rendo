# Rendo Workspace Root

This repository root now separates:

- [`rendo-cli/`](/D:/code/rendo/rendo-cli): the CLI development workspace
- `application/`: generated local template or project workspaces created by the published `rendo` CLI
- [`.tmp/`](/D:/code/rendo/.tmp): temporary reference material

Current status:

1. the CLI development workspace now lives under [`rendo-cli/`](/D:/code/rendo/rendo-cli)
2. the MVP local executable is built at [`rendo.exe`](/D:/code/rendo/rendo-cli/dist/release/dist/rendo.exe)
3. the initial template workspace already exists at [`application/saas-starter`](/D:/code/rendo/application/saas-starter)

Current next priority:

1. treat [`application/saas-starter`](/D:/code/rendo/application/saas-starter) as the local derived template workspace
2. do not develop inside `rendo-cli/shared/templates`
3. begin real `application/saas-starter` implementation on top of this generated template workspace

CLI install and usage:

1. from [`rendo-cli/`](/D:/code/rendo/rendo-cli), run `npm run build:release`
2. then run `npm run install:local-cli`
3. open a new shell and use `rendo --help`
