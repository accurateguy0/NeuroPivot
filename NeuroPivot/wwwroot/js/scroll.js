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
            const sv = document.getElementById('shuzoVideoPlayer');
            if (sv) { sv.muted = true; }
            const nv = document.getElementById('natureVideoPlayer');
            if (nv) { nv.muted = true; }
        }
        this.active = true;

        // Render first frame immediately
        this.render(this.currentProgress);

        // Start 60/120fps physics loop if not already running
        if (!this.animFrame) {
            const loop = () => {
                if (this.active) {
                    const diff = this.targetProgress - this.currentProgress;
                    if (Math.abs(diff) > 0.0005) {
                        this.currentProgress += diff * 0.15; // Smooth exponential lerp
                    } else if (this.currentProgress !== this.targetProgress) {
                        this.currentProgress = this.targetProgress;
                    }
                    this.render(this.currentProgress);
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
            this.targetProgress = 4.1;
            const nv = document.getElementById('natureVideoPlayer');
            if (nv) {
                if (nv.readyState === 0) nv.load();
                nv.play().catch(() => {});
            }
        } else if (typeof target === 'number') {
            const map = [0.0, 1.2, 2.9, 4.1, 5.1];
            const idx = Math.floor(target);
            if (idx >= 0 && idx < map.length) {
                this.targetProgress = map[idx];
            } else {
                this.targetProgress = Math.max(0.0, Math.min(5.5, target));
            }
        }
    },

    onWheel: function (e) {
        if (!this.isModalOpen()) return;
        e.preventDefault();
        e.stopPropagation();

        // Standardize delta across different mice & trackpads
        let dy = e.deltaY;
        if (e.deltaMode === 1) dy *= 25;
        else if (e.deltaMode === 2) dy *= 350;

        // Smooth delta clamped for controlled, luxurious pacing
        const clampedDy = Math.max(-100, Math.min(100, dy));
        const delta = (clampedDy / 240) * 0.22;
        this.targetProgress = Math.max(0.0, Math.min(5.5, this.targetProgress + delta));
    },

    onTouchStart: function (e) {
        if (!this.isModalOpen()) return;
        if (e.touches && e.touches.length > 0) {
            this._touchStartY = e.touches[0].clientY;
        }
    },

    onTouchMove: function (e) {
        if (!this.isModalOpen() || this._touchStartY === undefined) return;
        if (e.touches && e.touches.length > 0) {
            const currentY = e.touches[0].clientY;
            const delta = (this._touchStartY - currentY) * 0.005;
            this._touchStartY = currentY;
            this.targetProgress = Math.max(0.0, Math.min(5.5, this.targetProgress + delta));
            e.preventDefault();
        }
    },

    onKeyDown: function (e) {
        if (!this.isModalOpen()) return;
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            this.targetProgress = Math.min(5.5, this.targetProgress + 0.28);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            this.targetProgress = Math.max(0.0, this.targetProgress - 0.28);
        } else if (e.key === ' ') {
            e.preventDefault();
            this.targetProgress = Math.min(5.5, this.targetProgress + 0.55);
        }
    },

    render: function (p) {
        const s0 = document.getElementById('urge-scene-0');
        const s2 = document.getElementById('urge-scene-2');
        const s3 = document.getElementById('urge-scene-3');
        const s4 = document.getElementById('urge-scene-4');
        const bg = document.getElementById('urgeBgMusic');

        // Manage ambient background music ("The City of Lost Hope")
        if (bg && !bg.muted) {
            if (p < 2.4) {
                bg.volume = 0.45;
                if (bg.paused) bg.play().catch(() => {});
            } else if (p >= 2.4 && p <= 2.7) {
                const fadeNorm = (p - 2.4) / 0.3;
                bg.volume = Math.max(0, 0.45 * (1 - fadeNorm));
            } else {
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

                // Phase 1 (p: 0.0 -> 1.2): Vertical scroll until Day Diary is in view
                // Phase 2 (p: 1.2 -> 2.4): Pin scroller; only cards glide diagonally
                if (dataStream && dataContainer) {
                    const maxScroll = Math.max(0, dataStream.scrollHeight - dataContainer.clientHeight + 30);
                    const diaryOffset = diarySection ? Math.min(maxScroll, Math.max(0, diarySection.offsetTop - 15)) : maxScroll;

                    let currentScrollY = 0;
                    if (p < 1.2) {
                        const vertRatio = p / 1.2;
                        currentScrollY = vertRatio * diaryOffset;
                    } else {
                        // Locked / pinned on Day Diary
                        currentScrollY = diaryOffset;
                    }
                    dataStream.style.transform = `translate3d(0, ${(-currentScrollY).toFixed(1)}px, 0)`;
                }

                if (track && cards.length > 0) {
                    let diaryRatio = 0;
                    if (p >= 1.2) {
                        diaryRatio = Math.min(1.0, (p - 1.2) / 1.15);
                    }
                    const maxShiftX = (cards.length - 1) * 360;
                    const maxShiftY = (cards.length - 1) * 75;

                    track.style.transform = `translate3d(${(-diaryRatio * maxShiftX).toFixed(1)}px, ${(-diaryRatio * maxShiftY).toFixed(1)}px, 0)`;

                    const focalIndex = diaryRatio * (cards.length - 1);
                    cards.forEach((c, idx) => {
                        const dist = Math.abs(idx - focalIndex);
                        const isFocal = dist < 0.65;
                        const zIndex = 50 - Math.round(dist * 5);
                        c.style.zIndex = zIndex;

                        if (isFocal) {
                            c.classList.add('active-focus');
                        } else {
                            c.classList.remove('active-focus');
                        }
                    });

                    // Continuous hit-testing for stationary cursor (works during scroll & idle hover)
                    let hoveredCard = null;
                    if (this._mouseX !== undefined && this._mouseY !== undefined) {
                        const el = document.elementFromPoint(this._mouseX, this._mouseY);
                        if (el) {
                            hoveredCard = el.closest('.produx-diagonal-card');
                        }
                    }

                    if (hoveredCard) {
                        track.classList.add('has-hover');
                        cards.forEach(c => {
                            if (c === hoveredCard) {
                                c.classList.add('is-hovered');
                            } else {
                                c.classList.remove('is-hovered');
                            }
                        });
                    } else {
                        track.classList.remove('has-hover');
                        cards.forEach(c => c.classList.remove('is-hovered'));
                    }
                }
            } else if (p >= 2.4 && p <= 2.7) {
                const norm = (p - 2.4) / 0.3;
                const op = Math.max(0, 1 - norm);
                const ty = -norm * 40;
                const sc = 1 - norm * 0.06;
                const bl = norm * 6;
                s0.style.display = 'flex';
                s0.style.opacity = op.toFixed(3);
                s0.style.transform = `scale(${sc.toFixed(3)}) translate3d(0, ${ty.toFixed(1)}px, 0)`;
                s0.style.filter = `blur(${bl.toFixed(1)}px)`;
                s0.style.pointerEvents = op > 0.5 ? 'auto' : 'none';
            } else {
                s0.style.display = 'none';
                s0.style.opacity = '0';
                s0.style.pointerEvents = 'none';
            }
        }

        // -------------------------------------------------------------
        // SCENE 2: THE RAW SPARK (Motivation Video) (2.50 -> 3.80)
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

            if (p >= 2.50 && p <= 3.80) {
                let sceneOp = 1.0;
                let sceneTy = 0;
                let sceneBl = 0;

                if (p < 2.80) {
                    const norm = (p - 2.50) / 0.30;
                    sceneOp = norm;
                    sceneTy = (1 - norm) * 40;
                    sceneBl = (1 - norm) * 8;
                } else if (p > 3.50) {
                    const norm = (p - 3.50) / 0.30;
                    sceneOp = Math.max(0, 1 - norm);
                    sceneTy = -norm * 40;
                    sceneBl = norm * 8;
                }

                s2.style.display = 'flex';
                s2.style.opacity = sceneOp.toFixed(3);
                s2.style.transform = `translate3d(0, ${sceneTy.toFixed(1)}px, 0)`;
                s2.style.filter = `blur(${sceneBl.toFixed(1)}px)`;
                s2.style.pointerEvents = sceneOp > 0.5 ? 'auto' : 'none';

                // Video container expands smoothly
                const expandNorm = Math.min(1, Math.max(0, (p - 2.50) / 0.50));
                const videoScale = 0.58 + (0.42 * expandNorm);
                if (expandingBox) {
                    expandingBox.style.transform = `scale(${videoScale.toFixed(3)})`;
                }

                // Sound button reveals when full size
                const controlsRevealed = expandNorm >= 0.90;
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
                if (p >= 2.80 && p <= 3.50) {
                    if (sv && sv.paused && !sv.ended && !this._shuzoEnded) {
                        sv.play().catch(() => {});
                    }
                }
            } else {
                s2.style.display = 'none';
                s2.style.opacity = '0';
                s2.style.pointerEvents = 'none';

                if (sv && !sv.paused) {
                    sv.pause();
                }
            }
        }

        // -------------------------------------------------------------
        // SCENE 3: PHYSIOLOGICAL SIGH (Nature Video) (3.60 -> 4.80)
        // -------------------------------------------------------------
        if (s3) {
            const nv = document.getElementById('natureVideoPlayer');
            const natureSoundBtn = document.getElementById('natureSoundBtn');

            if (p >= 3.60 && p <= 4.80) {
                let sceneOp = 1.0;
                let sceneTy = 0;
                let sceneBl = 0;

                if (p < 3.90) {
                    const norm = (p - 3.60) / 0.30;
                    sceneOp = norm;
                    sceneTy = (1 - norm) * 40;
                    sceneBl = (1 - norm) * 8;
                } else if (p > 4.55) {
                    const norm = (p - 4.55) / 0.25;
                    sceneOp = Math.max(0, 1 - norm);
                    sceneTy = -norm * 40;
                    sceneBl = norm * 8;
                }

                s3.style.display = 'flex';
                s3.style.opacity = sceneOp.toFixed(3);
                s3.style.transform = `translate3d(0, ${sceneTy.toFixed(1)}px, 0)`;
                s3.style.filter = `blur(${sceneBl.toFixed(1)}px)`;
                s3.style.pointerEvents = sceneOp > 0.5 ? 'auto' : 'none';

                if (natureSoundBtn) {
                    if (sceneOp > 0.6) {
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
                    if (nv.paused) {
                        if (nv.readyState === 0) {
                            nv.load();
                        }
                        const pPromise = nv.play();
                        if (pPromise !== undefined) {
                            pPromise.catch(() => {});
                        }
                    }
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

                if (nv && !nv.paused) {
                    nv.pause();
                }
            }
        }

        // -------------------------------------------------------------
        // SCENE 4: VICTORY LOCK & ACTIONS (4.70 -> 5.50)
        // -------------------------------------------------------------
        if (s4) {
            if (p >= 4.70) {
                const norm = Math.min(1, (p - 4.70) / 0.40);
                const ty = (1 - norm) * 50;
                const sc = 0.90 + norm * 0.10;
                const bl = (1 - norm) * 8;
                s4.style.display = 'flex';
                s4.style.opacity = norm.toFixed(3);
                s4.style.transform = `scale(${sc.toFixed(3)}) translate3d(0, ${ty.toFixed(1)}px, 0)`;
                s4.style.filter = `blur(${bl.toFixed(1)}px)`;
                s4.style.pointerEvents = norm > 0.5 ? 'auto' : 'none';

                if (p >= 5.05 && !this.confettiFired) {
                    this.confettiFired = true;
                    if (window.nobsConfetti) window.nobsConfetti.launch();
                }
            } else {
                s4.style.display = 'none';
                s4.style.opacity = '0';
                s4.style.pointerEvents = 'none';
            }
        }
    },

    destroy: function () {
        this.active = false;
        this.targetProgress = 0.0;
        this.currentProgress = 0.0;
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
    }
};

// Global Event Listeners attached once on window:
(function () {
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

    // Pointer Tracking for Stationary Hit-Testing (Works even if mouse is motionless during scroll/glide)
    window.addEventListener('pointermove', function (e) {
        if (window.nobsProduxScrollytelling) {
            window.nobsProduxScrollytelling._mouseX = e.clientX;
            window.nobsProduxScrollytelling._mouseY = e.clientY;
        }
    }, { passive: true });

    window.addEventListener('pointerdown', function (e) {
        if (window.nobsProduxScrollytelling) {
            window.nobsProduxScrollytelling._mouseX = e.clientX;
            window.nobsProduxScrollytelling._mouseY = e.clientY;
        }
    }, { passive: true });

    window.addEventListener('mouseleave', function () {
        if (window.nobsProduxScrollytelling) {
            window.nobsProduxScrollytelling._mouseX = undefined;
            window.nobsProduxScrollytelling._mouseY = undefined;
            const track = document.getElementById('produxDiagonalTrack');
            if (track) track.classList.remove('has-hover');
            document.querySelectorAll('.produx-diagonal-card').forEach(c => c.classList.remove('is-hovered'));
        }
    }, { passive: true });

    // Explicit Mouseover / Mouseout Hover Event Delegation
    document.addEventListener('mouseover', function (e) {
        if (!window.nobsProduxScrollytelling || !window.nobsProduxScrollytelling.isModalOpen()) return;
        const card = e.target.closest('.produx-diagonal-card');
        const track = document.getElementById('produxDiagonalTrack');
        if (card && track) {
            track.classList.add('has-hover');
            document.querySelectorAll('.produx-diagonal-card').forEach(c => {
                if (c === card) c.classList.add('is-hovered');
                else c.classList.remove('is-hovered');
            });
        }
    });

    document.addEventListener('mouseout', function (e) {
        if (!window.nobsProduxScrollytelling || !window.nobsProduxScrollytelling.isModalOpen()) return;
        const fromCard = e.target.closest('.produx-diagonal-card');
        const toCard = e.relatedTarget ? e.relatedTarget.closest('.produx-diagonal-card') : null;
        if (fromCard && !toCard) {
            const track = document.getElementById('produxDiagonalTrack');
            if (track) track.classList.remove('has-hover');
            document.querySelectorAll('.produx-diagonal-card').forEach(c => c.classList.remove('is-hovered'));
        }
    });

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
