/* The hero board plays (maker, 2026-10-02) — a small taste of the app, not the app. One-shots fire at
   once and overlap. A loop starts on the next bar of whatever is already playing, the way the app lines
   loops up, and every loop here layers on the others; tap a playing loop to stop it. Everything is at
   120 BPM, so a bar is 2 seconds, and the first loop you start sets where the bars fall.
   The sounds are placeholders from the app's Groove bank until the maker's own replace them. They load
   on the first tap, not with the page, so the page stays light. */
(() => {
  const board = document.querySelector('.board[data-play]');
  if (!board || !(window.AudioContext || window.webkitAudioContext)) return;
  const BAR = 2;          // seconds: one 4/4 bar at 120 BPM
  const LEAD = 0.05;      // the soonest a scheduled start can be
  let ctx = null, out = null, t0 = null;   // t0: the audio-clock time the bar grid started
  const buffers = new Map(), loops = new Map();

  const audio = () => {
    if (!ctx) {
      // iOS: play through the silent switch, like the app does.
      try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      out = ctx.createGain(); out.gain.value = 0.8; out.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };
  const load = (url) => {
    if (!buffers.has(url)) {
      buffers.set(url, fetch(url).then(r => { if (!r.ok) throw new Error(url); return r.arrayBuffer(); })
        .then(ab => new Promise((res, rej) => audio().decodeAudioData(ab, res, rej)))
        .catch(e => { buffers.delete(url); throw e; }));
    }
    return buffers.get(url);
  };
  const gainFor = (pad) => { const g = ctx.createGain(); g.gain.value = Number(pad.dataset.vol || 1); g.connect(out); return g; };
  const nextBar = (now) => (t0 == null ? now + LEAD : t0 + Math.ceil((now + LEAD - t0) / BAR) * BAR);

  async function shot(pad) {
    audio();
    pad.classList.add('lit'); clearTimeout(pad._lit); pad._lit = setTimeout(() => pad.classList.remove('lit'), 180);
    try {
      const src = ctx.createBufferSource(); src.buffer = await load(pad.dataset.src);
      src.connect(gainFor(pad)); src.start();
    } catch (e) {}
  }

  async function loop(pad) {
    audio();
    const playing = loops.get(pad);
    if (playing) {                                   // stop it — or cancel it while it waits for its bar
      loops.delete(pad); clearTimeout(playing.timer);
      if (playing.gain) { playing.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.02); playing.src.stop(ctx.currentTime + 0.2); }
      pad.classList.remove('lit', 'queued'); pad.setAttribute('aria-pressed', 'false');
      if (!loops.size) t0 = null;                    // nothing left: the next loop starts a new grid
      return;
    }
    const entry = {}; loops.set(pad, entry);
    pad.setAttribute('aria-pressed', 'true'); pad.classList.add('queued');
    let buf; try { buf = await load(pad.dataset.src); } catch (e) { loops.delete(pad); pad.classList.remove('queued'); pad.setAttribute('aria-pressed', 'false'); return; }
    if (loops.get(pad) !== entry) return;            // tapped again while it was loading
    const at = nextBar(ctx.currentTime);
    if (t0 == null) t0 = at;
    entry.src = ctx.createBufferSource(); entry.src.buffer = buf; entry.src.loop = true;
    entry.gain = gainFor(pad); entry.src.connect(entry.gain); entry.src.start(at);
    entry.timer = setTimeout(() => { pad.classList.remove('queued'); pad.classList.add('lit'); }, Math.max(0, (at - ctx.currentTime) * 1000));
  }

  // One-shots fire on the press, not the release; a keyboard press arrives as a click with no pointer.
  board.addEventListener('pointerdown', (e) => {
    const pad = e.target.closest('.pad[data-kind="shot"]');
    if (pad && e.button === 0) shot(pad);
  });
  board.addEventListener('click', (e) => {
    const pad = e.target.closest('.pad');
    if (!pad) return;
    if (pad.dataset.kind === 'loop') loop(pad);
    else if (e.detail === 0) shot(pad);
  });
})();
