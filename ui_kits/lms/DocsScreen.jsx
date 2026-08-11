const { Kicker, Input, Badge } = window.NamasteUIDesignSystem_e97b71;
const SECTIONS = [
  { title: "Getting Started", items: ["Installing the theme", "Local Ghost setup", "Theme settings"] },
  { title: "Guides", items: ["Adding a course", "Adding a training section", "Configuring ads & sponsors"] },
  { title: "Reference", items: ["Handlebars helpers", "Tag conventions", "routes.yaml"] },
];
function DocsScreen() {
  const [active, setActive] = window.React.useState("Adding a course");
  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
        <Kicker align="center">Documentation</Kicker>
        <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "2rem" }}>Everything to run this theme</h1>
        <div style={{ width: "100%", maxWidth: 480 }}><Input icon="ph-magnifying-glass" placeholder="Search the docs..." hint="⌘K" /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "2.5rem" }}>
        <aside style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {SECTIONS.map(sec => (
            <div key={sec.title}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-label)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tracking-label)", color: "var(--color-label)", marginBottom: "0.5rem" }}>{sec.title}</div>
              {sec.items.map(it => (
                <a key={it} onClick={(e) => { e.preventDefault(); setActive(it); }} href="#" style={{ display: "block", padding: "0.4rem 0.6rem", borderRadius: "var(--radius-sm)", fontSize: "0.875rem", textDecoration: "none", color: active === it ? "var(--color-brand-600)" : "var(--color-ink)", boxShadow: active === it ? "inset 2px 0 0 var(--color-brand-500)" : "none", fontWeight: active === it ? 600 : 400 }}>{it}</a>
              ))}
            </div>
          ))}
        </aside>
        <article style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}><Badge>Guide</Badge><Badge variant="accent">v1</Badge></div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.5rem" }}>{active}</h2>
          <p style={{ color: "var(--color-muted)", lineHeight: 1.7 }}>A course's primary public tag is the course tag; its slug must equal that tag. Lessons carry the course tag as their primary tag plus the internal <code style={{ fontFamily: "var(--font-mono)", background: "var(--color-surface-sunken)", padding: "0.1rem 0.4rem", borderRadius: "var(--radius-sm)" }}>#lesson</code> marker, so the router nests them at <code style={{ fontFamily: "var(--font-mono)" }}>/courses/{"{tag}"}/{"{slug}"}/</code>.</p>
          <div style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", boxShadow: "inset 0 0 0 1px var(--color-border)" }}>
            <div style={{ background: "var(--color-brand-900)", padding: "8px 12px 0" }}><span style={{ background: "#fff", color: "var(--color-brand-600)", fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, borderRadius: "4px 4px 0 0", padding: "6px 12px", display: "inline-block" }}>routes.yaml</span></div>
            <pre style={{ margin: 0, background: "var(--color-surface)", padding: 14, fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--color-ink)", overflowX: "auto" }}>{"  /courses/apex-masterclass/:\n    data: tag.apex-masterclass\n    template: course"}</pre>
          </div>
        </article>
      </div>
    </div>
  );
}
window.DocsScreen = DocsScreen;
