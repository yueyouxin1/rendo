export function SurfaceSummary() {
  return (
    <div className="card grid">
      <div className="badge">Selected surfaces</div>
      <div className="muted">
        This generated project currently includes: <strong>web</strong>
      </div>
      <div className="muted">
        Extra surfaces are scaffolded only when requested during `rendo create`.
      </div>
    </div>
  );
}
