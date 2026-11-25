/* Future Composites mixed look: shared behavior for every page. */
(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Navigation: phone menu button and current page */
  const hdr = document.querySelector('.hdr');
  if (hdr) {
    const btn = document.createElement('button');
    btn.className = 'menu-btn'; btn.type = 'button'; btn.textContent = 'Menu';
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', () => { const o = hdr.classList.toggle('open'); btn.setAttribute('aria-expanded', o); btn.textContent = o ? 'Close' : 'Menu'; });
    hdr.appendChild(btn);
    const here = location.pathname.split('/').pop() || 'index.html';
    hdr.querySelectorAll('nav a').forEach(a => { if (a.getAttribute('href') === here) a.classList.add('cur'); });
  }

  /* Hero: gradient on the last sentence, honeycomb canvas behind */
  const hero = document.querySelector('.fc-hero');
  if (hero) {
    const h1 = hero.querySelector('h1');
    if (h1 && !h1.querySelector('.grad')) {
      const t = h1.textContent.trim();
      const parts = t.match(/[^.!?]+[.!?]?/g) || [t];
      if (parts.length > 1) { const last = parts.pop(); h1.innerHTML = parts.join('') + ' <span class="grad">' + last.trim() + '</span>'; }
      else { const w = t.split(' '); const last = w.pop(); h1.innerHTML = w.join(' ') + ' <span class="grad">' + last + '</span>'; }
    }
    const c = document.createElement('canvas'); c.className = 'hexbg'; c.setAttribute('aria-hidden', 'true');
    hero.prepend(c);
    const x = c.getContext('2d'); let W, H, cells = [], m = { x: -999, y: -999 }, t = 0; const R = 34;
    function build(){ const d = Math.min(devicePixelRatio || 1, 2); W = c.clientWidth; H = c.clientHeight; c.width = W*d; c.height = H*d; x.setTransform(d,0,0,d,0,0);
      cells = []; const w = Math.sqrt(3)*R, h = 1.5*R; for (let r=-1; r*h < H+R; r++) for (let q=-1; q*w < W+w; q++) cells.push({ x: q*w + (r&1 ? w/2 : 0), y: r*h, g: 0 }); }
    function hex(cx, cy, r){ x.beginPath(); for (let i=0;i<6;i++){ const a = Math.PI/180*(60*i-30); x.lineTo(cx + r*Math.cos(a), cy + r*Math.sin(a)); } x.closePath(); }
    function draw(){ t += .012; x.clearRect(0,0,W,H);
      for (const k of cells){ const d = Math.hypot(k.x-m.x, k.y-m.y), wave = (Math.sin(k.x*.008 + k.y*.006 - t*2)+1)/2;
        k.g += (Math.max(0, 1-d/220) - k.g)*.08; const g = Math.min(1, k.g + wave*.1);
        hex(k.x, k.y, R-3); x.fillStyle = `rgba(33,189,214,${.03+g*.2})`; x.fill(); x.strokeStyle = `rgba(33,189,214,${.1+g*.6})`; x.lineWidth = 1; x.stroke();
        if (k.g > .6){ x.strokeStyle = `rgba(247,148,30,${(k.g-.6)*1.5})`; x.stroke(); } }
      if (!reduce) requestAnimationFrame(draw); }
    addEventListener('resize', build);
    hero.addEventListener('pointermove', e => { const b = c.getBoundingClientRect(); m.x = e.clientX - b.left; m.y = e.clientY - b.top; });
    hero.addEventListener('pointerleave', () => { m.x = m.y = -999; });
    build(); draw();

    /* Orange keyword band after the hero (or after the facts bar) */
    const band = document.createElement('div'); band.className = 'mq'; band.setAttribute('aria-hidden', 'true');
    const words = ['Carbon fiber','Glass fiber','Vacuum infusion','Mold making','CNC machining','Product development'];
    band.innerHTML = '<span>' + words.concat(words).join('<b>●</b>') + '</span>';
    const after = hero.nextElementSibling && hero.nextElementSibling.classList.contains('fc-facts') ? hero.nextElementSibling : hero;
    after.after(band);
  }

  /* Blueprint sheet labels above section headings */
  let n = 0;
  document.querySelectorAll('.fc-section > h2.wp-block-heading:first-child').forEach(h => {
    n++; h.dataset.sheet = 'Sheet ' + String(n).padStart(2, '0');
  });

  /* Lightbox for photos and diagrams */
  const lb = document.createElement('div'); lb.className = 'lb'; lb.setAttribute('role', 'dialog');
  lb.innerHTML = '<div><img alt=""><p></p></div>'; document.body.appendChild(lb);
  document.querySelectorAll('.fc-photo img').forEach(img => img.addEventListener('click', () => {
    lb.querySelector('img').src = img.src; lb.querySelector('img').alt = img.alt;
    const cap = img.closest('figure').querySelector('figcaption'); lb.querySelector('p').textContent = cap ? cap.textContent : img.alt;
    lb.classList.add('on'); }));
  lb.addEventListener('click', () => lb.classList.remove('on'));
  addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('on'); });

  /* Material picker (only where the page has one) */
  const rows = document.getElementById('pick-rows');
  if (rows) {
    const M = {
      carbon: { name: 'Carbon fiber', s: { light:3, stiff:3, cost:1, impact:1, insul:0, outdoor:2, look:3 }, why: 'Carbon gives the most stiffness for the least weight and the classic carbon look.' },
      glass:  { name: 'Glass fiber',  s: { light:1, stiff:1, cost:3, impact:2, insul:3, outdoor:3, look:1 }, why: 'Glass is tough, does not conduct electricity, handles weather well and costs far less.' },
      hybrid: { name: 'Hybrid',       s: { light:2, stiff:2, cost:2, impact:3, insul:1, outdoor:2, look:2 }, why: 'A hybrid puts carbon where stiffness matters and glass elsewhere, balancing weight, toughness and cost.' } };
    rows.innerHTML = Object.entries(M).map(([k, v]) => `<div class="row" id="r-${k}"><span>${v.name.split(' ')[0]}</span><div class="track"><div class="fill"></div></div><span class="pct">0</span></div>`).join('');
    const upd = () => { const ks = [...document.querySelectorAll('.opt.on')].map(b => b.dataset.k), sc = {}; let best = 'carbon';
      for (const k in M){ sc[k] = ks.length ? ks.reduce((a, q) => a + M[k].s[q], 0)/(3*ks.length) : 0; if (sc[k] > sc[best]) best = k; }
      for (const k in M){ const r = document.getElementById('r-'+k); r.querySelector('.fill').style.width = Math.round(sc[k]*100) + '%'; r.querySelector('.pct').textContent = Math.round(sc[k]*100); r.classList.toggle('win', k === best && ks.length > 0); }
      document.getElementById('pick-best').textContent = ks.length ? M[best].name : 'pick a need';
      document.getElementById('pick-why').textContent = ks.length ? M[best].why : ''; };
    document.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => { b.classList.toggle('on'); upd(); }));
    upd();
  }

  /* Footer */
  const f = document.createElement('footer'); f.className = 'site-foot';
  f.innerHTML = 'Future Composites (Pvt.) Ltd. · Islamabad · <a href="get-a-quote.html">Get a quote</a> · <a href="https://wa.me/923485940170">WhatsApp</a>';
  document.body.appendChild(f);

  /* Reveal on scroll */
  if (!reduce && 'IntersectionObserver' in window) {
    const els = document.querySelectorAll('.fc-section h2, .fc-section .wp-block-columns, .fc-section .wp-block-table, .fc-section > p, .fx .in > *');
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => { el.classList.add('reveal'); io.observe(el); });
  }
})();
