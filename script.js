// ── Build tick marks ──────────────────────────────────────────
const ticksEl = document.getElementById('ticks');

for (let i = 0; i < 60; i++) {
  const tick = document.createElement('div');
  tick.className = 'tick' + (i % 5 === 0 ? ' major' : '');
  tick.style.transform = `translateX(-50%) rotate(${i * 6}deg)`;
  ticksEl.appendChild(tick);
}

// ── Build hour numbers ────────────────────────────────────────
const numsEl = document.getElementById('numbers');
const R = 118; // radius from center in px

for (let i = 1; i <= 12; i++) {
  const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
  const x = 150 + R * Math.cos(angle);
  const y = 150 + R * Math.sin(angle);

  const num = document.createElement('div');
  num.className = 'num';
  num.textContent = i < 10 ? '0' + i : String(i);
  num.style.left = x + 'px';
  num.style.top  = y + 'px';
  numsEl.appendChild(num);
}

// ── Timezone display ──────────────────────────────────────────
const tzOffset = -new Date().getTimezoneOffset();
const tzH = Math.floor(Math.abs(tzOffset) / 60).toString().padStart(2, '0');
const tzM = (Math.abs(tzOffset) % 60).toString().padStart(2, '0');
document.getElementById('tzDisplay').textContent =
  (tzOffset >= 0 ? 'UTC+' : 'UTC-') + tzH + ':' + tzM;

// ── Helpers ───────────────────────────────────────────────────
const days   = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function pad(n) {
  return n < 10 ? '0' + n : String(n);
}

// ── Main update function ──────────────────────────────────────
function update() {
  const now = new Date();
  const h   = now.getHours();
  const m   = now.getMinutes();
  const s   = now.getSeconds();
  const ms  = now.getMilliseconds();

  // Smooth second hand using milliseconds
  const sSmooth = s + ms / 1000;

  // Analog hand rotations
  const hRot = (h % 12) * 30 + m * 0.5;
  const mRot = m * 6 + s * 0.1;
  const sRot = sSmooth * 6;

  document.getElementById('hour').style.transform   = `rotate(${hRot}deg)`;
  document.getElementById('minute').style.transform = `rotate(${mRot}deg)`;
  document.getElementById('second').style.transform = `rotate(${sRot}deg)`;

  // Digital time display (12-hour format)
  const h12 = h % 12 || 12;
  document.getElementById('dHour').textContent = pad(h12);
  document.getElementById('dMin').textContent  = pad(m);
  document.getElementById('dSec').textContent  = pad(s);
  document.getElementById('ampm').textContent  = h < 12 ? 'AM' : 'PM';

  // Seconds progress bar
  document.getElementById('secBar').style.width = ((s / 59) * 100) + '%';

  // Date display
  const d   = now.getDate();
  const day = days[now.getDay()];
  const mon = months[now.getMonth()];
  document.getElementById('dateDisplay').innerHTML =
    `${day} <span>${pad(d)} ${mon} ${now.getFullYear()}</span>`;
}

// ── Run loop (requestAnimationFrame for smooth 60fps) ─────────
update();
function loop() {
  update();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);