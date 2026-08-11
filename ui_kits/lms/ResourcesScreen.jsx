const { Hero, ResourceCard, Kicker } = window.NamasteUIDesignSystem_e97b71;
const GROUPS = [
  { title: "Study Guides", items: [["Admin Cert Study Guide", "PDF", "ph-file-text"], ["Platform Developer I Guide", "PDF", "ph-file-text"]] },
  { title: "Templates", items: [["Flow Naming Conventions", "Template", "ph-flow-arrow"], ["Trigger Handler Boilerplate", "Template", "ph-code"]] },
  { title: "Tools", items: [["VS Code Apex Snippets", "Tool", "ph-terminal-window"], ["Data Loader Cheat Sheet", "PDF", "ph-database"]] },
];
function ResourcesScreen() {
  return (
    <div>
      <Hero variant="compact" kicker="Resources" title="Cheat sheets, templates &amp; tools" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
        {GROUPS.map((g) => (
          <div key={g.title}>
            <Kicker>{g.title}</Kicker>
            <div style={{ marginTop: "0.9rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {g.items.map(([title, type, icon]) => <ResourceCard key={title} title={title} type={type} icon={icon} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
window.ResourcesScreen = ResourcesScreen;
