/* The address follows the reading: while you scroll, the URL's #anchor names the section you are in,
   and at the very top it has none. replaceState, not pushState — scrolling must not fill the back
   button's history. Sections are the page's own <section id> elements (the guide's are an interface the
   app links to, so this only reads them). */
(() => {
  const sections = [...document.querySelectorAll('section[id]')];
  if (!sections.length || !history.replaceState) return;
  const bare = () => location.pathname + location.search;
  let current = location.hash.slice(1) || null, ticking = false;
  const update = () => {
    ticking = false;
    const line = window.innerHeight * 0.25;   // the section crossing the upper quarter is the one being read
    let id = null;
    for (const s of sections) if (s.getBoundingClientRect().top <= line) id = s.id;
    if (window.scrollY < 8) id = null;          // at the top: no anchor
    if (id === current) return;
    current = id;
    history.replaceState(history.state, '', id ? '#' + id : bare());
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
})();
