const { Hero, BlogCard, Kicker } = window.NamasteUIDesignSystem_e97b71;
const POSTS = [
  { title: "Why We Rebuilt the Training Roadmap", excerpt: "A look at the dashed-spine layout and why it beats a Netflix-style hover card that only reveals its blurb on hover.", tag: "Engineering", author: "Priya Sharma", date: "Jul 12", read: "6 min" },
  { title: "Flash-Free Dark Mode, Explained", excerpt: "How a pre-paint inline script and one data-theme attribute avoid the white flash entirely.", tag: "Engineering", author: "Namaste UI", date: "Jul 02", read: "4 min" },
  { title: "Grading Your First Trigger", excerpt: "A handler-pattern checklist for bulk-safety before you ship your first Apex trigger.", tag: "Apex", author: "Namaste UI", date: "Jun 24", read: "8 min" },
  { title: "Five Sections, One Trail", excerpt: "How the training roadmap's tag conventions keep five course sections in perfect order.", tag: "Product", author: "Priya Sharma", date: "Jun 10", read: "5 min" },
];
function BlogScreen() {
  return (
    <div>
      <Hero variant="compact" kicker="Blog" title="Notes on building &amp; learning Salesforce" />
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "2.5rem 1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "1.25rem" }}>
        {POSTS.map((p, i) => <BlogCard key={p.title} index={i + 1} title={p.title} excerpt={p.excerpt} tag={p.tag} authorName={p.author} date={p.date} readTime={p.read} />)}
      </div>
    </div>
  );
}
window.BlogScreen = BlogScreen;
