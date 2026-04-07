# Review Checklist

- Keep the control plane explicit: `AGENTS.md`, `CLAUDE.md`, `.agents/`, `docs/`, `interfaces/`, `integration/`.
- Keep implementation under `src/`.
- Do not reintroduce template-kind-named implementation roots.
- If callable behavior changes, update the matching `interfaces/*` surface and the affected `.agents/skills/*`.
- If boundaries change, update `docs/extension-points.md`, `docs/inheritance-boundaries.md`, and the relevant `.agents/skills/*`.
- Keep tests and health checks aligned with the claimed behavior.
- Keep docs concise; remove drift instead of adding parallel explanations.
