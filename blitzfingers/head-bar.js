/* The sticky header gets its ground once the page has scrolled (see .head-bar in app-nav.css). */
(() => {
  const bar = document.querySelector('.head-bar');
  if (!bar) return;
  const update = () => bar.classList.toggle('scrolled', window.scrollY > 4);
  addEventListener('scroll', update, { passive: true });
  update();
})();

/* The menu marks the section you are reading: the last of its in-page sections (#areas, #features, …)
   whose top has crossed the upper quarter of the window. Sections without a menu entry keep the one
   before them marked; above the first one, none is. Links to another page are left alone (the guide's
   own link carries aria-current="page" in the markup). */
(() => {
  const links = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const ids = [...new Set(links.map(a => a.getAttribute('href').slice(1)))];
  const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;
  let current, ticking = false;
  const update = () => {
    ticking = false;
    const line = window.innerHeight * 0.25;
    let id = null;
    for (const s of sections) if (s.getBoundingClientRect().top <= line) id = s.id;
    if (id === current) return;
    current = id;
    for (const a of links) {
      if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    }
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update, { passive: true });
  update();
})();
