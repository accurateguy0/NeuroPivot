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
