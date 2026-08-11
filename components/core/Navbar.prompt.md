The site header — mono uppercase nav links (active = hairline box, not underline), optional dark-mode toggle, one primary CTA.

```jsx
<Navbar logo={<Logo />} links={[{id:"home",label:"Home"},{id:"courses",label:"Courses"}]}
  activeId="home" onNavigate={setScreen} dark={dark} onToggleDark={() => setDark(d=>!d)} />
```
