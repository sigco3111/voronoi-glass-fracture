// One-shot build for index.html — uses concatenation (not template literal)
// so the inlined d3-delaunay backticks don't break parsing.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const MATTER_SRC = fs.readFileSync('/tmp/voronoi-deps/matter.min.js', 'utf8');
const D3_SRC = fs.readFileSync('/tmp/voronoi-deps/d3-delaunay.min.js', 'utf8');

const CSS = `
:root {
  --bg: #0a0e16;
  --bg-grad-top: #131a26;
  --bg-grad-bot: #050608;
  --panel: rgba(20, 26, 36, 0.78);
  --panel-border: rgba(120, 200, 230, 0.18);
  --accent: #6ec8e6;
  --accent-2: #c6e6f0;
  --text: #e8eef5;
  --muted: #8896a8;
  --danger: #ff9a9a;
  --shadow: 0 10px 30px rgba(0, 0, 0, 0.55);
}
* { box-sizing: border-box; }
html, body {
  margin: 0; padding: 0;
  width: 100%; height: 100%;
  overflow: hidden;
  background:
    radial-gradient(ellipse 90% 60% at 50% 30%, var(--bg-grad-top) 0%, var(--bg-grad-bot) 80%),
    #050608;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", Roboto, sans-serif;
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}
canvas#canvas {
  position: fixed; inset: 0;
  display: block;
  width: 100vw; height: 100vh;
  cursor: crosshair;
  z-index: 1;
}
.hint {
  position: fixed;
  top: 18px; left: 18px;
  z-index: 10;
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 0.02em;
  max-width: 320px;
  line-height: 1.55;
  pointer-events: none;
  background: var(--panel);
  border: 1px solid var(--panel-border);
  padding: 10px 14px;
  border-radius: 8px;
  backdrop-filter: blur(8px);
  box-shadow: var(--shadow);
}
.hint .title {
  display: block;
  color: var(--accent-2);
  font-weight: 700;
  font-size: 13px;
  margin-bottom: 4px;
  letter-spacing: 0.04em;
}
.ui-top {
  position: fixed; top: 16px; right: 16px; z-index: 10;
  display: flex; flex-direction: column; gap: 10px; align-items: flex-end;
}
.panel {
  background: var(--panel);
  border: 1px solid var(--panel-border);
  border-radius: 10px;
  padding: 10px 14px;
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow);
}
.slowmo-row { display: flex; gap: 6px; align-items: center; font-size: 13px; }
.slowmo-row .lbl {
  font-size: 11px; color: var(--muted);
  text-transform: uppercase; letter-spacing: 0.08em;
  margin-right: 6px;
}
.slowmo-row button[data-speed],
.slowmo-row button#reset-btn {
  background: rgba(110, 200, 230, 0.10);
  color: var(--text);
  border: 1px solid rgba(110, 200, 230, 0.30);
  padding: 6px 11px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-family: inherit;
  transition: background 0.12s, border-color 0.12s, color 0.12s;
}
.slowmo-row button[data-speed]:hover { background: rgba(110, 200, 230, 0.25); }
.slowmo-row button[data-speed].active {
  background: var(--accent); color: #061018;
  font-weight: 700; border-color: var(--accent);
}
.slowmo-row button#reset-btn {
  background: rgba(255, 154, 154, 0.10);
  border-color: rgba(255, 154, 154, 0.30);
  margin-left: 10px;
  font-weight: 600;
}
.slowmo-row button#reset-btn:hover { background: rgba(255, 154, 154, 0.25); }
.info {
  position: fixed;
  bottom: 18px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 28px;
  padding: 12px 22px;
  z-index: 10;
}
.info-item {
  display: flex; flex-direction: column;
  align-items: center; min-width: 76px;
}
.info-item .lbl {
  font-size: 11px; color: var(--muted);
  text-transform: uppercase; letter-spacing: 0.08em;
}
.info-item .val {
  font-size: 22px; font-weight: 700;
  color: var(--accent-2);
  font-variant-numeric: tabular-nums;
  margin-top: 2px;
}
.legend {
  position: fixed;
  bottom: 18px; right: 18px;
  z-index: 10;
  font-size: 11px; color: var(--muted);
  max-width: 220px; line-height: 1.6;
  background: var(--panel);
  border: 1px solid var(--panel-border);
  padding: 8px 12px;
  border-radius: 6px;
  backdrop-filter: blur(8px);
}
.legend .kbd {
  display: inline-block;
  background: rgba(110, 200, 230, 0.15);
  border: 1px solid rgba(110, 200, 230, 0.30);
  color: var(--accent-2);
  padding: 1px 6px;
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px;
  margin: 0 2px;
}
`;

const HTML_BODY = `
<canvas id="canvas" aria-label="Voronoi 유리 파괴 시뮬레이션 캔버스"></canvas>

<div class="hint">
  <span class="title">VORONOI FRACTURE</span>
  유리판을 클릭하면 해당 지점에서 보로노이 분할로 깨집니다.
  슬로 모션으로 결정적 순간을 천천히 보세요.
</div>

<div class="ui-top">
  <div class="panel slowmo-row">
    <span class="lbl">속도</span>
    <button data-speed="1" class="active" type="button">1×</button>
    <button data-speed="0.25" type="button">0.25×</button>
    <button data-speed="0.1" type="button">0.1×</button>
    <button id="reset-btn" type="button" title="새 유리판">↻ Reset</button>
  </div>
</div>

<div class="info panel">
  <div class="info-item">
    <div class="lbl">파편</div>
    <div class="val" id="shard-count">0</div>
  </div>
  <div class="info-item">
    <div class="lbl">충돌</div>
    <div class="val" id="collision-count">0</div>
  </div>
</div>

<div class="legend">
  <div><span class="kbd">좌클릭</span> 유리판 파괴</div>
  <div><span class="kbd">1×</span> / <span class="kbd">0.25×</span> / <span class="kbd">0.1×</span> 슬로 모션</div>
</div>
`;

const SIM_SCRIPT = `(function () {
  'use strict';

  if (!window.Matter) { console.error('[voronoi] Matter.js failed to load'); return; }
  if (!window.d3 || !window.d3.Delaunay || !window.d3.Voronoi) {
    console.error('[voronoi] d3-delaunay failed to load'); return;
  }

  var Engine = window.Matter.Engine;
  var World = window.Matter.World;
  var Bodies = window.Matter.Bodies;
  var Body = window.Matter.Body;
  var Composite = window.Matter.Composite;
  var Events = window.Matter.Events;
  var Runner = window.Matter.Runner;
  var Delaunay = window.d3.Delaunay;
  var Voronoi = window.d3.Voronoi;

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d', { alpha: false });
  var shardCountEl = document.getElementById('shard-count');
  var collisionCountEl = document.getElementById('collision-count');

  var engine = Engine.create({
    gravity: { x: 0, y: 1.0, scale: 0.0007 },
    enableSleeping: true,
    positionIterations: 10,
    velocityIterations: 6,
    constraintIterations: 3,
  });
  var world = engine.world;
  var runner = Runner.create();
  Runner.run(runner, engine);

  // Put stationary shards to sleep so piled-up bodies stop colliding with each other once they come to rest on the floor.
  Events.on(engine, 'afterUpdate', function () {
    if (window.Matter.Sleeping) window.Matter.Sleeping.update(world, engine);
  });

  // Hard-zero shards moving below SLEEP_SPEED so piled bodies settle instead of perpetually micro-jittering from collision cascades.
  // Position-gated to the floor band — mid-air shards must keep falling under gravity.
  var SLEEP_SPEED = 0.6;
  var FLOOR_SETTLE_Y = 760;
  Events.on(engine, 'beforeUpdate', function () {
    if (!shardBodies.length) return;
    for (var sd = 0; sd < shardBodies.length; sd++) {
      var bs = shardBodies[sd];
      if (bs.isStatic) continue;
      if (bs.position.y < FLOOR_SETTLE_Y) continue;
      var sxx = bs.velocity.x, syy = bs.velocity.y;
      var av = bs.angularVelocity;
      var spd2 = sxx * sxx + syy * syy;
      if (spd2 < SLEEP_SPEED * SLEEP_SPEED || (spd2 < 1.4 * 1.4 && Math.abs(av) < 0.06)) {
        Body.setVelocity(bs, { x: 0, y: 0 });
        Body.setAngularVelocity(bs, 0);
      }
    }
  });

  // Per-step velocity cap: prevents kinetic-energy cascades from sending shards off-screen.
  var MAX_VEL = 6;
  Events.on(engine, 'beforeUpdate', function () {
    if (!shardBodies.length) return;
    var W2 = window.innerWidth;
    var H2 = window.innerHeight;
    for (var v = 0; v < shardBodies.length; v++) {
      var bv = shardBodies[v];
      var vx = bv.velocity.x, vy = bv.velocity.y;
      var sp2 = vx * vx + vy * vy;
      if (sp2 > MAX_VEL * MAX_VEL) {
        var s2 = MAX_VEL / Math.sqrt(sp2);
        Body.setVelocity(bv, { x: vx * s2, y: vy * s2 });
      }
      // Park drifted-out shards just above the floor so they stay visible.
      if (bv.position.y > H2 + 80 || bv.position.y < -200 ||
          bv.position.x < -150 || bv.position.x > W2 + 150) {
        Body.setPosition(bv, {
          x: Math.max(20, Math.min(W2 - 20, bv.position.x)),
          y: H2 - 80,
        });
        Body.setVelocity(bv, { x: 0, y: 0 });
        Body.setAngularVelocity(bv, 0);
      }
    }
  });

  var plate = null;
  function computePlate() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var w = Math.max(320, Math.min(vw * 0.62, 760));
    var h = Math.max(220, Math.min(vh * 0.58, 480));
    plate = {
      x: (vw - w) / 2,
      y: (vh - h) / 2 - 10,
      w: w,
      h: h,
    };
  }
  function inPlate(x, y) {
    return plate && x >= plate.x && x <= plate.x + plate.w && y >= plate.y && y <= plate.y + plate.h;
  }

  var dpr = 1;
  function resizeCanvas() {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rebuildBoundaries();
  }

  var floor = null, leftWall = null, rightWall = null;
  function rebuildBoundaries() {
    if (floor) Composite.remove(world, floor);
    if (leftWall) Composite.remove(world, leftWall);
    if (rightWall) Composite.remove(world, rightWall);
    var W = window.innerWidth, H = window.innerHeight;
    var THICK = 1500;
    floor = Bodies.rectangle(W / 2, H + THICK / 2 - 4, W * 4, THICK, {
      isStatic: true, label: 'floor', friction: 0.6, restitution: 0.18,
    });
    leftWall = Bodies.rectangle(-THICK / 2, H / 2, THICK, H * 4, {
      isStatic: true, label: 'wall', friction: 0.3, restitution: 0.1,
    });
    rightWall = Bodies.rectangle(W + THICK / 2, H / 2, THICK, H * 4, {
      isStatic: true, label: 'wall', friction: 0.3, restitution: 0.1,
    });
    Composite.add(world, [floor, leftWall, rightWall]);
  }

  var shardBodies = [];
  var collisionCount = 0;
  var lastImpact = null;

  // === AUDIO (Web Audio API, lazy init on first user gesture) ===
  var audioCtx = null;
  var audioReady = false;
  var lastTickTime = 0;
  function initAudio() {
    if (audioCtx) return;
    try {
      var Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return;
      audioCtx = new Ctor();
      audioReady = true;
    } catch (e) { audioReady = false; }
  }
  function ensureAudioRunning() {
    if (!audioCtx) initAudio();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }
  function makeNoiseBuffer(duration) {
    var sr = audioCtx.sampleRate;
    var len = Math.max(1, Math.floor(sr * duration));
    var buf = audioCtx.createBuffer(1, len, sr);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }
  // Synthesized glass shatter: white-noise crack + sub-bass thud + 8 tinkles.
  function playShatter() {
    if (!audioReady) return;
    var t0 = audioCtx.currentTime;

    var noise = audioCtx.createBufferSource();
    noise.buffer = makeNoiseBuffer(0.5);
    var hp = audioCtx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 1800;
    hp.Q.value = 1.2;
    var ng = audioCtx.createGain();
    ng.gain.setValueAtTime(0.0, t0);
    ng.gain.linearRampToValueAtTime(0.55, t0 + 0.005);
    ng.gain.exponentialRampToValueAtTime(0.001, t0 + 0.5);
    noise.connect(hp).connect(ng).connect(audioCtx.destination);
    noise.start(t0);

    var osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, t0);
    osc.frequency.exponentialRampToValueAtTime(40, t0 + 0.15);
    var og = audioCtx.createGain();
    og.gain.setValueAtTime(0.4, t0);
    og.gain.exponentialRampToValueAtTime(0.001, t0 + 0.3);
    osc.connect(og).connect(audioCtx.destination);
    osc.start(t0);
    osc.stop(t0 + 0.3);

    for (var ti = 0; ti < 8; ti++) {
      var delay = t0 + 0.02 + ti * 0.04 + Math.random() * 0.02;
      var tosc = audioCtx.createOscillator();
      tosc.type = 'triangle';
      tosc.frequency.value = 2500 + Math.random() * 3500;
      var tg = audioCtx.createGain();
      tg.gain.setValueAtTime(0.0, delay);
      tg.gain.linearRampToValueAtTime(0.08, delay + 0.005);
      tg.gain.exponentialRampToValueAtTime(0.001, delay + 0.18);
      tosc.connect(tg).connect(audioCtx.destination);
      tosc.start(delay);
      tosc.stop(delay + 0.2);
    }
  }
  function maybePlayTick() {
    if (!audioReady) return;
    var now = audioCtx.currentTime;
    if (now - lastTickTime < 0.05) return;
    lastTickTime = now;
    var osc = audioCtx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = 1500 + Math.random() * 2000;
    var g = audioCtx.createGain();
    g.gain.setValueAtTime(0.06, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(g).connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // === DUST PARTICLES (custom physics, not Matter — perf) ===
  var dustParticles = [];
  var MAX_DUST = 500;
  function spawnDust(x, y, count) {
    for (var i = 0; i < count; i++) {
      if (dustParticles.length >= MAX_DUST) break;
      var ang = Math.random() * Math.PI * 2;
      var spd = 2 + Math.random() * 9;
      var life = 0.7 + Math.random() * 0.9;
      dustParticles.push({
        x: x + (Math.random() - 0.5) * 14,
        y: y + (Math.random() - 0.5) * 14,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 1.5,
        life: life,
        maxLife: life,
        radius: 1.4 + Math.random() * 2.0,
      });
    }
  }
  function updateDust(dt) {
    for (var i = dustParticles.length - 1; i >= 0; i--) {
      var p = dustParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.18;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.life -= dt;
      if (p.life <= 0) dustParticles.splice(i, 1);
    }
  }
  function renderDust(ctx) {
    for (var i = 0; i < dustParticles.length; i++) {
      var p = dustParticles[i];
      var t = p.life / p.maxLife;
      var a = t * 0.85;
      if (a <= 0) continue;
      ctx.fillStyle = 'rgba(232, 240, 252, ' + a.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // === IMPACT FLASH (brief white ring at impact point) ===
  var flash = null;
  function spawnFlash(x, y) {
    flash = { x: x, y: y, life: 0.18, maxLife: 0.18 };
  }
  function renderFlash(ctx) {
    if (!flash) return;
    var t = flash.life / flash.maxLife;
    var r = 60 * (1 - t) + 6;
    var a = t * 0.55;
    if (a <= 0) { flash = null; return; }
    var grad = ctx.createRadialGradient(flash.x, flash.y, 0, flash.x, flash.y, r);
    grad.addColorStop(0, 'rgba(240, 248, 255, ' + a.toFixed(3) + ')');
    grad.addColorStop(0.5, 'rgba(220, 232, 248, ' + (a * 0.5).toFixed(3) + ')');
    grad.addColorStop(1, 'rgba(200, 220, 240, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(flash.x, flash.y, r, 0, Math.PI * 2);
    ctx.fill();
    flash.life -= 0.016;
    if (flash.life <= 0) flash = null;
  }

  // === CAMERA SHAKE ===
  var shakeIntensity = 0;
  function applyShake(intensity) {
    shakeIntensity = Math.max(shakeIntensity, intensity);
  }
  function consumeShake() {
    if (shakeIntensity < 0.1) { shakeIntensity = 0; return { x: 0, y: 0 }; }
    var dx = (Math.random() - 0.5) * shakeIntensity * 2;
    var dy = (Math.random() - 0.5) * shakeIntensity * 2;
    shakeIntensity *= 0.85;
    return { x: dx, y: dy };
  }

  // === VORONOI: impact-biased Poisson sampling ===
  function sampleShardSites(impactX, impactY, totalTarget) {
    var p = plate;
    var points = [[impactX, impactY]];
    var R_BASE = 19;
    var R_INNER = 5;
    var INFLUENCE_R = 135;
    var INNER_COUNT = Math.max(18, Math.round(totalTarget * 0.32));

    function tooClose(x, y, minR) {
      for (var i = 0; i < points.length; i++) {
        var dx = x - points[i][0], dy = y - points[i][1];
        if (dx * dx + dy * dy < minR * minR) return true;
      }
      return false;
    }

    // Pass 1: dense fill inside the influence circle.
    var tries1 = 0;
    while (points.length < INNER_COUNT && tries1 < INNER_COUNT * 200) {
      tries1++;
      var ang = Math.random() * Math.PI * 2;
      var rad = Math.random() * INFLUENCE_R;
      var x = impactX + Math.cos(ang) * rad;
      var y = impactY + Math.sin(ang) * rad;
      var edge = Math.min(x - p.x, y - p.y, p.x + p.w - x, p.y + p.h - y);
      if (edge < 3) continue;
      if (!tooClose(x, y, R_INNER)) points.push([x, y]);
    }

    // Pass 2: sparse fill across the whole plate.
    var tries2 = 0;
    while (points.length < totalTarget && tries2 < (totalTarget - INNER_COUNT) * 120) {
      tries2++;
      var xx = p.x + Math.random() * p.w;
      var yy = p.y + Math.random() * p.h;
      var edge2 = Math.min(xx - p.x, yy - p.y, p.x + p.w - xx, p.y + p.h - yy);
      if (edge2 < 3) continue;
      if (!tooClose(xx, yy, R_BASE)) points.push([xx, yy]);
    }

    // Jitter points inside the influence zone to break uniformity.
    for (var j = 1; j < points.length; j++) {
      var pj = points[j];
      var dd = Math.hypot(pj[0] - impactX, pj[1] - impactY);
      var amp = 5 * Math.exp(-dd / 60);
      if (amp < 0.5) continue;
      points[j] = [
        Math.min(p.x + p.w - 2, Math.max(p.x + 2, pj[0] + (Math.random() - 0.5) * 2 * amp)),
        Math.min(p.y + p.h - 2, Math.max(p.y + 2, pj[1] + (Math.random() - 0.5) * 2 * amp)),
      ];
    }
    return points;
  }

  function buildShards(impactX, impactY) {
    var p = plate;
    var TARGET = 78;
    var sites = sampleShardSites(impactX, impactY, TARGET);

    var delaunay = Delaunay.from(sites);
    var voronoi = delaunay.voronoi([p.x, p.y, p.x + p.w, p.y + p.h]);

    var bodies = [];
    for (var i = 0; i < sites.length; i++) {
      var poly = voronoi.cellPolygon(i);
      if (!poly) continue;
      var verts = [];
      for (var j2 = 0; j2 < poly.length; j2++) {
        var pt = poly[j2];
        if (verts.length === 0 ||
            Math.abs(verts[verts.length - 1][0] - pt[0]) > 1e-9 ||
            Math.abs(verts[verts.length - 1][1] - pt[1]) > 1e-9) {
          verts.push([pt[0], pt[1]]);
        }
      }
      if (verts.length < 3) continue;

      var cx = sites[i][0];
      var cy = sites[i][1];
      var localVerts = verts.map(function (v) { return { x: v[0] - cx, y: v[1] - cy }; });

      var bboxArea = 0;
      for (var k = 0; k < localVerts.length; k++) {
        var a = localVerts[k];
        var b2 = localVerts[(k + 1) % localVerts.length];
        bboxArea += Math.abs(a.x * b2.y - b2.x * a.y);
      }
      if (bboxArea < 4) continue;

      var opts = {
        restitution: 0.14,
        friction: 0.55,
        frictionStatic: 0.7,
        frictionAir: 0.045,
        density: 0.0035,
        slop: 0.02,
        label: 'shard',
      };

      var body = null;
      try {
        body = Bodies.fromVertices(cx, cy, [localVerts], opts);
      } catch (e) {
        body = null;
      }
      if (!body) continue;

      body.shardData = {
        hueOffset: (Math.random() * 24 - 12),
        originalArea: bboxArea / 2,
      };
      bodies.push(body);
    }

    // Per-shard air drag: smaller shards (higher area/mass ratio) get more drag
    // and fall slower; larger shards fall slightly faster. Mirrors real air.
    var totalA = 0;
    for (var ai = 0; ai < bodies.length; ai++) totalA += bodies[ai].shardData.originalArea;
    var avgA = totalA / bodies.length || 1;
    var BASE_FA = 0.045;
    var FA_RANGE = 0.030;
    for (var bi2 = 0; bi2 < bodies.length; bi2++) {
      var rel = (avgA - bodies[bi2].shardData.originalArea) / avgA;
      var fa = BASE_FA + FA_RANGE * rel;
      if (fa < 0.015) fa = 0.015;
      if (fa > 0.085) fa = 0.085;
      bodies[bi2].frictionAir = fa;
      bodies[bi2].shardData.frictionAir = fa;
    }
    return bodies;
  }

  function fracture(impactX, impactY) {
    if (shardBodies.length > 0) {
      for (var i = 0; i < shardBodies.length; i++) Composite.remove(world, shardBodies[i]);
    }
    shardBodies = [];
    collisionCount = 0;
    collisionCountEl.textContent = '0';
    dustParticles = [];

    lastImpact = { x: impactX, y: impactY };

    var shards = buildShards(impactX, impactY);
    for (var s = 0; s < shards.length; s++) Composite.add(world, shards[s]);
    shardBodies = shards;
    shardCountEl.textContent = String(shards.length);

    var maxR = Math.hypot(plate.w, plate.h);
    for (var bi = 0; bi < shardBodies.length; bi++) {
      var b3 = shardBodies[bi];
      var dx = b3.position.x - impactX;
      var dy = b3.position.y - impactY;
      var d = Math.hypot(dx, dy) || 1;
      var proximity = Math.max(0, 1 - d / (maxR * 0.85));
      var kick = 0.4 + 1.1 * proximity;
      Body.setStatic(b3, false);
      Body.setVelocity(b3, {
        x: (dx / d) * kick,
        y: (dy / d) * kick * 0.6 + 0.6,
      });
      Body.setAngularVelocity(b3, (Math.random() - 0.5) * 0.35);
    }

    playShatter();
    spawnDust(impactX, impactY, 320);
    spawnFlash(impactX, impactY);
    applyShake(11);
  }

  function resetAll() {
    if (shardBodies.length > 0) {
      for (var i = 0; i < shardBodies.length; i++) Composite.remove(world, shardBodies[i]);
    }
    shardBodies = [];
    collisionCount = 0;
    lastImpact = null;
    dustParticles = [];
    flash = null;
    shakeIntensity = 0;
    shardCountEl.textContent = '0';
    collisionCountEl.textContent = '0';
  }

  Events.on(engine, 'collisionStart', function (ev) {
    for (var pi = 0; pi < ev.pairs.length; pi++) {
      var pair = ev.pairs[pi];
      var a = pair.bodyA, b4 = pair.bodyB;
      var hasShard = (a.label === 'shard') || (b4.label === 'shard');
      if (!hasShard) continue;
      collisionCount++;
      // Throttled tick on shard-on-floor impacts (skips shard-shard).
      var isFloor = (a.label === 'floor') || (b4.label === 'floor');
      if (isFloor) maybePlayTick();
    }
    collisionCountEl.textContent = String(collisionCount);
  });

  canvas.addEventListener('mousedown', function (ev) {
    if (ev.button !== 0) return;
    ensureAudioRunning();
    var x = ev.clientX, y = ev.clientY;
    if (!inPlate(x, y)) return;
    fracture(x, y);
  });
  canvas.addEventListener('touchstart', function (ev) {
    if (ev.touches.length === 0) return;
    ensureAudioRunning();
    var t2 = ev.touches[0];
    if (!inPlate(t2.clientX, t2.clientY)) return;
    ev.preventDefault();
    fracture(t2.clientX, t2.clientY);
  }, { passive: false });

  var speedButtons = document.querySelectorAll('button[data-speed]');
  for (var sb = 0; sb < speedButtons.length; sb++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        var speed = parseFloat(btn.dataset.speed);
        if (Number.isNaN(speed)) return;
        engine.timing.timeScale = speed;
        for (var x2 = 0; x2 < speedButtons.length; x2++) speedButtons[x2].classList.remove('active');
        btn.classList.add('active');
      });
    })(speedButtons[sb]);
  }

  document.getElementById('reset-btn').addEventListener('click', function () {
    resetAll();
  });

  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      computePlate();
      resizeCanvas();
    }, 80);
  });

  // === RENDERING ===
  function drawIntactPlate() {
    var p = plate;
    if (!p) return;
    ctx.save();
    var grad = ctx.createLinearGradient(p.x, p.y, p.x + p.w, p.y + p.h);
    grad.addColorStop(0.0, 'rgba(170, 220, 240, 0.16)');
    grad.addColorStop(0.5, 'rgba(140, 200, 230, 0.10)');
    grad.addColorStop(1.0, 'rgba(180, 225, 245, 0.18)');
    ctx.fillStyle = grad;
    ctx.fillRect(p.x, p.y, p.w, p.h);

    ctx.strokeStyle = 'rgba(190, 225, 245, 0.60)';
    ctx.lineWidth = 2;
    ctx.strokeRect(p.x + 1, p.y + 1, p.w - 2, p.h - 2);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(p.x + 5, p.y + 5, p.w - 10, p.h - 10);

    ctx.fillStyle = 'rgba(190, 225, 245, 0.35)';
    ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CLICK TO SHATTER', p.x + p.w / 2, p.y + p.h - 14);
    ctx.restore();
  }

  var lastFrameTime = 0;
  function render() {
    var W = window.innerWidth;
    var H = window.innerHeight;
    var nowMs = performance.now();
    var dt = lastFrameTime ? Math.min(0.05, (nowMs - lastFrameTime) / 1000) : 0.016;
    lastFrameTime = nowMs;

    ctx.fillStyle = '#0a0e16';
    ctx.fillRect(0, 0, W, H);

    if (!plate) { requestAnimationFrame(render); return; }

    var shake = consumeShake();

    if (shardBodies.length === 0) {
      ctx.save();
      ctx.translate(shake.x, shake.y);
      drawIntactPlate();
      ctx.restore();
    } else {
      ctx.save();
      ctx.translate(shake.x, shake.y);

      for (var i = 0; i < shardBodies.length; i++) {
        var b5 = shardBodies[i];
        var v = b5.vertices;
        if (!v || v.length < 3) continue;
        ctx.beginPath();
        ctx.moveTo(v[0].x, v[0].y);
        for (var j3 = 1; j3 < v.length; j3++) ctx.lineTo(v[j3].x, v[j3].y);
        ctx.closePath();
        var hueOffset = (b5.shardData && b5.shardData.hueOffset) || 0;
        ctx.fillStyle = 'hsla(' + (195 + hueOffset) + ', 55%, 80%, 0.36)';
        ctx.fill();
      }
      for (var i2 = 0; i2 < shardBodies.length; i2++) {
        var b6 = shardBodies[i2];
        var v2 = b6.vertices;
        if (!v2 || v2.length < 3) continue;
        ctx.beginPath();
        ctx.moveTo(v2[0].x, v2[0].y);
        for (var j4 = 1; j4 < v2.length; j4++) ctx.lineTo(v2[j4].x, v2[j4].y);
        ctx.closePath();
        var hueOffset2 = (b6.shardData && b6.shardData.hueOffset) || 0;
        ctx.strokeStyle = 'hsla(' + (195 + hueOffset2) + ', 80%, 92%, 0.85)';
        ctx.lineWidth = 1.05;
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(190, 225, 245, 0.10)';
      ctx.lineWidth = 1;
      ctx.strokeRect(plate.x, plate.y, plate.w, plate.h);

      updateDust(dt);
      renderDust(ctx);
      renderFlash(ctx);

      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  computePlate();
  resizeCanvas();
  requestAnimationFrame(render);

  window.__voronoi = {
    fracture: fracture,
    reset: resetAll,
    getState: function () {
      return {
        shardCount: shardBodies.length,
        collisionCount: collisionCount,
        timeScale: engine.timing.timeScale,
        plate: plate && { x: plate.x, y: plate.y, w: plate.w, h: plate.h },
        version: { matter: 'matter-js 0.20.0', delaunay: 'd3-delaunay 6.0.4' },
        engine: engine,
      };
    },
    _fx: {
      getDustCount: function () { return dustParticles.length; },
      getShakeIntensity: function () { return shakeIntensity; },
      isAudioReady: function () { return audioReady; },
      getAudioState: function () { return audioCtx ? audioCtx.state : 'none'; },
      getLastTickTime: function () { return lastTickTime; },
    },
  };

  console.log('[voronoi] ready — click plate to shatter');
})();
`;

const parts = [];
parts.push('<!DOCTYPE html>\n<html lang="ko">\n<head>\n');
parts.push('<meta charset="UTF-8">\n');
parts.push('<meta name="viewport" content="width=device-width, initial-scale=1.0">\n');
parts.push('<title>Voronoi 유리 파괴 시뮬레이션</title>\n');
parts.push('<style>\n' + CSS + '\n</style>\n');
parts.push('</head>\n<body>\n');
parts.push(HTML_BODY);
parts.push('\n<!-- inline:d3-delaunay -->\n<script>\n' + D3_SRC + '\n</script>\n');
parts.push('<!-- inline:matter-js -->\n<script>\n' + MATTER_SRC + '\n</script>\n');
parts.push('<!-- simulation -->\n<script>\n' + SIM_SCRIPT + '\n</script>\n');
parts.push('</body>\n</html>\n');

const out = parts.join('');
fs.writeFileSync(path.join(ROOT, 'index.html'), out);
console.log('Wrote', path.join(ROOT, 'index.html'), 'size=', Buffer.byteLength(out, 'utf8'), 'bytes');
