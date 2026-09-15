window.nobsScroll = {
    ticking: false,

    initScrollObserver: function () {
        this.updateProximity();
        window.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.onScroll);
        window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
        window.addEventListener('resize', this.onScroll.bind(this), { passive: true });
    },

    onScroll: function () {
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                window.nobsScroll.updateProximity();
                window.nobsScroll.ticking = false;
            });
            this.ticking = true;
        }
    },

    updateProximity: function () {
        const targets = document.querySelectorAll('.scroll-fade-in');
        if (!targets.length) return;

        const viewportCenter = window.innerHeight / 2;
        const maxDist = window.innerHeight * 0.45;

        targets.forEach(el => {
            if (el.closest('.narrative-track')) return; 
            
            const rect = el.getBoundingClientRect();
            const elCenter = rect.top + rect.height / 2;
            const dist = Math.abs(elCenter - viewportCenter);
            
            let ratio = 1 - Math.min(1, dist / maxDist);
            ratio = Math.pow(ratio, 0.75); // Fluid Waking Up proximity curve

            const opacity = Math.max(0.15, ratio);
            const scale = 0.94 + (0.06 * ratio);
            const translateY = (1 - ratio) * 14;

            el.style.opacity = opacity.toFixed(3);
            el.style.transform = `scale(${scale.toFixed(3)}) translate3d(0, ${translateY.toFixed(1)}px, 0)`;
        });
    }
};

window.nobsBreathingTimeline = [
    {
        "start": 0,
        "end": 5.5,
        "label": "HRV PROTOCOL INTRO",
        "phase": "intro",
        "text": "“So I looked at all the things that can raise your heart rate variability, and I started doing this breathing technique specifically for heart rate variability, and it went up.”"
    },
    {
        "start": 5.5,
        "end": 10.5,
        "label": "HRV PROTOCOL INTRO",
        "phase": "intro",
        "text": "“Awesome. So it's... Great. tested. Great. Let's do it together. Here, I'll play it.”"
    },
    {
        "start": 10.5,
        "end": 19.5,
        "label": "HRV PROTOCOL INTRO",
        "phase": "intro",
        "text": "“It'll say, 'Take a deep breath,' and then you'll hear the sound... if you follow me for the first inhale and exhale, you'll know what sound means what.”"
    },
    {
        "start": 19.5,
        "end": 24.2,
        "label": "CLOSE YOUR EYES",
        "phase": "intro",
        "text": "“And you do this eyes closed, typically? — I do it eyes closed. Okay, we'll close our eyes.”"
    },
    {
        "start": 24.2,
        "end": 29.4,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 1,
        "total": 31,
        "text": "🔔 [Inhale Chime] Guided Deep Inhale with Rick & guide..."
    },
    {
        "start": 29.4,
        "end": 35.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 1,
        "total": 31,
        "text": "💨 [Exhale Chime] Smooth, complete exhale with the guide..."
    },
    {
        "start": 35.2,
        "end": 40.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 2,
        "total": 31,
        "text": "🔔 [Inhale Chime] Smooth inhalation through nose..."
    },
    {
        "start": 40.5,
        "end": 46.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 2,
        "total": 31,
        "text": "💨 [Exhale Chime] Gentle, unforced release..."
    },
    {
        "start": 46.2,
        "end": 51.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 3,
        "total": 31,
        "text": "🔔 [Inhale Chime] Deep diaphragmatic breath..."
    },
    {
        "start": 51.5,
        "end": 57.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 3,
        "total": 31,
        "text": "💨 [Exhale Chime] Relaxing shoulders and jaw..."
    },
    {
        "start": 57.2,
        "end": 62.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 4,
        "total": 31,
        "text": "🔔 [Inhale Chime] Filling lower lungs with air..."
    },
    {
        "start": 62.5,
        "end": 68.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 4,
        "total": 31,
        "text": "💨 [Exhale Chime] Smooth, slow exhale..."
    },
    {
        "start": 68.2,
        "end": 73.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 5,
        "total": 31,
        "text": "🔔 [Inhale Chime] Expanding ribcage gently..."
    },
    {
        "start": 73.5,
        "end": 79.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 5,
        "total": 31,
        "text": "💨 [Exhale Chime] Releasing all physical tension..."
    },
    {
        "start": 79.2,
        "end": 84.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 6,
        "total": 31,
        "text": "🔔 [Inhale Chime] Calm, steady nasal inhalation..."
    },
    {
        "start": 84.5,
        "end": 90.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 6,
        "total": 31,
        "text": "💨 [Exhale Chime] Letting go of urge friction..."
    },
    {
        "start": 90.2,
        "end": 95.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 7,
        "total": 31,
        "text": "🔔 [Inhale Chime] Centering awareness on heart..."
    },
    {
        "start": 95.5,
        "end": 101.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 7,
        "total": 31,
        "text": "💨 [Exhale Chime] Long, calm release through nose..."
    },
    {
        "start": 101.2,
        "end": 106.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 8,
        "total": 31,
        "text": "🔔 [Inhale Chime] Synchronizing heart rate variability..."
    },
    {
        "start": 106.5,
        "end": 111.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 8,
        "total": 31,
        "text": "💨 [Exhale Chime] Deep parasympathetic tone..."
    },
    {
        "start": 111.2,
        "end": 117.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 9,
        "total": 31,
        "text": "🔔 [Inhale Chime] Smooth rhythm in and out..."
    },
    {
        "start": 117.5,
        "end": 123.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 9,
        "total": 31,
        "text": "💨 [Exhale Chime] Complete, effortless release..."
    },
    {
        "start": 123.2,
        "end": 128.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 10,
        "total": 31,
        "text": "🔔 [Inhale Chime] Pure resonant frequency breath..."
    },
    {
        "start": 128.5,
        "end": 134.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 10,
        "total": 31,
        "text": "💨 [Exhale Chime] Emptying lungs completely..."
    },
    {
        "start": 134.2,
        "end": 139.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 11,
        "total": 31,
        "text": "🔔 [Inhale Chime] Slow and effortless airflow..."
    },
    {
        "start": 139.5,
        "end": 145.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 11,
        "total": 31,
        "text": "💨 [Exhale Chime] Body settling into profound stillness..."
    },
    {
        "start": 145.2,
        "end": 150.2,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 12,
        "total": 31,
        "text": "🔔 [Inhale Chime] Vagal nerve stimulation active..."
    },
    {
        "start": 150.2,
        "end": 156.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 12,
        "total": 31,
        "text": "💨 [Exhale Chime] Releasing stress and resistance..."
    },
    {
        "start": 156.2,
        "end": 160.6,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 13,
        "total": 31,
        "text": "🔔 [Inhale Chime] Expanding chest softly..."
    },
    {
        "start": 160.6,
        "end": 167.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 13,
        "total": 31,
        "text": "💨 [Exhale Chime] Smooth airflow out..."
    },
    {
        "start": 167.2,
        "end": 171.4,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 14,
        "total": 31,
        "text": "🔔 [Inhale Chime] Steady breath, peaceful mind..."
    },
    {
        "start": 171.4,
        "end": 177.6,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 14,
        "total": 31,
        "text": "💨 [Exhale Chime] Slowing heart rhythm naturally..."
    },
    {
        "start": 177.6,
        "end": 183.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 15,
        "total": 31,
        "text": "🔔 [Inhale Chime] Down-regulating nervous system..."
    },
    {
        "start": 183.5,
        "end": 189.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 15,
        "total": 31,
        "text": "💨 [Exhale Chime] Letting tension dissolve..."
    },
    {
        "start": 189.2,
        "end": 194.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 16,
        "total": 31,
        "text": "🔔 [Inhale Chime] Deep soothing inspiration..."
    },
    {
        "start": 194.5,
        "end": 200.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 16,
        "total": 31,
        "text": "💨 [Exhale Chime] Deep peace settling in..."
    },
    {
        "start": 200.2,
        "end": 205.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 17,
        "total": 31,
        "text": "🔔 [Inhale Chime] Steady parasympathetic flow..."
    },
    {
        "start": 205.5,
        "end": 211.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 17,
        "total": 31,
        "text": "💨 [Exhale Chime] Quiet exhale with chime..."
    },
    {
        "start": 211.2,
        "end": 216.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 18,
        "total": 31,
        "text": "🔔 [Inhale Chime] Nourishing heart and brain..."
    },
    {
        "start": 216.5,
        "end": 222.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 18,
        "total": 31,
        "text": "💨 [Exhale Chime] Resting in autonomic coherence..."
    },
    {
        "start": 222.2,
        "end": 227.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 19,
        "total": 31,
        "text": "🔔 [Inhale Chime] Smooth inhalation with chime..."
    },
    {
        "start": 227.5,
        "end": 233.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 19,
        "total": 31,
        "text": "💨 [Exhale Chime] Gentle, quiet airflow out..."
    },
    {
        "start": 233.2,
        "end": 238.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 20,
        "total": 31,
        "text": "🔔 [Inhale Chime] Harmonizing cardiac rhythm..."
    },
    {
        "start": 238.5,
        "end": 244.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 20,
        "total": 31,
        "text": "💨 [Exhale Chime] Softening belly and face..."
    },
    {
        "start": 244.2,
        "end": 249.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 21,
        "total": 31,
        "text": "🔔 [Inhale Chime] Unforced, gentle intake..."
    },
    {
        "start": 249.5,
        "end": 255.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 21,
        "total": 31,
        "text": "💨 [Exhale Chime] Smooth release..."
    },
    {
        "start": 255.2,
        "end": 260.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 22,
        "total": 31,
        "text": "🔔 [Inhale Chime] Clarity and calmness expanding..."
    },
    {
        "start": 260.5,
        "end": 266.1,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 22,
        "total": 31,
        "text": "💨 [Exhale Chime] Sinking into grounded stillness..."
    },
    {
        "start": 266.1,
        "end": 271.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 23,
        "total": 31,
        "text": "🔔 [Inhale Chime] Soft, even breath..."
    },
    {
        "start": 271.5,
        "end": 277.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 23,
        "total": 31,
        "text": "💨 [Exhale Chime] Nervous system fully stabilized..."
    },
    {
        "start": 277.2,
        "end": 282.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 24,
        "total": 31,
        "text": "🔔 [Inhale Chime] Deep resonance..."
    },
    {
        "start": 282.5,
        "end": 288.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 24,
        "total": 31,
        "text": "💨 [Exhale Chime] Effortless relaxation..."
    },
    {
        "start": 288.2,
        "end": 293.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 25,
        "total": 31,
        "text": "🔔 [Inhale Chime] Effortless nasal airflow..."
    },
    {
        "start": 293.5,
        "end": 299.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 25,
        "total": 31,
        "text": "💨 [Exhale Chime] Gentle release of tension..."
    },
    {
        "start": 299.2,
        "end": 304.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 26,
        "total": 31,
        "text": "🔔 [Inhale Chime] Entering deep coherence state..."
    },
    {
        "start": 304.5,
        "end": 310.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 26,
        "total": 31,
        "text": "💨 [Exhale Chime] Quiet and steady exhale..."
    },
    {
        "start": 310.2,
        "end": 315.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 27,
        "total": 31,
        "text": "🔔 [Inhale Chime] Smooth and peaceful breath..."
    },
    {
        "start": 315.5,
        "end": 321.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 27,
        "total": 31,
        "text": "💨 [Exhale Chime] Smooth surrender of tension..."
    },
    {
        "start": 321.2,
        "end": 326.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 28,
        "total": 31,
        "text": "🔔 [Inhale Chime] Steady rhythm anchoring you..."
    },
    {
        "start": 326.5,
        "end": 332.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 28,
        "total": 31,
        "text": "💨 [Exhale Chime] Calm, complete release..."
    },
    {
        "start": 332.2,
        "end": 337.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 29,
        "total": 31,
        "text": "🔔 [Inhale Chime] Smooth deep breath..."
    },
    {
        "start": 337.5,
        "end": 343.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 29,
        "total": 31,
        "text": "💨 [Exhale Chime] Smooth and steady release..."
    },
    {
        "start": 343.2,
        "end": 348.6,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 30,
        "total": 31,
        "text": "🔔 [Inhale Chime] Penultimate deep inhale..."
    },
    {
        "start": 348.6,
        "end": 354.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 30,
        "total": 31,
        "text": "💨 [Exhale Chime] Penultimate smooth exhale..."
    },
    {
        "start": 354.2,
        "end": 359.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 31,
        "total": 31,
        "text": "🔔 [Inhale Chime] Final deep inhale with chime..."
    },
    {
        "start": 359.5,
        "end": 372,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 31,
        "total": 31,
        "text": "💨 [Exhale Chime] Final slow exhale • 5 minutes complete!"
    },
    {
        "start": 372,
        "end": 379,
        "label": "5-MIN COHERENCE COMPLETE",
        "phase": "complete",
        "text": "“That was five minutes. I like that. Feels nice, doesn't it? — Yeah.”"
    },
    {
        "start": 379,
        "end": 387,
        "label": "5-MIN COHERENCE COMPLETE",
        "phase": "complete",
        "text": "“I noticed I don't spontaneously breathe at that cadence. I breathe quite a bit faster. — Mhm. So especially on the exhale.”"
    },
    {
        "start": 387,
        "end": 397.5,
        "label": "5-MIN COHERENCE COMPLETE",
        "phase": "complete",
        "text": "“So once I got into a rhythm of it, yeah, the mind just goes pseudo random for me. What about for you?”"
    }
];

/**
 * PRODUX-INSPIRED SCROLLYTELLING ENGINE
 * Ultra-smooth inertia scrubbing, global event delegation & non-overlapping 3D scene transitions
 */
window.nobsProduxScrollytelling = {
    animFrame: null,
    targetProgress: 0.0,
    currentProgress: 0.0,
    confettiFired: false,
    active: false,
    _touchStartY: 0,

    _shuzoEnded: false,
    _breathingAudio: null,
    _breathingPlaying: false,
    _breathingEnded: false,
    _natureMuted: true,
    _natureVideos: ['videos/nature_wildlife.mp4', 'videos/water_beach_video.mp4'],
    _natureIndex: 0,
    _lastNatureSwitchTime: 0,

    replayShuzo: function () {
        this._shuzoEnded = false;
        const sv = document.getElementById('shuzoVideoPlayer');
        if (sv) {
            sv.currentTime = 0;
            const p = sv.play();
            if (p !== undefined) p.catch(() => {});
        }
        const btn = document.getElementById('shuzoPlayCenterBtn');
        if (btn) {
            btn.style.display = 'none';
        }
    },

    switchNatureVideo: function (forceIndex) {
        const nv = document.getElementById('natureVideoPlayer');
        if (!nv) return;
        if (typeof forceIndex === 'number') {
            this._natureIndex = forceIndex % this._natureVideos.length;
        } else {
            this._natureIndex = (this._natureIndex + 1) % this._natureVideos.length;
        }
        const nextSrc = this._natureVideos[this._natureIndex];
        nv._playPending = true;
        nv.src = nextSrc;
        nv.muted = this._natureMuted;
        nv.volume = this._natureMuted ? 0 : 0.35;
        nv.currentTime = 0;
        nv.load();
        nv.play().then(() => {
            nv._playPending = false;
        }).catch(() => {
            nv._playPending = false;
        });
    },

    syncBreathingText: function (currentTime) {
        const t = (typeof currentTime === 'number' && !isNaN(currentTime)) ? currentTime : 0;
        const timeline = window.nobsBreathingTimeline;
        if (!timeline || timeline.length === 0) return;

        const deckContainer = document.querySelector('.breath-deck-container');
        const labelEl = document.getElementById('phaseLiveLabel');
        const timerEl = document.getElementById('phaseLiveTimer');
        const pillEl = document.getElementById('breathLivePill');
        const captionEl = document.getElementById('breathCaptionText');
        const skipBtn = document.getElementById('skipIntroBtn');

        // When audio ends (t >= 396.5s or _breathingEnded), hide text & pill completely
        if (this._breathingEnded || t >= 397.5) {
            if (deckContainer) deckContainer.classList.add('is-ended');
            if (captionEl) captionEl.textContent = '';
            if (skipBtn) skipBtn.style.display = 'none';
            return;
        } else {
            if (deckContainer) deckContainer.classList.remove('is-ended');
        }

        let entry = timeline.find(item => t >= item.start && t < item.end);
        if (!entry && t >= timeline[timeline.length - 1].end) {
            if (deckContainer) deckContainer.classList.add('is-ended');
            if (captionEl) captionEl.textContent = '';
            if (skipBtn) skipBtn.style.display = 'none';
            return;
        }
        if (!entry) entry = timeline[0];

        if (labelEl) {
            const labelText = entry.breath ? `${entry.label} (${entry.breath}/${entry.total})` : entry.label;
            if (labelEl.textContent !== labelText) {
                labelEl.textContent = labelText;
            }
        }

        if (timerEl) {
            if (entry.phase === 'complete') {
                timerEl.textContent = '5:00 ✓';
            } else if (entry.phase === 'intro') {
                const secsToStart = Math.max(1, Math.ceil(24.2 - t));
                timerEl.textContent = secsToStart > 0 ? (secsToStart <= 9 ? `0:0${secsToStart}` : `0:${secsToStart}`) : '0:01';
            } else {
                const secsRemaining = Math.max(1, Math.ceil(entry.end - t));
                timerEl.textContent = secsRemaining + 's';
            }
        }

        if (pillEl) {
            pillEl.classList.remove('inhale-deep', 'exhale-long', 'intro-listen', 'prepare-phase', 'phase-complete');
            if (entry.phase === 'inhale') pillEl.classList.add('inhale-deep');
            else if (entry.phase === 'exhale') pillEl.classList.add('exhale-long');
            else if (entry.phase === 'intro') pillEl.classList.add('intro-listen');
            else if (entry.phase === 'prepare') pillEl.classList.add('prepare-phase');
            else if (entry.phase === 'complete') pillEl.classList.add('phase-complete');
        }

        if (captionEl) {
            if (captionEl.getAttribute('data-active-text') !== entry.text) {
                captionEl.setAttribute('data-active-text', entry.text);
                captionEl.textContent = entry.text;
            }
        }

        if (skipBtn) {
            if (t < 24.0) {
                skipBtn.style.display = 'inline-flex';
            } else {
                skipBtn.style.display = 'none';
            }
        }
    },

    skipIntro: function () {
        const audio = this.getBreathingAudio();
        if (audio) {
            audio.currentTime = 24.2;
            if (audio.paused && !this._breathingEnded) {
                this.playBreathingAudio();
            }
            this.syncBreathingText(24.2);
        }
    },

    getBreathingAudio: function () {
        const domAudio = document.getElementById('breathingAudioPlayer');
        if (domAudio) {
            domAudio.loop = false;
            if (!domAudio._timelineHooked) {
                domAudio._timelineHooked = true;
                const onTime = () => {
                    this.syncBreathingText(domAudio.currentTime);
                };
                domAudio.addEventListener('timeupdate', onTime);
                domAudio.addEventListener('seeking', onTime);
                domAudio.addEventListener('play', () => {
                    this._breathingPlaying = true;
                    this.syncBreathingText(domAudio.currentTime);
                });
                domAudio.addEventListener('pause', () => {
                    this._breathingPlaying = false;
                });
                domAudio.addEventListener('ended', () => {
                    this._breathingPlaying = false;
                    this._breathingEnded = true;
                    this.syncBreathingText(domAudio.duration || 464.5);
                });
            }
            return domAudio;
        }
        if (!this._breathingAudio) {
            this._breathingAudio = new Audio('sounds/breathing_exercise.mp3');
            this._breathingAudio.loop = false;
            this._breathingAudio.preload = 'auto';
            this._breathingAudio.volume = 0.85;
            this._breathingAudio.addEventListener('ended', () => {
                this._breathingPlaying = false;
                this._breathingEnded = true;
            });
        }
        return this._breathingAudio;
    },

    playBreathingAudio: function () {
        if (this._breathingEnded) return;
        const audio = this.getBreathingAudio();
        if (audio) {
            if (!audio.paused) {
                this._breathingPlaying = true;
                return;
            }
            audio.volume = 0.85;
            audio.muted = false;
            audio.loop = false;
            this._breathingPlaying = true;
            const p = audio.play();
            if (p !== undefined) {
                p.catch((err) => {
                    console.warn('Breathing audio play error:', err);
                    this._breathingPlaying = false;
                });
            }
        }
    },

    pauseBreathingAudio: function () {
        this._breathingPlaying = false;
        const audio = this.getBreathingAudio();
        if (audio && !audio.paused) {
            audio.pause();
        }
    },

    toggleNatureSound: function (isMuted) {
        if (typeof isMuted === 'boolean') {
            this._natureMuted = isMuted;
        } else {
            this._natureMuted = !this._natureMuted;
        }
        const nv = document.getElementById('natureVideoPlayer');
        if (nv) {
            nv.muted = this._natureMuted;
            nv.volume = this._natureMuted ? 0 : 0.35;
            if (!this._natureMuted) {
                if (this.currentProgress >= 3.60 && this.currentProgress <= 4.80) {
                    if (nv.paused) nv.play().catch(() => {});
                }
            }
        }
        return this._natureMuted;
    },

    toggleBreathingAudio: function (isMuted) {
        // Alias to toggleNatureSound: sound button in breathing exercise only toggles nature sound!
        return this.toggleNatureSound(isMuted);
    },

    init: function (forceReset) {
        if (this.active && !forceReset) {
            // Already active, do not reset progress! Just maintain render state
            this.render(this.currentProgress);
            return;
        }
        if (forceReset || !this.active) {
            this.targetProgress = 0.0;
            this.currentProgress = 0.0;
            this.confettiFired = false;
            this._shuzoEnded = false;
            this._breathingPlaying = false;
            this._breathingEnded = false;
            this._natureIndex = 0;
            this._lastNatureSwitchTime = 0;
            this._natureMuted = true;
            const sv = document.getElementById('shuzoVideoPlayer');
            if (sv) { sv.muted = true; }
            const nv = document.getElementById('natureVideoPlayer');
            if (nv) { nv.muted = true; nv.volume = 0; }
            const ba = document.getElementById('breathingAudioPlayer');
            if (ba) {
                ba.muted = false;
                ba.volume = 0.85;
                ba.loop = false;
                ba.currentTime = 0;
            }
            const ma = document.getElementById('mountainAmbienceAudio');
            if (ma) {
                ma.muted = false;
                ma.volume = 0.60;
                ma.loop = true;
                ma.currentTime = 0;
            }
            const wa = document.getElementById('waterWavesAudio');
            if (wa) {
                wa.muted = false;
                wa.volume = 0.70;
                wa.loop = true;
                wa.currentTime = 0;
            }
            this.syncBreathingText(0);
            const sections = document.querySelectorAll('.spotify-data-section');
            sections.forEach((s, idx) => {
                if (idx === 0) s.classList.add('in-view');
                else s.classList.remove('in-view');
            });
        }
        this.active = true;

        // Render first frame immediately
        this.render(this.currentProgress);

        // Start 60/120fps physics loop if not already running
        if (!this.animFrame) {
            const loop = () => {
                if (this.active) {
                    try {
                        const diff = this.targetProgress - this.currentProgress;
                        if (Math.abs(diff) > 0.0005) {
                            this.currentProgress += diff * 0.15; // Smooth exponential lerp
                        } else if (this.currentProgress !== this.targetProgress) {
                            this.currentProgress = this.targetProgress;
                        }
                        this.render(this.currentProgress);
                    } catch (err) {
                        console.error('Produx render error:', err);
                    }
                }
                this.animFrame = requestAnimationFrame(loop);
            };
            this.animFrame = requestAnimationFrame(loop);
        }
    },

    isModalOpen: function () {
        return !!(document.getElementById('urgeModalBackdrop') || document.querySelector('.urge-modal-square'));
    },

    jumpTo: function (target) {
        if (target === 'breathing' || target === 3.0 || target === 3) {
            this.targetProgress = 4.90;
            const nv = document.getElementById('natureVideoPlayer');
            if (nv) {
                nv.muted = this._natureMuted;
                nv.volume = this._natureMuted ? 0 : 0.35;
                if (nv.readyState === 0) nv.load();
                nv.play().catch(() => {});
            }
            if (!this._breathingEnded && !this._breathingPlaying) {
                this.playBreathingAudio();
            }
        } else if (typeof target === 'number') {
            const map = [0.0, 1.0, 3.5, 4.9, 5.8];
            const idx = Math.floor(target);
            if (idx >= 0 && idx < map.length) {
                this.targetProgress = map[idx];
            } else {
                this.targetProgress = Math.max(0.0, Math.min(6.00, target));
            }
        }
    },

    onWheel: function (e) {
        if (!this.isModalOpen()) return;
        e.preventDefault();

        // High precision scrolling physics tailored per section:
        // Slower, more granular scroll in Data Section (p < 1.0), Day Diary (1.0 <= p < 2.30),
        // Japanese Video expansion (2.80 <= p <= 4.25), and Breathing (4.35 <= p <= 5.35)
        const p = this.targetProgress;
        let multiplier = 0.0014;
        if (p < 1.0) {
            multiplier = 0.00065; // ~2.5x slower for data metrics and quotes
        } else if (p < 2.30) {
            multiplier = 0.00048; // comfortable pace for shine and day diary cards inspection
        } else if (p >= 2.80 && p <= 4.25) {
            multiplier = 0.00070; // deliberate, extended scroll pacing for Japanese video player expansion
        } else if (p >= 4.35 && p <= 5.35) {
            multiplier = 0.00035; // ~4x slower anti-skimming scroll deceleration for guided HRV breathing
        }

        const delta = e.deltaY * multiplier;
        this.targetProgress = Math.max(0.0, Math.min(6.00, this.targetProgress + delta));
    },

    onTouchStart: function (e) {
        if (!this.isModalOpen()) return;
        if (e.touches && e.touches.length > 0) {
            this._touchStartY = e.touches[0].clientY;
        }
    },

    onTouchMove: function (e) {
        if (!this.isModalOpen()) return;
        if (e.touches && e.touches.length > 0) {
            const currentY = e.touches[0].clientY;
            const p = this.targetProgress;
            let multiplier = 0.0030;
            if (p < 1.0) {
                multiplier = 0.0014; // ~2.5x slower
            } else if (p < 2.30) {
                multiplier = 0.0010; // ~3.5x slower
            } else if (p >= 2.80 && p <= 4.25) {
                multiplier = 0.0016; // extended scroll for Japanese video expanding
            } else if (p >= 4.35 && p <= 5.35) {
                multiplier = 0.00075; // ~4x slower touch deceleration for guided HRV breathing
            }
            const deltaY = (this._touchStartY - currentY) * multiplier;
            this._touchStartY = currentY;
            this.targetProgress = Math.max(0.0, Math.min(6.00, this.targetProgress + deltaY));
            if (e.cancelable) e.preventDefault();
        }
    },

    onKeyDown: function (e) {
        if (!this.isModalOpen()) return;
        if (e.key === 'Escape') {
            const closeBtn = document.querySelector('.modal-close-btn');
            if (closeBtn) {
                closeBtn.click();
            }
            return;
        }
        const p = this.targetProgress;
        const step = (p < 2.45) ? 0.08 : 0.20;
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            this.targetProgress = Math.min(6.00, this.targetProgress + step);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            this.targetProgress = Math.max(0.0, this.targetProgress - step);
        } else if (e.key === ' ') {
            e.preventDefault();
            this.targetProgress = Math.min(6.00, this.targetProgress + (step * 1.5));
        }
    },

    render: function (p) {
        const s0 = document.getElementById('urge-scene-0');
        const s2 = document.getElementById('urge-scene-2');
        const s3 = document.getElementById('urge-scene-3');
        const s4 = document.getElementById('urge-scene-4');
        const bg = document.getElementById('urgeBgMusic');

        // Manage ambient background music ("The City of Lost Hope")
        // Plays during Scene 0 across all cards of the Day Diary.
        // Fades out gently as we scroll down from Day Diary into Scene 2 (Japanese video, p: 2.30 -> 2.75).
        // Once past Day Diary (p > 2.75) or on track end, it marks _hasPlayedOnce = true and never plays again.
        if (bg) {
            if (!bg._endedHooked) {
                bg._endedHooked = true;
                bg.loop = false;
                bg.addEventListener('ended', () => {
                    bg._hasPlayedOnce = true;
                    bg.pause();
                });
            }

            if (!bg.muted && !bg._hasPlayedOnce) {
                if (p <= 2.30) {
                    let baseVol = 0.40;
                    if (p <= 0.25) {
                        baseVol = 0.22; // Duck slightly for mountain wind
                    } else if (p >= 0.45 && p <= 1.20) {
                        baseVol = 0.15; // Duck so water waves sound is rich and audible
                    }
                    bg.volume = baseVol;
                    if (bg.paused) bg.play().catch(() => {});
                } else if (p > 2.30 && p <= 2.75) {
                    const fadeNorm = (p - 2.30) / 0.45;
                    bg.volume = Math.max(0, 0.40 * (1 - fadeNorm));
                    if (bg.paused) bg.play().catch(() => {});
                } else {
                    bg.volume = 0;
                    if (!bg.paused) bg.pause();
                    bg._hasPlayedOnce = true;
                }
            } else {
                bg.volume = 0;
                if (!bg.paused) bg.pause();
            }
        }

        // -------------------------------------------------------------
        // SCENE 0: DATA STREAM + PINNED DAY DIARY (0.0 -> 2.7)
        // -------------------------------------------------------------
        if (s0) {
            const dataStream = document.getElementById('spotifyDataStream');
            const dataContainer = document.getElementById('spotifyDataScrollContainer');
            const track = document.getElementById('produxDiagonalTrack');
            const cards = s0.querySelectorAll('.produx-diagonal-card');
            const diarySection = s0.querySelector('.day-diary-data-section');

            if (p < 2.4) {
                s0.style.display = 'flex';
                s0.style.opacity = '1';
                s0.style.transform = 'scale(1) translate3d(0, 0, 0)';
                s0.style.filter = 'blur(0px)';
                s0.style.pointerEvents = 'auto';

                // Phase 1 (p: 0.0 -> 1.0): Vertical scroll until Day Diary is in view
                // Phase 1.5 (p: 0.85 -> 1.45): Day diary text shine animation (starts when visible, ends completely before cards glide)
                // Phase 2 (p: 1.45 -> 2.30): Cards glide diagonally AFTER shining animation has completed!
                if (dataStream && dataContainer) {
                    const maxScroll = Math.max(0, dataStream.scrollHeight - dataContainer.clientHeight + 30);
                    const diaryOffset = diarySection ? Math.min(maxScroll, Math.max(0, diarySection.offsetTop - 15)) : maxScroll;

                    let currentScrollY = 0;
                    if (p < 1.0) {
                        const vertRatio = p / 1.0;
                        currentScrollY = vertRatio * diaryOffset;
                    } else {
                        // Locked / pinned on Day Diary
                        currentScrollY = diaryOffset;
                    }
                    dataStream.style.transform = `translate3d(0, ${(-currentScrollY).toFixed(1)}px, 0)`;

                    // Check exact visibility of Top Streak card (Section 1) and Urges Surfed card (Section 3.5)
                    const containerH = dataContainer.clientHeight || 450;
                    const streakCard = s0.querySelector('.folder-card-streak');
                    const wavesCard = s0.querySelector('.folder-card-waves');

                    let isStreakInView = false;
                    let isWavesInView = false;

                    if (streakCard) {
                        const streakSec = streakCard.closest('.spotify-data-section') || streakCard;
                        const sTop = streakSec.offsetTop - currentScrollY;
                        isStreakInView = (sTop > -180 && sTop < containerH * 0.40 && p <= 0.22);
                    }

                    if (wavesCard) {
                        const wavesSec = wavesCard.closest('.spotify-data-section') || wavesCard;
                        const wTop = wavesSec.offsetTop - currentScrollY;
                        isWavesInView = (wTop > -150 && wTop < containerH * 0.70 && p >= 0.52 && p < 1.05);
                    }

                    const mountainAudio = document.getElementById('mountainAmbienceAudio');
                    const waterAudio = document.getElementById('waterWavesAudio');

                    if (mountainAudio) {
                        if (isStreakInView) {
                            mountainAudio.volume = 0.65;
                            if (mountainAudio.paused) mountainAudio.play().catch(() => {});
                        } else {
                            if (!mountainAudio.paused) mountainAudio.pause();
                        }
                    }

                    if (waterAudio) {
                        if (isWavesInView) {
                            waterAudio.volume = 0.75;
                            if (waterAudio.paused) waterAudio.play().catch(() => {});
                        } else {
                            if (!waterAudio.paused) waterAudio.pause();
                        }
                    }

                    if (bg && !bg.muted && !bg._hasPlayedOnce) {
                        if (isWavesInView) {
                            bg.volume = 0.12; // Duck for water waves
                        } else if (isStreakInView) {
                            bg.volume = 0.22; // Duck for mountain wind
                        } else {
                            bg.volume = 0.40;
                        }
                    }

                    // Trigger letter animations for data sections as each enters the viewport
                    const sections = s0.querySelectorAll('.spotify-data-section');
                    if (sections && sections.length > 0) {
                        const containerHeight = dataContainer.clientHeight || 450;
                        sections.forEach((sec, idx) => {
                            if (idx === 0) {
                                sec.classList.add('in-view');
                            } else {
                                const secTop = sec.offsetTop;
                                if (currentScrollY + containerHeight * 0.70 >= secTop) {
                                    sec.classList.add('in-view');
                                }
                            }
                        });
                    }

                    // Produx-style "top 90%" shine trigger:
                    // Text shines up while positioned at the near bottom of the visible page
                    const containerHeight = dataContainer.clientHeight || 450;
                    const sectionTopInView = diarySection ? (diarySection.offsetTop - currentScrollY) : containerHeight;
                    const viewRatio = sectionTopInView / containerHeight;

                    const headlineEl = s0.querySelector('.slide-headline.shine-scroll-text');
                    const subtextEl = s0.querySelector('.slide-subtext.shine-scroll-text');

                    // Headline starts shining right as it enters near the bottom (viewRatio <= 0.92)
                    // and sweeps across diagonally, completing by viewRatio <= 0.50
                    let headRatio = 0;
                    if (viewRatio <= 0.50 || p >= 1.0) {
                        headRatio = 1.0;
                    } else if (viewRatio < 0.92) {
                        headRatio = (0.92 - viewRatio) / 0.42;
                    }
                    const headPos = (-20 + headRatio * 145).toFixed(1);

                    // Subtext starts shining as headline progresses (viewRatio <= 0.65)
                    // and completes by viewRatio <= 0.15 (when pinned at p >= 1.0)
                    let subRatio = 0;
                    if (viewRatio <= 0.15 || p >= 1.0) {
                        subRatio = 1.0;
                    } else if (viewRatio < 0.65) {
                        subRatio = (0.65 - viewRatio) / 0.50;
                    }
                    const subPos = (-20 + subRatio * 145).toFixed(1);

                    if (headlineEl) {
                        headlineEl.style.setProperty('--shine-pos', `${headPos}%`);
                        headlineEl.style.setProperty('--fill-pct', `${headPos}%`);
                    }

                    if (subtextEl) {
                        subtextEl.style.setProperty('--shine-pos', `${subPos}%`);
                        subtextEl.style.setProperty('--fill-pct', `${subPos}%`);
                    }
                }

                if (track && cards.length > 0) {
                    // Day diary cards animation: starts ONLY AFTER the shining animation has completed and pinned (p >= 1.05)
                    let diaryRatio = 0;
                    if (p >= 1.05) {
                        diaryRatio = Math.min(1.0, (p - 1.05) / 1.25);
                    }
                    const maxShiftX = (cards.length - 1) * 360;
                    const maxShiftY = (cards.length - 1) * 75;

                    track.style.transform = `translate3d(${(-diaryRatio * maxShiftX).toFixed(1)}px, ${(-diaryRatio * maxShiftY).toFixed(1)}px, 0)`;

                    const focalIndex = diaryRatio * (cards.length - 1);
                    cards.forEach((c, idx) => {
                        const dist = Math.abs(idx - focalIndex);
                        c.style.zIndex = 50 - Math.round(dist * 5);
                        c.classList.remove('active-focus');
                    });

                    this.updateCardHover();
                }
            } else if (p >= 2.30 && p <= 2.85) {
                // Scene 0 scrolls vertically UP out of view (normal scroll down)
                const norm0 = Math.min(1, Math.max(0, (p - 2.30) / 0.55));
                const ease0 = norm0 * norm0 * (3 - 2 * norm0);
                const tyPct0 = -ease0 * 100; // 0% -> -100% (moving up out of frame)
                const op0 = norm0 > 0.92 ? Math.max(0, 1 - (norm0 - 0.92) / 0.08) : 1.0;

                const track = document.getElementById('produxDiagonalTrack');
                const cards = s0.querySelectorAll('.produx-diagonal-card');
                if (track && cards.length > 0) {
                    const maxShiftX = (cards.length - 1) * 360;
                    const maxShiftY = (cards.length - 1) * 75;
                    track.style.transform = `translate3d(${(-maxShiftX).toFixed(1)}px, ${(-maxShiftY).toFixed(1)}px, 0)`;
                }

                const ma = document.getElementById('mountainAmbienceAudio');
                const wa = document.getElementById('waterWavesAudio');
                if (ma && !ma.paused) ma.pause();
                if (wa && !wa.paused) wa.pause();

                s0.style.display = 'flex';
                s0.style.zIndex = '15';
                s0.style.opacity = op0.toFixed(3);
                s0.style.transform = `translate3d(0, ${tyPct0.toFixed(2)}%, 0)`;
                s0.style.boxShadow = 'none';
                s0.style.filter = 'none';
                s0.style.pointerEvents = norm0 > 0.4 ? 'none' : 'auto';
            } else {
                s0.style.display = 'none';
                s0.style.zIndex = '1';
                s0.style.opacity = '0';
                s0.style.pointerEvents = 'none';
                const ma = document.getElementById('mountainAmbienceAudio');
                const wa = document.getElementById('waterWavesAudio');
                if (ma && !ma.paused) ma.pause();
                if (wa && !wa.paused) wa.pause();
            }
        }

        // -------------------------------------------------------------
        // SCENE 2: THE RAW SPARK (Motivation Video) (2.30 -> 4.70)
        // -------------------------------------------------------------
        if (s2) {
            const sv = document.getElementById('shuzoVideoPlayer');
            const expandingBox = document.getElementById('shuzoExpandingBox');
            const soundBtn = document.getElementById('shuzoSoundBtn');

            if (sv && !sv._shuzoHooked) {
                sv._shuzoHooked = true;
                sv.addEventListener('ended', () => {
                    window.nobsProduxScrollytelling._shuzoEnded = true;
                });
            }

            if (p >= 2.30 && p <= 4.70) {
                if (p < 2.85) {
                    // Normal vertical scroll IN from BOTTOM into center
                    const norm2In = Math.min(1, Math.max(0, (p - 2.30) / 0.55));
                    const easeIn2 = norm2In * norm2In * (3 - 2 * norm2In);
                    const tyPct2In = (1 - easeIn2) * 100; // +100% -> 0% (scrolling up into place)
                    s2.style.display = 'flex';
                    s2.style.zIndex = '20';
                    s2.style.opacity = '1';
                    s2.style.transform = `translate3d(0, ${tyPct2In.toFixed(2)}%, 0)`;
                    s2.style.boxShadow = (norm2In > 0.02 && norm2In < 0.98) ? '0 -12px 35px rgba(0, 0, 0, 0.4)' : 'none';
                    s2.style.filter = 'none';
                    s2.style.pointerEvents = norm2In > 0.7 ? 'auto' : 'none';
                } else if (p > 4.25) {
                    // Glides OUT to the LEFT towards Nature video
                    const normOut2 = Math.min(1, Math.max(0, (p - 4.25) / 0.45));
                    const easeOut2 = normOut2 * normOut2 * (3 - 2 * normOut2);
                    const txPct2Out = -easeOut2 * 100; // 0% -> -100%
                    const op2 = normOut2 > 0.90 ? Math.max(0, 1 - (normOut2 - 0.90) / 0.10) : 1.0;
                    s2.style.display = 'flex';
                    s2.style.zIndex = '15';
                    s2.style.opacity = op2.toFixed(3);
                    s2.style.transform = `translate3d(${txPct2Out.toFixed(2)}%, 0, 0)`;
                    s2.style.boxShadow = 'none';
                    s2.style.filter = 'none';
                    s2.style.pointerEvents = normOut2 > 0.4 ? 'none' : 'auto';
                } else {
                    // Fully active centered
                    s2.style.display = 'flex';
                    s2.style.zIndex = '20';
                    s2.style.opacity = '1';
                    s2.style.transform = 'translate3d(0, 0, 0)';
                    s2.style.boxShadow = 'none';
                    s2.style.filter = 'none';
                    s2.style.pointerEvents = 'auto';
                }

                // Video container expands smoothly over a LONGER scroll distance (p: 2.85 -> 4.15)
                const expandNorm = Math.min(1, Math.max(0, (p - 2.85) / 1.30));
                const easeExpand = expandNorm * expandNorm * (3 - 2 * expandNorm);
                const videoScale = 0.86 + (0.14 * easeExpand);
                if (expandingBox) {
                    expandingBox.style.transform = `scale(${videoScale.toFixed(3)})`;
                }

                // Sound button reveals when full size
                const controlsRevealed = expandNorm >= 0.85;
                if (soundBtn) {
                    if (controlsRevealed) {
                        soundBtn.style.opacity = '1';
                        soundBtn.style.pointerEvents = 'auto';
                        soundBtn.style.transform = 'translateY(0)';
                    } else {
                        soundBtn.style.opacity = '0';
                        soundBtn.style.pointerEvents = 'none';
                        soundBtn.style.transform = 'translateY(12px)';
                    }
                }

                // Auto-play video
                if (p >= 2.85 && p <= 4.25) {
                    if (sv && sv.paused && !sv.ended && !this._shuzoEnded) {
                        sv.play().catch(() => {});
                    }
                }
            } else {
                s2.style.display = 'none';
                s2.style.zIndex = '1';
                s2.style.opacity = '0';
                s2.style.pointerEvents = 'none';

                if (sv && !sv.paused) {
                    sv.pause();
                }
            }
        }

        // -------------------------------------------------------------
        // SCENE 3: PHYSIOLOGICAL SIGH (Nature Video) (4.25 -> 5.75)
        // -------------------------------------------------------------
        if (s3) {
            const nv = document.getElementById('natureVideoPlayer');
            const natureExpandingBox = document.getElementById('natureExpandingBox');
            const natureSoundBtn = document.getElementById('natureSoundBtn');

            if (p >= 4.25 && p <= 5.75) {
                if (p < 4.70) {
                    // Glides IN from the RIGHT to the LEFT into center
                    const norm3In = Math.min(1, Math.max(0, (p - 4.25) / 0.45));
                    const easeIn3 = norm3In * norm3In * (3 - 2 * norm3In);
                    const txPct3In = (1 - easeIn3) * 100; // +100% -> 0%
                    s3.style.display = 'flex';
                    s3.style.zIndex = '20';
                    s3.style.opacity = '1';
                    s3.style.transform = `translate3d(${txPct3In.toFixed(2)}%, 0, 0)`;
                    s3.style.boxShadow = (norm3In > 0.02 && norm3In < 0.98) ? '-12px 0 35px rgba(0, 0, 0, 0.4)' : 'none';
                    s3.style.filter = 'none';
                    s3.style.pointerEvents = norm3In > 0.7 ? 'auto' : 'none';
                } else if (p > 5.35) {
                    // Pure normal vertical scroll upward out of view
                    const scrollNorm = Math.min(1, Math.max(0, (p - 5.35) / 0.60));
                    const sceneTy = -scrollNorm * 100;
                    s3.style.display = 'flex';
                    s3.style.zIndex = '10';
                    s3.style.opacity = '1';
                    s3.style.transform = `translate3d(0, ${sceneTy.toFixed(2)}%, 0)`;
                    s3.style.boxShadow = 'none';
                    s3.style.filter = 'none';
                    s3.style.pointerEvents = (p <= 5.50) ? 'auto' : 'none';
                } else {
                    // Fully active centered
                    s3.style.display = 'flex';
                    s3.style.zIndex = '20';
                    s3.style.opacity = '1';
                    s3.style.transform = 'translate3d(0, 0, 0)';
                    s3.style.boxShadow = 'none';
                    s3.style.filter = 'none';
                    s3.style.pointerEvents = 'auto';
                }
                s3.style.filter = 'none';

                // Video container expands smoothly
                const expandNorm = Math.min(1, Math.max(0, (p - 4.40) / 0.40));
                const easeExpand = expandNorm * expandNorm * (3 - 2 * expandNorm);
                const videoScale = 0.92 + (0.08 * easeExpand);
                if (natureExpandingBox) {
                    natureExpandingBox.style.transform = `scale(${videoScale.toFixed(3)})`;
                }

                if (natureSoundBtn) {
                    if (p >= 4.70 && p <= 5.40) {
                        natureSoundBtn.style.opacity = '1';
                        natureSoundBtn.style.pointerEvents = 'auto';
                        natureSoundBtn.style.transform = 'translateY(0)';
                    } else {
                        natureSoundBtn.style.opacity = '0';
                        natureSoundBtn.style.pointerEvents = 'none';
                        natureSoundBtn.style.transform = 'translateY(12px)';
                    }
                }

                if (nv) {
                    if (!nv._recoveryHooked) {
                        nv._recoveryHooked = true;
                        nv.addEventListener('error', () => {
                            console.warn('Nature video error, switching video...');
                            nv._playPending = false;
                            setTimeout(() => {
                                if (window.nobsProduxScrollytelling) {
                                    window.nobsProduxScrollytelling.switchNatureVideo();
                                }
                            }, 500);
                        });
                        nv.addEventListener('ended', () => {
                            if (window.nobsProduxScrollytelling) {
                                window.nobsProduxScrollytelling.switchNatureVideo();
                            }
                        });
                    }

                    if (p > 5.35) {
                        nv.muted = true;
                        nv.volume = 0;
                    } else {
                        nv.muted = this._natureMuted;
                        nv.volume = this._natureMuted ? 0 : 0.35;
                    }

                    if (nv.paused && !nv._playPending && p <= 5.45) {
                        nv._playPending = true;
                        if (nv.readyState === 0) nv.load();
                        const pPromise = nv.play();
                        if (pPromise !== undefined) {
                            pPromise.then(() => { nv._playPending = false; }).catch(() => { nv._playPending = false; });
                        } else {
                            nv._playPending = false;
                        }
                    }
                }

                // CRITICAL USER REQUIREMENT: Play guided breathing audio ONLY when fully in Scene 3 (p >= 4.70 && p <= 5.35)
                if (p >= 4.70 && p <= 5.35) {
                    if (!this._breathingEnded) {
                        const ba = document.getElementById('breathingAudioPlayer');
                        if (!this._breathingPlaying || (ba && ba.paused)) {
                            this.playBreathingAudio();
                        }
                    }
                } else {
                    if (this._breathingPlaying) {
                        this.pauseBreathingAudio();
                    } else {
                        const ba = document.getElementById('breathingAudioPlayer');
                        if (ba && !ba.paused) ba.pause();
                    }
                }

                // Sync on-screen breath status, countdown timer, and captions with audio in real time
                const baLive = document.getElementById('breathingAudioPlayer') || this._breathingAudio;
                if (baLive) {
                    this.syncBreathingText(baLive.currentTime);
                }
            } else {
                s3.style.display = 'none';
                s3.style.opacity = '0';
                s3.style.pointerEvents = 'none';

                if (natureSoundBtn) {
                    natureSoundBtn.style.opacity = '0';
                    natureSoundBtn.style.pointerEvents = 'none';
                    natureSoundBtn.style.transform = 'translateY(12px)';
                }

                if (nv && !nv.paused) nv.pause();
                if (this._breathingPlaying) {
                    this.pauseBreathingAudio();
                } else {
                    const ba = document.getElementById('breathingAudioPlayer');
                    if (ba && !ba.paused) ba.pause();
                }
            }
        }

        // -------------------------------------------------------------
        // SCENE 4: VICTORY LOCK & ACTIONS (5.35 -> 6.00)
        // -------------------------------------------------------------
        if (s4) {
            if (p >= 5.35) {
                // Pure normal vertical scroll in from bottom directly connected to Scene 3
                const scrollNorm = Math.min(1, Math.max(0, (p - 5.35) / 0.60));
                const tyPct = (1 - scrollNorm) * 100; // percentage: 100% -> 0%
                s4.style.display = 'flex';
                s4.style.zIndex = '25';
                s4.style.opacity = '1';
                s4.style.transform = `translate3d(0, ${tyPct.toFixed(2)}%, 0)`;
                s4.style.filter = 'none';
                s4.style.pointerEvents = scrollNorm >= 0.5 ? 'auto' : 'none';

                if (p >= 5.85 && !this.confettiFired) {
                    this.confettiFired = true;
                    if (window.nobsConfetti) window.nobsConfetti.launch();
                    if (window.nobsAudio) window.nobsAudio.playVictorySound();
                }
            } else {
                s4.style.display = 'none';
                s4.style.zIndex = '1';
                s4.style.opacity = '0';
                s4.style.pointerEvents = 'none';
                if (p < 5.30) {
                    this.confettiFired = false;
                }
            }
        }
    },

    updateCardHover: function () {
        const track = document.getElementById('produxDiagonalTrack');
        if (!track) return;
        const cards = track.querySelectorAll('.produx-diagonal-card');
        if (!cards || cards.length === 0) return;

        let cardUnderCursor = null;
        if (this._mouseX !== undefined && this._mouseY !== undefined) {
            const el = document.elementFromPoint(this._mouseX, this._mouseY);
            if (el) {
                cardUnderCursor = el.closest('.produx-diagonal-card');
            }
        }

        if (cardUnderCursor) {
            track.classList.add('has-hover');
            for (let i = 0; i < cards.length; i++) {
                if (cards[i] === cardUnderCursor) {
                    cards[i].classList.add('is-hovered');
                } else {
                    cards[i].classList.remove('is-hovered');
                }
            }
        } else {
            track.classList.remove('has-hover');
            for (let i = 0; i < cards.length; i++) {
                cards[i].classList.remove('is-hovered');
            }
        }
    },

    clearCardHover: function () {
        const track = document.getElementById('produxDiagonalTrack');
        if (track) {
            track.classList.remove('has-hover');
            const cards = track.querySelectorAll('.produx-diagonal-card');
            for (let i = 0; i < cards.length; i++) {
                cards[i].classList.remove('is-hovered');
            }
        }
    },

    destroy: function () {
        this.active = false;
        this.targetProgress = 0.0;
        this.currentProgress = 0.0;
        this.clearCardHover();
        this._breathingPlaying = false;
        this._breathingEnded = false;
        const bg = document.getElementById('urgeBgMusic');
        if (bg) {
            bg.pause();
            bg.currentTime = 0;
        }
        const sv = document.getElementById('shuzoVideoPlayer');
        if (sv) {
            if (!sv.paused) sv.pause();
            sv.muted = true;
        }
        const nv = document.getElementById('natureVideoPlayer');
        if (nv) {
            if (!nv.paused) nv.pause();
            nv.muted = true;
        }
        if (this._breathingAudio) {
            this._breathingAudio.pause();
            this._breathingAudio.currentTime = 0;
        }
        const domBa = document.getElementById('breathingAudioPlayer');
        if (domBa) {
            domBa.pause();
            domBa.currentTime = 0;
        }
        this.syncBreathingText(0);
        const sections = document.querySelectorAll('.spotify-data-section');
        sections.forEach(s => s.classList.remove('in-view'));
        const ma = document.getElementById('mountainAmbienceAudio');
        if (ma) { ma.pause(); ma.currentTime = 0; }
        const wa = document.getElementById('waterWavesAudio');
        if (wa) { wa.pause(); wa.currentTime = 0; }
        if (window.nobsAudio) {
            window.nobsAudio.stopMountainWindAmbience();
            window.nobsAudio.stopOceanWaveAmbience();
        }
    }
};

// Global Event Listeners attached once on window:
(function () {
    // User gesture audio unlock for Scene 3 (ONLY when fully in Scene 3)
    window.addEventListener('pointerdown', function (e) {
        if (!window.nobsProduxScrollytelling || !window.nobsProduxScrollytelling.isModalOpen()) return;
        const p = window.nobsProduxScrollytelling.currentProgress;
        if (p >= 4.70 && p <= 5.35) {
            if (!window.nobsProduxScrollytelling._breathingEnded) {
                const ba = document.getElementById('breathingAudioPlayer');
                if (ba && ba.paused) {
                    window.nobsProduxScrollytelling.playBreathingAudio();
                }
            }
            const nv = document.getElementById('natureVideoPlayer');
            if (nv && nv.paused && !nv._playPending) {
                nv._playPending = true;
                nv.play().then(() => { nv._playPending = false; }).catch(() => { nv._playPending = false; });
            }
        }
    }, { passive: true });
    window.addEventListener('wheel', function (e) {
        if (window.nobsProduxScrollytelling && window.nobsProduxScrollytelling.isModalOpen()) {
            window.nobsProduxScrollytelling.onWheel(e);
        }
    }, { passive: false });

    window.addEventListener('touchstart', function (e) {
        if (window.nobsProduxScrollytelling && window.nobsProduxScrollytelling.isModalOpen()) {
            window.nobsProduxScrollytelling.onTouchStart(e);
        }
    }, { passive: true });

    window.addEventListener('touchmove', function (e) {
        if (window.nobsProduxScrollytelling && window.nobsProduxScrollytelling.isModalOpen()) {
            window.nobsProduxScrollytelling.onTouchMove(e);
        }
    }, { passive: false });

    window.addEventListener('keydown', function (e) {
        if (window.nobsProduxScrollytelling && window.nobsProduxScrollytelling.isModalOpen()) {
            window.nobsProduxScrollytelling.onKeyDown(e);
        }
    });

    // Pointer Tracking for Hit-Testing & Card Hover Spotlight Blur
    window.addEventListener('pointermove', function (e) {
        if (window.nobsProduxScrollytelling && window.nobsProduxScrollytelling.isModalOpen()) {
            window.nobsProduxScrollytelling._mouseX = e.clientX;
            window.nobsProduxScrollytelling._mouseY = e.clientY;
            window.nobsProduxScrollytelling.updateCardHover();
        }
    }, { passive: true });

    window.addEventListener('pointerdown', function (e) {
        if (window.nobsProduxScrollytelling && window.nobsProduxScrollytelling.isModalOpen()) {
            window.nobsProduxScrollytelling._mouseX = e.clientX;
            window.nobsProduxScrollytelling._mouseY = e.clientY;
            window.nobsProduxScrollytelling.updateCardHover();
        }
    }, { passive: true });

    window.addEventListener('mouseleave', function () {
        if (window.nobsProduxScrollytelling) {
            window.nobsProduxScrollytelling._mouseX = undefined;
            window.nobsProduxScrollytelling._mouseY = undefined;
            window.nobsProduxScrollytelling.clearCardHover();
        }
    }, { passive: true });

    // Auto-detect modal insertion in DOM
    if (typeof MutationObserver !== 'undefined' && document.body) {
        const obs = new MutationObserver(function () {
            if (window.nobsProduxScrollytelling) {
                if (window.nobsProduxScrollytelling.isModalOpen()) {
                    if (!window.nobsProduxScrollytelling.active) {
                        window.nobsProduxScrollytelling.init();
                    }
                } else {
                    if (window.nobsProduxScrollytelling.active) {
                        window.nobsProduxScrollytelling.destroy();
                    }
                }
            }
        });
        obs.observe(document.body, { childList: true, subtree: true });
    }
})();
