/* The sticky header gets its ground once the page has scrolled (see .head-bar in app-nav.css). */
(() => {
  const bar = document.querySelector('.head-bar');
  if (!bar) return;
  const update = () => bar.classList.toggle('scrolled', window.scrollY > 4);
  addEventListener('scroll', update, { passive: true });
  update();
})();
