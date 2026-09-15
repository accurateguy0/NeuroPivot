window.nobsConfetti = {
    launch: function () {
        const count = 100;
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '99999';
        container.style.overflow = 'hidden';
        document.body.appendChild(container);

        const colors = ['#7FB7BE', '#E6AACE', '#34C759', '#F3E9DC', '#EFF6EE', '#FFD700'];

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 10 + 6;
            
            particle.style.position = 'absolute';
            particle.style.width = size + 'px';
            particle.style.height = (size * 0.6) + 'px';
            particle.style.backgroundColor = color;
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = '-20px';
            particle.style.opacity = '1';
            particle.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            const duration = Math.random() * 2 + 2;
            const horizontalDrift = (Math.random() - 0.5) * 200;
            
            particle.style.transition = `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            container.appendChild(particle);

            setTimeout(() => {
                particle.style.top = '105vh';
                particle.style.left = `calc(${particle.style.left} + ${horizontalDrift}px)`;
                particle.style.transform = `rotate(${Math.random() * 720}deg)`;
                particle.style.opacity = '0';
            }, 50);
        }

        setTimeout(() => {
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
        }, 4500);
    }
};
