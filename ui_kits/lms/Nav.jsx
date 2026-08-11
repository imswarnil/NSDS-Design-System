const { Navbar, Logo } = window.NamasteUIDesignSystem_e97b71;
function Nav({ dark, onToggleDark, screen, setScreen }) {
  const links = [["home", "Home", "ph-house"], ["courses", "Courses", "ph-graduation-cap"], ["course", "Course", "ph-book-bookmark"], ["player", "Player", "ph-play-circle"], ["training", "Training", "ph-flag-checkered"], ["blog", "Blog", "ph-article"], ["resources", "Resources", "ph-folders"], ["docs", "Docs", "ph-book-open-text"]].map(([id, label, icon]) => ({ id, label, icon }));
  return (
    <Navbar
      logo={<Logo iconSrc="../../assets/logo/favicon.svg" />}
      links={links}
      activeId={screen}
      onNavigate={setScreen}
      dark={dark}
      onToggleDark={onToggleDark}
    />
  );
}
window.Nav = Nav;
