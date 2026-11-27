/* =========================================================================
   MEDIA_CONFIG — CONFIGURACIÓN DE IMÁGENES EN GITHUB / VERCEL
   Sube tus imágenes a la raíz del repositorio con estos nombres exactos.
   Si alguna aún no existe, se muestra un arte oscuro limpio sin errores.
   ========================================================================= */
const MEDIA_CONFIG = {
  logo: './logo.jpg',
  profile: './perfil.jpg',
  gallery: [
    './foto1.jpg',
    './foto2.jpg',
    './foto3.jpg',
    './foto4.jpg',
  ],
};

(function () {
  'use strict';

  const PREFS_KEY = 'endlooxs_ui_prefs_v2';
  const reducedMotionPref = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  const DEFAULT_PREFS = {
    theme: 'light',
    accent: 'blue',
    lang: 'es',
    motion: !reducedMotionPref,
    sound: false,
    ambient: true,
  };

  let prefs = loadPrefs();
  let activeTopic = 'Optimización Windows';
  let activeFilter = 'all';
  let comparePos = 50;
  let currentChapter = 0;
  let chapterLocked = false;
  let currentLightboxIndex = 0;
  let audioCtx = null;

  /* -----------------------------------------------------------------------
     AUDIO SUTIL DE INTERFAZ (WEB AUDIO API)
     ----------------------------------------------------------------------- */
  function playUiSound(type = 'tap') {
    if (!prefs.sound) return;
    try {
      const AudioContextRef = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextRef) return;
      if (!audioCtx) audioCtx = new AudioContextRef();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;

      osc.type = type === 'switch' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(type === 'switch' ? 520 : 420, now);
      osc.frequency.exponentialRampToValueAtTime(type === 'switch' ? 760 : 280, now + 0.055);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {}
  }

  /* -----------------------------------------------------------------------
     DICCIONARIO BILINGÜE (ES / EN)
     ----------------------------------------------------------------------- */
  const I18N = {
    es: {
      utilityStatus: 'DISPONIBLE PARA PROYECTOS',
      navHome: 'Inicio',
      navEco: 'Ecosistema',
      navCompare: 'Comparativa',
      navProjects: 'Proyectos',
      navAbout: 'Sobre Mí',
      navContact: 'Contacto',
      btnSettings: 'Ajustes',
      btnContact: 'Contactar',
      heroTitleA: 'Identidad digital, sistemas y',
      heroTitleB: 'proyectos multidisciplinarios',
      heroSubtitle: 'El ecosistema personal de Edgar Rodriguez: optimización avanzada de Windows 11, arquitectura de PCs custom de gama alta, gestión de comunidades digitales y curaduría visual bajo @endlooxs.',
      heroCtaPrimary: 'Explorar Proyectos',
      sec01Tag: '01 // ECOSISTEMA EN MOVIMIENTO',
      sec01TitleA: 'Cuatro pilares.',
      sec01TitleB: 'Un mismo estándar de ejecución.',
      sec01Desc: 'Tecnología, hardware y estrategia digital integrados bajo una estética sobria. Desplázate o selecciona cualquier capítulo para explorar el visor 3D interactivo.',
      ch0Title: 'Núcleo de Marca & Visión',
      ch0Desc: 'Identidad minimalista de alto contraste que conecta ingeniería técnica, criterio visual y proyectos digitales bajo @endlooxs.',
      ch1Title: 'Suite Optima0x & Control de Latencia',
      ch1Desc: 'Scripts .bat con detección dinámica de rutas, limpieza automatizada de RAM y configuración persistente en Optima0x.cfg para máximo rendimiento.',
      ch2Title: 'Hardware Custom ($1,000+)',
      ch2Desc: 'Selección inteligente sin cuellos de botella, diseño de flujo térmico silencioso, cableado quirúrgico y validación bajo estrés.',
      ch3Title: 'Redes Sociales & Curaduría 9:16',
      ch3Desc: 'Calendarios editoriales, retención en formatos verticales, crecimiento orgánico y manejo cercano de comunidades digitales.',
      compareTag: '01.5 // IMPACTO REAL',
      compareTitleA: 'Arrastra y compara',
      compareTitleB: 'el antes y el después',
      sec02Tag: '02 // PROYECTOS & SPEC SHEETS',
      sec02TitleA: 'Casos de estudio',
      sec02TitleB: 'con ficha técnica',
      filterAll: 'Todos',
      filterSys: 'Sistemas',
      filterHw: 'Hardware',
      filterBrand: 'Marca',
      viewSpec: 'Ver ficha técnica →',
      viewSpecShort: 'Ver ficha →',
      sec03Tag: '03 // SOBRE MÍ & GALERÍA',
      sec03TitleB: 'precisión técnica y curaduría visual',
      founderTag: 'FUNDADOR • ENDLOOXS',
      profileSub: 'Panamá · Perfil Híbrido Técnico-Creativo',
      bioP1: 'Desde Panamá dirijo ENDLOOXS con un principio claro: unir la exactitud técnica con el criterio estético. Trabajo desde el rendimiento a bajo nivel en Windows 11 y el armado de PCs custom de gama alta, hasta la dirección visual y gestión estratégica de comunidades digitales.',
      bioP2: 'Mi enfoque prioriza soluciones limpias, resultados medibles y una presentación visual minimalista que transmita solidez sin exceso.',
      factBase: 'Base',
      factRole: 'Perfil',
      factStatus: 'Estado',
      statusAvailable: 'Disponible',
      galleryTitle: 'Galería Personal',
      gallerySub: 'Curaduría vertical 4:5 de retratos, sistemas, hardware y @endlooxs. Haz clic para ampliar.',
      sec04Tag: '04 // CONTACTO DIRECTO',
      sec04TitleA: 'Hablemos de tu',
      sec04TitleB: 'próximo proyecto',
      sec04Desc: 'Disponible para optimización de Windows 11, cotización y armado de PCs custom (+$1,000 USD), Community Management o colaboraciones de marca.',
      btnCopy: 'Copiar',
      emailLabel: 'Correo Electrónico',
      quickMsgTitle: 'Mensaje Rápido',
      quickMsgSub: 'Conexión directa',
      nameLabel: 'Tu Nombre (opcional)',
      msgLabel: 'Cuéntame tu idea o necesidad',
      sendWa: 'Enviar por WhatsApp',
      sendMail: 'Enviar por Correo',
      settingsTitle: 'Ajustes de Página',
    },
    en: {
      utilityStatus: 'AVAILABLE FOR PROJECTS',
      navHome: 'Home',
      navEco: 'Ecosystem',
      navCompare: 'Comparison',
      navProjects: 'Projects',
      navAbout: 'About',
      navContact: 'Contact',
      btnSettings: 'Settings',
      btnContact: 'Contact',
      heroTitleA: 'Digital identity, systems and',
      heroTitleB: 'multidisciplinary projects',
      heroSubtitle: 'The personal ecosystem of Edgar Rodriguez: advanced Windows 11 optimization, high-end custom PC architecture, digital community management, and visual curation under @endlooxs.',
      heroCtaPrimary: 'Explore Projects',
      sec01Tag: '01 // ECOSYSTEM IN MOTION',
      sec01TitleA: 'Four pillars.',
      sec01TitleB: 'One execution standard.',
      sec01Desc: 'Technology, hardware, and digital strategy unified under a clean aesthetic. Scroll or pick any chapter to explore the interactive 3D stage.',
      ch0Title: 'Brand Core & Vision',
      ch0Desc: 'High-contrast minimalist identity bridging technical engineering, visual direction, and digital projects under @endlooxs.',
      ch1Title: 'Optima0x Suite & Latency Control',
      ch1Desc: 'Dynamic-path .bat scripts, automated RAM clearing, and persistent Optima0x.cfg tuning built for responsive gaming performance.',
      ch2Title: 'Custom Hardware ($1,000+)',
      ch2Desc: 'Bottleneck-free component selection, quiet airflow engineering, surgical cable management, and thermal stress validation.',
      ch3Title: 'Social Media & 9:16 Curation',
      ch3Desc: 'Editorial calendars, vertical retention frameworks, organic growth, and hands-on community management.',
      compareTag: '01.5 // REAL IMPACT',
      compareTitleA: 'Drag to compare',
      compareTitleB: 'before and after',
      sec02Tag: '02 // PROJECTS & SPEC SHEETS',
      sec02TitleA: 'Case studies',
      sec02TitleB: 'with technical specs',
      filterAll: 'All',
      filterSys: 'Systems',
      filterHw: 'Hardware',
      filterBrand: 'Brand',
      viewSpec: 'View spec sheet →',
      viewSpecShort: 'View specs →',
      sec03Tag: '03 // ABOUT & GALLERY',
      sec03TitleB: 'technical precision & visual curation',
      founderTag: 'FOUNDER • ENDLOOXS',
      profileSub: 'Panama · Hybrid Tech-Creative Profile',
      bioP1: 'From Panama I lead ENDLOOXS with one clear principle: uniting technical accuracy with aesthetic judgment—from low-level Windows 11 tuning and custom high-end PCs to visual direction and strategic community management.',
      bioP2: 'Every project prioritizes clean architecture, measurable performance, and minimalist visual execution without unnecessary noise.',
      factBase: 'Base',
      factRole: 'Profile',
      factStatus: 'Status',
      statusAvailable: 'Available',
      galleryTitle: 'Personal Gallery',
      gallerySub: 'Vertical 4:5 curation of portraits, systems, hardware, and @endlooxs. Click to expand.',
      sec04Tag: '04 // DIRECT CONTACT',
      sec04TitleA: "Let's build your",
      sec04TitleB: 'next project',
      sec04Desc: 'Available for Windows 11 optimization, custom PC builds ($1,000+ USD), Community Management, or brand collaborations.',
      btnCopy: 'Copy',
      emailLabel: 'Email Address',
      quickMsgTitle: 'Quick Message',
      quickMsgSub: 'Direct connection',
      nameLabel: 'Your Name (optional)',
      msgLabel: 'Tell me about your idea or project',
      sendWa: 'Send via WhatsApp',
      sendMail: 'Send via Email',
      settingsTitle: 'Page Settings',
    },
  };

  function applyLanguage() {
    const dict = I18N[prefs.lang] || I18N.es;
    document.documentElement.lang = prefs.lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (dict[key]) el.textContent = dict[key];
    });
    const utilLangBtn = document.getElementById('utilityLangBtn');
    if (utilLangBtn) utilLangBtn.textContent = prefs.lang === 'es' ? 'ES / EN' : 'EN / ES';
    positionFilterSlider();
  }

  /* -----------------------------------------------------------------------
     PREFERENCIAS Y TOASTS
     ----------------------------------------------------------------------- */
  function loadPrefs() {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (!raw) return { ...DEFAULT_PREFS };
      const parsed = JSON.parse(raw);
      return {
        theme: ['light', 'dark', 'navy'].includes(parsed.theme) ? parsed.theme : DEFAULT_PREFS.theme,
        accent: ['blue', 'gold', 'red'].includes(parsed.accent) ? parsed.accent : DEFAULT_PREFS.accent,
        lang: ['es', 'en'].includes(parsed.lang) ? parsed.lang : DEFAULT_PREFS.lang,
        motion: typeof parsed.motion === 'boolean' ? parsed.motion : DEFAULT_PREFS.motion,
        sound: typeof parsed.sound === 'boolean' ? parsed.sound : DEFAULT_PREFS.sound,
        ambient: typeof parsed.ambient === 'boolean' ? parsed.ambient : DEFAULT_PREFS.ambient,
      };
    } catch (e) {
      return { ...DEFAULT_PREFS };
    }
  }

  function savePrefs() {
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch (e) {}
  }

  function toast(message, tone = 'accent') {
    const stack = document.getElementById('toastStack');
    if (!stack) return;
    const el = document.createElement('div');
    const dotMap = { accent: 'bg-[var(--accent)]', gold: 'bg-[#D4AF37]', red: 'bg-[#E11D48]' };
    el.className = 'pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-full surface-glass-strong border border-hair text-xs font-semibold ink-main shadow-2xl transition-all duration-300 translate-y-3 opacity-0';
    el.innerHTML = `<span class="w-2 h-2 rounded-full shrink-0 ${dotMap[tone] || dotMap.accent}"></span><span>${message}</span>`;
    stack.appendChild(el);
    requestAnimationFrame(() => el.classList.remove('translate-y-3', 'opacity-0'));
    setTimeout(() => {
      el.classList.add('translate-y-3', 'opacity-0');
      setTimeout(() => el.remove(), 300);
    }, 2400);
  }

  /* -----------------------------------------------------------------------
     SCROLL REVEAL INMEDIATO Y PROGRESIVO
     ----------------------------------------------------------------------- */
  function initReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05 });
      revealEls.forEach((el) => io.observe(el));
      setTimeout(() => {
        revealEls.forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight * 1.15) {
            el.classList.add('visible');
          }
        });
      }, 60);
    } else {
      revealEls.forEach((el) => el.classList.add('visible'));
    }
  }

  /* -----------------------------------------------------------------------
     BARRA DE PROGRESO DE LECTURA
     ----------------------------------------------------------------------- */
  const scrollProgressEl = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    if (!scrollProgressEl) return;
    const y = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    scrollProgressEl.style.width = (max > 0 ? Math.min(100, Math.max(0, (y / max) * 100)) : 0) + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* -----------------------------------------------------------------------
     CARGA SILENCIOSA DE IMÁGENES (LOGO Y PERFIL)
     ----------------------------------------------------------------------- */
  function probeImage(src, onSuccess) {
    if (!src || typeof src !== 'string' || !src.trim()) return;
    const probe = new Image();
    probe.onload = () => onSuccess(src);
    probe.onerror = () => {};
    probe.src = src;
  }

  probeImage(MEDIA_CONFIG.logo, (validSrc) => {
    document.querySelectorAll('.brand-svg').forEach((svg) => svg.classList.add('hidden'));
    document.querySelectorAll('.brand-img').forEach((img) => {
      img.src = validSrc;
      img.classList.remove('hidden');
    });
  });

  const profileFallback = document.getElementById('profileFallback');
  const profileRealImg = document.getElementById('profileRealImg');
  probeImage(MEDIA_CONFIG.profile, (validSrc) => {
    if (profileRealImg && profileFallback) {
      profileRealImg.src = validSrc;
      profileRealImg.classList.remove('hidden');
      profileFallback.classList.add('hidden');
    }
  });

  /* -----------------------------------------------------------------------
     FÍSICAS 3D PARA TARJETAS [data-tilt-3d]
     ----------------------------------------------------------------------- */
  function attachTilt3D(el) {
    if (!el || isTouchDevice) return;
    const maxAngle = Number(el.dataset.tiltMax || 7);
    el.addEventListener('mousemove', (e) => {
      if (!prefs.motion) return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      const rx = (0.5 - ny) * (maxAngle * 2);
      const ry = (nx - 0.5) * (maxAngle * 2);
      el.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  }
  document.querySelectorAll('[data-tilt-3d]').forEach(attachTilt3D);

  /* -----------------------------------------------------------------------
     GALERÍA VERTICAL 4:5 CON TILT 3D Y LIGHTBOX
     ----------------------------------------------------------------------- */
  const GALLERY_META = [
    {
      tag: '01 // RETRATO',
      title: 'Edgar · Dirección Personal',
      caption: 'Estética sobria y enfoque multidisciplinario en Panamá.',
      fallbackArtwork: `<div class="relative w-full h-full bg-gradient-to-b from-[#0C1324] via-[#091121] to-[#050814] p-5 flex flex-col justify-between overflow-hidden"><div class="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full blur-2xl bg-[#0070CC]/25"></div><div class="relative z-10 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-white/60"><span>01 // RETRATO</span><span>4:5</span></div><div class="relative z-10 my-auto flex flex-col items-center justify-center"><svg viewBox="0 0 140 140" class="w-28 h-28 sm:w-32 sm:h-32" fill="none" aria-hidden="true"><circle cx="70" cy="70" r="62" stroke="rgba(255,255,255,0.12)" stroke-width="1"/><circle cx="70" cy="70" r="48" stroke="#D4AF37" stroke-opacity="0.38" stroke-width="1.2" stroke-dasharray="4 4"/><path d="M70 40C79 40 86 47 86 56C86 65 79 72 70 72C61 72 54 65 54 56C54 47 61 40 70 40Z" stroke="#F8FAFC" stroke-opacity="0.85" stroke-width="1.6"/><path d="M40 108C43 90 55 82 70 82C85 82 97 90 100 108" stroke="#0055FF" stroke-width="1.8" stroke-linecap="round"/><circle cx="96" cy="44" r="3" fill="#D4AF37"/></svg></div><div class="relative z-10 border-t border-white/10 pt-3"><p class="font-display font-semibold text-xs sm:text-sm text-white">Edgar · Dirección Personal</p><p class="font-mono text-[10px] text-white/55 mt-0.5">ENDLOOXS Studio</p></div></div>`,
    },
    {
      tag: '02 // SISTEMAS',
      title: 'Entorno & Optima0x Lab',
      caption: 'Optimización Windows 11, scripts automatizados y latencia controlada.',
      fallbackArtwork: `<div class="relative w-full h-full bg-gradient-to-b from-[#061128] via-[#071836] to-[#040814] p-5 flex flex-col justify-between overflow-hidden"><div class="pointer-events-none absolute -top-10 -left-10 w-44 h-44 rounded-full blur-2xl bg-[#0055FF]/30"></div><div class="relative z-10 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-[#60A5FA]"><span>02 // SISTEMAS</span><span>4:5</span></div><div class="relative z-10 my-auto space-y-3"><div class="rounded-xl bg-white/[0.05] border border-white/10 p-3 font-mono text-[10px] text-slate-300 space-y-1.5"><div class="flex justify-between text-[#60A5FA]"><span>Optima0x.cfg</span><span>LIVE</span></div><div class="h-1 w-full rounded bg-white/10 overflow-hidden"><div class="h-full w-4/5 bg-[#0055FF]"></div></div><div class="h-1 w-full rounded bg-white/10 overflow-hidden"><div class="h-full w-3/5 bg-[#D4AF37]"></div></div></div><svg viewBox="0 0 180 56" class="w-full h-12" fill="none" aria-hidden="true"><path d="M0 44 C26 42, 42 18, 72 28 C102 38, 126 16, 180 14" stroke="#60A5FA" stroke-width="2"/><circle cx="136" cy="18" r="3.5" fill="#0055FF"/></svg></div><div class="relative z-10 border-t border-white/10 pt-3"><p class="font-display font-semibold text-xs sm:text-sm text-white">Entorno &amp; Optima0x Lab</p><p class="font-mono text-[10px] text-white/55 mt-0.5">Windows 11 Engine</p></div></div>`,
    },
    {
      tag: '03 // HARDWARE',
      title: 'Ensamble Custom +$1,000',
      caption: 'Selección de componentes, flujo térmico y ensamblaje de precisión.',
      fallbackArtwork: `<div class="relative w-full h-full bg-gradient-to-b from-[#17130A] via-[#131218] to-[#060810] p-5 flex flex-col justify-between overflow-hidden"><div class="pointer-events-none absolute top-1/3 -right-12 w-40 h-40 rounded-full blur-2xl bg-[#D4AF37]/24"></div><div class="relative z-10 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-[#D4AF37]"><span>03 // HARDWARE</span><span>4:5</span></div><div class="relative z-10 my-auto"><svg viewBox="0 0 180 120" class="w-full h-28" fill="none" aria-hidden="true"><rect x="14" y="10" width="152" height="100" rx="14" stroke="rgba(255,255,255,0.18)" stroke-width="1.3"/><rect x="28" y="24" width="44" height="36" rx="8" fill="rgba(212,175,55,0.14)" stroke="#D4AF37" stroke-width="1.2"/><rect x="28" y="70" width="94" height="24" rx="6" fill="rgba(0,112,204,0.18)" stroke="#60A5FA" stroke-width="1.2"/><circle cx="136" cy="42" r="14" stroke="rgba(255,255,255,0.28)" stroke-width="1.2" stroke-dasharray="3 3"/><circle cx="136" cy="42" r="4" fill="#D4AF37"/><path d="M26 52 H152" stroke="#D4AF37" stroke-opacity="0.55" stroke-width="1.2" class="dash-flow"/></svg></div><div class="relative z-10 border-t border-white/10 pt-3"><p class="font-display font-semibold text-xs sm:text-sm text-white">Ensamble Custom +$1,000</p><p class="font-mono text-[10px] text-white/55 mt-0.5">Thermal &amp; Balance</p></div></div>`,
    },
    {
      tag: '04 // @ENDLOOXS',
      title: 'Estética & Curaduría Visual',
      caption: 'Identidad personal, ritmo visual y presencia orgánica en Instagram.',
      fallbackArtwork: `<div class="relative w-full h-full bg-gradient-to-b from-[#1A0B14] via-[#100D1B] to-[#050814] p-5 flex flex-col justify-between overflow-hidden"><div class="pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-2xl bg-[#E11D48]/24"></div><div class="relative z-10 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-[#FB7185]"><span>04 // @ENDLOOXS</span><span>4:5</span></div><div class="relative z-10 my-auto flex flex-col items-center"><div class="w-20 h-20 rounded-full carbon-medallion border border-[#D4AF37]/70 flex items-center justify-center shadow-lg"><svg class="w-12 h-12" viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="M21 66L13 56L24 49L17 38L34 32L46 14L52 28L61 18L61 34L73 41L75 49L89 54L82 63L67 61L62 71L71 78C58 87 38 87 24 77C18 72 19 68 21 66Z" fill="#D4AF37" fill-opacity="0.16" stroke="#D4AF37" stroke-width="3.6" stroke-linejoin="round"/><path d="M35 63L42.5 59.5L40 69.5L35 63Z" fill="#E11D48"/></svg></div><div class="flex items-center gap-1.5 mt-4"><span class="w-4 h-1.5 rounded-full bg-[#0055FF]"></span><span class="w-4 h-1.5 rounded-full bg-[#D4AF37]"></span><span class="w-4 h-1.5 rounded-full bg-[#E11D48]"></span></div></div><div class="relative z-10 border-t border-white/10 pt-3"><p class="font-display font-semibold text-xs sm:text-sm text-white">Estética &amp; Curaduría Visual</p><p class="font-mono text-[10px] text-white/55 mt-0.5">instagram.com/endlooxs</p></div></div>`,
    },
  ];

  const galleryResolved = GALLERY_META.map((meta, idx) => ({
    ...meta,
    loadedSrc: '',
    configuredSrc: (MEDIA_CONFIG.gallery && MEDIA_CONFIG.gallery[idx]) || '',
  }));

  const galleryGrid = document.getElementById('galleryGrid');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxArtwork = document.getElementById('lightboxArtwork');
  const lightboxTag = document.getElementById('lightboxTag');
  const lightboxCaption = document.getElementById('lightboxCaption');

  function renderGallery() {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';
    galleryResolved.forEach((item, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.tiltMax = '7';
      btn.setAttribute('aria-label', `Ampliar ${item.title}`);
      btn.className = 'tilt-card group relative aspect-[4/5] w-full text-left rounded-2xl surface-card overflow-hidden transition-all duration-500 hover:border-[var(--accent)] hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]';

      btn.innerHTML = `
        <div class="gallery-fallback w-full h-full transition-transform duration-700 group-hover:scale-[1.03]">${item.fallbackArtwork}</div>
        <img class="gallery-real hidden w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="${item.title}" />
        <div class="gallery-real-caption hidden absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 via-black/35 to-transparent">
          <span class="block font-mono text-[9px] tracking-[0.18em] text-[#D4AF37] uppercase">${item.tag}</span>
          <span class="block font-display font-semibold text-xs sm:text-sm text-white mt-0.5">${item.title}</span>
        </div>`;

      btn.addEventListener('click', () => { playUiSound('tap'); openLightbox(idx); });
      attachTilt3D(btn);
      galleryGrid.appendChild(btn);

      probeImage(item.configuredSrc, (validSrc) => {
        item.loadedSrc = validSrc;
        btn.querySelector('.gallery-real').src = validSrc;
        btn.querySelector('.gallery-real').classList.remove('hidden');
        btn.querySelector('.gallery-real-caption').classList.remove('hidden');
        btn.querySelector('.gallery-fallback').classList.add('hidden');
      });
    });
  }

  function openLightbox(idx) {
    if (!lightboxModal) return;
    currentLightboxIndex = (idx + galleryResolved.length) % galleryResolved.length;
    const item = galleryResolved[currentLightboxIndex];
    if (lightboxTag) lightboxTag.textContent = item.tag;
    if (lightboxCaption) lightboxCaption.textContent = `${item.title} — ${item.caption}`;

    if (item.loadedSrc) {
      lightboxImg.src = item.loadedSrc;
      lightboxImg.alt = item.title;
      lightboxImg.classList.remove('hidden');
      lightboxArtwork.classList.add('hidden');
      lightboxArtwork.innerHTML = '';
    } else {
      lightboxImg.classList.add('hidden');
      lightboxImg.src = '';
      lightboxArtwork.innerHTML = item.fallbackArtwork;
      lightboxArtwork.classList.remove('hidden');
    }
    lightboxModal.classList.remove('hidden');
    lightboxModal.classList.add('flex');
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.add('hidden');
    lightboxModal.classList.remove('flex');
  }

  document.getElementById('closeLightboxBtn')?.addEventListener('click', closeLightbox);
  document.getElementById('lbPrevBtn')?.addEventListener('click', () => openLightbox(currentLightboxIndex - 1));
  document.getElementById('lbNextBtn')?.addEventListener('click', () => openLightbox(currentLightboxIndex + 1));
  lightboxModal?.addEventListener('click', (e) => { if (e.target === lightboxModal) closeLightbox(); });

  /* -----------------------------------------------------------------------
     COMPARADOR INTERACTIVO ANTES VS. DESPUÉS
     ----------------------------------------------------------------------- */
  const COMPARE_MODES = {
    optima: {
      before: `
        <div class="flex items-center justify-between gap-2">
          <span class="px-3.5 py-1 rounded-full font-mono text-[10px] sm:text-xs font-semibold tracking-wider uppercase bg-[#E11D48]/15 text-[#FB7185] border border-[#E11D48]/40">ANTES · WINDOWS 11 DE FÁBRICA</span>
          <span class="font-mono text-[11px] text-slate-400">STOCK OS</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-6">
          <div class="rounded-2xl bg-white/[0.04] border border-white/10 p-4"><span class="font-mono text-[10px] text-slate-400 uppercase block">Procesos Activos</span><p class="font-display font-bold text-2xl sm:text-3xl text-[#FB7185] mt-1">184</p><span class="font-mono text-[10px] text-slate-500">Telemetría y bloatware</span></div>
          <div class="rounded-2xl bg-white/[0.04] border border-white/10 p-4"><span class="font-mono text-[10px] text-slate-400 uppercase block">RAM en Reposo</span><p class="font-display font-bold text-2xl sm:text-3xl text-[#FB7185] mt-1">6.4 GB</p><span class="font-mono text-[10px] text-slate-500">Caché sin purgar</span></div>
          <div class="rounded-2xl bg-white/[0.04] border border-white/10 p-4"><span class="font-mono text-[10px] text-slate-400 uppercase block">Estabilidad 1% Low</span><p class="font-display font-bold text-2xl sm:text-3xl text-[#FB7185] mt-1">Irregular</p><span class="font-mono text-[10px] text-slate-500">Micro-stuttering</span></div>
        </div>
        <div class="flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[11px] text-slate-400"><span>Servicios innecesarios en segundo plano</span><span class="text-[#FB7185]">Sin calibrar</span></div>`,
      after: `
        <div class="flex items-center justify-between gap-2">
          <span class="font-mono text-[11px] text-slate-400">OPTIMA0X ENGINE</span>
          <span class="px-3.5 py-1 rounded-full font-mono text-[10px] sm:text-xs font-semibold tracking-wider uppercase bg-[#0055FF]/20 text-[#60A5FA] border border-[#0055FF]/45">DESPUÉS · OPTIMA0X ACTIVO</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-6">
          <div class="rounded-2xl bg-[#0055FF]/10 border border-[#0055FF]/35 p-4"><span class="font-mono text-[10px] text-slate-300 uppercase block">Procesos Activos</span><p class="font-display font-bold text-2xl sm:text-3xl text-[#60A5FA] mt-1">68</p><span class="font-mono text-[10px] text-emerald-400">-63% carga de fondo</span></div>
          <div class="rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/35 p-4"><span class="font-mono text-[10px] text-slate-300 uppercase block">RAM en Reposo</span><p class="font-display font-bold text-2xl sm:text-3xl text-[#D4AF37] mt-1">2.3 GB</p><span class="font-mono text-[10px] text-emerald-400">Auto RAM Clear</span></div>
          <div class="rounded-2xl bg-white/[0.06] border border-emerald-400/35 p-4"><span class="font-mono text-[10px] text-slate-300 uppercase block">Estabilidad 1% Low</span><p class="font-display font-bold text-2xl sm:text-3xl text-emerald-400 mt-1">Consistente</p><span class="font-mono text-[10px] text-slate-300">Optima0x.cfg persistente</span></div>
        </div>
        <div class="flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[11px] text-slate-300"><span>Rutas dinámicas &amp; baja latencia</span><span class="text-emerald-400 font-semibold">Peak Performance •</span></div>`,
    },
    social: {
      before: `
        <div class="flex items-center justify-between gap-2">
          <span class="px-3.5 py-1 rounded-full font-mono text-[10px] sm:text-xs font-semibold tracking-wider uppercase bg-[#E11D48]/15 text-[#FB7185] border border-[#E11D48]/40">ANTES · FEED SIN DIRECCIÓN</span>
          <span class="font-mono text-[11px] text-slate-400">RAW PROFILE</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-6">
          <div class="h-32 rounded-2xl bg-[#271816]/80 border border-white/10 p-4 flex flex-col justify-end"><span class="font-mono text-xs text-slate-300">Recortes sin orden</span></div>
          <div class="h-32 rounded-2xl bg-[#142327]/80 border border-white/10 p-4 flex flex-col justify-end"><span class="font-mono text-xs text-slate-300">Paleta dispersa</span></div>
          <div class="h-32 rounded-2xl bg-[#241624]/80 border border-white/10 p-4 flex flex-col justify-end"><span class="font-mono text-xs text-slate-300">Sin calendario</span></div>
        </div>
        <div class="flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[11px] text-slate-400"><span>Publicaciones aisladas sin narrativa</span><span class="text-[#FB7185]">Baja retención</span></div>`,
      after: `
        <div class="flex items-center justify-between gap-2">
          <span class="font-mono text-[11px] text-slate-400">CURADURÍA 4:5</span>
          <span class="font-mono text-xs font-semibold tracking-wider text-[#D4AF37]">@endlooxs // COHESIVE</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-6">
          <div class="h-32 rounded-2xl bg-gradient-to-br from-[#0055FF]/25 to-[#060C1E] border border-[#0055FF]/45 p-4 flex flex-col justify-between"><span class="font-mono text-[10px] text-[#60A5FA]">01 // IDENTIDAD</span><span class="font-display font-semibold text-sm text-white">Encuadre Vertical 4:5</span></div>
          <div class="h-32 rounded-2xl bg-gradient-to-br from-[#D4AF37]/25 to-[#0B101D] border border-[#D4AF37]/45 p-4 flex flex-col justify-between"><span class="font-mono text-[10px] text-[#D4AF37]">02 // COLOR</span><span class="font-display font-semibold text-sm text-white">Paleta Moody Coherente</span></div>
          <div class="h-32 rounded-2xl bg-gradient-to-br from-[#E11D48]/25 to-[#0D0A18] border border-[#E11D48]/45 p-4 flex flex-col justify-between"><span class="font-mono text-[10px] text-[#FB7185]">03 // GROWTH</span><span class="font-display font-semibold text-sm text-white">Comunidad Activa</span></div>
        </div>
        <div class="flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[11px] text-slate-300"><span>Narrativa visual consistente</span><span class="text-emerald-400 font-semibold">Brand Authority •</span></div>`,
    },
  };

  const compareStage = document.getElementById('compareStage');
  const compareBefore = document.getElementById('compareBefore');
  const compareAfter = document.getElementById('compareAfter');
  const compareHandle = compareStage ? compareStage.querySelector('.compare-handle') : null;
  const compareModeBtns = document.querySelectorAll('.compare-mode-btn');

  function setComparePosition(pct) {
    comparePos = Math.max(8, Math.min(92, pct));
    if (compareStage) compareStage.style.setProperty('--pos', comparePos.toFixed(1) + '%');
    if (compareHandle) compareHandle.setAttribute('aria-valuenow', String(Math.round(comparePos)));
  }

  function renderCompare(mode) {
    const data = COMPARE_MODES[mode] || COMPARE_MODES.optima;
    if (compareBefore) compareBefore.innerHTML = data.before;
    if (compareAfter) compareAfter.innerHTML = data.after;
    compareModeBtns.forEach((btn) => {
      const on = btn.dataset.compareMode === mode;
      btn.classList.toggle('accent-fill', on);
      btn.classList.toggle('ink-sub', !on);
    });
  }

  compareModeBtns.forEach((btn) => {
    btn.addEventListener('click', () => { playUiSound('switch'); renderCompare(btn.dataset.compareMode); });
  });

  if (compareStage) {
    let dragging = false;
    const updateFromClientX = (clientX) => {
      const r = compareStage.getBoundingClientRect();
      if (r.width > 0) setComparePosition(((clientX - r.left) / r.width) * 100);
    };
    compareStage.addEventListener('pointerdown', (e) => {
      dragging = true;
      compareStage.setPointerCapture(e.pointerId);
      updateFromClientX(e.clientX);
    });
    compareStage.addEventListener('pointermove', (e) => { if (dragging) updateFromClientX(e.clientX); });
    const endDrag = () => { dragging = false; };
    compareStage.addEventListener('pointerup', endDrag);
    compareStage.addEventListener('pointercancel', endDrag);
    compareHandle?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); setComparePosition(comparePos - 5); }
      if (e.key === 'ArrowRight') { e.preventDefault(); setComparePosition(comparePos + 5); }
    });
  }
  renderCompare('optima');
  setComparePosition(50);

  /* -----------------------------------------------------------------------
     PANEL DE AJUSTES DE PÁGINA
     ----------------------------------------------------------------------- */
  const htmlEl = document.documentElement;
  const settingsDrawer = document.getElementById('settingsDrawer');
  const settingsBackdrop = document.getElementById('settingsBackdrop');

  function updateSwitch(btnId, knobId, active) {
    const btn = document.getElementById(btnId);
    const knob = document.getElementById(knobId);
    if (!btn || !knob) return;
    btn.setAttribute('aria-checked', String(active));
    btn.style.backgroundColor = active ? 'var(--accent)' : '#94A3B8';
    knob.classList.toggle('translate-x-6', active);
    knob.classList.toggle('translate-x-1', !active);
  }

  function applyPrefs() {
    htmlEl.setAttribute('data-theme', prefs.theme);
    htmlEl.setAttribute('data-accent', prefs.accent);
    htmlEl.setAttribute('data-motion', prefs.motion ? 'on' : 'off');
    htmlEl.setAttribute('data-ambient', prefs.ambient ? 'on' : 'off');

    document.querySelectorAll('.theme-opt').forEach((btn) => {
      const on = btn.dataset.setTheme === prefs.theme;
      btn.style.borderColor = on ? 'var(--accent)' : '';
      const dot = btn.querySelector('.theme-dot');
      if (dot) dot.style.backgroundColor = on ? 'var(--accent)' : 'transparent';
    });
    document.querySelectorAll('.accent-opt').forEach((btn) => {
      const on = btn.dataset.setAccent === prefs.accent;
      btn.style.borderColor = on ? 'var(--accent)' : '';
      btn.style.backgroundColor = on ? 'var(--accent-soft)' : '';
    });
    document.querySelectorAll('.lang-opt').forEach((btn) => {
      const on = btn.dataset.setLang === prefs.lang;
      btn.style.borderColor = on ? 'var(--accent)' : '';
      btn.style.backgroundColor = on ? 'var(--accent-soft)' : '';
    });

    updateSwitch('motionToggle', 'motionKnob', prefs.motion);
    updateSwitch('soundToggle', 'soundKnob', prefs.sound);
    updateSwitch('ambientToggle', 'ambientKnob', prefs.ambient);
    applyLanguage();
    savePrefs();
  }

  function openSettings() {
    playUiSound('tap');
    settingsBackdrop?.classList.remove('hidden');
    settingsDrawer?.classList.remove('translate-x-full');
  }
  function closeSettings() {
    settingsDrawer?.classList.add('translate-x-full');
    settingsBackdrop?.classList.add('hidden');
  }

  document.getElementById('navSettingsBtn')?.addEventListener('click', openSettings);
  document.getElementById('floatingSettingsBtn')?.addEventListener('click', openSettings);
  document.getElementById('closeSettingsBtn')?.addEventListener('click', closeSettings);
  settingsBackdrop?.addEventListener('click', closeSettings);

  document.getElementById('utilityThemeBtn')?.addEventListener('click', () => {
    const themes = ['light', 'dark', 'navy'];
    const names = { light: 'Blanco Futurista', dark: 'Obsidiana Oscuro', navy: 'Azul Profundo' };
    prefs.theme = themes[(themes.indexOf(prefs.theme) + 1) % themes.length];
    playUiSound('switch');
    applyPrefs();
    toast(`Tema: ${names[prefs.theme]}`);
  });
  document.getElementById('utilityLangBtn')?.addEventListener('click', () => {
    prefs.lang = prefs.lang === 'es' ? 'en' : 'es';
    playUiSound('switch');
    applyPrefs();
    toast(prefs.lang === 'es' ? 'Idioma: Español' : 'Language: English');
  });
  document.querySelectorAll('.theme-opt').forEach((btn) => {
    btn.addEventListener('click', () => { prefs.theme = btn.dataset.setTheme; playUiSound('switch'); applyPrefs(); toast('Tema visual actualizado'); });
  });
  document.querySelectorAll('.accent-opt').forEach((btn) => {
    btn.addEventListener('click', () => { prefs.accent = btn.dataset.setAccent; playUiSound('switch'); applyPrefs(); toast('Color de acento actualizado'); });
  });
  document.querySelectorAll('.lang-opt').forEach((btn) => {
    btn.addEventListener('click', () => { prefs.lang = btn.dataset.setLang; playUiSound('switch'); applyPrefs(); toast(prefs.lang === 'es' ? 'Idioma: Español' : 'Language: English'); });
  });
  document.getElementById('motionToggle')?.addEventListener('click', () => {
    prefs.motion = !prefs.motion; playUiSound('switch'); applyPrefs();
    toast(prefs.motion ? 'Físicas 3D y animaciones activas' : 'Animaciones pausadas');
  });
  document.getElementById('soundToggle')?.addEventListener('click', () => {
    prefs.sound = !prefs.sound; applyPrefs();
    if (prefs.sound) playUiSound('switch');
    toast(prefs.sound ? 'Audio de interfaz activado' : 'Audio silenciado');
  });
  document.getElementById('ambientToggle')?.addEventListener('click', () => {
    prefs.ambient = !prefs.ambient; playUiSound('switch'); applyPrefs();
    toast(prefs.ambient ? 'Luz ambiental activada' : 'Luz ambiental desactivada');
  });
  document.getElementById('resetPrefsBtn')?.addEventListener('click', () => {
    prefs = { ...DEFAULT_PREFS }; applyPrefs(); toast('Ajustes restablecidos', 'gold');
  });

  /* -----------------------------------------------------------------------
     MENÚ MÓVIL, BOTONES MAGNÉTICOS Y SPOTLIGHT
     ----------------------------------------------------------------------- */
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  document.getElementById('mobileNavBtn')?.addEventListener('click', () => mobileNavDrawer?.classList.toggle('hidden'));
  document.querySelectorAll('.mobile-nav-link').forEach((a) => {
    a.addEventListener('click', () => mobileNavDrawer?.classList.add('hidden'));
  });

  if (!isTouchDevice) {
    document.querySelectorAll('[data-magnetic]').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        if (!prefs.motion) return;
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate3d(${((e.clientX - (r.left + r.width / 2)) * 0.14).toFixed(1)}px, ${((e.clientY - (r.top + r.height / 2)) * 0.14).toFixed(1)}px, 0)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate3d(0, 0, 0)'; });
    });
    document.querySelectorAll('.spotlight-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        if (!prefs.ambient) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* -----------------------------------------------------------------------
     LIENZO INTERACTIVO 60FPS + MONOLITO 3D DEL HERO
     ----------------------------------------------------------------------- */
  const heroCanvas = document.getElementById('heroLightCanvas');
  const ctx = heroCanvas ? heroCanvas.getContext('2d') : null;
  let cw = 0, ch = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
  const particles = [];
  let t = 0;

  function resizeCanvas() {
    if (!heroCanvas || !ctx) return;
    const rect = heroCanvas.parentElement.getBoundingClientRect();
    cw = rect.width;
    ch = rect.height;
    heroCanvas.width = Math.floor(cw * dpr);
    heroCanvas.height = Math.floor(ch * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles.length = 0;
    const count = cw < 640 ? 18 : 36;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * cw,
        y: Math.random() * ch,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.5 + 0.9,
        tone: i % 9 === 0 ? 'gold' : (i % 15 === 0 ? 'red' : 'blue'),
      });
    }
  }

  if (heroCanvas) {
    window.addEventListener('resize', resizeCanvas);
    heroCanvas.parentElement.addEventListener('mousemove', (e) => {
      const r = heroCanvas.getBoundingClientRect();
      pointer.tx = e.clientX - r.left;
      pointer.ty = e.clientY - r.top;
    });
    heroCanvas.parentElement.addEventListener('mouseleave', () => { pointer.tx = -9999; pointer.ty = -9999; });
  }

  function drawCanvas() {
    if (!ctx) return;
    ctx.clearRect(0, 0, cw, ch);
    const isLight = prefs.theme === 'light';
    ctx.strokeStyle = isLight ? 'rgba(15, 23, 42, 0.032)' : 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < cw; x += 72) { ctx.moveTo(x, 0); ctx.lineTo(x, ch); }
    for (let y = 0; y < ch; y += 72) { ctx.moveTo(0, y); ctx.lineTo(cw, y); }
    ctx.stroke();

    if (prefs.ambient) {
      const blueRgba = isLight ? 'rgba(0, 85, 255,' : 'rgba(59, 130, 246,';
      const goldRgba = 'rgba(212, 175, 55,';
      const redRgba = 'rgba(225, 29, 72,';
      if (prefs.motion) t += 0.008;

      [
        { yBase: ch * 0.26, amp: 24, freq: 0.003, color: blueRgba + (isLight ? '0.08)' : '0.15)') },
        { yBase: ch * 0.62, amp: 30, freq: 0.0022, color: goldRgba + (isLight ? '0.09)' : '0.12)') },
      ].forEach((wave, idx) => {
        ctx.beginPath();
        for (let x = 0; x <= cw; x += 20) {
          const y = wave.yBase + Math.sin(x * wave.freq + t + idx * 1.7) * wave.amp;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      });

      pointer.x += (pointer.tx - pointer.x) * 0.1;
      pointer.y += (pointer.ty - pointer.y) * 0.1;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (prefs.motion) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > cw) p.vx *= -1;
          if (p.y < 0 || p.y > ch) p.vy *= -1;
        }
        const dxp = pointer.x - p.x;
        const dyp = pointer.y - p.y;
        const distP = Math.hypot(dxp, dyp);
        if (prefs.motion && distP < 155 && distP > 1) {
          p.x -= (dxp / distP) * 0.35;
          p.y -= (dyp / distP) * 0.35;
        }
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 130) {
            ctx.strokeStyle = blueRgba + ((1 - d / 130) * (isLight ? 0.10 : 0.15)).toFixed(3) + ')';
            ctx.lineWidth = 0.85;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        ctx.fillStyle = p.tone === 'gold' ? goldRgba + '0.58)' : p.tone === 'red' ? redRgba + '0.45)' : blueRgba + (isLight ? '0.32)' : '0.52)');
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    }
    requestAnimationFrame(drawCanvas);
  }

  const heroMonolith = document.getElementById('heroMonolith');
  const monolithGlare = document.getElementById('monolithGlare');
  const tilt = { rx: 0, ry: 0, trx: 0, try: 0, gx: 50, gy: 24, tgx: 50, tgy: 24 };

  if (heroMonolith && !isTouchDevice) {
    heroMonolith.addEventListener('mousemove', (e) => {
      if (!prefs.motion) return;
      const r = heroMonolith.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      tilt.trx = (0.5 - ny) * 14;
      tilt.try = (nx - 0.5) * 14;
      tilt.tgx = nx * 100;
      tilt.tgy = ny * 100;
    });
    heroMonolith.addEventListener('mouseleave', () => {
      tilt.trx = 0; tilt.try = 0; tilt.tgx = 50; tilt.tgy = 24;
    });
  }

  function animateMonolith() {
    if (prefs.motion && heroMonolith && !isTouchDevice) {
      tilt.rx += (tilt.trx - tilt.rx) * 0.085;
      tilt.ry += (tilt.try - tilt.ry) * 0.085;
      tilt.gx += (tilt.tgx - tilt.gx) * 0.1;
      tilt.gy += (tilt.tgy - tilt.gy) * 0.1;
      heroMonolith.style.transform = `rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg)`;
      if (monolithGlare) {
        monolithGlare.style.setProperty('--gx', `${tilt.gx.toFixed(1)}%`);
        monolithGlare.style.setProperty('--gy', `${tilt.gy.toFixed(1)}%`);
      }
    }
    requestAnimationFrame(animateMonolith);
  }

  /* -----------------------------------------------------------------------
     BANDA OSCURA — 4 CAPÍTULOS INTERACTIVOS CON VISOR 3D
     ----------------------------------------------------------------------- */
  const CHAPTERS = [
    {
      code: 'CORE // 01 · ARQUITECTURA ENDLOOXS',
      chip: '@endlooxs',
      color: '#0070CC',
      aurora1: 'rgba(0, 85, 255, 0.36)',
      aurora2: 'rgba(212, 175, 55, 0.16)',
      visual: `<div class="w-full flex flex-col items-center justify-center py-4"><div class="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center perspective-1200"><div class="gyro-ring gyro-ring-1" style="width:220px;height:220px;"></div><div class="gyro-ring gyro-ring-2" style="width:180px;height:180px;"></div><div class="relative w-28 h-28 rounded-full carbon-medallion border-2 border-[#D4AF37]/80 flex items-center justify-center shadow-[0_0_48px_rgba(0,85,255,0.40)]"><svg class="w-20 h-20" viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="M21 66L13 56L24 49L17 38L34 32L46 14L52 28L61 18L61 34L73 41L75 49L89 54L82 63L67 61L62 71L71 78C58 87 38 87 24 77C18 72 19 68 21 66Z" fill="#D4AF37" fill-opacity="0.16" stroke="#D4AF37" stroke-width="3.2" stroke-linejoin="round"/><path d="M27 61L40 44L47 51L59 36" stroke="#D4AF37" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M35 63L42.5 59.5L40 69.5L35 63Z" fill="#E11D48"/><path d="M48 62.5L60.5 54.5L52.5 64L48 62.5Z" fill="#E11D48"/></svg></div></div><p class="mt-4 font-mono text-[11px] tracking-[0.22em] text-slate-300 uppercase">Tecnología • Hardware • Estrategia</p></div>`,
      telemetry: [{ label: 'IDENTIDAD', value: 'ENDLOOXS' }, { label: 'ENFOQUE', value: 'Híbrido Pro' }, { label: 'PERFIL', value: '@endlooxs' }],
    },
    {
      code: 'CORE // 02 · OPTIMIZACIÓN WINDOWS 11',
      chip: 'Optima0x.cfg',
      color: '#38BDF8',
      aurora1: 'rgba(56, 189, 248, 0.30)',
      aurora2: 'rgba(0, 85, 255, 0.25)',
      visual: `<div class="w-full space-y-5"><div class="flex items-center justify-between font-mono text-[11px] text-slate-300"><span>FRAMETIME &amp; RAM WAVEFORM</span><span class="text-[#38BDF8]">OPTIMA0X ACTIVE</span></div><svg viewBox="0 0 420 135" class="w-full h-36" fill="none" aria-hidden="true"><defs><linearGradient id="optWaveGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#38BDF8" stop-opacity="0.34"/><stop offset="100%" stop-color="#38BDF8" stop-opacity="0"/></linearGradient></defs><line x1="0" y1="30" x2="420" y2="30" stroke="rgba(255,255,255,0.08)" stroke-dasharray="4 4"/><line x1="0" y1="70" x2="420" y2="70" stroke="rgba(255,255,255,0.08)" stroke-dasharray="4 4"/><line x1="0" y1="110" x2="420" y2="110" stroke="rgba(255,255,255,0.08)"/><path d="M0 95 L42 84 L74 38 L102 92 L140 50 L175 88 L210 68" stroke="rgba(225,29,72,0.58)" stroke-width="1.5" stroke-dasharray="4 4"/><path d="M0 95 C45 92, 92 88, 150 84 C210 79, 270 75, 330 74 C372 73, 398 73, 420 72 L420 128 L0 128 Z" fill="url(#optWaveGrad)"/><path d="M0 95 C45 92, 92 88, 150 84 C210 79, 270 75, 330 74 C372 73, 398 73, 420 72" stroke="#38BDF8" stroke-width="2.5"/><circle cx="330" cy="74" r="5" fill="#38BDF8"/><circle cx="330" cy="74" r="11" stroke="#38BDF8" stroke-opacity="0.45"/></svg><div class="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-slate-400"><span class="text-white/90">&gt; Rutas dinámicas verificadas</span><span>Limpieza RAM automatizada: OK</span></div></div>`,
      telemetry: [{ label: 'CONFIG', value: 'Optima0x.cfg' }, { label: 'MEMORIA', value: 'Auto Purge' }, { label: 'LATENCIA', value: 'Optimizada' }],
    },
    {
      code: 'CORE // 03 · ENSAMBLES PC GAMA ALTA',
      chip: 'Custom $1,000+',
      color: '#D4AF37',
      aurora1: 'rgba(212, 175, 55, 0.30)',
      aurora2: 'rgba(0, 112, 204, 0.22)',
      visual: `<div class="w-full space-y-4"><div class="flex items-center justify-between font-mono text-[11px] text-slate-300"><span>ESQUEMA TÉRMICO &amp; BALANCE DE HARDWARE</span><span class="text-[#D4AF37]">ZERO BOTTLENECK</span></div><svg viewBox="0 0 420 148" class="w-full h-36" fill="none" aria-hidden="true"><rect x="24" y="12" width="372" height="124" rx="18" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.18)" stroke-width="1.4"/><rect x="38" y="28" width="12" height="26" rx="4" fill="#0070CC" fill-opacity="0.6"/><rect x="38" y="61" width="12" height="26" rx="4" fill="#0070CC" fill-opacity="0.6"/><rect x="38" y="94" width="12" height="26" rx="4" fill="#0070CC" fill-opacity="0.6"/><rect x="148" y="28" width="66" height="44" rx="10" fill="rgba(212,175,55,0.16)" stroke="#D4AF37" stroke-width="1.4"/><text x="181" y="54" text-anchor="middle" fill="#F8FAFC" font-family="JetBrains Mono" font-size="10">CPU</text><rect x="122" y="84" width="160" height="32" rx="8" fill="rgba(0,112,204,0.20)" stroke="#60A5FA" stroke-width="1.4"/><text x="202" y="104" text-anchor="middle" fill="#F8FAFC" font-family="JetBrains Mono" font-size="10">GPU // THERMAL CURVE</text><path d="M56 41 C110 41, 120 48, 356 40" stroke="#60A5FA" stroke-width="1.5" class="dash-flow"/><path d="M56 74 C140 74, 210 74, 356 74" stroke="#D4AF37" stroke-width="1.5" class="dash-flow"/><path d="M56 107 C140 107, 220 99, 356 103" stroke="#60A5FA" stroke-width="1.5" class="dash-flow"/><rect x="370" y="34" width="12" height="44" rx="4" fill="#E11D48" fill-opacity="0.6"/></svg></div>`,
      telemetry: [{ label: 'GAMA', value: '$1,000+ USD' }, { label: 'AIRFLOW', value: 'Calibrado' }, { label: 'ENTREGA', value: 'Stress Tested' }],
    },
    {
      code: 'CORE // 04 · COMMUNITY & CURADURÍA',
      chip: 'Feed 9:16 & 4:5',
      color: '#E11D48',
      aurora1: 'rgba(225, 29, 72, 0.28)',
      aurora2: 'rgba(0, 112, 204, 0.22)',
      visual: `<div class="w-full space-y-5"><div class="flex items-center justify-between font-mono text-[11px] text-slate-300"><span>GRID VERTICAL &amp; PULSO ORGÁNICO</span><span class="text-[#FB7185]">RETENCIÓN ACTIVA</span></div><div class="grid grid-cols-3 gap-3"><div class="rounded-2xl bg-white/[0.05] border border-white/12 p-3.5 flex flex-col justify-between h-32"><span class="font-mono text-[10px] text-[#FB7185]">01 · HOOK</span><div class="space-y-1.5"><div class="h-1.5 w-3/4 rounded-full bg-white/30"></div><div class="h-1.5 w-1/2 rounded-full bg-[#E11D48]/80"></div></div></div><div class="rounded-2xl bg-white/[0.08] border border-[#0055FF]/55 p-3.5 flex flex-col justify-between h-32"><span class="font-mono text-[10px] text-[#60A5FA]">02 · ESTÉTICA</span><div class="space-y-1.5"><div class="h-1.5 w-full rounded-full bg-[#0055FF]/85"></div><div class="h-1.5 w-2/3 rounded-full bg-white/30"></div></div></div><div class="rounded-2xl bg-white/[0.05] border border-white/12 p-3.5 flex flex-col justify-between h-32"><span class="font-mono text-[10px] text-[#D4AF37]">03 · GROWTH</span><div class="space-y-1.5"><div class="h-1.5 w-4/5 rounded-full bg-[#D4AF37]/85"></div><div class="h-1.5 w-1/2 rounded-full bg-white/30"></div></div></div></div></div>`,
      telemetry: [{ label: 'FORMATO', value: '9:16 & 4:5' }, { label: 'ESTRATEGIA', value: 'Editorial' }, { label: 'CRECIMIENTO', value: 'Orgánico' }],
    },
  ];

  const chapterCards = document.querySelectorAll('.chapter-card');
  function setChapter(idx) {
    const ch = CHAPTERS[idx];
    if (!ch) return;
    currentChapter = idx;
    const counter = document.getElementById('chapterCounter');
    if (counter) counter.textContent = `0${idx + 1}`;
    chapterCards.forEach((c, i) => c.classList.toggle('is-active', i === idx));
    const a1 = document.getElementById('coreAurora1');
    const a2 = document.getElementById('coreAurora2');
    const dot = document.getElementById('coreDot');
    const code = document.getElementById('coreCode');
    const chip = document.getElementById('coreChip');
    const stage = document.getElementById('coreVisualStage');
    const tel = document.getElementById('coreTelemetry');
    if (a1) a1.style.background = ch.aurora1;
    if (a2) a2.style.background = ch.aurora2;
    if (dot) dot.style.backgroundColor = ch.color;
    if (code) code.textContent = ch.code;
    if (chip) chip.textContent = ch.chip;
    if (stage) stage.innerHTML = ch.visual;
    if (tel) {
      tel.innerHTML = ch.telemetry.map((m) => `<div class="rounded-2xl bg-white/[0.05] border border-white/10 p-3"><span class="block font-mono text-[9px] text-slate-400 uppercase tracking-wider">${m.label}</span><span class="block font-display font-semibold text-xs sm:text-sm text-white mt-0.5">${m.value}</span></div>`).join('');
    }
  }

  chapterCards.forEach((card) => {
    card.addEventListener('click', () => {
      playUiSound('tap'); chapterLocked = true; setChapter(Number(card.dataset.chapter));
      setTimeout(() => { chapterLocked = false; }, 3500);
    });
  });
  document.querySelectorAll('[data-jump-chapter]').forEach((link) => {
    link.addEventListener('click', () => {
      chapterLocked = true; setChapter(Number(link.dataset.jumpChapter));
      setTimeout(() => { chapterLocked = false; }, 3500);
    });
  });

  const ecosistemaSec = document.getElementById('ecosistema');
  window.addEventListener('scroll', () => {
    if (!prefs.motion || chapterLocked || window.innerWidth < 1024 || !ecosistemaSec) return;
    const secRect = ecosistemaSec.getBoundingClientRect();
    if (secRect.top >= window.innerHeight * 0.7 || secRect.bottom <= window.innerHeight * 0.3) return;
    let bestIdx = currentChapter, minDist = Infinity;
    const centerY = window.innerHeight * 0.42;
    chapterCards.forEach((card, idx) => {
      const r = card.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - centerY);
      if (d < minDist) { minDist = d; bestIdx = idx; }
    });
    if (bestIdx !== currentChapter) setChapter(bestIdx);
  }, { passive: true });
  setChapter(0);

  /* -----------------------------------------------------------------------
     FILTROS DESLIZANTES Y MODAL DE CASOS CON SPEC SHEET
     ----------------------------------------------------------------------- */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const filterSlider = document.getElementById('filterSlider');
  const projectCards = document.querySelectorAll('.project-card');

  function positionFilterSlider() {
    const activeBtn = document.querySelector(`.filter-tab[data-filter="${activeFilter}"]`);
    if (!activeBtn || !filterSlider) return;
    filterSlider.style.width = activeBtn.offsetWidth + 'px';
    filterSlider.style.transform = `translateX(${activeBtn.offsetLeft - 6}px)`;
    filterTabs.forEach((tab) => { tab.style.color = tab === activeBtn ? 'var(--accent-ink)' : 'var(--ink-secondary)'; });
  }

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      playUiSound('tap');
      activeFilter = tab.dataset.filter;
      positionFilterSlider();
      projectCards.forEach((card) => {
        const match = activeFilter === 'all' || card.dataset.category === activeFilter;
        card.classList.toggle('hidden', !match);
        if (activeFilter !== 'all' && match) {
          card.classList.remove('lg:col-span-5', 'lg:col-span-7');
          card.classList.add('lg:col-span-12');
        } else if (activeFilter === 'all') {
          card.classList.remove('lg:col-span-12');
          const wide = card.dataset.case === 'optima0x' || card.dataset.case === 'endlooxs-brand';
          card.classList.add(wide ? 'lg:col-span-7' : 'lg:col-span-5');
        }
      });
    });
  });
  window.addEventListener('resize', positionFilterSlider);

  const CASE_STUDIES = {
    optima0x: {
      badge: '<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#0055FF]/10 text-[#0055FF] border border-[#0055FF]/25">01 // SISTEMAS &amp; OS</span>',
      title: 'Optima0x — Suite de Optimización Windows 11',
      challenge: 'Muchos optimizadores aplican cambios agresivos o placebo que deterioran la estabilidad de Windows 11 sin aportar mejoras consistentes en gaming ni gestión de RAM.',
      solution: 'Desarrollo de scripts .bat modulares con detección dinámica de rutas, limpieza automatizada de memoria RAM, configuración persistente en Optima0x.cfg y ajustes reales enfocados en baja latencia.',
      specs: [
        ['Sistema Objetivo', 'Windows 11 (22H2 / 23H2 / 24H2)'],
        ['Arquitectura', 'Batch (.bat) portable con rutas dinámicas'],
        ['Persistencia', 'Archivo de preferencias Optima0x.cfg'],
        ['Módulo RAM', 'Purga automatizada de memoria en reposo'],
      ],
      deliverables: [
        'Detección dinámica de rutas y ejecución portable en entornos Windows 11.',
        'Limpieza automatizada de RAM y control de procesos en segundo plano.',
        'Persistencia de preferencias en Optima0x.cfg con respaldo seguro.',
      ],
      stack: ['Windows 11', 'Batch (.bat)', 'Optima0x.cfg', 'RAM Management', 'Gaming Latency'],
      wa: 'Hola Edgar (ENDLOOXS), vi tu proyecto Optima0x y quiero consultar sobre optimización para Windows 11.',
    },
    'hardware-custom': {
      badge: '<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#D4AF37]/15 text-[#A58119] border border-[#D4AF37]/35">02 // HARDWARE CUSTOM</span>',
      title: 'Ensambles PC Custom ($1,000+)',
      challenge: 'Inversiones elevadas en hardware desaprovechadas por malas combinaciones de componentes, cuellos de botella, ruido térmico excesivo o ensamblajes descuidados.',
      solution: 'Cotización inteligente pieza por pieza según presupuesto y uso real, ensamblaje con gestión limpia de cableado, perfil térmico optimizado y validación completa de estabilidad.',
      specs: [
        ['Rango de Cotización', '$1,000+ USD (Gaming / Workstation)'],
        ['Balance', 'Cero cuellos de botella CPU / GPU / PSU'],
        ['Térmica', 'Presión positiva y curvas silenciosas'],
        ['Validación', 'BIOS (XMP/EXPO) + pruebas de estrés'],
      ],
      deliverables: [
        'Cotización balanceada pieza por pieza según presupuesto real.',
        'Armado profesional con cable management limpio y flujo térmico.',
        'Ajuste de BIOS y validación con benchmarks de estabilidad.',
      ],
      stack: ['Custom Builds $1,000+', 'Airflow & Térmica', 'Cable Management', 'Benchmarks'],
      wa: 'Hola Edgar (ENDLOOXS), quiero cotizar un armado de PC custom de gama alta (+$1,000 USD).',
    },
    'social-growth': {
      badge: '<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#E11D48]/10 text-[#E11D48] border border-[#E11D48]/25">03 // SOCIAL MEDIA</span>',
      title: 'Community Management & Estrategia Digital',
      challenge: 'Perfiles con baja consistencia visual y publicaciones sin una estructura editorial clara que sostenga la retención ni el vínculo con la audiencia.',
      solution: 'Planificación editorial estructurada, dirección de contenido vertical y gestión cercana de comunidad orientada a crecimiento orgánico y recordación de marca.',
      specs: [
        ['Formatos Clave', 'Vertical 9:16 (Reels) & 4:5 (Feed)'],
        ['Planificación', 'Calendario editorial y pilares de marca'],
        ['Enfoque', 'Retención orgánica y respuesta activa'],
        ['Reportes', 'Seguimiento de alcance y consistencia'],
      ],
      deliverables: [
        'Calendario editorial mensual alineado a la identidad de marca.',
        'Estrategia de retención en formatos cortos y coherencia visual.',
        'Gestión activa de comunidad y optimización continua.',
      ],
      stack: ['Community Management', 'Calendario Editorial', 'Retención', 'Analítica Social'],
      wa: 'Hola Edgar (ENDLOOXS), me gustaría conversar sobre Community Management y estrategia para redes sociales.',
    },
    'endlooxs-brand': {
      badge: '<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold accent-pill">04 // MARCA PERSONAL</span>',
      title: '@endlooxs — Identidad & Dirección Visual',
      challenge: 'Consolidar múltiples disciplinas técnicas y creativas en una identidad personal minimalista, coherente y reconocible en Instagram.',
      solution: 'Dirección creativa de @endlooxs combinando estética oscura/moody, encuadre vertical 4:5, retoque natural sin artificios y un emblema propio de alto impacto.',
      specs: [
        ['Canal Principal', 'instagram.com/endlooxs'],
        ['Lenguaje Visual', 'Minimalismo oscuro/moody + retoque limpio'],
        ['Paleta', 'Blanco, Azul Eléctrico, Dorado y Crimson'],
        ['Ecosistema', 'Identidad + Portafolio Web Oficial'],
      ],
      deliverables: [
        'Sistema de identidad visual con emblema geométrico del lobo.',
        'Curaduría de fotografía vertical 4:5 y narrativa visual.',
        'Portafolio web oficial integrado al ecosistema de marca.',
      ],
      stack: ['Marca Personal', 'Dirección Visual', 'Curaduría 4:5', 'Instagram @endlooxs'],
      wa: 'Hola Edgar (ENDLOOXS), vi tu trabajo de marca en @endlooxs y quiero explorar una colaboración.',
    },
  };

  const caseModal = document.getElementById('caseModal');
  function openCaseModal(id) {
    const c = CASE_STUDIES[id];
    if (!c || !caseModal) return;
    playUiSound('tap');
    document.getElementById('caseBadge').innerHTML = c.badge;
    document.getElementById('caseTitle').textContent = c.title;
    document.getElementById('caseChallenge').textContent = c.challenge;
    document.getElementById('caseSolution').textContent = c.solution;
    document.getElementById('caseSpecs').innerHTML = c.specs.map(([k, v]) => `<div class="px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"><span class="font-mono uppercase tracking-wider ink-muted">${k}</span><span class="font-semibold ink-main">${v}</span></div>`).join('');
    document.getElementById('caseDeliverables').innerHTML = c.deliverables.map((d) => `<li class="flex items-start gap-2.5"><span class="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0"></span><span>${d}</span></li>`).join('');
    document.getElementById('caseStack').innerHTML = c.stack.map((s) => `<span class="px-3 py-1 rounded-full surface-alt font-mono text-[11px] ink-sub">${s}</span>`).join('');
    document.getElementById('caseWhatsAppLink').href = `https://wa.me/50768890772?text=${encodeURIComponent(c.wa)}`;
    caseModal.classList.remove('hidden');
    caseModal.classList.add('flex');
  }
  function closeCaseModal() {
    caseModal?.classList.add('hidden');
    caseModal?.classList.remove('flex');
  }

  projectCards.forEach((card) => card.addEventListener('click', () => openCaseModal(card.dataset.case)));
  document.getElementById('closeCaseModalBtn')?.addEventListener('click', closeCaseModal);
  caseModal?.addEventListener('click', (e) => { if (e.target === caseModal) closeCaseModal(); });

  /* -----------------------------------------------------------------------
     COPIAR AL PORTAPAPELES Y MENSAJE RÁPIDO
     ----------------------------------------------------------------------- */
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      const label = btn.dataset.copyLabel || 'Dato';
      let copied = false;
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        copied = document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (err) { copied = false; }
      if (copied) {
        playUiSound('tap');
        const prev = btn.textContent;
        btn.textContent = prefs.lang === 'es' ? 'Copiado' : 'Copied';
        toast(`${label} copiado al portapapeles`);
        setTimeout(() => { btn.textContent = prev; }, 1600);
      }
    });
  });

  const topicBtns = document.querySelectorAll('.topic-btn');
  topicBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      playUiSound('tap');
      activeTopic = btn.dataset.topic;
      topicBtns.forEach((b) => {
        const on = b === btn;
        b.classList.toggle('accent-fill', on);
        b.classList.toggle('surface-alt', !on);
        b.classList.toggle('ink-sub', !on);
      });
    });
  });

  function readBrief() {
    const name = document.getElementById('briefName')?.value.trim() || '';
    const msgEl = document.getElementById('briefMsg');
    const msg = msgEl?.value.trim() || '';
    if (!msg) {
      toast('Escribe un breve mensaje antes de enviar.', 'gold');
      msgEl?.focus();
      return null;
    }
    return { name, topic: activeTopic, msg };
  }

  document.getElementById('sendWhatsAppBtn')?.addEventListener('click', () => {
    const d = readBrief();
    if (!d) return;
    playUiSound('switch');
    const greeting = d.name ? `Hola Edgar (ENDLOOXS), soy ${d.name}.` : 'Hola Edgar (ENDLOOXS).';
    const text = `${greeting}\n*Tema:* ${d.topic}\n*Mensaje:* ${d.msg}`;
    window.open(`https://wa.me/50768890772?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    toast('Abriendo WhatsApp...');
  });

  document.getElementById('sendEmailBtn')?.addEventListener('click', () => {
    const d = readBrief();
    if (!d) return;
    playUiSound('switch');
    const subject = `[ENDLOOXS] ${d.topic}${d.name ? ' — ' + d.name : ''}`;
    const body = `${d.name ? 'Hola Edgar, soy ' + d.name + '.\n\n' : 'Hola Edgar,\n\n'}Tema: ${d.topic}\n\nMensaje:\n${d.msg}`;
    window.location.href = `mailto:ej.rj2007@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast('Abriendo cliente de correo...');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeSettings(); closeCaseModal(); closeLightbox(); }
    if (lightboxModal && !lightboxModal.classList.contains('hidden')) {
      if (e.key === 'ArrowRight') openLightbox(currentLightboxIndex + 1);
      if (e.key === 'ArrowLeft') openLightbox(currentLightboxIndex - 1);
    }
  });

  /* -----------------------------------------------------------------------
     ARRANQUE
     ----------------------------------------------------------------------- */
  initReveal();
  applyPrefs();
  renderGallery();
  resizeCanvas();
  drawCanvas();
  animateMonolith();
  window.addEventListener('load', () => {
    resizeCanvas();
    positionFilterSlider();
  });
})(); // === FIN DE app.js ===