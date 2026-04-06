import { SurfaceSummary } from "../components/surface-summary";

export default function HomePage() {
  return (
    <main>
      <div className="panel grid">
        <div className="hero">
          <section className="card grid">
            <div className="badge">Application Base Starter Template</div>
            <h1 style={{ margin: 0, fontSize: "2.5rem" }}>Multi-surface hello world, one canonical application base.</h1>
            <p className="muted" style={{ margin: 0 }}>
              This starter validates the official application base path: one starter identity, one CLI semantics layer,
              selectable surfaces at project creation time.
            </p>
            <div className="grid muted">
              <span>Default generated surface: web</span>
              <span>Optional extra surfaces: miniapp, mobile</span>
              <span>Consumption path: `rendo create application --surfaces web,miniapp`</span>
            </div>
          </section>
          <SurfaceSummary />
        </div>
      </div>
    </main>
  );
}
