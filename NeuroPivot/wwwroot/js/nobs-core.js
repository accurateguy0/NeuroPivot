import Lenis from 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/+esm';

let lenis;

export function initNeuroPivot() {
    if (lenis) lenis.destroy();
    lenis = new Lenis({ duration: 1.2, lerp: 0.1 });

    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        const tl = gsap.timeline({ delay: 0.2 });

        const logoChars = document.querySelectorAll('.logo-char');
        if (logoChars && logoChars.length > 0) {
            tl.from(logoChars, {
                y: 120,
                opacity: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: "expo.out",
                delay: 0.2
            });
        }

        tl.to(".hero-label-reveal", {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power4.out"
        }, "-=0.6");

        tl.to(".nobs-btn-hero", {
            y: 0,
            opacity: 1,
            duration: 1,
            filter: "blur(0px)",
            ease: "power3.out"
        }, "-=0.7");

        gsap.to(".nobs-logo", {
            fontSize: "1.5rem",
            y: "-28vh",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "200px top",
                scrub: 0.8,
                immediateRender: false
            }
        });

        gsap.to(".hero-content-wrapper", {
            opacity: 1,
            y: 150,
            scrollTrigger: {
                trigger: "body",
                start: "300px top",
                end: "650px top",
                scrub: true
            }
        });

        gsap.to(".hero-button-box", {
            opacity: 1,
            y: 150,
            scrollTrigger: {
                trigger: "body",
                start: "300px top",
                end: "650px top",
                scrub: true
            }
        });
    } else {
        function raf(time) {
            if (lenis) { lenis.raf(time); requestAnimationFrame(raf); }
        }
        requestAnimationFrame(raf);
    }
}

const waitForElements = (selector, count = 28, timeout = 3000) => {
    return new Promise((resolve) => {
        const start = Date.now();
        const check = () => {
            const els = document.querySelectorAll(selector);
            if (els && els.length >= count) {
                resolve(els);
            } else if (Date.now() - start > timeout) {
                resolve(els && els.length > 0 ? els : document.querySelectorAll(selector));
            } else {
                requestAnimationFrame(check);
            }
        };
        check();
    });
};

export async function initNarrative() {
    const blocks = await waitForElements('.narrative-block', 28);
    if (blocks && blocks.length > 0) {
        blocks.forEach((block, i) => {
            const totalCols = 7; 
            const totalRows = 4;
            const col = i % totalCols;
            const row = Math.floor(i / totalCols);
            const bgX = (col / (totalCols - 1)) * 100;
            const bgY = (row / (totalRows - 1)) * 100;

            block.style.backgroundImage = "url('/images/water.jpg')";
            block.style.backgroundSize = "700% 400%";
            block.style.backgroundPosition = `${bgX}% ${bgY}%`;

            const centerX = (col / (totalCols - 1)) - 0.5;
            const centerY = (row / (totalRows - 1)) - 0.5;
            const crossoverNoiseX = (Math.random() - 0.5) * 1000; 
            const crossoverNoiseY = (Math.random() - 0.5) * 300;

            const randomZ = (Math.random() * 1200) - 800;
            gsap.set(block, {
                opacity: Math.random() * 0.5 + 0.1,
                xPercent: (centerX * 600) + crossoverNoiseX,
                yPercent: (centerY * 600) + crossoverNoiseY,
                z: randomZ,
                scale: 0.5,
                filter: `blur(${Math.random() * 15 + 15}px)`,
            });
        });
    }

    const video = document.querySelector('#hero-showreel');

    // 1. PRIME AND CONFIGURE CONTINUOUS VIDEO LOOP
    if (video) {
        video.muted = true;
        video.defaultMuted = true;
        video.loop = true; 
        video.playsInline = true;
        video.autoplay = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('loop', '');
        video.setAttribute('muted', '');

        // Guarantee infinite continuous loop
        video.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play().catch(() => {});
        });

        // Backup safeguard against Chromium freeze near end of video
        video.addEventListener('timeupdate', function () {
            if (this.duration && this.currentTime >= this.duration - 0.15) {
                this.currentTime = 0;
                this.play().catch(() => {});
            }
        });

        const primeVideo = () => {
            if (video) {
                video.muted = true;
                const p = video.play();
                if (p !== undefined) {
                    p.catch(() => {});
                }
            }
        };

        primeVideo();
        setTimeout(primeVideo, 300);
        setTimeout(primeVideo, 1000);
    }

    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".narrative-track",
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                pin: ".sticky-pin",
                pinSpacing: true,
                anticipatePin: 1
            }
        });

        // 1. Overlay title fades out
        tl.to(".narrative-overlay-text", { 
            opacity: 0, 
            scale: 0.8,
            y: -50,
            duration: 2 
        });

        // 2. THE TIMELINE SEQUENCE
        tl.addLabel("assemble");

        // Step 1: Fully Assemble 3D Blocks from center (Total time: 16s + 6s = 22s)
        if (blocks && blocks.length > 0) {
            tl.to(blocks, {
                xPercent: 0, 
                yPercent: 0, 
                z: 0, 
                scale: 1, 
                opacity: 1,
                filter: "blur(0px)",
                duration: 16, 
                stagger: { amount: 6, from: "center" },
                ease: "expo.out"
            }, "assemble");
        }

        // Step 2: Bridge image seals any grid seams once blocks are fully converged (at 22s)
        tl.to(".video-poster-bridge", {
            opacity: 1,
            duration: 1.5,
            ease: "power2.inOut"
        }, "assemble+=22");

        tl.addLabel("reveal", "assemble+=24");

        // Step 3: Video fades in at initial size
        tl.to("#hero-showreel", { 
            opacity: 1, 
            zIndex: 10,
            duration: 2.5,
            ease: "power2.inOut",
            onStart: () => {
                if (video && video.paused) video.play().catch(() => {});
            }
        }, "reveal");

        // Fade fragments and bridge smoothly out as video takes over
        if (blocks && blocks.length > 0) {
            tl.to(blocks, {
                opacity: 0,
                duration: 2.5,
                ease: "power2.inOut"
            }, "reveal");
        }

        tl.to(".blocks-grid", {
            opacity: 0,
            display: "none",
            duration: 2.5,
            ease: "power2.inOut"
        }, "reveal");

        tl.to(".video-poster-bridge", {
            opacity: 0,
            duration: 2.5,
            ease: "power2.inOut"
        }, "reveal");

        tl.addLabel("widening", "reveal+=3");

        // Step 4: Scale and widen video container to fit within frame bounds
        tl.to(".hero-expanding-box", {
            scale: 1.15,
            width: "84vw",
            duration: 12,
            ease: "power2.inOut"
        }, "widening");

        tl.addLabel("widenedState", "widening+=10");

        // ONLY WHEN IN WIDENED STATE: Sound button appears and volume ramps up
        tl.to("#video-sound-btn", {
            opacity: 1,
            y: 0,
            pointerEvents: "auto",
            duration: 2,
            ease: "power2.out"
        }, "widenedState");

        tl.fromTo(video, 
            { volume: 0 }, 
            { volume: 1, duration: 2, ease: "power2.inOut" }, 
            "widenedState"
        );

        // Hold widened state with sound button visible and sound on
        tl.to({}, { duration: 8 });

        // Leaving widened state when scrolling down: hide sound button and fade out volume
        tl.to("#video-sound-btn", {
            opacity: 0,
            y: 12,
            pointerEvents: "none",
            duration: 2,
            ease: "power2.in"
        });

        tl.to(video, {
            volume: 0,
            duration: 2,
            ease: "power1.out"
        }, "<");

        // Sound button click toggle handler
        const soundBtn = document.querySelector('#video-sound-btn');
        const updateSoundUI = () => {
            if (!soundBtn || !video) return;
            const iconMuted = soundBtn.querySelector('.sound-icon-muted');
            const iconUnmuted = soundBtn.querySelector('.sound-icon-unmuted');
            if (video.muted || video.volume === 0) {
                if (iconMuted) iconMuted.style.display = 'inline-flex';
                if (iconUnmuted) iconUnmuted.style.display = 'none';
            } else {
                if (iconMuted) iconMuted.style.display = 'none';
                if (iconUnmuted) iconUnmuted.style.display = 'inline-flex';
            }
        };

        if (soundBtn && video) {
            soundBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (video.muted || video.volume === 0) {
                    video.muted = false;
                    video.volume = 1;
                    if (video.paused) video.play().catch(() => {});
                } else {
                    video.muted = true;
                }
                updateSoundUI();
            };

            updateSoundUI();
        }

        // Attach mute handlers to all Get Started buttons
        document.querySelectorAll('.nobs-btn-hero, .nobs-btn-blue, button').forEach(btn => {
            if (btn.textContent && btn.textContent.toLowerCase().includes('get started')) {
                btn.addEventListener('click', muteHeroVideo);
            }
        });

        ScrollTrigger.create({
            trigger: ".narrative-track",
            start: "top bottom",
            end: "bottom top",
            onEnter: () => { if (video && video.paused) video.play().catch(() => {}); },
            onEnterBack: () => { if (video && video.paused) video.play().catch(() => {}); },
            onLeave: () => {
                muteHeroVideo();
            },
            onLeaveBack: () => {
                muteHeroVideo();
            }
        });

        window.addEventListener('resize', () => {
            ScrollTrigger.refresh();
        });

        window.addEventListener('touchstart', () => { if (video && video.paused) video.play().catch(() => {}); }, { passive: true });
        window.addEventListener('scroll', () => { if (video && video.paused) video.play().catch(() => {}); }, { passive: true });

        document.addEventListener("visibilitychange", () => {
            if (!document.hidden && video && video.paused) video.play().catch(() => {});
        });

        // Ensure ScrollTrigger calculates correct pin and start/end coordinates
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 150);
    }
}

export function muteHeroVideo() {
    const video = document.querySelector('#hero-showreel');
    if (video) {
        video.muted = true;
        video.volume = 0;
        video.pause();
    }
    const soundBtn = document.querySelector('#video-sound-btn');
    if (soundBtn) {
        const iconMuted = soundBtn.querySelector('.sound-icon-muted');
        const iconUnmuted = soundBtn.querySelector('.sound-icon-unmuted');
        if (iconMuted) iconMuted.style.display = 'inline-flex';
        if (iconUnmuted) iconUnmuted.style.display = 'none';
    }
}

export function destroyNarrative() {
    let triggers = ScrollTrigger.getAll();
    triggers.forEach(t => {
        if (t.vars.id === "narrative" || t.trigger === ".narrative-track") {
            t.kill();
        }
    });
    console.log("Narrative ScrollTriggers cleaned up.");
}