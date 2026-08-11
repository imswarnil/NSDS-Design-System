const { Kicker, RoadmapCard, Button } = window.NamasteUIDesignSystem_e97b71;
const SECTIONS = [
  { n: 1, title: "Foundations", desc: "What Salesforce is, the ecosystem, and your first Developer org.", icon: "ph-flag", lessons: 7, duration: "1h 10m" },
  { n: 2, title: "Org Setup", desc: "Editions, licenses, and configuring your org's baseline settings.", icon: "ph-gear-six", lessons: 5, duration: "55m" },
  { n: 3, title: "Navigation", desc: "The App Launcher, list views, record pages, and global search.", icon: "ph-compass", lessons: 4, duration: "40m" },
  { n: 4, title: "Data Model", desc: "Objects, fields, and the relationships that connect them.", icon: "ph-database", lessons: 6, duration: "1h 05m" },
  { n: 5, title: "Security", desc: "Profiles, permission sets, sharing rules, and field-level security.", icon: "ph-shield-check", lessons: 6, duration: "1h 15m" },
  { n: 6, title: "Automation", desc: "Flow Builder: record-triggered flows, decisions, and best practices.", icon: "ph-flow-arrow", lessons: 5, duration: "1h 00m" },
  { n: 7, title: "Reports & Dashboards", desc: "Report types, groupings, chart components, and a working dashboard.", icon: "ph-chart-bar", lessons: 4, duration: "45m" },
  { n: 8, title: "Apex / Code", desc: "Your first steps from clicks to code, and where to go next.", icon: "ph-code", lessons: 7, duration: "1h 20m" },
];
function TrainingScreen() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "3.5rem 1.5rem" }}>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", marginBottom: "3rem" }}>
        <Kicker align="center">Training Roadmap</Kicker>
        <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "2rem" }}>The path from zero to certified</h1>
        <p style={{ color: "var(--color-muted)", maxWidth: 560 }}>Eight sections, one dashed trail. Work through them in order, or jump to the one you need.</p>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: "50%", top: "0.5rem", bottom: "2.5rem", width: 2, marginLeft: -1, background: "repeating-linear-gradient(to bottom, var(--color-border) 0 8px, transparent 8px 15px)" }} />
        <div style={{ position: "relative", textAlign: "center", marginBottom: "2rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, borderRadius: 9999, background: "var(--color-brand-500)", boxShadow: "0 0 0 5px color-mix(in srgb, var(--color-brand-500) 14%, transparent)" }} />
          <div style={{ marginTop: "0.6rem", fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-brand-600)" }}>Start</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {SECTIONS.map((s, i) => (
            <div key={s.n} style={{ width: "calc(50% - 2rem)", marginLeft: i % 2 === 0 ? 0 : "auto" }}>
              <RoadmapCard n={s.n} title={s.title} desc={s.desc} icon={s.icon} lessons={s.lessons} duration={s.duration} />
            </div>
          ))}
        </div>
        <div style={{ position: "relative", textAlign: "center", marginTop: "3rem", maxWidth: 480, marginInline: "auto" }}>
          <span style={{ position: "absolute", left: "50%", top: "-2.3rem", transform: "translateX(-50%)", display: "inline-flex", width: 16, height: 16, borderRadius: 9999, background: "var(--color-brand-500)", boxShadow: "0 0 0 5px color-mix(in srgb, var(--color-brand-500) 14%, transparent)" }} />
          <div style={{ borderRadius: "var(--radius-card)", background: "var(--color-surface-sunken)", boxShadow: "inset 0 0 0 1px var(--color-border)", padding: "1.5rem" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-brand-600)" }}>Finish</div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, marginTop: "0.5rem" }}>You've gone from zero.</h3>
            <p style={{ color: "var(--color-muted)", fontSize: "0.9rem", marginTop: "0.4rem" }}>Pick your certification track and keep practising in your Developer org.</p>
            <div style={{ marginTop: "1rem" }}><Button size="sm">Get the newsletter</Button></div>
          </div>
        </div>
      </div>
    </div>
  );
}
window.TrainingScreen = TrainingScreen;
