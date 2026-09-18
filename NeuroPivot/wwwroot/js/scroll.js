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
        "text": "So I looked at all the things that can raise your heart rate variability, and I started doing this breathing technique specifically for heart rate variability, and it went up."
    },
    {
        "start": 5.5,
        "end": 10.5,
        "label": "HRV PROTOCOL INTRO",
        "phase": "intro",
        "text": "Awesome. So it's... Great. tested. Great. Let's do it together."
    },
    {
        "start": 10.5,
        "end": 19.5,
        "label": "HRV PROTOCOL INTRO",
        "phase": "intro",
        "text": "It'll say, 'Take a deep breath,' and then you'll hear the sound... if you follow me for the first inhale and exhale, you'll know what sound means what."
    },
    {
        "start": 19.5,
        "end": 24.2,
        "label": "CLOSE YOUR EYES",
        "phase": "intro",
        "text": "And you do this eyes closed, typically? â€” I do it eyes closed. Okay, we'll close our eyes."
    },
    {
        "start": 24.2,
        "end": 29.4,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 1,
        "total": 30,
        "text": " [Inhale Chime] Guided Deep Inhale with Rick & guide..."
    },
    {
        "start": 29.4,
        "end": 35.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 1,
        "total": 30,
        "text": " [Exhale Chime] Smooth, complete exhale with the guide..."
    },
    {
        "start": 35.2,
        "end": 40.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 2,
        "total": 30,
        "text": " [Inhale Chime] Smooth inhalation through nose..."
    },
    {
        "start": 40.5,
        "end": 46.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 2,
        "total": 30,
        "text": " [Exhale Chime] Gentle, unforced release..."
    },
    {
        "start": 46.2,
        "end": 51.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 3,
        "total": 30,
        "text": " [Inhale Chime] Deep diaphragmatic breath..."
    },
    {
        "start": 51.5,
        "end": 57.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 3,
        "total": 30,
        "text": " [Exhale Chime] Relaxing shoulders and jaw..."
    },
    {
        "start": 57.2,
        "end": 62.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 4,
        "total": 30,
        "text": " [Inhale Chime] Filling lower lungs with air..."
    },
    {
        "start": 62.5,
        "end": 68.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 4,
        "total": 30,
        "text": " [Exhale Chime] Smooth, slow exhale..."
    },
    {
        "start": 68.2,
        "end": 73.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 5,
        "total": 30,
        "text": " [Inhale Chime] Expanding ribcage gently..."
    },
    {
        "start": 73.5,
        "end": 79.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 5,
        "total": 30,
        "text": " [Exhale Chime] Releasing all physical tension..."
    },
    {
        "start": 79.2,
        "end": 84.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 6,
        "total": 30,
        "text": " [Inhale Chime] Calm, steady nasal inhalation..."
    },
    {
        "start": 84.5,
        "end": 90.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 6,
        "total": 30,
        "text": " [Exhale Chime] Letting go of urge friction..."
    },
    {
        "start": 90.2,
        "end": 95.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 7,
        "total": 30,
        "text": " [Inhale Chime] Centering awareness on heart..."
    },
    {
        "start": 95.5,
        "end": 101.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 7,
        "total": 30,
        "text": " [Exhale Chime] Long, calm release through nose..."
    },
    {
        "start": 101.2,
        "end": 106.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 8,
        "total": 30,
        "text": "[Inhale Chime] Synchronizing heart rate variability..."
    },
    {
        "start": 106.5,
        "end": 111.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 8,
        "total": 30,
        "text": " [Exhale Chime] Deep parasympathetic tone..."
    },
    {
        "start": 111.2,
        "end": 117.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 9,
        "total": 30,
        "text": "[Inhale Chime] Smooth rhythm in and out..."
    },
    {
        "start": 117.5,
        "end": 123.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 9,
        "total": 30,
        "text": " [Exhale Chime] Complete, effortless release..."
    },
    {
        "start": 123.2,
        "end": 128.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 10,
        "total": 30,
        "text": " [Inhale Chime] Pure resonant frequency breath..."
    },
    {
        "start": 128.5,
        "end": 134.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 10,
        "total": 30,
        "text": " [Exhale Chime] Emptying lungs completely..."
    },
    {
        "start": 134.2,
        "end": 139.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 11,
        "total": 30,
        "text": " [Inhale Chime] Slow and effortless airflow..."
    },
    {
        "start": 139.5,
        "end": 145.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 11,
        "total": 30,
        "text": " [Exhale Chime] Body settling into profound stillness..."
    },
    {
        "start": 145.2,
        "end": 150.2,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 12,
        "total": 30,
        "text": " [Inhale Chime] Vagal nerve stimulation active..."
    },
    {
        "start": 150.2,
        "end": 156.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 12,
        "total": 30,
        "text": " [Exhale Chime] Releasing stress and resistance..."
    },
    {
        "start": 156.2,
        "end": 160.6,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 13,
        "total": 30,
        "text": " [Inhale Chime] Expanding chest softly..."
    },
    {
        "start": 160.6,
        "end": 167.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 13,
        "total": 30,
        "text": " [Exhale Chime] Smooth airflow out..."
    },
    {
        "start": 167.2,
        "end": 171.4,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 14,
        "total": 30,
        "text": " [Inhale Chime] Steady breath, peaceful mind..."
    },
    {
        "start": 171.4,
        "end": 177.6,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 14,
        "total": 30,
        "text": " [Exhale Chime] Slowing heart rhythm naturally..."
    },
    {
        "start": 177.6,
        "end": 183.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 15,
        "total": 30,
        "text": " [Inhale Chime] Down-regulating nervous system..."
    },
    {
        "start": 183.5,
        "end": 189.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 15,
        "total": 30,
        "text": " [Exhale Chime] Letting tension dissolve..."
    },
    {
        "start": 189.2,
        "end": 194.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 16,
        "total": 30,
        "text": " [Inhale Chime] Deep soothing inspiration..."
    },
    {
        "start": 194.5,
        "end": 200.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 16,
        "total": 30,
        "text": " [Exhale Chime] Deep peace settling in..."
    },
    {
        "start": 200.2,
        "end": 205.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 17,
        "total": 30,
        "text": " [Inhale Chime] Steady parasympathetic flow..."
    },
    {
        "start": 205.5,
        "end": 211.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 17,
        "total": 30,
        "text": " [Exhale Chime] Quiet exhale with chime..."
    },
    {
        "start": 211.2,
        "end": 216.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 18,
        "total": 30,
        "text": " [Inhale Chime] Nourishing heart and brain..."
    },
    {
        "start": 216.5,
        "end": 222.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 18,
        "total": 30,
        "text": "[Exhale Chime] Resting in autonomic coherence..."
    },
    {
        "start": 222.2,
        "end": 227.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 19,
        "total": 30,
        "text": "[Inhale Chime] Smooth inhalation with chime..."
    },
    {
        "start": 227.5,
        "end": 233.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 19,
        "total": 30,
        "text": "[Exhale Chime] Gentle, quiet airflow out..."
    },
    {
        "start": 233.2,
        "end": 238.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 20,
        "total": 30,
        "text": " [Inhale Chime] Harmonizing cardiac rhythm..."
    },
    {
        "start": 238.5,
        "end": 244.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 20,
        "total": 30,
        "text": " [Exhale Chime] Softening belly and face..."
    },
    {
        "start": 244.2,
        "end": 249.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 21,
        "total": 30,
        "text": " [Inhale Chime] Unforced, gentle intake..."
    },
    {
        "start": 249.5,
        "end": 255.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 21,
        "total": 30,
        "text": " [Exhale Chime] Smooth release..."
    },
    {
        "start": 255.2,
        "end": 260.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 22,
        "total": 30,
        "text": " [Inhale Chime] Clarity and calmness expanding..."
    },
    {
        "start": 260.5,
        "end": 266.1,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 22,
        "total": 30,
        "text": " [Exhale Chime] Sinking into grounded stillness..."
    },
    {
        "start": 266.1,
        "end": 271.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 23,
        "total": 30,
        "text": " [Inhale Chime] Soft, even breath..."
    },
    {
        "start": 271.5,
        "end": 277.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 23,
        "total": 30,
        "text": " [Exhale Chime] Nervous system fully stabilized..."
    },
    {
        "start": 277.2,
        "end": 282.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 24,
        "total": 30,
        "text": " [Inhale Chime] Deep resonance..."
    },
    {
        "start": 282.5,
        "end": 288.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 24,
        "total": 30,
        "text": " [Exhale Chime] Effortless relaxation..."
    },
    {
        "start": 288.2,
        "end": 293.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 25,
        "total": 30,
        "text": " [Inhale Chime] Effortless nasal airflow..."
    },
    {
        "start": 293.5,
        "end": 299.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 25,
        "total": 30,
        "text": " [Exhale Chime] Gentle release of tension..."
    },
    {
        "start": 299.2,
        "end": 304.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 26,
        "total": 30,
        "text": "[Inhale Chime] Entering deep coherence state..."
    },
    {
        "start": 304.5,
        "end": 310.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 26,
        "total": 30,
        "text": " [Exhale Chime] Quiet and steady exhale..."
    },
    {
        "start": 310.2,
        "end": 315.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 27,
        "total": 30,
        "text": " [Inhale Chime] Smooth and peaceful breath..."
    },
    {
        "start": 315.5,
        "end": 321.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 27,
        "total": 30,
        "text": " [Exhale Chime] Smooth surrender of tension..."
    },
    {
        "start": 321.2,
        "end": 326.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 28,
        "total": 30,
        "text": " [Inhale Chime] Steady rhythm anchoring you..."
    },
    {
        "start": 326.5,
        "end": 332.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 28,
        "total": 30,
        "text": " [Exhale Chime] Calm, complete release..."
    },
    {
        "start": 332.2,
        "end": 337.5,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 29,
        "total": 30,
        "text": " [Inhale Chime] Smooth deep breath..."
    },
    {
        "start": 337.5,
        "end": 343.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 29,
        "total": 30,
        "text": " [Exhale Chime] Smooth and steady release..."
    },
    {
        "start": 343.2,
        "end": 348.6,
        "label": "INHALE THROUGH NOSE",
        "phase": "inhale",
        "breath": 30,
        "total": 30,
        "text": "[Inhale Chime] Penultimate deep inhale..."
    },
    {
        "start": 348.6,
        "end": 354.2,
        "label": "SLOW SMOOTH EXHALE",
        "phase": "exhale",
        "breath": 30,
        "total": 30,
        "text": " [Exhale Chime] Penultimate smooth exhale..."
    },
    {
        "start": 354.2,
        "end": 359.5,
        "label": "5-MIN COHERENCE COMPLETE",
        "phase": "complete",
        "text": " That was five minutes. I like that. Feels nice, doesn't it? Yeah."
    },
    {
        "start": 359.5,
        "end": 372,
        "label": "5-MIN COHERENCE COMPLETE",
        "phase": "complete",
        "text": " I noticed I don't spontaneously breathe at that cadence. I breathe quite a bit faster. Mhm. So especially on the exhale."
    },
    {
        "start": 372,
        "end": 379,
        "label": "5-MIN COHERENCE COMPLETE",
        "phase": "complete",
        "text": "So once I got into a rhythm of it, yeah, the mind just goes pseudo random for me. What about for you?"
    },
    {
        "start": 379,
        "end": 387,
        "label": "5-MIN COHERENCE COMPLETE",
        "phase": "complete",
        "text": ""
    },
    {
        "start": 387,
        "end": 397.5,
        "label": "5-MIN COHERENCE COMPLETE",
        "phase": "complete",
        "text": ""
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
    victorySoundFired: false,
    active: false,
    _touchStartY: 0,

    _shuzoEnded: false,
    _affectAcknowledged: false,
    _breathingAudio: null,
    _breathingPlaying: false,
    _breathingEnded: false,
    _breathingStarted: false,
    _breathingGateUnlocked: false,
    _dotNetHelper: null,
    _natureMuted: true,
    _natureVideos: ['videos/nature_wildlife.mp4', 'videos/water_beach_video.mp4'],
    _natureIndex: 0,
    _lastNatureSwitchTime: 0,

    unlockAffectGate: function () {
        this._affectAcknowledged = true;
    },

    setDotNetHelper: function (helper) {
        this._dotNetHelper = helper;
    },

    toggleShuzoPlay: function () {
        const sv = document.getElementById('shuzoVideoPlayer');
        if (!sv) return;
        if (sv.ended || (sv.duration && sv.currentTime >= sv.duration - 0.25) || this._shuzoEnded) {
            this.replayShuzo();
        } else if (sv.paused) {
            this._shuzoEnded = false;
            const p = sv.play();
            if (p !== undefined) p.catch(() => {});
            const btn = document.getElementById('shuzoPlayCenterBtn');
            if (btn) btn.classList.remove('visible');
        } else {
            sv.pause();
            const btn = document.getElementById('shuzoPlayCenterBtn');
            if (btn) btn.classList.add('visible');
        }
    },

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
            btn.classList.remove('visible');
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
                timerEl.textContent = '5:00';
            } else if (entry.phase === 'intro') {
                const secsToStart = Math.max(1, Math.ceil(24.2 - t));
                timerEl.textContent = secsToStart > 0 ? (secsToStart <= 9 ? `0:0${secsToStart}` : `0:${secsToStart}`) : '0:01';
            } else {
                const secsRemaining = Math.max(1, Math.ceil(entry.end - t));
                timerEl.textContent = secsRemaining + 's';
            }
        }

        if (pillEl) {
            const currentPhase = pillEl.getAttribute('data-active-phase');
            if (currentPhase !== entry.phase) {
                pillEl.setAttribute('data-active-phase', entry.phase);
                pillEl.classList.remove('inhale-deep', 'exhale-long', 'intro-listen', 'prepare-phase', 'phase-complete');
                if (entry.phase === 'inhale') pillEl.classList.add('inhale-deep');
                else if (entry.phase === 'exhale') pillEl.classList.add('exhale-long');
                else if (entry.phase === 'intro') pillEl.classList.add('intro-listen');
                else if (entry.phase === 'prepare') pillEl.classList.add('prepare-phase');
                else if (entry.phase === 'complete') pillEl.classList.add('phase-complete');
            }
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

        // 90-Second Clinically-Gated Urge Surfing Progress Calculation
        // Acute dopamine craving peaks within 90s. We measure active breathing time from start.
        const gateTargetSeconds = 90.0;
        const gateFillEl = document.getElementById('breathGateFill');
        const gateTimeEl = document.getElementById('breathGateTime');
        const gateBadgeEl = document.getElementById('exitGateBadge');
        const exitGridEl = document.getElementById('exitActionsGrid');

        const activeElapsed = Math.max(0, Math.min(gateTargetSeconds, t));
        const gatePct = Math.min(100, Math.max(0, (activeElapsed / gateTargetSeconds) * 100));

        if (gateFillEl) {
            gateFillEl.style.width = `${gatePct.toFixed(1)}%`;
        }

        if (gateTimeEl) {
            if (t >= gateTargetSeconds) {
                gateTimeEl.textContent = '90s / 90s ✓';
                gateTimeEl.style.color = '#7FB7BE';
            } else {
                gateTimeEl.textContent = `${Math.floor(t)}/90s`;
                gateTimeEl.style.color = '';
            }
        }

        if (t >= gateTargetSeconds && !this._breathingGateUnlocked) {
            this._breathingGateUnlocked = true;
            if (gateBadgeEl) {
                gateBadgeEl.classList.remove('is-locked');
                gateBadgeEl.classList.add('is-unlocked');
                gateBadgeEl.textContent = '✓ 90s Surfed — Actions Ready';
            }
            if (exitGridEl) {
                exitGridEl.classList.remove('is-gated');
                const btns = exitGridEl.querySelectorAll('.exit-action-btn');
                btns.forEach(b => b.removeAttribute('disabled'));
            }
            if (this._dotNetHelper) {
                try {
                    this._dotNetHelper.invokeMethodAsync('UnlockBreathingGate');
                } catch (e) { }
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
        if (!this._breathingAudio) {
            this._breathingAudio = new Audio();
            this._breathingAudio.loop = false;
            this._breathingAudio.muted = false;
            this._breathingAudio.volume = 0.85;
            this._breathingAudio.preload = 'auto';

            // --- FETCH INTO BROWSER RAM AS A BLOB ---
            fetch('sounds/breathing_exercise.mp3')
                .then(response => response.blob())
                .then(blob => {
                    const blobUrl = URL.createObjectURL(blob);
                    if (this._breathingAudio) {
                        this._breathingAudio.src = blobUrl;
                    }
                })
                .catch(err => {
                    console.error('Failed to load breathing_exercise into memory, falling back to direct URL:', err);
                    if (this._breathingAudio) {
                        this._breathingAudio.src = 'sounds/breathing_exercise.mp3';
                    }
                });
            // ----------------------------------------

            if (!this._breathingAudio._timelineHooked) {
                this._breathingAudio._timelineHooked = true;
                const onTime = () => {
                    if (this._breathingAudio) {
                        this.syncBreathingText(this._breathingAudio.currentTime);
                    }
                };
                this._breathingAudio.addEventListener('timeupdate', onTime);
                this._breathingAudio.addEventListener('seeking', onTime);
                this._breathingAudio.addEventListener('play', () => {
                    this._breathingPlaying = true;
                    if (this._breathingAudio) {
                        this.syncBreathingText(this._breathingAudio.currentTime);
                    }
                });
                this._breathingAudio.addEventListener('pause', () => {
                    this._breathingPlaying = false;
                });
                this._breathingAudio.addEventListener('ended', () => {
                    this._breathingPlaying = false;
                    this._breathingEnded = true;
                    this._breathingHasPlayedOnce = true;
                    this._breathingGateUnlocked = true;
                    if (this._breathingAudio) {
                        this.syncBreathingText(this._breathingAudio.duration || 397.5);
                    }
                });
            }
        }
        return this._breathingAudio;
    },

    playBreathingAudio: function () {
        if (this._breathingEnded) return;
        const audio = this.getBreathingAudio();
        if (audio) {
            if (!audio.paused || audio._playPending) {
                this._breathingPlaying = true;
                return;
            }
            audio.volume = 0.85;
            audio.muted = false;
            audio.loop = false;
            audio._playPending = true;
            this._breathingPlaying = true;
            const p = audio.play();
            if (p !== undefined) {
                p.then(() => {
                    audio._playPending = false;
                }).catch((err) => {
                    console.warn('Breathing audio play error:', err);
                    audio._playPending = false;
                    this._breathingPlaying = false;
                    const retryPlay = () => {
                        window.removeEventListener('click', retryPlay);
                        window.removeEventListener('keydown', retryPlay);
                        if (this.currentProgress >= 7.50 && this.currentProgress <= 9.10 && !this._breathingEnded) {
                            this.playBreathingAudio();
                        }
                    };
                    window.addEventListener('click', retryPlay, { once: true });
                    window.addEventListener('keydown', retryPlay, { once: true });
                });
            } else {
                audio._playPending = false;
            }
        }
    },

    pauseBreathingAudio: function () {
        this._breathingPlaying = false;
        const audio = this.getBreathingAudio();
        if (audio && !audio.paused && !audio._playPending) {
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

    toggleCallMyNameSound: function (isMuted) {
        if (this._callMyNameDismissed) return;
        if (typeof isMuted === 'boolean') {
            this._callMyNameMuted = isMuted;
        } else {
            this._callMyNameMuted = !this._callMyNameMuted;
        }
        const audio = this.getCallMyNameAudio();
        if (!audio) return;

        if (this._callMyNameMuted) {
            // Mute: fade out and pause
            if (this._callMyNameFadeTimer) clearInterval(this._callMyNameFadeTimer);
            this._callMyNameFadeTimer = setInterval(() => {
                if (audio.volume > 0.04) {
                    audio.volume = Math.max(0, audio.volume - 0.035);
                } else {
                    audio.volume = 0;
                    if (!audio.paused && !audio._playPending) audio.pause();
                    clearInterval(this._callMyNameFadeTimer);
                    this._callMyNameFadeTimer = null;
                }
            }, 40);
        } else {
            // Unmute: ONLY start playing if currently inside the Anchor section
            const p = this.currentProgress;
            if (p < 3.20 || p > 5.45) return; // Not in section — do nothing

            // Silence background music
            const bg = document.getElementById('urgeBgMusic');
            if (bg && !bg.paused) { bg.volume = 0; bg.pause(); }

            // Allow replay if song already ended
            // if (this._callMyNameEnded) {
            //     audio.currentTime = 0;
            //     this._callMyNameEnded = false;
            // }

            // Fire play() ONCE, with fade-in
            if (this._callMyNameFadeTimer) clearInterval(this._callMyNameFadeTimer);
            audio.volume = 0;
            if (audio.paused && !audio._playPending) {
                audio._playPending = true;
                const pp = audio.play();
                if (pp !== undefined) {
                    pp.then(() => { audio._playPending = false; })
                      .catch(() => { audio._playPending = false; });
                } else {
                    audio._playPending = false;
                }
            }
            this._callMyNameFadeTimer = setInterval(() => {
                if (audio.volume < 0.47) {
                    audio.volume = Math.min(0.50, audio.volume + 0.035);
                } else {
                    audio.volume = 0.50;
                    clearInterval(this._callMyNameFadeTimer);
                    this._callMyNameFadeTimer = null;
                }
            }, 40);
        }
    },

    getCallMyNameAudio: function () {
        if (!this._callMyNameAudio) {
            // this._callMyNameAudio = new Audio('sounds/call_my_name.mp3');
            // this._callMyNameAudio.preload = 'auto';
            // this._callMyNameAudio.loop = false;
            // this._callMyNameAudio.volume = 0;   // starts silent; toggled by button

            // this._callMyNameAudio.addEventListener('ended', () => {
            //     this._callMyNameEnded = true;
            //     this._callMyNameAudio._hasPlayedOnce = true;
            //     this._callMyNameAudio._playPending = false;
            // });
            this._callMyNameAudio = new Audio();
            this._callMyNameAudio.preload = 'auto';
            this._callMyNameAudio.loop = false;
            this._callMyNameAudio.volume = 0;

            // Fetch the entire audio file into memory as a Blob
            fetch('sounds/call_my_name.mp3')
                .then(response => response.blob())
                .then(blob => {
                    const blobUrl = URL.createObjectURL(blob);
                    if (this._callMyNameAudio) {
                        this._callMyNameAudio.src = blobUrl;
                    }
                })
                .catch(err => {
                    console.error('Failed to load call_my_name into memory, falling back to direct URL:', err);
                    if (this._callMyNameAudio) {
                        this._callMyNameAudio.src = 'sounds/call_my_name.mp3';
                    }
                });

            this._callMyNameAudio.addEventListener('ended', () => {
                this._callMyNameEnded = true;
                this._callMyNameAudio._hasPlayedOnce = true;
                this._callMyNameAudio._playPending = false;
            });

        }
        return this._callMyNameAudio;
    },

    setupLoopingVideo: function (v) {
        if (!v || v._loopHooked) return;
        v._loopHooked = true;
        v.muted = true;
        v.loop = true;
        v.playsInline = true;
        v.disablePictureInPicture = true;
        v.disableRemotePlayback = true;
        v.addEventListener('pause', () => {
            if (this.active && this.currentProgress <= 2.4 && v.paused && !v._playPending) {
                this.safePlayVideo(v);
            }
        });
    },

    safePlayVideo: function (v) {
        if (!v) return;
        this.setupLoopingVideo(v);
        v.muted = true;
        v.disablePictureInPicture = true;
        v.disableRemotePlayback = true;
        if (v.paused && !v._playPending) {
            v._playPending = true;
            if (v.networkState === HTMLMediaElement.NETWORK_EMPTY) v.load();
            const p = v.play();
            if (p !== undefined) {
                p.then(() => {
                    v._playPending = false;
                }).catch(() => {
                    v._playPending = false;
                });
            } else {
                v._playPending = false;
            }
        }
    },

    init: function (forceReset, hasPhotos) {
        if (typeof hasPhotos === 'boolean') {
            this._hasAnchorPhotos = hasPhotos;
        } else {
            const deck = document.getElementById('anchorCardDeck');
            const existingPhotoImgs = deck ? deck.querySelectorAll('.anchor-photo-img') : [];
            this._hasAnchorPhotos = existingPhotoImgs.length > 0;
        }

        if (this.active) {
            // Modal is already active and running (e.g. Blazor re-render or lifecycle event).
            // NEVER reset audio currentTime, gate timers, or progress mid-session!
            this.render(this.currentProgress);
            return;
        }
        if (forceReset || !this.active) {
            this.targetProgress = 0.0;
            this.currentProgress = 0.0;
            this.victorySoundFired = false;
            this._shuzoEnded = false;
            this._affectAcknowledged = false;
            this._cueAcknowledged = false;
            this._skipAnchors = false;
            this._isFadingToAnchors = false;
            this._breathingPlaying = false;
            this._breathingEnded = false;
            this._breathingStarted = false;
            this._breathingHasPlayedOnce = false;
            this._breathingGateUnlocked = false;
            this._natureIndex = 0;
            this._lastNatureSwitchTime = 0;
            this._natureMuted = true;
            this._callMyNameMuted = true; // Sound OFF by default
            this._callMyNameEnded = false;
            this._callMyNameDismissed = false;
            const callBtn = document.getElementById('callMyNameSoundBtn');
            if (callBtn) {
                callBtn.style.display = '';
                callBtn.style.opacity = '0';
                callBtn.style.pointerEvents = 'none';
            }
            this._audioUnlocked = false; // Guard: audios stay silent until 2s delay elapses
            this._anchorsExitAccumulator = 0;
            this._anchorsTouchAccumulator = 0;
            this._anchorsKeyPushes = 0;
            this._lastAnchorScrollTime = 0;
            this._lastAnchorTouchTime = 0;

            const gateFillEl = document.getElementById('breathGateFill');
            if (gateFillEl) gateFillEl.style.width = '0%';
            const gateTimeEl = document.getElementById('breathGateTime');
            if (gateTimeEl) { gateTimeEl.textContent = '0/90s'; gateTimeEl.style.color = ''; }
            const gateBadgeEl = document.getElementById('exitGateBadge');
            if (gateBadgeEl) {
                gateBadgeEl.classList.remove('is-unlocked');
                gateBadgeEl.classList.add('is-locked');
                gateBadgeEl.textContent = 'Locked (Complete 90s Breathing)';
            }
            const exitGridEl = document.getElementById('exitActionsGrid');
            if (exitGridEl) {
                exitGridEl.classList.add('is-gated');
                const btns = exitGridEl.querySelectorAll('.exit-action-btn');
                btns.forEach(b => b.setAttribute('disabled', 'disabled'));
            }

            // Shuzo motivation video stays paused at start until user enters Scene 2
            const sv = document.getElementById('shuzoVideoPlayer');
            if (sv) {
                sv.muted = true;
                sv.currentTime = 0;
                sv.disablePictureInPicture = true;
                sv.disableRemotePlayback = true;
                if (!sv.paused) sv.pause();
            }
            const shuzoBtn = document.getElementById('shuzoPlayCenterBtn');
            if (shuzoBtn) shuzoBtn.classList.add('visible');

            const nv = document.getElementById('natureVideoPlayer');
            if (nv) {
                nv.muted = true;
                nv.volume = 0;
                nv.disablePictureInPicture = true;
                nv.disableRemotePlayback = true;
            }
            const mv = document.getElementById('mountainTimelapseVideo');
            if (mv) {
                mv.muted = true;
                mv.disablePictureInPicture = true;
                mv.disableRemotePlayback = true;
                this.safePlayVideo(mv);
            }
            const wv = document.getElementById('waterWaveVideo');
            if (wv) {
                wv.muted = true;
                wv.disablePictureInPicture = true;
                wv.disableRemotePlayback = true;
                this.safePlayVideo(wv);
            }

            // Breathing audio pre-configured but NOT played yet
            const ba = this.getBreathingAudio();
            if (ba) {
                ba.muted = false;
                ba.volume = 0.85;
                ba.loop = false;
                if (ba.currentTime === 0 || this._breathingEnded) {
                    ba.pause();
                    ba.currentTime = 0;
                }
            }

            // All audios start SILENT  they unlock after 2s (unblur animation = 2.2s)
            const ma = document.getElementById('mountainAmbienceAudio');
            if (ma) {
                ma.muted = false;
                ma.volume = 0;
                ma.loop = true;
            }
            const wa = document.getElementById('waterWavesAudio');
            if (wa) {
                wa.muted = false;
                wa.volume = 0;
                wa.loop = true;
            }
            const bg = document.getElementById('urgeBgMusic');
            if (bg) {
                bg.muted = false;
                bg.volume = 0;
                bg._hasPlayedOnce = false;
            }

           
            if (this._callMyNameAudio) {
                // ONLY pause/rewind if it has NOT started yet, or if it already finished
                if (this._callMyNameAudio.currentTime === 0 || this._callMyNameEnded) {
                    this._callMyNameEnded = false;
                    this._callMyNameDismissed = false;
                    this._callMyNameAudio.pause();
                    this._callMyNameAudio.currentTime = 0;
                    this._callMyNameAudio._hasPlayedOnce = false;
                }
            } else {
                const ca = document.getElementById('anchorCallMyNameAudio') || document.getElementById('callMyNameAudio');
                if (ca) {
                    ca.pause();
                    ca.volume = 0.50;
                }
            }

            const sCueEl = document.getElementById('urge-scene-photo-cue');
            if (sCueEl && !sCueEl._clickHooked) {
                sCueEl._clickHooked = true;
                sCueEl.addEventListener('click', () => {
                    if (this.currentProgress >= 3.20 && this.currentProgress < 3.65) {
                        this.targetProgress = 3.65;
                        this.currentProgress = 3.65;
                        this.render(3.65);
                    }
                });
            }

            // After 2s: unblur is complete. Audio unlock is enabled, but stays silent
            // on the Stats Intro screen ("let's look at your past stats").
            // Central audio engine in render() will fade in bg music only when scrolling into stats (p >= 0.75).
            const self = this;
            if (this._audioUnlockTimer) clearTimeout(this._audioUnlockTimer);
            this._audioUnlockTimer = setTimeout(() => {
                self._audioUnlocked = true;
            }, 2000);

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
                            this.currentProgress += diff * 0.22; // Snappy, responsive exponential lerp
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
        if (target === 'breathing' || target === 6.0 || target === 6) {
            this._affectAcknowledged = true;
            this.targetProgress = 8.10;
            this._breathingStarted = true;
            this._breathingHasPlayedOnce = false;
            const nv = document.getElementById('natureVideoPlayer');
            if (nv) {
                nv.muted = this._natureMuted;
                nv.volume = this._natureMuted ? 0 : 0.35;
                if (nv.readyState === 0) nv.load();
                nv.play().catch(() => {});
            }
            if (!this._breathingEnded) {
                this.playBreathingAudio();
            }
        } else if (typeof target === 'number') {
            const map = [0.0, 0.60, 2.05, 3.65, 5.00, 5.45, 6.10, 7.50, 8.10, 9.35];
            const idx = Math.floor(target);
            let val = 0.0;
            if (idx >= 0 && idx < map.length) {
                val = map[idx];
            } else {
                val = Math.max(0.0, Math.min(10.00, target));
            }
            if (val >= 3.65 && !this._cueAcknowledged) {
                this._cueAcknowledged = true;
            }
            if (val > 7.50 && !this._affectAcknowledged) {
                this._affectAcknowledged = true;
            }
            this.targetProgress = val;
        }
    },

    onWheel: function (e) {
        if (!this.isModalOpen()) return;
        e.preventDefault();

        // High precision scrolling physics tailored per section:
        const p = this.targetProgress;
        const isScrollingBack = (e.deltaY < 0);
        let multiplier = 0.0014;
        if (p < 0.60) {
            multiplier = 0.0014; // Smooth dismiss for Stats Intro ("let's look at your past stats")
        } else if (p < 1.45) {
            multiplier = 0.00060; // Natural, comfortable reading pace through data metric cards
        } else if (p < 2.05) {
            multiplier = 0.00024; // Slower, graceful transition from data into Day Diary so user absorbs "Why you entered this arena" & shine
        } else if (p < 3.20) {
            // Responsive Day Diary horizontal/diagonal card glide
            const s0 = document.getElementById('urge-scene-0');
            const cards = s0 ? s0.querySelectorAll('.produx-diagonal-card') : null;
            const cardCount = (cards && cards.length > 0) ? cards.length : 7;
            const intervals = Math.max(1, cardCount - 1);
            const targetDeltaYPerCard = 360;
            let diaryMultiplier = 1.15 / (targetDeltaYPerCard * intervals);
            diaryMultiplier = Math.max(0.00015, Math.min(0.0016, diaryMultiplier));
            multiplier = diaryMultiplier;
        } else if (p >= 3.20 && p < 5.00) {
            // Relational Anchor Flashcards:
            // When scrolling backwards (wheel up), provide responsive pacing so user can un-swipe easily:
            multiplier = isScrollingBack ? 0.0012 : 0.00085;
        } else if (p >= 5.00 && p < 5.45) {
            // Forward scroll has deliberate delay. Backward scroll has instant responsive return:
            multiplier = isScrollingBack ? 0.0012 : 0.00035;
        } else if (p >= 5.45 && p < 6.10) {
            // Friction-free normal scroll: "you've come this far..." to Japanese motivation video
            multiplier = 0.0014;
        } else if (p >= 6.10 && p < 6.70) {
            multiplier = 0.0010; // comfortable pacing during video expansion
        } else if (p >= 6.70 && p < 7.50) {
            multiplier = 0.0014; // smooth normal scroll into somatic check-in
        } else if (p >= 7.50 && p < 8.00) {
            // Friction-free normal scroll: "Let's leave all the noise behind" to breathing exercise
            multiplier = 0.0014;
        } else if (p >= 8.00 && p <= 8.85) {
            multiplier = 0.00045; // steady pace during guided HRV breathing
        } else {
            // Friction-free normal scroll: breathing exercise to "You chose this. Day X is yours" (p > 8.85)
            multiplier = 0.0014;
        }

        const delta = e.deltaY * multiplier;
        let nextP = Math.max(0.0, Math.min(10.00, this.targetProgress + delta));

        // "Remember who counts on you" Exit Blocking:
        // Protects call_my_name music from being accidentally closed.
        // Requires deliberate, continuous scroll (~280 delta within 800ms) to transition past 5.00 into "you've come this far...".
        if (this.targetProgress <= 5.00 && nextP > 5.00) {
            const now = Date.now();
            if (now - (this._lastAnchorScrollTime || 0) > 800) {
                this._anchorsExitAccumulator = 0;
            }
            this._lastAnchorScrollTime = now;
            if (e.deltaY > 0) {
                this._anchorsExitAccumulator = (this._anchorsExitAccumulator || 0) + e.deltaY;
                if (this._anchorsExitAccumulator < 280) {
                    nextP = 5.00;
                }
            }
        } else if (nextP < 5.00) {
            this._anchorsExitAccumulator = 0;
        }

        // Photo Cue gate: if user has no photos yet, lock forward progress at 3.65 until OK button clicked
        // _skipAnchors means user pressed OK with no photos â†’ bypass gate entirely
        if (!this._hasAnchorPhotos && !this._cueAcknowledged && !this._skipAnchors && nextP > 3.65) {
            nextP = 3.65;
        }
        // Somatic Interoception gate: lock progress until acknowledged or skipped
        if (nextP > 7.50 && !this._affectAcknowledged) {
            nextP = 7.50;
        }
        // Breathing Exercise gate: lock completely in place until 90s urge surfing gate is unlocked or breathing exercise finishes
        const inBreathingZone = (this.targetProgress >= 7.95 && this.targetProgress <= 8.85);
        if ((inBreathingZone || nextP >= 7.95) && !this._breathingGateUnlocked && !this._breathingEnded) {
            nextP = 8.10;
        }
        this.targetProgress = nextP;
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
            const rawTouchDelta = (this._touchStartY - currentY);
            const isTouchingBack = (rawTouchDelta < 0);
            let multiplier = 0.0030;
            if (p < 0.60) {
                multiplier = 0.0030; // Smooth dismiss for Stats Intro
            } else if (p < 1.45) {
                multiplier = 0.0013; // Balanced, natural touch swipe through data metric cards
            } else if (p < 2.05) {
                multiplier = 0.00055; // Slower touch swipe to unveil "Why you entered this arena" and text shine
            } else if (p < 3.20) {
                // Responsive Day Diary touch glide
                const s0 = document.getElementById('urge-scene-0');
                const cards = s0 ? s0.querySelectorAll('.produx-diagonal-card') : null;
                const cardCount = (cards && cards.length > 0) ? cards.length : 7;
                const intervals = Math.max(1, cardCount - 1);
                const targetTouchDeltaYPerCard = 220;
                let diaryTouchMultiplier = 1.15 / (targetTouchDeltaYPerCard * intervals);
                diaryTouchMultiplier = Math.max(0.00030, Math.min(0.0028, diaryTouchMultiplier));
                multiplier = diaryTouchMultiplier;
            } else if (p >= 3.20 && p < 5.00) {
                multiplier = isTouchingBack ? 0.0028 : 0.0016;
            } else if (p >= 5.00 && p < 5.45) {
                // Deliberate touch delay for transition forward from anchors; snappy return backward:
                multiplier = isTouchingBack ? 0.0028 : 0.00075;
            } else if (p >= 5.45 && p < 6.10) {
                multiplier = 0.0030; // Friction-free normal touch swipe
            } else if (p >= 6.10 && p < 6.70) {
                multiplier = 0.0020;
            } else if (p >= 6.70 && p < 7.50) {
                multiplier = 0.0030; // Friction-free normal touch swipe
            } else if (p >= 7.50 && p < 8.00) {
                multiplier = 0.0030; // Friction-free normal touch swipe
            } else if (p >= 8.00 && p <= 8.85) {
                multiplier = 0.00080;
            } else {
                multiplier = 0.0030; // Friction-free normal touch swipe into victory
            }
            const deltaY = rawTouchDelta * multiplier;
            this._touchStartY = currentY;
            let nextP = Math.max(0.0, Math.min(10.00, this.targetProgress + deltaY));

            // Touch exit blocking for "Remember who counts on you"
            if (this.targetProgress <= 5.00 && nextP > 5.00) {
                const now = Date.now();
                if (now - (this._lastAnchorTouchTime || 0) > 800) {
                    this._anchorsTouchAccumulator = 0;
                }
                this._lastAnchorTouchTime = now;
                if (rawTouchDelta > 0) {
                    this._anchorsTouchAccumulator = (this._anchorsTouchAccumulator || 0) + rawTouchDelta;
                    if (this._anchorsTouchAccumulator < 180) {
                        nextP = 5.00;
                    }
                }
            } else if (nextP < 5.00) {
                this._anchorsTouchAccumulator = 0;
            }

            if (!this._hasAnchorPhotos && !this._cueAcknowledged && !this._skipAnchors && nextP > 3.65) {
                nextP = 3.65;
            }
            if (nextP > 7.50 && !this._affectAcknowledged) {
                nextP = 7.50;
            }
            // Breathing Exercise gate: lock completely in place until 90s urge surfing gate is unlocked or breathing exercise finishes
            const inBreathingZone = (this.targetProgress >= 7.95 && this.targetProgress <= 8.85);
            if ((inBreathingZone || nextP >= 7.95) && !this._breathingGateUnlocked && !this._breathingEnded) {
                nextP = 8.10;
            }
            this.targetProgress = nextP;
            if (e.cancelable) e.preventDefault();
        }
    },

    onKeyDown: function (e) {
        if (!this.isModalOpen()) return;

        // If focus or event target is an editable input or textarea, DO NOT intercept keys (especially Space bar or arrows)
        const target = e.target;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
            return;
        }
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
            return;
        }

        if (e.key === 'Escape') {
            const closeBtn = document.querySelector('.modal-close-btn');
            if (closeBtn) {
                closeBtn.click();
            }
            return;
        }

        // Lock all scroll keys while in breathing exercise until 90s gate is unlocked or it finishes
        const inBreathingKeyZone = (this.targetProgress >= 7.95 && this.targetProgress <= 8.85);
        if (inBreathingKeyZone && !this._breathingGateUnlocked && !this._breathingEnded) {
            if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === ' ') {
                e.preventDefault();
                this.targetProgress = 8.10;
                return;
            }
        }

        const p = this.targetProgress;
        let step = (p < 0.60) ? 0.15 : ((p < 1.45) ? 0.06 : ((p < 2.05) ? 0.03 : 0.08));
        if (p >= 2.05 && p < 3.20) {
            const s0 = document.getElementById('urge-scene-0');
            const cards = s0 ? s0.querySelectorAll('.produx-diagonal-card') : null;
            const intervals = Math.max(1, (cards && cards.length > 0 ? cards.length : 7) - 1);
            step = 1.15 / intervals;
        } else if (p >= 3.20 && p < 5.00) {
            step = 0.08;
        } else if (p >= 5.00 && p < 5.45) {
            step = 0.04; // Deliberate scroll delay step for transition from "Remember who counts on you" to "you've come this far..."
        }
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            let nextP = Math.min(10.00, this.targetProgress + step);
            if (this.targetProgress <= 5.00 && nextP > 5.00) {
                this._anchorsKeyPushes = (this._anchorsKeyPushes || 0) + 1;
                if (this._anchorsKeyPushes < 3) {
                    nextP = 5.00;
                }
            } else if (nextP < 5.00) {
                this._anchorsKeyPushes = 0;
            }
            if (!this._hasAnchorPhotos && !this._cueAcknowledged && !this._skipAnchors && nextP > 3.65) nextP = 3.65;
            if (nextP > 7.50 && !this._affectAcknowledged) nextP = 7.50;
            if ((this.targetProgress >= 8.00 || nextP >= 8.00) && !this._breathingEnded) nextP = 8.10;
            this.targetProgress = nextP;
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            this._anchorsKeyPushes = 0;
            const upStep = (p >= 5.00 && p <= 5.45) ? 0.08 : step;
            this.targetProgress = Math.max(0.0, this.targetProgress - upStep);
        } else if (e.key === ' ') {
            e.preventDefault();
            let nextP = Math.min(10.00, this.targetProgress + (step * 1.5));
            if (this.targetProgress <= 5.00 && nextP > 5.00) {
                this._anchorsKeyPushes = (this._anchorsKeyPushes || 0) + 1;
                if (this._anchorsKeyPushes < 3) {
                    nextP = 5.00;
                }
            } else if (nextP < 5.00) {
                this._anchorsKeyPushes = 0;
            }
            if (!this._hasAnchorPhotos && !this._cueAcknowledged && !this._skipAnchors && nextP > 3.65) nextP = 3.65;
            if (nextP > 7.50 && !this._affectAcknowledged) nextP = 7.50;
            if ((this.targetProgress >= 8.00 || nextP >= 8.00) && !this._breathingEnded) nextP = 8.10;
            this.targetProgress = nextP;
        }
    },

    render: function (p) {
        const sPre0 = document.getElementById('urge-scene-stats-intro');
        const s0 = document.getElementById('urge-scene-0');
        const sCue = document.getElementById('urge-scene-photo-cue');
        const sAnchors = document.getElementById('urge-scene-anchors');
        const sFar = document.getElementById('urge-scene-far');
        const s2 = document.getElementById('urge-scene-2');
        const sAffect = document.getElementById('urge-scene-affect');
        const sBridge = document.getElementById('urge-scene-bridge');
        const s3 = document.getElementById('urge-scene-3');
        const s4 = document.getElementById('urge-scene-4');
        const bg = document.getElementById('urgeBgMusic');

        // Track visibility metrics for biophilic ducking and ambient volume
        let streakVis = 0;
        let wavesVis = 0;

        // -------------------------------------------------------------
        // SCENE PRE-0: STATS INTRO (0.00 -> 0.60)
        // Strictly SILENT (no bg music, no ambience)
        // Immediately scrolls up on first notch of wheel
        // -------------------------------------------------------------
        if (sPre0) {
            if (p < 0.60) {
                sPre0.style.display = 'flex';
                sPre0.style.zIndex = '22';
                // Responsive vertical scroll OUT upwards towards stats stream (0% -> -100%)
                const normPre = Math.min(1, Math.max(0, p / 0.60));
                const easePre = normPre * (2 - normPre); // Quad ease-out: immediate motion on tick 1
                const tyPre = -easePre * 100;
                const opPre = normPre > 0.88 ? Math.max(0, 1 - (normPre - 0.88) / 0.12) : 1.0;
                sPre0.style.opacity = opPre.toFixed(3);
                sPre0.style.transform = `translate3d(0, ${tyPre.toFixed(2)}%, 0)`;
                sPre0.style.pointerEvents = normPre > 0.3 ? 'none' : 'auto';
            } else {
                sPre0.style.display = 'none';
                sPre0.style.zIndex = '1';
                sPre0.style.opacity = '0';
                sPre0.style.pointerEvents = 'none';
            }
        }

        // -------------------------------------------------------------
        // SCENE 0: DATA STREAM + PINNED DAY DIARY (0.00 -> 3.65)
        // -------------------------------------------------------------
        if (s0) {
            const dataStream = document.getElementById('spotifyDataStream');
            const dataContainer = document.getElementById('spotifyDataScrollContainer');
            const track = document.getElementById('produxDiagonalTrack');
            const cards = s0.querySelectorAll('.produx-diagonal-card');
            const diarySection = s0.querySelector('.day-diary-data-section');

            if (p < 3.20) {
                s0.style.display = 'flex';
                s0.style.zIndex = '15';
                s0.style.boxShadow = 'none';
                s0.style.filter = 'none';

                if (p < 0.60) {
                    // Normal vertical scroll IN from bottom (+100% -> 0%)
                    const normIn0 = Math.min(1, Math.max(0, p / 0.60));
                    const easeIn0 = normIn0 * (2 - normIn0);
                    const tyIn0 = (1 - easeIn0) * 100;
                    s0.style.opacity = '1';
                    s0.style.transform = `translate3d(0, ${tyIn0.toFixed(2)}%, 0)`;
                    s0.style.pointerEvents = normIn0 > 0.5 ? 'auto' : 'none';
                } else {
                    // Fully active centered
                    s0.style.opacity = '1';
                    s0.style.transform = 'translate3d(0, 0, 0)';
                    s0.style.pointerEvents = 'auto';
                }

                // Phase 1 (p: 1.00 -> 2.05): Slower vertical scroll until Day Diary is in view
                // Phase 2 (p: 2.05 -> 3.20): Cards glide horizontally/diagonally
                if (dataStream && dataContainer) {
                    const maxScroll = Math.max(0, dataStream.scrollHeight - dataContainer.clientHeight + 30);
                    const diaryOffset = diarySection ? Math.min(maxScroll, Math.max(0, diarySection.offsetTop - 15)) : maxScroll;

                    let currentScrollY = 0;
                    if (p < 0.60) {
                        currentScrollY = 0;
                    } else if (p < 2.05) {
                        const vertRatio = (p - 0.60) / 1.45;
                        currentScrollY = vertRatio * diaryOffset;
                    } else {
                        currentScrollY = diaryOffset;
                    }
                    dataStream.style.transform = `translate3d(0, ${(-currentScrollY).toFixed(1)}px, 0)`;

                    // Visibility checks for Streak and Waves cards
                    const streakCard = s0.querySelector('.folder-card-streak');
                    const wavesCard = s0.querySelector('.folder-card-waves');
                    const cRect = dataContainer.getBoundingClientRect();

                    if (streakCard && cRect.height > 0 && p >= 0.40 && p < 1.40) {
                        const sRect = streakCard.getBoundingClientRect();
                        const overlapTop = Math.max(sRect.top, cRect.top);
                        const overlapBottom = Math.min(sRect.bottom, cRect.bottom);
                        const visibleH = Math.max(0, overlapBottom - overlapTop);
                        if (visibleH > 0) {
                            streakVis = Math.min(1.0, visibleH / (sRect.height * 0.45));
                        }
                    }

                    if (wavesCard && cRect.height > 0 && p >= 1.10 && p < 2.30) {
                        const wRect = wavesCard.getBoundingClientRect();
                        const overlapTop = Math.max(wRect.top, cRect.top);
                        const overlapBottom = Math.min(wRect.bottom, cRect.bottom);
                        const visibleH = Math.max(0, overlapBottom - overlapTop);
                        const distToBottom = wRect.top - cRect.bottom;

                        if (visibleH > 0) {
                            wavesVis = Math.min(1.0, visibleH / (wRect.height * 0.40));
                        } else if (distToBottom > 0 && distToBottom < 180) {
                            wavesVis = (1 - distToBottom / 180) * 0.35;
                        }
                    }

                    // Trigger letter animations for data sections
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
                    const containerHeight = dataContainer.clientHeight || 450;
                    const sectionTopInView = diarySection ? (diarySection.offsetTop - currentScrollY) : containerHeight;
                    const viewRatio = sectionTopInView / containerHeight;

                    const headlineEl = s0.querySelector('.slide-headline.shine-scroll-text');
                    const subtextEl = s0.querySelector('.slide-subtext.shine-scroll-text');

                    // Headline ("Why you entered this arena.") shines dynamically as it glides up: p 1.55 → 1.80
                    let headRatio = 0;
                    if (p >= 1.85) {
                        headRatio = 1.0;
                    } else if (p >= 1.75) {
                        headRatio = Math.min(1.0, (p - 1.75) / 0.25);
                    }
                    const headPos = (-30 + headRatio * 160).toFixed(1);

                    // Subtext ("Scroll momentum glides...") shines dynamically as it completes rise: p 1.80 → 2.05 (finishes at start of Day Diary)
                    let subRatio = 0;
                    if (p >= 2.05) {
                        subRatio = 1.0;
                    } else if (p >= 1.85) {
                        subRatio = Math.min(1.0, (p - 1.85) / 0.25);
                    }
                    const subPos = (-30 + subRatio * 160).toFixed(1);

                    if (headlineEl) {
                        headlineEl.style.setProperty('--shine-pos', `${headPos}%`);
                        headlineEl.style.setProperty('--fill-pct', `${headPos}%`);
                    }

                    if (subtextEl) {
                        subtextEl.style.setProperty('--shine-pos', `${subPos}%`);
                        subtextEl.style.setProperty('--fill-pct', `${subPos}%`);
                    }
                }

                // Phase 2: Diagonal Day Diary Glide (p: 2.05 -> 3.20)
                if (track && cards.length > 0) {
                    let diaryRatio = 0.0;
                    if (p >= 2.05) {
                        diaryRatio = Math.min(1.0, (p - 2.05) / 1.15);
                    }
                    const stepX = 400;
                    const baseStepY = 70;
                    const maxShiftX = (cards.length - 1) * stepX;

                    const flattenFactor = Math.max(0, 1.0 - diaryRatio);
                    const currentStepY = baseStepY * flattenFactor;
                    const trackY = -diaryRatio * (cards.length - 1) * currentStepY;

                    track.style.transform = `translate3d(${(-diaryRatio * maxShiftX).toFixed(1)}px, ${trackY.toFixed(1)}px, 0)`;

                    const focalIndex = diaryRatio * (cards.length - 1);
                    const parallelHeight = Math.min(410, Math.round(380 + diaryRatio * 25));

                    cards.forEach((c, idx) => {
                        const dist = Math.abs(idx - focalIndex);
                        c.style.zIndex = 50 - Math.round(dist * 5);
                        c.classList.remove('active-focus');

                        const cardTop = idx * currentStepY;
                        c.style.top = `${cardTop.toFixed(1)}px`;
                        c.style.setProperty('--card-height', `${parallelHeight}px`);
                        c.style.minHeight = `${parallelHeight}px`;
                        c.style.height = `${parallelHeight}px`;
                    });

                    this.updateCardHover();
                }

                const mv = document.getElementById('mountainTimelapseVideo') || s0.querySelector('.folder-mountain-video');
                if (mv && mv.paused) this.safePlayVideo(mv);
                const wv = document.getElementById('waterWaveVideo') || s0.querySelector('.folder-water-wave-video');
                if (wv && wv.paused) this.safePlayVideo(wv);

            } else if (p >= 3.20 && p <= 3.65) {
                // Scene 0 scrolls vertically UP out of view (0% -> -100%)
                const norm0 = Math.min(1, Math.max(0, (p - 3.20) / 0.45));
                const ease0 = norm0 * (2 - norm0);
                const tyPct0 = -ease0 * 100;
                const op0 = norm0 > 0.92 ? Math.max(0, 1 - (norm0 - 0.92) / 0.08) : 1.0;

                const track = document.getElementById('produxDiagonalTrack');
                const cards = s0.querySelectorAll('.produx-diagonal-card');
                if (track && cards.length > 0) {
                    const stepX = 400;
                    const maxShiftX = (cards.length - 1) * stepX;
                    track.style.transform = `translate3d(${(-maxShiftX).toFixed(1)}px, 0px, 0)`;
                    cards.forEach((c) => {
                        c.style.top = '0px';
                        c.style.setProperty('--card-height', '405px');
                        c.style.minHeight = '405px';
                        c.style.height = '405px';
                    });
                }

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

                const mv = document.getElementById('mountainTimelapseVideo');
                if (mv && !mv.paused) mv.pause();
                const wv = document.getElementById('waterWaveVideo');
                if (wv && !wv.paused) wv.pause();
            }
        }

        // -------------------------------------------------------------
        // CENTRAL AUDIO ENGINE (NO BUZZ, NO COMPETING LERPS, NO CHATTER)
        // -------------------------------------------------------------
        const mountainAudio = document.getElementById('mountainAmbienceAudio');
        const waterAudio = document.getElementById('waterWavesAudio');

        if (bg && !bg._endedHooked) {
            bg._endedHooked = true;
            bg.loop = false;
            bg.addEventListener('ended', () => {
                bg._hasPlayedOnce = true;
                bg.pause();
            });
        }

        if (!this._audioUnlocked || p < 0.50) {
            // Stats Intro screen or locked window: STRICT SILENCE
            if (bg && bg.volume > 0) bg.volume = 0;
            if (mountainAudio && mountainAudio.volume > 0) mountainAudio.volume = 0;
            if (waterAudio && waterAudio.volume > 0) waterAudio.volume = 0;
        } else if (p >= 0.50 && p <= 3.65) {
            // SCENE 0 IS ACTIVE:
            const isCallActive = this._callMyNameAudio && !this._callMyNameAudio.paused;
            if (isCallActive) {
                if (bg) {
                    bg.volume = 0;
                    if (!bg.paused) bg.pause();
                }
            } else if (bg && !bg.muted && !bg._hasPlayedOnce) {
                if (p <= 3.20) {
                    let targetBgVol = 0.38;
                    if (wavesVis > 0.05) {
                        targetBgVol = Math.max(0.12, 0.38 - (wavesVis * 0.26));
                    } else if (streakVis > 0.05) {
                        targetBgVol = Math.max(0.18, 0.38 - (streakVis * 0.20));
                    }
                    const bgDiff = targetBgVol - bg.volume;
                    if (Math.abs(bgDiff) > 0.002) {
                        bg.volume = Math.max(0, Math.min(1, bg.volume + bgDiff * 0.04));
                    }
                    if (bg.paused && bg.volume > 0.01) bg.play().catch(() => {});
                } else {
                    // Smooth fade-out before Anchor deck
                    const fadeNorm = (p - 3.20) / 0.45;
                    const targetFadeVol = Math.max(0, 0.38 * (1 - fadeNorm));
                    const bfDiff = targetFadeVol - bg.volume;
                    if (Math.abs(bfDiff) > 0.002) {
                        bg.volume = Math.max(0, Math.min(1, bg.volume + bfDiff * 0.06));
                    }
                    if (bg.paused && bg.volume > 0.01) bg.play().catch(() => {});
                }
            }

            // Mountain Ambience Audio
            if (mountainAudio) {
                const targetMountainVol = streakVis * 0.65;
                const mDiff = targetMountainVol - mountainAudio.volume;
                if (Math.abs(mDiff) > 0.002) {
                    mountainAudio.volume = Math.max(0, Math.min(1, mountainAudio.volume + mDiff * 0.05));
                }
                if (mountainAudio.paused && targetMountainVol > 0.02) {
                    mountainAudio.play().catch(() => {});
                }
            }

            // Water Waves Sound
            if (waterAudio) {
                const targetWaterVol = wavesVis * 0.75;
                const wDiff = targetWaterVol - waterAudio.volume;
                if (Math.abs(wDiff) > 0.002) {
                    waterAudio.volume = Math.max(0, Math.min(1, waterAudio.volume + wDiff * 0.05));
                }
                if (waterAudio.paused && targetWaterVol > 0.02) {
                    waterAudio.play().catch(() => {});
                }
            }
        } else {
            // Past Scene 0 (p > 3.65): fade out and stop Scene 0 audios
            if (bg) {
                if (bg.volume > 0.005) {
                    bg.volume = Math.max(0, bg.volume * 0.85);
                } else {
                    bg.volume = 0;
                    if (!bg.paused) bg.pause();
                    bg._hasPlayedOnce = true;
                }
            }
            if (mountainAudio && !mountainAudio.paused) {
                mountainAudio.volume = 0;
                mountainAudio.pause();
            }
            if (waterAudio && !waterAudio.paused) {
                waterAudio.volume = 0;
                waterAudio.pause();
            }
        }

        // -------------------------------------------------------------
        // AUDIO: CALL MY NAME
        // Render loop ONLY handles stopping — never calls play().
        // play() is called exclusively from toggleCallMyNameSound (user button).
        // Once outside Anchor section, audio pauses cleanly and never plays again.
        // -------------------------------------------------------------
        const callAudio = this.getCallMyNameAudio();
        if (callAudio) {
            if (this._callMyNameDismissed) {
                if (!callAudio.paused) {
                    callAudio.pause();
                }
                callAudio.volume = 0;
            } else {
                // Section 1.2 is active from p: 3.20 to 5.05.
                // Dismiss ONLY when the user scrolls away forward into Scene 2 (p > 5.05)
                // or scrolls backward all the way into Day Diary (p < 3.20).
                const outOfSection = (p < 3.20 || p > 5.00);
                if (outOfSection) {
                    if (this._callMyNameFadeTimer) {
                        clearInterval(this._callMyNameFadeTimer);
                        this._callMyNameFadeTimer = null;
                    }
                    if (!callAudio.paused || !this._callMyNameMuted) {
                        callAudio.pause();
                        this._callMyNameDismissed = true;
                        this._callMyNameMuted = true;
                        if (this._dotNetHelper) {
                            try { this._dotNetHelper.invokeMethodAsync('DismissCallMyName'); } catch (e) { }
                        }
                    }
                    if (p > 5.05) {
                        this._callMyNameDismissed = true;
                        this._callMyNameMuted = true;
                        if (this._dotNetHelper) {
                            try { this._dotNetHelper.invokeMethodAsync('DismissCallMyName'); } catch (e) { }
                        }
                    }
                    callAudio.volume = 0;
                } else if (this._callMyNameMuted && !callAudio.paused) {
                    callAudio.pause();
                }
            }
        }

        // -------------------------------------------------------------
        // SCENE 1.1: GROUNDING ANCHORS PHOTO CUE
        // Shown ONLY if user has no photos yet and has not unlocked cue gate
        // -------------------------------------------------------------
        if (sCue) {
            // Never show the cue screen if user skipped (no photos) or already acknowledged
            if (this._skipAnchors || this._cueAcknowledged || this._hasAnchorPhotos) {
                sCue.style.display = 'none';
                sCue.style.opacity = '0';
                sCue.style.zIndex = '1';
                sCue.style.pointerEvents = 'none';
            } else {
                // Show only when user has no photos and hasn't yet clicked OK
                if (p >= 3.20 && p <= 4.00) {
                    if (p < 3.65) {
                        const normCIn = Math.min(1, Math.max(0, (p - 3.20) / 0.45));
                        const easeCIn = normCIn * (2 - normCIn);
                        const tyCIn = (1 - easeCIn) * 100;
                        sCue.style.display = 'flex';
                        sCue.style.zIndex = '22';
                        sCue.style.opacity = normCIn.toFixed(3);
                        sCue.style.transform = `translate3d(0, ${tyCIn.toFixed(2)}%, 0)`;
                        sCue.style.pointerEvents = normCIn > 0.08 ? 'auto' : 'none';
                    } else {
                        // Locked centered at 3.65 with pointer events enabled
                        sCue.style.display = 'flex';
                        sCue.style.zIndex = '22';
                        sCue.style.opacity = '1';
                        sCue.style.transform = 'translate3d(0, 0, 0)';
                        sCue.style.pointerEvents = 'auto';
                    }
                } else {
                    sCue.style.display = 'none';
                    sCue.style.zIndex = '1';
                    sCue.style.opacity = '0';
                    sCue.style.pointerEvents = 'none';
                }
            }
        }

        // If user scrolled all the way back into Day Diary (p <= 3.20), reset _cueAcknowledged so returning encounters Cue screen again
        // But if _skipAnchors is set (skipped with no photos), keep it set so we never re-show sCue or sAnchors
        if (p <= 3.20 && !this._hasAnchorPhotos && !this._skipAnchors) {
            this._cueAcknowledged = false;
        }

        // -------------------------------------------------------------
        // SCENE 1.2: ANCHOR FLASHCARDS DECK ("Remember who counts on you")
        // Active when user has photos OR has acknowledged the cue gate
        // -------------------------------------------------------------
        // Show anchors only when user has photos or acknowledged cue — never when skipped (no photos)
        const showAnchors = (this._hasAnchorPhotos || this._cueAcknowledged) && !this._skipAnchors;
        if (sAnchors) {
            if (showAnchors && !this._isFadingToAnchors) {
                const deck = document.getElementById('anchorCardDeck');
                const cards = deck ? deck.querySelectorAll('.anchor-card') : [];

                if (p >= 3.20 && p <= 5.45) {
                    const soundBtn = document.getElementById('callMyNameSoundBtn');

                    if (this._callMyNameDismissed) {
                        if (soundBtn) {
                            soundBtn.style.display = 'none';
                            soundBtn.style.opacity = '0';
                            soundBtn.style.pointerEvents = 'none';
                        }
                    }

                    if (p < 3.65) {
                        // Smooth vertical scroll IN from bottom (+100% → 0%)
                        const normIn = Math.min(1, Math.max(0, (p - 3.20) / 0.45));
                        const easeIn = normIn * (2 - normIn);
                        const tyIn = (1 - easeIn) * 100;
                        const opIn = Math.min(1, Math.max(0, (normIn - 0.05) / 0.95));

                        // Deck scales up as it enters: 0.88 → 1.0
                        const scaleIn = 0.88 + easeIn * 0.12;

                        sAnchors.style.display = 'flex';
                        sAnchors.style.zIndex = '22';
                        sAnchors.style.opacity = opIn.toFixed(3);
                        sAnchors.style.transform = `translate3d(0, ${tyIn.toFixed(2)}%, 0) scale(${scaleIn.toFixed(3)})`;
                        sAnchors.style.pointerEvents = normIn > 0.15 ? 'auto' : 'none';

                        // Sound button hidden during scroll-in
                        if (soundBtn && !this._callMyNameDismissed) { soundBtn.style.opacity = '0'; soundBtn.style.pointerEvents = 'none'; }

                    } else if (p > 5.00) {
                        // Vertical scroll OUT upwards towards Momentum Anchor (0% → -100%)
                        const normOut = Math.min(1, Math.max(0, (p - 5.00) / 0.45));
                        const easeOut = normOut * (2 - normOut);
                        const tyOut = -easeOut * 100;
                        const opOut = normOut > 0.90 ? Math.max(0, 1 - (normOut - 0.90) / 0.10) : 1.0;
                        sAnchors.style.display = 'flex';
                        sAnchors.style.zIndex = '15';
                        sAnchors.style.opacity = opOut.toFixed(3);
                        sAnchors.style.transform = `translate3d(0, ${tyOut.toFixed(2)}%, 0)`;
                        sAnchors.style.pointerEvents = 'none';

                        // Sound button fades with section
                        if (soundBtn && !this._callMyNameDismissed) { soundBtn.style.opacity = opOut.toFixed(3); soundBtn.style.pointerEvents = 'none'; }

                    } else {
                        // Centered interactive full page (3.65 → 5.00)
                        sAnchors.style.display = 'flex';
                        sAnchors.style.zIndex = '22';
                        sAnchors.style.opacity = '1';
                        sAnchors.style.transform = 'translate3d(0, 0, 0) scale(1)';
                        sAnchors.style.pointerEvents = 'auto';

                        // Sound button fully visible once settled (only if not dismissed)
                        if (soundBtn) {
                            if (this._callMyNameDismissed) {
                                soundBtn.style.display = 'none';
                                soundBtn.style.opacity = '0';
                                soundBtn.style.pointerEvents = 'none';
                            } else {
                                soundBtn.style.display = 'flex';
                                soundBtn.style.opacity = '1';
                                soundBtn.style.pointerEvents = 'auto';
                            }
                        }
                    }

                    // Flashcard Swipe Physics (p: 3.65 -> 5.00)
                    if (cards && cards.length > 0) {
                        const cardCount = cards.length;
                        const deckProgress = Math.min(1.0, Math.max(0.0, (p - 3.65) / 1.35));

                        if (cardCount === 1) {
                            // Single card interactive feedback: gentle responsive float so user knows scroll is active
                            const floatY = (deckProgress - 0.5) * -16;
                            const scale = 0.98 + Math.sin(deckProgress * Math.PI) * 0.03;
                            cards[0].style.transform = `translate3d(0, ${floatY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
                            cards[0].style.opacity = '1';
                            cards[0].style.zIndex = '20';
                            cards[0].style.pointerEvents = 'auto';
                        } else {
                            const swipeSlot = 1.0 / (cardCount - 1);
                            cards.forEach((c, idx) => {
                                // Dynamic base z-index ensuring cards are strictly stacked top-to-bottom
                                const restingZ = 100 + (cardCount - idx) * 10;

                                if (idx < cardCount - 1) {
                                    const startP = idx * swipeSlot;
                                    const endP = (idx + 1) * swipeSlot;
                                    if (deckProgress <= startP) {
                                        c.style.transform = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
                                        c.style.opacity = '1';
                                        c.style.zIndex = `${restingZ}`;
                                        c.style.pointerEvents = 'auto';
                                    } else if (deckProgress >= endP) {
                                        const swipeDir = (idx % 2 === 0) ? -1 : 1;
                                        c.style.transform = `translate3d(${swipeDir * 140}%, -20%, 0) rotate(${swipeDir * 18}deg) scale(0.9)`;
                                        c.style.opacity = '0';
                                        c.style.zIndex = '1';
                                        c.style.pointerEvents = 'none';
                                    } else {
                                        const localNorm = (deckProgress - startP) / (endP - startP);
                                        const easeSwipe = localNorm * (2 - localNorm);
                                        const swipeDir = (idx % 2 === 0) ? -1 : 1;
                                        const tx = swipeDir * easeSwipe * 140;
                                        const ty = -easeSwipe * 20;
                                        const rot = swipeDir * easeSwipe * 18;
                                        const op = Math.max(0, 1 - easeSwipe * 1.2);
                                        c.style.transform = `translate3d(${tx.toFixed(1)}%, ${ty.toFixed(1)}%, 0) rotate(${rot.toFixed(1)}deg) scale(${(1 - easeSwipe * 0.1).toFixed(2)})`;
                                        c.style.opacity = op.toFixed(3);
                                        c.style.zIndex = `${restingZ + 20}`;
                                        c.style.pointerEvents = 'auto';
                                    }
                                } else {
                                    const prevStart = (cardCount - 2) * swipeSlot;
                                    const revealNorm = Math.min(1.0, Math.max(0.0, (deckProgress - prevStart) / swipeSlot));
                                    const scale = 0.94 + 0.06 * revealNorm;
                                    const ty = (1 - revealNorm) * 16;
                                    c.style.transform = `translate3d(0, ${ty.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
                                    c.style.opacity = '1';
                                    c.style.zIndex = `${restingZ}`;
                                    c.style.pointerEvents = 'auto';
                                }
                            });
                        }
                    }
                } else {
                    sAnchors.style.display = 'none';
                    sAnchors.style.zIndex = '1';
                    sAnchors.style.opacity = '0';
                    sAnchors.style.pointerEvents = 'none';
                }
            } else if (!this._isFadingToAnchors) {
                sAnchors.style.display = 'none';
                sAnchors.style.zIndex = '1';
                sAnchors.style.opacity = '0';
                sAnchors.style.pointerEvents = 'none';
            }
        }

        // -------------------------------------------------------------
        // SCENE 1.5: "YOU'VE COME THIS FAR..." (5.00 -> 6.10)
        // Standalone full-screen momentum anchor
        // -------------------------------------------------------------
        if (sFar) {
            if (p >= 5.00 && p <= 6.10) {
                if (p < 5.45) {
                    // Vertical scroll IN from bottom (+100% -> 0%)
                    const normFIn = Math.min(1, Math.max(0, (p - 5.00) / 0.45));
                    const easeFIn = normFIn * (2 - normFIn);
                    const tyFIn = (1 - easeFIn) * 100;
                    sFar.style.display = 'flex';
                    sFar.style.zIndex = '22';
                    sFar.style.opacity = '1';
                    sFar.style.transform = `translate3d(0, ${tyFIn.toFixed(2)}%, 0)`;
                    sFar.style.pointerEvents = 'none';
                } else if (p > 5.65) {
                    // Vertical scroll OUT upwards towards Motivation Video (0% -> -100%)
                    const normFOut = Math.min(1, Math.max(0, (p - 5.65) / 0.45));
                    const easeFOut = normFOut * (2 - normFOut);
                    const tyFOut = -easeFOut * 100;
                    const opF = normFOut > 0.90 ? Math.max(0, 1 - (normFOut - 0.90) / 0.10) : 1.0;
                    sFar.style.display = 'flex';
                    sFar.style.zIndex = '15';
                    sFar.style.opacity = opF.toFixed(3);
                    sFar.style.transform = `translate3d(0, ${tyFOut.toFixed(2)}%, 0)`;
                    sFar.style.pointerEvents = 'none';
                } else {
                    // Centered full page alone (5.45 -> 5.65)
                    sFar.style.display = 'flex';
                    sFar.style.zIndex = '22';
                    sFar.style.opacity = '1';
                    sFar.style.transform = 'translate3d(0, 0, 0)';
                    sFar.style.pointerEvents = 'auto';
                }
            } else {
                sFar.style.display = 'none';
                sFar.style.zIndex = '1';
                sFar.style.opacity = '0';
                sFar.style.pointerEvents = 'none';
            }
        }

        // -------------------------------------------------------------
        // SCENE 2: THE RAW SPARK (Motivation Video) (5.65 -> 7.45)
        // -------------------------------------------------------------
        if (s2) {
            const sv = document.getElementById('shuzoVideoPlayer');
            const expandingBox = document.getElementById('shuzoExpandingBox');
            const soundBtn = document.getElementById('shuzoSoundBtn');

            if (sv && !sv._shuzoHooked) {
                sv._shuzoHooked = true;
                sv.disablePictureInPicture = true;
                sv.disableRemotePlayback = true;
                const updatePlayBtn = () => {
                    const btn = document.getElementById('shuzoPlayCenterBtn');
                    if (!btn) return;
                    if (sv.paused || sv.ended || (sv.duration && sv.currentTime >= sv.duration - 0.25)) {
                        btn.classList.add('visible');
                    } else {
                        btn.classList.remove('visible');
                    }
                };
                sv.addEventListener('play', () => {
                    window.nobsProduxScrollytelling._shuzoEnded = false;
                    updatePlayBtn();
                });
                sv.addEventListener('pause', updatePlayBtn);
                sv.addEventListener('ended', () => {
                    window.nobsProduxScrollytelling._shuzoEnded = true;
                    updatePlayBtn();
                });
            }

            if (p >= 5.65 && p <= 7.45) {
                if (p < 6.10) {
                    // Normal vertical scroll IN from BOTTOM (+100% -> 0%)
                    const norm2In = Math.min(1, Math.max(0, (p - 5.65) / 0.45));
                    const easeIn2 = norm2In * (2 - norm2In);
                    const tyPct2In = (1 - easeIn2) * 100;
                    s2.style.display = 'flex';
                    s2.style.zIndex = '20';
                    s2.style.opacity = '1';
                    s2.style.transform = `translate3d(0, ${tyPct2In.toFixed(2)}%, 0)`;
                    s2.style.boxShadow = 'none';
                    s2.style.filter = 'none';
                    s2.style.pointerEvents = norm2In > 0.7 ? 'auto' : 'none';
                } else if (p > 7.00) {
                    // Normal vertical scroll OUT upwards towards Somatic Check-In (0% -> -100%)
                    const normOut2 = Math.min(1, Math.max(0, (p - 7.00) / 0.45));
                    const easeOut2 = normOut2 * (2 - normOut2);
                    const tyPct2Out = -easeOut2 * 100;
                    const op2 = normOut2 > 0.90 ? Math.max(0, 1 - (normOut2 - 0.90) / 0.10) : 1.0;
                    s2.style.display = 'flex';
                    s2.style.zIndex = '15';
                    s2.style.opacity = op2.toFixed(3);
                    s2.style.transform = `translate3d(0, ${tyPct2Out.toFixed(2)}%, 0)`;
                    s2.style.boxShadow = 'none';
                    s2.style.filter = 'none';
                    s2.style.pointerEvents = normOut2 > 0.4 ? 'none' : 'auto';
                } else {
                    // Fully active centered (6.10 -> 7.00)
                    s2.style.display = 'flex';
                    s2.style.zIndex = '20';
                    s2.style.opacity = '1';
                    s2.style.transform = 'translate3d(0, 0, 0)';
                    s2.style.boxShadow = 'none';
                    s2.style.filter = 'none';
                    s2.style.pointerEvents = 'auto';
                }

                // Video container expands smoothly over scroll (p: 6.10 -> 6.70)
                const expandNorm = Math.min(1, Math.max(0, (p - 6.10) / 0.60));
                const easeExpand = expandNorm * (2 - expandNorm);
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
                if (p >= 6.10 && p <= 7.00) {
                    if (sv && sv.paused && !sv.ended && !this._shuzoEnded && sv.currentTime < ((sv.duration || 30) - 0.25)) {
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
        // SCENE 2.3: SOMATIC AWARENESS / AFFECT LABELING (7.00 -> 7.95)
        // Standalone full-screen check-in before entering the bridge (GATED at 7.50)
        // -------------------------------------------------------------
        if (sAffect) {
            if (p >= 7.00 && p <= 7.95) {
                if (p < 7.45) {
                    // Vertical scroll IN from bottom (+100% -> 0%)
                    const normAIn = Math.min(1, Math.max(0, (p - 7.00) / 0.45));
                    const easeAIn = normAIn * (2 - normAIn);
                    const tyAIn = (1 - easeAIn) * 100;
                    sAffect.style.display = 'flex';
                    sAffect.style.zIndex = '22';
                    sAffect.style.opacity = '1';
                    sAffect.style.transform = `translate3d(0, ${tyAIn.toFixed(2)}%, 0)`;
                    sAffect.style.pointerEvents = normAIn > 0.7 ? 'auto' : 'none';
                } else if (p > 7.50) {
                    // Vertical scroll OUT upwards towards Breathing Exercise (0% -> -100%)
                    const normAOut = Math.min(1, Math.max(0, (p - 7.50) / 0.45));
                    const easeAOut = normAOut * (2 - normAOut);
                    const tyAOut = -easeAOut * 100;
                    const opA = normAOut > 0.90 ? Math.max(0, 1 - (normAOut - 0.90) / 0.10) : 1.0;
                    sAffect.style.display = 'flex';
                    sAffect.style.zIndex = '15';
                    sAffect.style.opacity = opA.toFixed(3);
                    sAffect.style.transform = `translate3d(0, ${tyAOut.toFixed(2)}%, 0)`;
                    sAffect.style.pointerEvents = 'none';
                } else {
                    // Centered full page (7.45 -> 7.50)
                    sAffect.style.display = 'flex';
                    sAffect.style.zIndex = '22';
                    sAffect.style.opacity = '1';
                    sAffect.style.transform = 'translate3d(0, 0, 0)';
                    sAffect.style.pointerEvents = 'auto';
                }
            } else {
                sAffect.style.display = 'none';
                sAffect.style.zIndex = '1';
                sAffect.style.opacity = '0';
                sAffect.style.pointerEvents = 'none';
            }
        }

        // -------------------------------------------------------------
        // SCENE 2.5: COGNITIVE BRIDGE (Merged in-place inside sAffect)
        // -------------------------------------------------------------
        if (sBridge) {
            sBridge.style.display = 'none';
            sBridge.style.zIndex = '1';
            sBridge.style.opacity = '0';
            sBridge.style.pointerEvents = 'none';
        }

        // -------------------------------------------------------------
        // SCENE 3: PHYSIOLOGICAL SIGH (Nature Video & Guided HRV) (7.50 -> 9.35)
        // Clean, tranquil biophilic breathing exercise
        // -------------------------------------------------------------
        if (s3) {
            const nv = document.getElementById('natureVideoPlayer');
            const natureExpandingBox = document.getElementById('natureExpandingBox');
            const natureSoundBtn = document.getElementById('natureSoundBtn');

            if (p >= 7.50 && p <= 9.35) {
                if (p < 7.95) {
                    // Normal vertical scroll IN from BOTTOM (+100% -> 0%)
                    const norm3In = Math.min(1, Math.max(0, (p - 7.50) / 0.45));
                    const easeIn3 = norm3In * (2 - norm3In);
                    const tyPct3In = (1 - easeIn3) * 100;
                    s3.style.display = 'flex';
                    s3.style.zIndex = '20';
                    s3.style.opacity = '1';
                    s3.style.transform = `translate3d(0, ${tyPct3In.toFixed(2)}%, 0)`;
                    s3.style.boxShadow = 'none';
                    s3.style.filter = 'none';
                    s3.style.pointerEvents = norm3In > 0.7 ? 'auto' : 'none';
                } else if (p > 8.85) {
                    // Synchronized 1:1 vertical scroll OUT upwards locked with Scene 4 entering
                    const normTrans = Math.min(1, Math.max(0, (p - 8.85) / 0.50));
                    const easeTrans = normTrans * (2 - normTrans);
                    const sceneTy = -easeTrans * 100;
                    const op3 = normTrans > 0.92 ? Math.max(0, 1 - (normTrans - 0.92) / 0.08) : 1.0;
                    s3.style.display = 'flex';
                    s3.style.zIndex = '15';
                    s3.style.opacity = op3.toFixed(3);
                    s3.style.transform = `translate3d(0, ${sceneTy.toFixed(2)}%, 0)`;
                    s3.style.boxShadow = 'none';
                    s3.style.filter = 'none';
                    s3.style.pointerEvents = normTrans > 0.4 ? 'none' : 'auto';
                } else {
                    // Fully active centered (7.95 -> 8.85)
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
                const expandNorm = Math.min(1, Math.max(0, (p - 7.80) / 0.35));
                const easeExpand = expandNorm * (2 - expandNorm);
                const videoScale = 0.92 + (0.08 * easeExpand);
                if (natureExpandingBox) {
                    natureExpandingBox.style.transform = `scale(${videoScale.toFixed(3)})`;
                }

                if (natureSoundBtn) {
                    if (p >= 7.95 && p <= 8.85) {
                        natureSoundBtn.style.opacity = '1';
                        natureSoundBtn.style.pointerEvents = 'auto';
                        natureSoundBtn.style.transform = 'translateY(0)';
                    } else if (p > 8.85 && p <= 9.35) {
                        const btnFade = Math.max(0, 1 - (p - 8.85) / 0.50);
                        natureSoundBtn.style.opacity = btnFade.toFixed(2);
                        natureSoundBtn.style.pointerEvents = 'none';
                        natureSoundBtn.style.transform = `translateY(${((1 - btnFade) * 12).toFixed(1)}px)`;
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

                    if (p > 8.85) {
                        const fadeAudio = Math.max(0, 1 - (p - 8.85) / 0.50);
                        nv.volume = this._natureMuted ? 0 : (0.35 * fadeAudio);
                        if (fadeAudio <= 0.01) nv.muted = true;
                    } else {
                        nv.muted = this._natureMuted;
                        nv.volume = this._natureMuted ? 0 : 0.35;
                    }

                    if (nv.paused && !nv._playPending && p <= 9.00) {
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

                // Guided breathing audio: auto-play in active breathing zone (7.80 -> 8.85)
                // Pause when scrolled out into Scene 4 (p > 8.85)
                const baLive = this.getBreathingAudio();
                if (baLive) {
                    if (p > 8.85) {
                        if (!baLive.paused && !baLive._playPending) {
                            baLive.pause(); // scrolled into Scene 4
                        }
                    } else if (p >= 7.80 && p <= 8.85) {
                        if (baLive.paused && !baLive._playPending && !this._breathingEnded && this._audioUnlocked) {
                            this.playBreathingAudio();
                        }
                    }
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

                // Outside Scene 3: pause breathing audio cleanly (no stutter, no retrigger)
                const baOff = this.getBreathingAudio();
                if (baOff && !baOff.paused && !baOff._playPending) {
                    baOff.pause();
                }
                this._breathingPlaying = false;
            }
        }

        // -------------------------------------------------------------
        // SCENE 4: VICTORY LOCK & ACTIONS (8.85 -> 10.00)
        // -------------------------------------------------------------
        if (s4) {
            if (p >= 8.85) {
                // Synchronized 1:1 continuous vertical scroll locked with Scene 3
                const normTrans = Math.min(1, Math.max(0, (p - 8.85) / 0.50));
                const easeTrans = normTrans * (2 - normTrans);
                const s4Ty = (1 - easeTrans) * 100;
                s4.style.display = 'flex';
                s4.style.zIndex = '20';
                s4.style.opacity = '1';
                s4.style.transform = `translate3d(0, ${s4Ty.toFixed(2)}%, 0)`;
                s4.style.filter = 'none';
                s4.style.pointerEvents = normTrans >= 0.5 ? 'auto' : 'none';

            } else {
                s4.style.display = 'none';
                s4.style.zIndex = '1';
                s4.style.opacity = '0';
                s4.style.pointerEvents = 'none';
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
         console.warn('⚠️ PRODUX DESTROY WAS CALLED! Caller:', new Error().stack);
        this.active = false;
        this.targetProgress = 0.0;
        this.currentProgress = 0.0;
        this.clearCardHover();
        this._breathingPlaying = false;
        this._breathingEnded = false;
        this._breathingStarted = false;
        this._breathingHasPlayedOnce = false;
        this._audioUnlocked = false;
        if (this._audioUnlockTimer) { clearTimeout(this._audioUnlockTimer); this._audioUnlockTimer = null; }
        const bg = document.getElementById('urgeBgMusic');
        if (bg) {
            bg.pause();
            bg.currentTime = 0;
            bg._hasPlayedOnce = false;
        }
        const sv = document.getElementById('shuzoVideoPlayer');
        if (sv) {
            if (!sv.paused) sv.pause();
            sv.currentTime = 0;
            sv.muted = true;
        }
        const nv = document.getElementById('natureVideoPlayer');
        if (nv) {
            if (!nv.paused) nv.pause();
            nv.muted = true;
        }
        // if (this._breathingAudio) {
        //     this._breathingAudio.pause();
        //     this._breathingAudio.currentTime = 0;
        //     this._breathingAudio = null;
        // }
        // const domBa = document.getElementById('breathingAudioPlayer');
        // if (domBa) {
        //     domBa.pause();
        //     domBa.currentTime = 0;
        // }
        this.syncBreathingText(0);
        const sections = document.querySelectorAll('.spotify-data-section');
        sections.forEach(s => s.classList.remove('in-view'));
        const ma = document.getElementById('mountainAmbienceAudio');
        if (ma) { ma.pause(); ma.currentTime = 0; }
        const wa = document.getElementById('waterWavesAudio');
        if (wa) { wa.pause(); wa.currentTime = 0; }
        const mv = document.getElementById('mountainTimelapseVideo');
        if (mv) { if (!mv.paused) mv.pause(); mv.currentTime = 0; }
        const wv = document.getElementById('waterWaveVideo');
        if (wv) { if (!wv.paused) wv.pause(); wv.currentTime = 0; }
        if (this._callMyNameTimer) {
            clearTimeout(this._callMyNameTimer);
            this._callMyNameTimer = null;
        }
        if (this._callMyNameAudio) {
            this._callMyNameAudio.pause();
            this._callMyNameAudio.currentTime = 0;
            this._callMyNameAudio = null;
        }
        const ca = document.getElementById('anchorCallMyNameAudio') || document.getElementById('callMyNameAudio');
        if (ca) { if (!ca.paused) ca.pause(); }
        this._callMyNameEnded = false;
        this._callMyNameMuted = true;
        this._callMyNameDismissed = false;
        const soundBtn = document.getElementById('callMyNameSoundBtn');
        if (soundBtn) {
            soundBtn.style.display = '';
            soundBtn.style.opacity = '';
            soundBtn.style.pointerEvents = '';
        }
        const sCue = document.getElementById('urge-scene-photo-cue');
        if (sCue) { sCue.style.display = 'none'; sCue.style.opacity = '0'; sCue.classList.remove('cue-fade-out'); }
        const sBridge = document.getElementById('urge-scene-bridge');
        if (sBridge) { sBridge.style.display = 'none'; sBridge.style.opacity = '0'; }
        const sAnchors = document.getElementById('urge-scene-anchors');
        if (sAnchors) { sAnchors.style.display = 'none'; sAnchors.style.opacity = '0'; sAnchors.classList.remove('anchor-deck-fade-in'); }
        if (window.nobsAudio) {
            window.nobsAudio.stopMountainWindAmbience();
            window.nobsAudio.stopOceanWaveAmbience();
        }
        this._anchorsExitAccumulator = 0;
        this._anchorsTouchAccumulator = 0;
        this._anchorsKeyPushes = 0;
        this._lastAnchorScrollTime = 0;
        this._lastAnchorTouchTime = 0;
    },

    setHasPhotos: function (val) {
        this._hasAnchorPhotos = !!val;
        if (this._hasAnchorPhotos) {
            const sCue = document.getElementById('urge-scene-photo-cue');
            if (sCue) {
                sCue.style.display = 'none';
                sCue.style.opacity = '0';
                sCue.style.pointerEvents = 'none';
            }
        }
    },

    unlockCueGate: function (hasPhotos) {
        const sCue = document.getElementById('urge-scene-photo-cue');
        const sAnchors = document.getElementById('urge-scene-anchors');
        const sFar = document.getElementById('urge-scene-far');

        // Immediately hide sCue in all cases
        if (sCue) {
            sCue.style.display = 'none';
            sCue.style.opacity = '0';
            sCue.style.pointerEvents = 'none';
            sCue.classList.remove('cue-fade-out');
        }

        if (!hasPhotos) {
            // No photos — use _skipAnchors flag so render() NEVER shows anchors section
            // Do NOT set _cueAcknowledged (that would make showAnchors true → blink)
            this._skipAnchors = true;
            this._cueAcknowledged = false;

            // Immediately hide anchors section too — no blink whatsoever
            if (sAnchors) {
                sAnchors.style.display = 'none';
                sAnchors.style.opacity = '0';
                sAnchors.style.pointerEvents = 'none';
            }

            setTimeout(() => {
                this._isFadingToAnchors = false;
                this.currentProgress = 5.45;
                this.targetProgress = 5.45;
                this.render(5.45);
            }, 400);
        } else {
            // Has photos â€” show anchor deck
            this._cueAcknowledged = true;
            this._skipAnchors = false;
            this._isFadingToAnchors = true;
            if (sAnchors) {
                sAnchors.style.display = 'flex';
                sAnchors.style.zIndex = '22';
                sAnchors.style.transform = 'translate3d(0, 0, 0)';
                sAnchors.style.pointerEvents = 'auto';
                sAnchors.classList.remove('cue-fade-out');
                sAnchors.classList.add('anchor-deck-fade-in');
            }

            setTimeout(() => {
                this._isFadingToAnchors = false;
                this.currentProgress = 3.65;
                this.targetProgress = 3.65;
                if (sCue) {
                    sCue.style.display = 'none';
                    sCue.style.opacity = '0';
                    sCue.classList.remove('cue-fade-out');
                }
                if (sAnchors) {
                    sAnchors.classList.remove('anchor-deck-fade-in');
                    sAnchors.style.opacity = '1';
                }
                this.render(3.65);
            }, 400);
        }
    },

    unlockAffectGate: function () {
        this._affectAcknowledged = true;
    }
};

// Global Event Listeners attached once on window:
(function () {
    // User gesture unlock for nature video in Scene 3
    window.addEventListener('pointerdown', function (e) {
        if (!window.nobsProduxScrollytelling || !window.nobsProduxScrollytelling.isModalOpen()) return;
        const p = window.nobsProduxScrollytelling.currentProgress;
        if (p >= 7.95 && p <= 8.85) {
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

            const exitGrid = document.getElementById('exitActionsGrid');
            const tooltip = document.getElementById('cursorGatedTooltip');
            if (exitGrid && tooltip) {
                if (exitGrid.classList.contains('is-gated') && (exitGrid === e.target || exitGrid.contains(e.target))) {
                    tooltip.style.display = 'block';
                    tooltip.style.left = (e.clientX + 14) + 'px';
                    tooltip.style.top = (e.clientY + 14) + 'px';
                } else {
                    tooltip.style.display = 'none';
                }
            }
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
            const tooltip = document.getElementById('cursorGatedTooltip');
            if (tooltip) tooltip.style.display = 'none';
        }
    }, { passive: true });

    // Auto-detect modal insertion in DOM with debounce to prevent false teardowns during Blazor re-renders
    if (typeof MutationObserver !== 'undefined' && document.body) {
        let _modalDestroyTimer = null;
        const obs = new MutationObserver(function () {
            if (window.nobsProduxScrollytelling) {
                const isOpen = window.nobsProduxScrollytelling.isModalOpen();
                if (isOpen) {
                    if (_modalDestroyTimer) {
                        clearTimeout(_modalDestroyTimer);
                        _modalDestroyTimer = null;
                    }
                    if (!window.nobsProduxScrollytelling.active) {
                        window.nobsProduxScrollytelling.init();
                    }
                } else if (window.nobsProduxScrollytelling.active && !_modalDestroyTimer) {
                    _modalDestroyTimer = setTimeout(() => {
                        _modalDestroyTimer = null;
                        if (window.nobsProduxScrollytelling && !window.nobsProduxScrollytelling.isModalOpen() && window.nobsProduxScrollytelling.active) {
                            window.nobsProduxScrollytelling.destroy();
                        }
                    }, 250);
                }
            }
        });
        obs.observe(document.body, { childList: true, subtree: true });
    }
})();


