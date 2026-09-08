window.nobsAudio = {
    audioCtx: null,
    audioCache: {},

    getAudioContext: function () {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioCtx = new AudioContext();
            }
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
        return this.audioCtx;
    },

    // Optional MP3 Sound File player with synthesized fallback
    playMp3: function (soundName, volume) {
        try {
            const masterVol = (typeof volume === 'number') ? Math.max(0, Math.min(1, volume / 100)) : 0.8;
            const src = `sounds/${soundName}.mp3`;

            let audio = this.audioCache[soundName];
            if (!audio) {
                audio = new Audio(src);
                this.audioCache[soundName] = audio;
            }
            audio.volume = masterVol;
            audio.currentTime = 0;
            audio.play().catch(err => {
                // If MP3 file is not found or blocked by browser policy, fall back silently
            });
        } catch (e) {
            // Silently handle audio play exceptions
        }
    },

    _serumEngine: null,
    _serumReleaseTimer: null,
    _ambienceBuffer: null,
    _ambienceBufferRate: 0,

    getAmbienceBuffer: function (ctx) {
        if (!this._ambienceBuffer || this._ambienceBufferRate !== ctx.sampleRate) {
            const rate = ctx.sampleRate;
            const length = Math.floor(rate * 0.35); // 350ms ambience room
            const decay = 4.0;
            const impulse = ctx.createBuffer(2, length, rate);
            const left = impulse.getChannelData(0);
            const right = impulse.getChannelData(1);
            for (let i = 0; i < length; i++) {
                const t = i / length;
                const env = Math.exp(-t * decay);
                left[i] = (Math.random() * 2 - 1) * env;
                right[i] = (Math.random() * 2 - 1) * env;
            }
            this._ambienceBuffer = impulse;
            this._ambienceBufferRate = rate;
        }
        return this._ambienceBuffer;
    },

    // Serum Bass & Lead Synth Architecture (Optimized for Continuous Real-Time Slider Performance):
    // --- BASS SYNTH ---
    // • Voicing: Auto, Always, Portamento ~700ms
    // • Env 1: Dynamic amplitude envelope
    // • Sub Osc: Direct Out, Octave -2 (pure clean sub fundamental sine)
    // • Osc A: Saw wave, Octave -2, Unison 7 (detuned supersaw stack)
    // =========================================================================
    // SERUM BASS SYNTH ENGINE (DC Breaks "Von Dutch" Authentic Sound Architecture)
    // =========================================================================
    // • Sub Bass: Pitch-enveloped Sine (-2 Octaves) with fast 35ms pitch-drop attack + Notch filter
    // • Oscillator A: Sawtooth Stack (-2 Octaves, Unison 7) as FM Carrier
    // • Oscillator B: Sawtooth Stack (+1 Octave + 4 Semitones / +16 Semitones, Unison 7) as FM Modulator
    // • FM from B: Subtle FM modulation into Osc A for the signature bright electro bite
    // • Filter: MG Low 24 (24dB/oct) lowpass swept across 160Hz -> 2200Hz
    // • ShaperBox / Kickstart: 130 BPM offbeat pumping cycle with sub transient re-trigger
    // • Portamento: 700ms smooth glide across F# Minor (46.25Hz -> 92.5Hz -> 185.0Hz)
    // =========================================================================
    _initSerumEngine: function (ctx, bassFreq, leadFreq, filterCutoff, oscBRatio, masterVol, normVol, now) {
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.0001, now);
        masterGain.gain.exponentialRampToValueAtTime(masterVol, now + 0.025);
        masterGain.connect(ctx.destination);

        // Kickstart / ShaperBox Offbeat Pumping Gain Node
        const kickstartGain = ctx.createGain();
        kickstartGain.gain.setValueAtTime(1.0, now);
        kickstartGain.connect(masterGain);

        const sources = [];

        // ==========================================
        // 1. SUB BASS: Sine (-2 Octaves) with Pitch Envelope Attack (DC Breaks Sound Design)
        // ==========================================
        const subOsc = ctx.createOscillator();
        subOsc.type = 'sine';
        // Pitch drop attack envelope (zappy transient punch)
        subOsc.frequency.setValueAtTime(bassFreq * 2.0, now);
        subOsc.frequency.exponentialRampToValueAtTime(bassFreq, now + 0.038);

        const subGain = ctx.createGain();
        const subVol = 0.75 + (1 - normVol) * 0.18;
        subGain.gain.setValueAtTime(0.0001, now);
        subGain.gain.exponentialRampToValueAtTime(subVol, now + 0.020);

        // Notch filter to scoop mud between sub fundamental and harmonics (DC Breaks Notch EQ)
        const subNotch = ctx.createBiquadFilter();
        subNotch.type = 'notch';
        subNotch.frequency.setValueAtTime(360, now);
        subNotch.Q.setValueAtTime(1.8, now);

        subOsc.connect(subNotch);
        subNotch.connect(subGain);
        subGain.connect(kickstartGain); // Direct Out into Kickstart
        subOsc.start(now);
        sources.push(subOsc);

        // ==========================================
        // 2. OSC A (CARRIER): Saw Wave, Octave -2, Unison 7
        // ==========================================
        const oscAGain = ctx.createGain();
        const oscAVol = (0.22 + Math.pow(normVol, 1.2) * 0.30) / 7;
        oscAGain.gain.setValueAtTime(0.0001, now);
        oscAGain.gain.exponentialRampToValueAtTime(oscAVol, now + 0.020);

        const unison7A = [-8, -4, -1.5, 0, 1.5, 4, 8];
        const sawOscsA = [];
        unison7A.forEach(cents => {
            const sawOsc = ctx.createOscillator();
            sawOsc.type = 'sawtooth';
            sawOsc.detune.setValueAtTime(cents, now);
            sawOsc.frequency.setValueAtTime(bassFreq, now);
            sawOsc.connect(oscAGain);
            sawOsc.start(now);
            sawOscsA.push(sawOsc);
            sources.push(sawOsc);
        });

        // ==========================================
        // 3. OSC B (MODULATOR): Saw Wave, Octave +1, Semitones +4 (+16 Semitones, Unison 7)
        // ==========================================
        // FM FROM B: Modulates Osc A frequency for signature Von Dutch bright harmonic timbre
        const fmGain = ctx.createGain();
        const fmDepth = 30 + Math.pow(normVol, 1.3) * 220; // Smooth musical FM depth
        fmGain.gain.setValueAtTime(fmDepth, now);

        const oscBGain = ctx.createGain();
        const oscBVol = (Math.pow(normVol, 1.3) * 0.24) / 7;
        oscBGain.gain.setValueAtTime(0.0001, now);
        oscBGain.gain.exponentialRampToValueAtTime(oscBVol, now + 0.020);

        const unison7B = [-9, -4, -1.5, 0, 1.5, 4, 9];
        const sawOscsB = [];
        unison7B.forEach(cents => {
            const sawOsc = ctx.createOscillator();
            sawOsc.type = 'sawtooth';
            sawOsc.detune.setValueAtTime(cents, now);
            sawOsc.frequency.setValueAtTime(bassFreq * oscBRatio, now);
            sawOsc.connect(oscBGain);
            sawOsc.connect(fmGain); // Connect Modulator into FM Gain
            sawOsc.start(now);
            sawOscsB.push(sawOsc);
            sources.push(sawOsc);
        });

        // Wire FM from B into each Osc A carrier frequency AudioParam
        sawOscsA.forEach(carrier => {
            try { fmGain.connect(carrier.frequency); } catch (e) { }
        });

        // ==========================================
        // 4. MG LOW 24 FILTER (24dB/oct Cascaded Lowpass)
        // ==========================================
        const mgLow24_1 = ctx.createBiquadFilter();
        const mgLow24_2 = ctx.createBiquadFilter();
        mgLow24_1.type = 'lowpass';
        mgLow24_2.type = 'lowpass';
        const filterQ = 1.20 + Math.pow(normVol, 1.1) * 0.65;
        mgLow24_1.Q.setValueAtTime(filterQ * 0.707, now);
        mgLow24_2.Q.setValueAtTime(filterQ * 0.707, now);
        mgLow24_1.frequency.setValueAtTime(filterCutoff, now);
        mgLow24_2.frequency.setValueAtTime(filterCutoff, now);

        // ==========================================
        // 5. MID RANGE BOOST EQ (900Hz Presence Punch)
        // ==========================================
        const midBoost = ctx.createBiquadFilter();
        midBoost.type = 'peaking';
        midBoost.frequency.setValueAtTime(900, now);
        midBoost.Q.setValueAtTime(1.2, now);
        midBoost.gain.setValueAtTime(2.0 + Math.pow(normVol, 1.3) * 5.0, now);

        // High shelf to tame excess treble
        const highTame = ctx.createBiquadFilter();
        highTame.type = 'highshelf';
        highTame.frequency.setValueAtTime(3600, now);
        highTame.gain.setValueAtTime(-4.0, now);

        // ==========================================
        // 6. DIODE / ANALOG TUBE SATURATION
        // ==========================================
        const tubeDistortion = ctx.createWaveShaper();
        const samples = 1024;
        const curve = new Float32Array(samples);
        const tubeDrive = 1.8 + Math.pow(normVol, 1.3) * 3.8;
        for (let i = 0; i < samples; ++i) {
            const x = (i * 2) / samples - 1;
            const satX = x + 0.05 * (x * x);
            curve[i] = Math.tanh(tubeDrive * satX);
        }
        tubeDistortion.curve = curve;

        // Route Saws -> MG Low 24 -> Mid Boost -> High Tame -> Tube Saturation -> Kickstart
        oscAGain.connect(mgLow24_1);
        oscBGain.connect(mgLow24_1);
        mgLow24_1.connect(mgLow24_2);
        mgLow24_2.connect(midBoost);
        midBoost.connect(highTame);
        highTame.connect(tubeDistortion);
        tubeDistortion.connect(kickstartGain);

        // ==========================================
        // 7. SHAPERBOX / KICKSTART 2 OFFBEAT PUMPING (130 BPM)
        // ==========================================
        function triggerKickstartPump(startTime, curCutoff, curBassFreq, curFmDepth) {
            try {
                // 1. ShaperBox Offbeat Pumping Envelope
                kickstartGain.gain.cancelScheduledValues(startTime);
                kickstartGain.gain.setValueAtTime(0.08, startTime);
                kickstartGain.gain.exponentialRampToValueAtTime(1.0, startTime + 0.135);

                // 2. Sub Pitch Attack Envelope Re-trigger (Zappy punch on every beat)
                const baseFreq = curBassFreq || bassFreq;
                subOsc.frequency.cancelScheduledValues(startTime);
                subOsc.frequency.setValueAtTime(baseFreq * 1.8, startTime);
                subOsc.frequency.exponentialRampToValueAtTime(baseFreq, startTime + 0.038);

                // 3. Filter Pluck on Pump
                const peakCutoff = Math.min(2600, (curCutoff || filterCutoff) * 1.35);
                mgLow24_1.frequency.cancelScheduledValues(startTime);
                mgLow24_2.frequency.cancelScheduledValues(startTime);
                mgLow24_1.frequency.setValueAtTime(peakCutoff, startTime);
                mgLow24_2.frequency.setValueAtTime(peakCutoff, startTime);
                mgLow24_1.frequency.exponentialRampToValueAtTime(curCutoff || filterCutoff, startTime + 0.150);
                mgLow24_2.frequency.exponentialRampToValueAtTime(curCutoff || filterCutoff, startTime + 0.150);
            } catch (e) { }
        }

        triggerKickstartPump(now, filterCutoff, bassFreq, fmDepth);

        return {
            masterGain,
            kickstartGain,
            subOsc,
            subGain,
            sawOscsA,
            sawOscsB,
            oscAGain,
            oscBGain,
            fmGain,
            mgLow24_1,
            mgLow24_2,
            midBoost,
            tubeDistortion,
            sources,
            triggerKickstartPump,
            lastPumpTime: now,
            isStopping: false
        };
    },

    playFmSynthBass: function (volume) {
        try {
            const ctx = this.getAudioContext();
            if (!ctx) return;

            const now = ctx.currentTime;
            const volPercent = (typeof volume === 'number') ? Math.max(0, Math.min(100, volume)) : 80;

            // If 0% volume, immediately fade out and stop
            if (volPercent === 0) {
                if (this._serumEngine) {
                    const stopNow = ctx.currentTime;
                    this._serumEngine.isStopping = true;
                    this._serumEngine.masterGain.gain.cancelScheduledValues(stopNow);
                    this._serumEngine.masterGain.gain.setValueAtTime(this._serumEngine.masterGain.gain.value, stopNow);
                    this._serumEngine.masterGain.gain.linearRampToValueAtTime(0.0001, stopNow + 0.015);
                    const eng = this._serumEngine;
                    this._serumEngine = null;
                    setTimeout(() => {
                        try { eng.sources.forEach(s => s.stop()); } catch (e) { }
                    }, 25);
                }
                return;
            }

            const normVol = volPercent / 100; // 0.01 to 1.0
            const masterVol = Math.max(0.04, Math.min(1.0, normVol));

            // Musical Pitch Mapping in the Key of Von Dutch (F# Minor):
            // Bass glides across 2 octaves from F#1 (46.25Hz) -> F#2 (92.5Hz) -> F#3 (185.0Hz)
            const targetBassFreq = 46.25 * Math.pow(2, (normVol * 24) / 12);
            const targetLeadFreq = targetBassFreq * 2.0;
            const filterCutoff = 160 + Math.pow(normVol, 1.4) * 1850; // 160Hz (deep sub) -> 2010Hz (bright crunchy electro bite)
            const fmDepth = 30 + Math.pow(normVol, 1.3) * 220; // Smooth FM depth
            const oscBRatio = Math.pow(2, 16 / 12); // Transposed +16 semitones (+1 Oct +4 Semi)

            // Clear any pending release timer so the engine stays alive continuously during active sliding
            if (this._serumReleaseTimer) {
                clearTimeout(this._serumReleaseTimer);
                this._serumReleaseTimer = null;
            }

            let eng = this._serumEngine;
            if (!eng || eng.isStopping) {
                // Initialize new continuous voice
                eng = this._initSerumEngine(ctx, targetBassFreq, targetLeadFreq, filterCutoff, oscBRatio, masterVol, normVol, now);
                this._serumEngine = eng;
            } else {
                // REAL-TIME ZERO-LAG CONTINUOUS UPDATE WITH 700MS PORTAMENTO GLIDE
                const portamentoTimeConstant = 0.16; // Smooth 700ms portamento curve

                // Master gain tracking
                eng.masterGain.gain.cancelScheduledValues(now);
                eng.masterGain.gain.setValueAtTime(eng.masterGain.gain.value, now);
                eng.masterGain.gain.linearRampToValueAtTime(masterVol, now + 0.025);

                // Portamento pitch glide on Sub, Osc A, and Osc B
                eng.subOsc.frequency.setTargetAtTime(targetBassFreq, now, portamentoTimeConstant);
                eng.sawOscsA.forEach(osc => osc.frequency.setTargetAtTime(targetBassFreq, now, portamentoTimeConstant));
                eng.sawOscsB.forEach(osc => osc.frequency.setTargetAtTime(targetBassFreq * oscBRatio, now, portamentoTimeConstant));

                // Dynamic Levels, FM Depth & Filter
                eng.subGain.gain.setTargetAtTime(0.75 + (1 - normVol) * 0.18, now, 0.035);
                eng.oscAGain.gain.setTargetAtTime((0.22 + Math.pow(normVol, 1.2) * 0.30) / 7, now, 0.035);
                eng.oscBGain.gain.setTargetAtTime((Math.pow(normVol, 1.3) * 0.24) / 7, now, 0.035);
                eng.fmGain.gain.setTargetAtTime(fmDepth, now, 0.035);

                eng.mgLow24_1.frequency.setTargetAtTime(filterCutoff, now, 0.035);
                eng.mgLow24_2.frequency.setTargetAtTime(filterCutoff, now, 0.035);
                eng.midBoost.gain.setTargetAtTime(2.0 + Math.pow(normVol, 1.3) * 5.0, now, 0.035);

                // Check Kickstart / ShaperBox offbeat pump trigger (130 BPM = 461.5ms per beat)
                if (now - eng.lastPumpTime >= 0.461) {
                    eng.triggerKickstartPump(now, filterCutoff, targetBassFreq, fmDepth);
                    eng.lastPumpTime = now;
                }
            }

            // Schedule smooth natural release when sliding stops (350ms hold, then 200ms fade)
            this._serumReleaseTimer = setTimeout(() => {
                if (this._serumEngine) {
                    const stopNow = ctx.currentTime;
                    this._serumEngine.isStopping = true;
                    this._serumEngine.masterGain.gain.cancelScheduledValues(stopNow);
                    this._serumEngine.masterGain.gain.setValueAtTime(this._serumEngine.masterGain.gain.value, stopNow);
                    this._serumEngine.masterGain.gain.exponentialRampToValueAtTime(0.0001, stopNow + 0.20);

                    const stoppingEng = this._serumEngine;
                    setTimeout(() => {
                        if (stoppingEng) {
                            try {
                                stoppingEng.sources.forEach(s => s.stop());
                            } catch (e) { }
                            if (this._serumEngine === stoppingEng) {
                                this._serumEngine = null;
                            }
                        }
                    }, 220);
                }
            }, 350);

        } catch (e) {
            console.error("Serum Bass & Lead Synth Error", e);
        }
    },

    playThud: function (volume) {
        this.playMp3('thud', volume);
        try {
            const ctx = this.getAudioContext();
            if (!ctx) return;
            
            const gainNode = ctx.createGain();
            const now = ctx.currentTime;
            
            const masterVol = (typeof volume === 'number') ? volume / 100 : 0.8;
            gainNode.gain.setValueAtTime(masterVol * 0.9, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            gainNode.connect(ctx.destination);
            
            const osc = ctx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(95, now);
            osc.frequency.exponentialRampToValueAtTime(25, now + 0.28);
            
            osc.connect(gainNode);
            osc.start(now);
            osc.stop(now + 0.3);
        } catch (e) {
            console.error("Audio thud error", e);
        }
    },
    
    playShimmer: function (volume) {
        this.playMp3('shimmer', volume);
        try {
            const ctx = this.getAudioContext();
            if (!ctx) return;
            
            const gainNode = ctx.createGain();
            const now = ctx.currentTime;
            
            const masterVol = (typeof volume === 'number') ? volume / 100 : 0.8;
            gainNode.gain.setValueAtTime(masterVol * 0.45, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
            gainNode.connect(ctx.destination);
            
            const notes = [1318.51, 1661.22, 1975.53, 2637.02, 3322.44, 3951.07];
            notes.forEach((freq, idx) => {
                const noteTime = now + (idx * 0.08);
                const osc = ctx.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, noteTime);
                
                const noteGain = ctx.createGain();
                noteGain.gain.setValueAtTime(0, now);
                noteGain.gain.linearRampToValueAtTime(0.3, noteTime);
                noteGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.8);
                
                osc.connect(noteGain);
                noteGain.connect(gainNode);
                
                osc.start(noteTime);
                osc.stop(noteTime + 0.85);
            });
        } catch (e) {
            console.error("Audio shimmer error", e);
        }
    },

    playChime: function (volume) {
        this.playThud(volume);
    },

    // Pencil scratch: filtered noise burst that sweeps like a pen crossing paper
    playPencilScratch: function (volume) {
        try {
            const ctx = this.getAudioContext();
            if (!ctx) return;

            const now = ctx.currentTime;
            const masterVol = (typeof volume === 'number') ? Math.max(0, Math.min(1, volume / 100)) : 0.6;
            const duration = 0.38; // matches the CSS animation duration

            // White noise buffer
            const bufferSize = ctx.sampleRate * duration;
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1);
            }

            const noiseSource = ctx.createBufferSource();
            noiseSource.buffer = noiseBuffer;

            // Bandpass filter to shape "paper friction" texture
            const bandpass = ctx.createBiquadFilter();
            bandpass.type = 'bandpass';
            bandpass.frequency.setValueAtTime(3200, now);
            bandpass.frequency.linearRampToValueAtTime(1800, now + duration);
            bandpass.Q.setValueAtTime(1.8, now);

            // Highpass to cut rumble
            const highpass = ctx.createBiquadFilter();
            highpass.type = 'highpass';
            highpass.frequency.setValueAtTime(1200, now);

            // Amplitude envelope: quick attack, sustained scratch, fast fade
            const gainNode = ctx.createGain();
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(masterVol * 0.55, now + 0.025);
            gainNode.gain.setValueAtTime(masterVol * 0.55, now + duration * 0.7);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

            noiseSource.connect(highpass);
            highpass.connect(bandpass);
            bandpass.connect(gainNode);
            gainNode.connect(ctx.destination);

            noiseSource.start(now);
            noiseSource.stop(now + duration);
        } catch (e) {
            console.error('Pencil scratch audio error', e);
        }
    },

    activeCustomAudio: null,
    _activeAudioResolve: null,

    playCustomAudio: function (dataUrl, volume) {
        return new Promise((resolve) => {
            try {
                if (!dataUrl) {
                    resolve();
                    return;
                }
                if (this.activeCustomAudio) {
                    this.activeCustomAudio.pause();
                    this.activeCustomAudio.currentTime = 0;
                    if (this._activeAudioResolve) {
                        this._activeAudioResolve();
                        this._activeAudioResolve = null;
                    }
                }
                const vol = (typeof volume === 'number') ? Math.max(0, Math.min(100, volume)) : 80;
                const audio = new Audio(dataUrl);
                this.activeCustomAudio = audio;
                this._activeAudioResolve = resolve;

                audio.volume = Math.max(0.0, Math.min(1.0, vol / 100));
                audio.onended = () => {
                    this.activeCustomAudio = null;
                    this._activeAudioResolve = null;
                    resolve();
                };
                audio.onerror = () => {
                    this.activeCustomAudio = null;
                    this._activeAudioResolve = null;
                    resolve();
                };
                audio.play().catch(err => {
                    console.warn('Custom audio playback error', err);
                    this.activeCustomAudio = null;
                    this._activeAudioResolve = null;
                    resolve();
                });
            } catch (e) {
                console.error('Play custom audio error', e);
                resolve();
            }
        });
    },

    stopAllAlarms: function () {
        try {
            if (this.activeCustomAudio) {
                this.activeCustomAudio.pause();
                this.activeCustomAudio.currentTime = 0;
                this.activeCustomAudio = null;
            }
            if (this._activeAudioResolve) {
                this._activeAudioResolve();
                this._activeAudioResolve = null;
            }
        } catch (e) { }
    },

    playFileAudio: function (src, volume) {
        return new Promise((resolve) => {
            try {
                if (this.activeCustomAudio) {
                    this.activeCustomAudio.pause();
                    this.activeCustomAudio.currentTime = 0;
                    if (this._activeAudioResolve) {
                        this._activeAudioResolve();
                        this._activeAudioResolve = null;
                    }
                }
                const vol = (typeof volume === 'number') ? Math.max(0, Math.min(100, volume)) : 80;
                const audio = new Audio(src);
                this.activeCustomAudio = audio;
                this._activeAudioResolve = resolve;

                audio.volume = Math.max(0.0, Math.min(1.0, vol / 100));
                audio.onended = () => {
                    this.activeCustomAudio = null;
                    this._activeAudioResolve = null;
                    resolve();
                };
                audio.onerror = () => {
                    this.activeCustomAudio = null;
                    this._activeAudioResolve = null;
                    resolve();
                };
                audio.play().catch(err => {
                    console.warn('Audio playback error', err);
                    this.activeCustomAudio = null;
                    this._activeAudioResolve = null;
                    resolve();
                });
            } catch (e) {
                console.error('Audio error', e);
                resolve();
            }
        });
    },

    // Alarm & Notification Synthesizer Audio
    playWakeAlarm: function (soundName, volume, customDataUrl) {
        try {
            const vol = (typeof volume === 'number') ? Math.max(0, Math.min(100, volume)) : 80;
            if (soundName === 'custom') {
                if (customDataUrl) {
                    return this.playCustomAudio(customDataUrl, vol);
                }
            }

            // Audio files from wwwroot/sounds/
            switch (soundName) {
                case 'zen_bell':
                    return this.playFileAudio('sounds/Zen_Singing_Bowl.mp3', vol);
                case '528hz_tone':
                case 'binaural_pulse':
                    return this.playFileAudio('sounds/528hz-pure-tone.mp3', vol);
                case 'digital_alarm':
                    return this.playFileAudio('sounds/digital_alarm_clock.mp3', vol);
                case 'fm_bass':
                    return this.playFileAudio('sounds/FM_synth_bass.wav', vol);
                case 'xiaomi_chimes':
                    return this.playFileAudio('sounds/xiaomi_chimes.mp3', vol);
                case 'kling_pulse':
                    return this.playFileAudio('sounds/kling_pulse.mp3', vol);
            }

            if (vol === 0) return Promise.resolve();

            // Synthesizers for gentle_chime & soft_pulse
            const masterVol = Math.max(0.001, vol / 100);
            const ctx = this.getAudioContext();
            if (!ctx) return Promise.resolve();
            const now = ctx.currentTime;

            if (soundName === 'soft_pulse') {
                [0, 0.28].forEach((delay, i) => {
                    const osc = ctx.createOscillator();
                    const g = ctx.createGain();
                    osc.type = 'sine';
                    const freq = i === 0 ? 587.33 : 440.0;
                    osc.frequency.setValueAtTime(freq, now + delay);
                    g.gain.setValueAtTime(0, now + delay);
                    g.gain.linearRampToValueAtTime(masterVol * 0.45, now + delay + 0.03);
                    g.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.9);
                    osc.connect(g);
                    g.connect(ctx.destination);
                    osc.start(now + delay);
                    osc.stop(now + delay + 0.95);
                });
                return new Promise(resolve => setTimeout(resolve, 1250));
            }

            // Default gentle chime synthesizer
            const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
            notes.forEach((freq, idx) => {
                const noteTime = now + (idx * 0.12);
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, noteTime);
                g.gain.setValueAtTime(0, noteTime);
                g.gain.linearRampToValueAtTime(masterVol * 0.45, noteTime + 0.02);
                g.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.2);
                osc.connect(g);
                g.connect(ctx.destination);
                osc.start(noteTime);
                osc.stop(noteTime + 1.25);
            });
            return new Promise(resolve => setTimeout(resolve, 1750));
        } catch (e) {
            console.error('Wake alarm audio error', e);
            return Promise.resolve();
        }
    },

    playCutoffAlert: function (soundName, volume, customDataUrl) {
        try {
            const vol = (typeof volume === 'number') ? Math.max(0, Math.min(100, volume)) : 80;
            if (soundName === 'custom') {
                if (customDataUrl) {
                    return this.playCustomAudio(customDataUrl, vol);
                }
            }

            // Audio files from wwwroot/sounds/
            switch (soundName) {
                case 'zen_bell':
                    return this.playFileAudio('sounds/Zen_Singing_Bowl.mp3', vol);
                case 'fm_bass':
                    return this.playFileAudio('sounds/FM_synth_bass.wav', vol);
                case '528hz_tone':
                case 'binaural_pulse':
                    return this.playFileAudio('sounds/528hz-pure-tone.mp3', vol);
                case 'digital_alarm':
                    return this.playFileAudio('sounds/digital_alarm_clock.mp3', vol);
                case 'xiaomi_chimes':
                    return this.playFileAudio('sounds/xiaomi_chimes.mp3', vol);
                case 'kling_pulse':
                    return this.playFileAudio('sounds/kling_pulse.mp3', vol);
            }

            if (vol === 0) return Promise.resolve();

            // Synthesizers for soft_pulse & gentle_chime
            const masterVol = Math.max(0.001, vol / 100);
            const ctx = this.getAudioContext();
            if (!ctx) return Promise.resolve();
            const now = ctx.currentTime;

            if (soundName === 'gentle_chime') {
                const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
                notes.forEach((freq, idx) => {
                    const noteTime = now + (idx * 0.12);
                    const osc = ctx.createOscillator();
                    const g = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, noteTime);
                    g.gain.setValueAtTime(0, noteTime);
                    g.gain.linearRampToValueAtTime(masterVol * 0.45, noteTime + 0.02);
                    g.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.2);
                    osc.connect(g);
                    g.connect(ctx.destination);
                    osc.start(noteTime);
                    osc.stop(noteTime + 1.25);
                });
                return new Promise(resolve => setTimeout(resolve, 1750));
            }

            // Default soft pulse synthesizer
            [0, 0.28].forEach((delay, i) => {
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.type = 'sine';
                const freq = i === 0 ? 587.33 : 440.0;
                osc.frequency.setValueAtTime(freq, now + delay);
                g.gain.setValueAtTime(0, now + delay);
                g.gain.linearRampToValueAtTime(masterVol * 0.45, now + delay + 0.03);
                g.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.9);
                osc.connect(g);
                g.connect(ctx.destination);
                osc.start(now + delay);
                osc.stop(now + delay + 0.95);
            });
            return new Promise(resolve => setTimeout(resolve, 1250));
        } catch (e) {
            console.error('Cutoff alert audio error', e);
            return Promise.resolve();
        }
    }
};

window.nobsNotification = {
    requestPermission: async function () {
        if ('Notification' in window) {
            return await Notification.requestPermission();
        }
        return 'denied';
    },

    show: function (title, body, iconUrl) {
        if ('Notification' in window && Notification.permission === 'granted') {
            try {
                const n = new Notification(title, {
                    body: body,
                    icon: iconUrl || '/images/favicon.png',
                    silent: true
                });
                n.onclick = function () {
                    window.focus();
                    n.close();
                };
            } catch (e) {
                console.error("Desktop notification error", e);
            }
        }
    }
};
