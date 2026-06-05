/* =============================================
   PVN Loading Screen — main.js
   ============================================= */

// ---- Audio setup (lower default volume) ----
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('bgm');
    const slider = document.getElementById('volumeSlider');
    const icon = document.getElementById('audioIcon');
    let muted = false;

    if (audio) {
        audio.volume = 0.15;

        slider.addEventListener('input', () => {
            audio.volume = slider.value / 100;
            muted = slider.value == 0;
            icon.textContent = muted ? '♪̶' : '♪';
        });

        icon.parentElement.addEventListener('click', (e) => {
            if (e.target === slider) return;
            muted = !muted;
            audio.volume = muted ? 0 : slider.value / 100;
            icon.textContent = muted ? '♪̶' : '♪';
        });
    }
});

// ---- Tips ----
const TIPS = [
    "Use /advert in-game to broadcast announcements to all players on the server.",
    "Respect the chain of command — address superior officers by their correct rank at all times.",
    "The x86-64 version of Garry's Mod offers better performance and fewer crashes.",
    "Need help? Type !menu in-game to access the player help panel.",
    "Stay in character during RP scenarios — breaking character may result in a warn.",
    "Check the Discord for the latest server announcements and update logs.",
    "Faction leaders can issue wartime orders through the /order command.",
    "New to Imperial Germany RP? Speak to a staff member for an orientation.",
    "Keep your microphone push-to-talk to maintain immersion for other players.",
    "Prop surfing and spawn killing are strictly prohibited — read the rules before playing.",
];

let tipIndex = Math.floor(Math.random() * TIPS.length);
const tipBox  = document.getElementById('tipBox');
const tipText = document.getElementById('tipText');

function showNextTip() {
    tipBox.classList.add('hidden');
    setTimeout(() => {
        tipIndex = (tipIndex + 1) % TIPS.length;
        tipText.textContent = TIPS[tipIndex];
        tipBox.classList.remove('hidden');
    }, 700);
}

// Set first tip immediately
tipText.textContent = TIPS[tipIndex];
setInterval(showNextTip, 7000);

// ---- Loading bar simulation ----
// GMod loading screens don't expose true progress, so we animate a believable fake bar.
const bar   = document.getElementById('loadingBar');
const label = document.getElementById('loadingLabel');

const STAGES = [
    { pct: 12,  msg: 'Connecting to server...' },
    { pct: 28,  msg: 'Downloading game content...' },
    { pct: 47,  msg: 'Loading map assets...' },
    { pct: 61,  msg: 'Initialising addons...' },
    { pct: 74,  msg: 'Syncing player data...' },
    { pct: 85,  msg: 'Spawning entities...' },
    { pct: 93,  msg: 'Almost there...' },
    { pct: 100, msg: 'Ready!' },
];

let stage = 0;

function advanceBar() {
    if (stage >= STAGES.length) return;
    const { pct, msg } = STAGES[stage];
    bar.style.width = pct + '%';
    label.textContent = msg;
    stage++;

    if (stage < STAGES.length) {
        // Random delay between stages (1.2s – 3.5s) for realism
        const delay = 1200 + Math.random() * 2300;
        setTimeout(advanceBar, delay);
    }
}

setTimeout(advanceBar, 800); // Short pause before first tick

// ---- Particle canvas ----
(function () {
    const canvas = document.getElementById('particles');
    const ctx    = canvas.getContext('2d');

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Particle config
    const COUNT = 90;
    const GOLD  = [
        'rgba(201,168,76,',
        'rgba(232,201,111,',
        'rgba(138,106,34,',
        'rgba(255,220,120,',
    ];

    const particles = Array.from({ length: COUNT }, () => spawnParticle(true));

    function spawnParticle(randomY = false) {
        return {
            x:     Math.random() * window.innerWidth,
            y:     randomY ? Math.random() * window.innerHeight : window.innerHeight + 5,
            size:  0.5 + Math.random() * 1.6,
            speed: 0.15 + Math.random() * 0.45,
            drift: (Math.random() - 0.5) * 0.3,
            alpha: 0.15 + Math.random() * 0.55,
            color: GOLD[Math.floor(Math.random() * GOLD.length)],
            twinkleSpeed: 0.005 + Math.random() * 0.015,
            twinklePhase: Math.random() * Math.PI * 2,
        };
    }

    let lastTime = 0;

    function animate(ts) {
        const dt = ts - lastTime;
        lastTime = ts;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            // Twinkle
            p.twinklePhase += p.twinkleSpeed * dt;
            const alpha = p.alpha * (0.6 + 0.4 * Math.sin(p.twinklePhase));

            // Draw
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color + alpha + ')';
            ctx.fill();

            // Move upward with gentle drift
            p.y -= p.speed * (dt / 16);
            p.x += p.drift * (dt / 16);

            // Reset when off-screen top
            if (p.y < -5) {
                particles[i] = spawnParticle(false);
            }
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
})();
