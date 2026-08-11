const { TableOfContents, TimelineStepper, VideoPoster, CodeBlock, CurriculumList, Kicker, Button } = window.NamasteUIDesignSystem_e97b71;
const LESSONS = [
  { title: "What is Salesforce & the Ecosystem", type: "article", done: true },
  { title: "Editions, Orgs & Signing Up", type: "article", done: true },
  { title: "Navigating Lightning Experience", type: "article" },
  { title: "Objects, Records & Fields", type: "article" },
  { title: "Your First Automation with Flow", type: "exercise" },
];
const TOC = [{ id: "intro", label: "Introduction" }, { id: "editions", label: "Editions & orgs" }, { id: "devorg", label: "Signing up for a Dev org", level: 3 }, { id: "habits", label: "Habits worth forming" }];
function PlayerScreen() {
  const [active, setActive] = window.React.useState("editions");
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.5rem", display: "grid", gridTemplateColumns: "240px 1fr 200px", gap: "2rem", alignItems: "start" }}>
      <aside>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-label)", fontWeight: 700, letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--color-label)", marginBottom: "0.6rem" }}>Course Player</div>
        <CurriculumList variant="timeline" items={LESSONS} />
      </aside>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <TimelineStepper steps={["Watch", "Read", "Exercise", "Done"]} activeIndex={1} />
        <VideoPoster />
        <Kicker>Editions, Orgs &amp; Signing Up for a Dev Org</Kicker>
        <p style={{ color: "var(--color-muted)", lineHeight: 1.7 }}>An <b id="intro">org</b> is a single instance of Salesforce with its own users, data, and configuration. <b id="editions">Editions</b> are the packaging tiers that decide which features and limits you get.</p>
        <CodeBlock filename="apex" code={"public class OrgUtil {\n  // returns the current org's namespace\n  public static String namespace() {\n    return UserInfo.getOrganizationId();\n  }\n}"} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="outline" icon="ph-arrow-left">Previous</Button>
          <Button icon="ph-arrow-right" iconPosition="right">Next lesson</Button>
        </div>
      </div>
      <TableOfContents activeId={active} onNavigate={setActive} items={TOC} />
    </div>
  );
}
window.PlayerScreen = PlayerScreen;
