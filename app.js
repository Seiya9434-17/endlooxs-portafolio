/* =========================================================================
   MEDIA_CONFIG — CONFIGURACIÓN DE IMÁGENES EN GITHUB / VERCEL
   Sube tus imágenes a la raíz del repositorio con estos nombres exactos.
   Si alguna aún no existe, se muestra un arte oscuro limpio sin errores.
   ========================================================================= */
const MEDIA_CONFIG = {
  logo: './logo.jpg',       // Deja '' si prefieres el emblema SVG vectorial
  profile: './perfil.jpg',  // Tu foto de perfil en Sobre Mí
  gallery: [
    './foto1.jpg',          // 01 // RETRATO
    './foto2.jpg',          // 02 // SISTEMAS
    './foto3.jpg',          // 03 // HARDWARE
    './foto4.jpg',          // 04 // @ENDLOOXS
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
  let activeCompareMode = 'optima';
  let comparePos = 50;
  let currentChapter = 0;
  let chapterLocked = false;
  let currentLightboxIndex = 0;
  let audioCtx = null;

  /* -----------------------------------------------------------------------
     AUDIO SUTIL DE INTERFAZ (WEB AUDIO API — SIN ARCHIVOS EXTERNOS)
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
      const freqStart = type === 'switch' ? 520 : 420;
      const freqEnd = type === 'switch' ? 760 : 280;

      osc.frequency.setValueAtTime(freqStart, now);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, now + 0.055);

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