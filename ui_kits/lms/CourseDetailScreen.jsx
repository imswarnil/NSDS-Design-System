const { Kicker, Button, LevelBadge, CourseStats, CurriculumList, AuthorBox, AdSlot } = window.NamasteUIDesignSystem_e97b71;
const LESSONS = [
  { title: "What is Salesforce & the Ecosystem", type: "article", desc: "A plain-English tour of what Salesforce is, the products that make up the platform, and the roles in its ecosystem.", done: true },
  { title: "Editions, Orgs & Signing Up for a Dev Org", type: "article", desc: "Understand orgs and editions, then sign up for a free Developer Edition org.", preview: true },
  { title: "Navigating Lightning Experience", type: "article", desc: "The App Launcher, tabs, list views, record pages, and global search." },
  { title: "Objects, Records, Fields & Relationships", type: "article", desc: "The heart of the data model: objects as tables, records as rows, fields as columns." },
  { title: "Reports & Dashboards Basics", type: "article", desc: "Report types, filters, groupings, chart types, and assembling a dashboard." },
  { title: "Your First Automation with Flow", type: "exercise", desc: "Build your first no-code automation: triggers, elements, a record-triggered flow." },
  { title: "Where to Go Next: Admin, Dev, Architect", type: "quiz", desc: "Map the career paths — Admin, Developer, Architect — with a concrete next step." },
];
function CourseDetailScreen() {
  return (
    <div>
      <section style={{ background: "var(--color-brand-900)", color: "#fff", padding: "3.5rem 1.5rem" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "3rem", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Kicker light>Zero to Hero / Foundations</Kicker>
            <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "2.25rem", lineHeight: 1.15 }}>Salesforce — Zero to Hero</h1>
            <p style={{ color: "rgb(255 255 255 / 0.72)", fontSize: "1.05rem", lineHeight: 1.6 }}>Go from total beginner to job-ready Salesforce professional — the platform, admin basics, automation, and your first steps into development.</p>
            <div style={{ display: "flex", gap: "0.6rem" }}><LevelBadge level="beginner" /></div>
            <div style={{ borderTop: "1px solid rgb(255 255 255 / 0.12)", paddingTop: "1rem" }}>
              <CourseStats stats={[{ icon: "ph-books", value: "07", label: "lessons" }, { icon: "ph-clock", value: "1h 10m", label: "content" }, { icon: "ph-users-three", value: "8,200", label: "enrolled" }]} />
            </div>
            <div><Button variant="white">Start course — Free</Button></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: "4/3", borderRadius: "var(--radius-card)", background: "rgb(255 255 255 / 0.04)", boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.14)" }}>
            <i className="ph ph-graduation-cap" style={{ fontSize: "4rem", color: "var(--color-brand-300)" }} />
          </div>
        </div>
      </section>
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "3rem 1.5rem", display: "grid", gridTemplateColumns: "1fr 320px", gap: "3rem", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <Kicker>Curriculum</Kicker>
          <CurriculumList variant="detailed" items={LESSONS} />
          <AdSlot />
        </div>
        <aside style={{ display: "flex", flexDirection: "column", gap: "1.25rem", position: "sticky", top: "5rem" }}>
          <AuthorBox name="Namaste UI" bio="Community-run Salesforce learning project — courses written and maintained by working admins & developers." />
          <div style={{ padding: "1.1rem 1.25rem", borderRadius: "var(--radius-card)", boxShadow: "inset 0 0 0 1px var(--color-border)" }}>
            <div style={{ fontWeight: 700, marginBottom: "0.4rem" }}>Need help?</div>
            <p style={{ fontSize: "0.85rem", color: "var(--color-muted)", marginBottom: "0.75rem" }}>Ask in the community forum or open an issue on GitHub.</p>
            <Button size="sm" variant="outline">Get support</Button>
          </div>
        </aside>
      </section>
    </div>
  );
}
window.CourseDetailScreen = CourseDetailScreen;
