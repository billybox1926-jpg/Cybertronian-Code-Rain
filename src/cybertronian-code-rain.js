/**
 * Cybertronian Code-Rain
 *
 * Embeddable canvas animation.
 *
 * Example:
 *   import { init } from './src/cybertronian-code-rain.js';
 *   init('allspark', { color: '#00f0ff', fontSize: 16 });
 */

export function init(canvasId, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    throw new Error(`CybertronianCodeRain: canvas element "#${canvasId}" not found`);
  }

  const ctx = canvas.getContext('2d');

  const config = {
    glyphs: options.glyphs ?? "ΔΞΨΩ⚙⚡█▄▌▐░▒▓■□▲▼○●◈◇◆⚡╳✕✖✚",
    fontSize: options.fontSize ?? 16,
    color: options.color ?? '#00f0ff',
    fps: options.fps ?? 30,
    fadeAlpha: options.fadeAlpha ?? 0.08,
    shadowBlur: options.shadowBlur ?? 0,
    trailGlyphs: options.trailGlyphs ?? 3,
    trailColor: options.trailColor ?? null,
    trailAlphaBase: options.trailAlphaBase ?? 200,
    trailAlphaStep: options.trailAlphaStep ?? 70,
  };

  const intervalMs = Math.max(1, Math.round(1000 / config.fps));

  const alphabet = String(config.glyphs).split('');
  let colStep;
  let cols;
  let rainDrops;
  let yoff;

  function setup() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    cols = Math.max(1, Math.floor(canvas.width / config.fontSize));
    colStep = canvas.width / cols;
    rainDrops = Array(cols).fill(0);
    yoff = Array(cols).fill(0).map(() => Math.floor(Math.random() * -40 + -10));
  }

  function resize() {
    setup();
  }

  function randomGlyph() {
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  function draw() {
    ctx.fillStyle = `rgba(0, 0, 0, ${config.fadeAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${config.fontSize}px monospace`;
    ctx.shadowBlur = config.shadowBlur;

    for (let i = 0; i < cols; i++) {
      const x = i * colStep;
      const y = yoff[i] * config.fontSize;
      const glyph = randomGlyph();
      ctx.fillStyle = String(config.color);

      ctx.fillText(glyph, x, y);

      if (config.trailGlyphs > 0) {
        for (let t = 1; t <= config.trailGlyphs; t++) {
          const ty = y - t * config.fontSize;
          if (ty < -config.fontSize) continue;
          const a = Math.max(0, (config.trailAlphaBase ?? 200) - t * (config.trailAlphaStep ?? 70));
          ctx.fillStyle = config.trailColor
            ? config.trailColor.replace('ALPHA', String(a))
            : `rgba(255, 215, 0, ${a})`;
          ctx.fillText(randomGlyph(), x, ty);
        }
      }

      if (y > canvas.height && Math.random() > 0.975) {
        rainDrops[i] = 0;
        yoff[i] = Math.floor(Math.random() * -30 + -8);
      }
      rainDrops[i] += config.fontSize;
      yoff[i] += config.fontSize;
    }
  }

  let timer;

  function start() {
    stop();
    timer = setInterval(draw, intervalMs);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  setup();
  window.addEventListener('resize', resize);
  start();

  return {
    start,
    stop,
    resize,
    config,
  };
}
