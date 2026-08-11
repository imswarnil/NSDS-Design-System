function App() {
  const [screen, setScreen] = window.React.useState("home");
  const [dark, setDark] = window.React.useState(false);
  window.React.useEffect(() => { document.documentElement.setAttribute("data-theme", dark ? "dark" : "light"); }, [dark]);
  const Screen = { home: window.HomeScreen, courses: window.CoursesScreen, course: window.CourseDetailScreen, player: window.PlayerScreen, training: window.TrainingScreen, blog: window.BlogScreen, resources: window.ResourcesScreen, docs: window.DocsScreen }[screen];
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      <window.Nav dark={dark} onToggleDark={() => setDark(d => !d)} screen={screen} setScreen={setScreen} />
      <Screen goCourse={() => setScreen("course")} />
    </div>
  );
}
window.App = App;
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
