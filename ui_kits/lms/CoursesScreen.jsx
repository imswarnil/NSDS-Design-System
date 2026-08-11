const { CourseCard, Kicker, Input, CourseStats } = window.NamasteUIDesignSystem_e97b71;
const COURSES = [
  { title: "Salesforce — Zero to Hero", excerpt: "Go from total beginner to job-ready Salesforce professional — platform, admin basics, automation, and your first steps into development.", level: "beginner", price: "free", lessons: 7, duration: "1h 10m", author: "Namaste UI", featured: true },
  { title: "Apex Masterclass", excerpt: "Master server-side Salesforce development: Apex language, SOQL, triggers, bulkification, async Apex, and testing to 75%+ coverage.", level: "advanced", price: "paid", priceLabel: "$49", lessons: 12, duration: "6h 40m", author: "Namaste UI" },
  { title: "CRM Analytics", excerpt: "Build analytics apps in CRM Analytics: datasets, recipes & dataflows, lenses, dashboards, SAQL, and bindings.", level: "intermediate", price: "paid", priceLabel: "$39", lessons: 10, duration: "4h 20m", author: "Namaste UI" },
  { title: "Conga CPQ", excerpt: "Understand Conga CPQ end to end: product catalog, bundles, pricing, constraint rules, approvals, quotes and documents.", level: "intermediate", price: "paid", priceLabel: "$59", lessons: 9, duration: "5h 05m", author: "Namaste UI", sponsored: true },
  { title: "LWC A-Z", excerpt: "Build modern Salesforce UIs with Lightning Web Components: templates, reactivity, events, Apex wiring, LDS, and deployment.", level: "advanced", price: "paid", priceLabel: "$45", lessons: 14, duration: "7h 15m", author: "Namaste UI" },
];
function CoursesScreen({ goCourse }) {
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
        <Kicker align="center">Courses</Kicker>
        <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "2rem" }}>Every Salesforce course, in one catalog</h1>
        <div style={{ width: "100%", maxWidth: 480 }}><Input icon="ph-magnifying-glass" placeholder="Search courses, topics, tags..." hint="⌘K" /></div>
        <div style={{ paddingTop: "0.5rem" }}><CourseStats onDark={false} stats={[{ icon: "ph-books", value: "05", label: "courses" }, { icon: "ph-play", value: "52", label: "lessons" }, { icon: "ph-clock", value: "24h", label: "content" }]} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "2rem", alignItems: "start" }}>
        <aside style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-label)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tracking-label)", color: "var(--color-label)", marginBottom: "0.5rem" }}>Level</legend>
            {["Beginner", "Intermediate", "Advanced"].map(l => (
              <label key={l} style={{ display: "flex", alignItems: "center", gap: "0.55rem", padding: "0.3rem 0", fontSize: "0.875rem", cursor: "pointer" }}>
                <input type="checkbox" style={{ accentColor: "var(--color-brand-500)" }} /> {l}
              </label>
            ))}
          </fieldset>
          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-label)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tracking-label)", color: "var(--color-label)", marginBottom: "0.5rem" }}>Price</legend>
            {["Free", "Paid"].map(l => (
              <label key={l} style={{ display: "flex", alignItems: "center", gap: "0.55rem", padding: "0.3rem 0", fontSize: "0.875rem", cursor: "pointer" }}>
                <input type="radio" name="price" style={{ accentColor: "var(--color-brand-500)" }} /> {l}
              </label>
            ))}
          </fieldset>
        </aside>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1.25rem" }}>
          {COURSES.map((c, i) => (
            <CourseCard key={c.title} index={i + 1} title={c.title} excerpt={c.excerpt} level={c.level} price={c.price} priceLabel={c.priceLabel} lessons={c.lessons} duration={c.duration} authorName={c.author} featured={c.featured} sponsored={c.sponsored} href="#" onClick={(e) => { e.preventDefault(); goCourse(); }} />
          ))}
        </div>
      </div>
    </div>
  );
}
window.CoursesScreen = CoursesScreen;
