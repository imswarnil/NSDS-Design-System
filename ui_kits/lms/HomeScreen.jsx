const { Button, Kicker, Chip, CourseStats } = window.NamasteUIDesignSystem_e97b71;
function HomeScreen({ goCourse }) {
  const features = [
    ["ph-lightning", "Learn by doing", "Every lesson runs inside your own free Developer org — no sandboxes, no waiting."],
    ["ph-books", "Structured tracks", "Courses and an eight-part training roadmap take you from zero to certified."],
    ["ph-chart-bar", "See it click", "Reports, dashboards and Flow automations you build are real, working artifacts."],
  ];
  return (
    <div>
      <section style={{ position: "relative", overflow: "hidden", background: "var(--color-brand-900)", color: "#fff", padding: "5rem 1.5rem" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(to right, rgb(255 255 255 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.05) 1px, transparent 1px)", backgroundSize: "44px 44px", WebkitMaskImage: "radial-gradient(ellipse 100% 100% at 50% 20%, #000 20%, transparent 72%)", maskImage: "radial-gradient(ellipse 100% 100% at 50% 20%, #000 20%, transparent 72%)" }} />
        <div style={{ position: "relative", maxWidth: 760, margin: "0 auto", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
          <Kicker align="center" light>Open-source Salesforce learning</Kicker>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--size-display)", fontWeight: 800, lineHeight: 1.1 }}>Go from zero to job-ready Salesforce professional</h1>
          <p style={{ fontSize: "1.125rem", color: "rgb(255 255 255 / 0.72)", maxWidth: 560 }}>Courses, an eight-part training roadmap, and developer documentation — one calm, fast platform built for learning the platform, not fighting the UI.</p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button variant="white" icon="ph-arrow-right" iconPosition="right" onClick={goCourse}>Start Zero to Hero</Button>
            <Button variant="ghost">Browse courses</Button>
          </div>
          <div style={{ marginTop: "1.5rem", borderTop: "1px solid rgb(255 255 255 / 0.12)", paddingTop: "1.25rem" }}>
            <CourseStats stats={[{ icon: "ph-users-three", value: "12,400", label: "learners" }, { icon: "ph-books", value: "05", label: "courses" }, { icon: "ph-star", value: "4.9", label: "avg rating" }]} />
          </div>
        </div>
      </section>
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "4rem 1.5rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
        <Kicker align="center">Why Namaste Salesforce</Kicker>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.25rem" }}>
          {features.map(([icon, title, body]) => (
            <div key={title} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "1.4rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-card)", background: "var(--color-surface-raised)" }}>
              <Chip icon={icon} />
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.05rem" }}>{title}</h3>
              <p style={{ color: "var(--color-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
window.HomeScreen = HomeScreen;
