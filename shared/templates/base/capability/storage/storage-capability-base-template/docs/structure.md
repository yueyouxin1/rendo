# Structure

- `capability/README.md`: human-readable capability contract
- `capability/drivers.json`: machine-readable driver matrix
- root manifest and docs: runtime and install-plan control plane

## Design rule

The capability layer defines what is provided and how it installs. It should not silently claim ownership of application routes, UI, or business workflows.
