// ===== INTERNAL TOOLS PAGE JAVASCRIPT =====
export function initInternalTools() {

    // 1. Initialize global site animations (navbar, footer, etc.)
    if (window.siteAnimations && window.siteAnimations.initAll) {
        window.siteAnimations.initAll();
    }

    // 2. Scroll Reveal for the cards and sections
    const targets = document.querySelectorAll('.reveal:not([data-observed])');

    if (targets.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        targets.forEach(el => {
            el.setAttribute('data-observed', 'true');
            observer.observe(el);
        });
    }

    // 3. Optional: Image click to zoom effect (if you want the proof images to open full screen)
    const images = document.querySelectorAll('.system-card-image');
    images.forEach(img => {
        img.addEventListener('click', () => {
            // Create a full-screen overlay
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.inset = '0';
            overlay.style.backgroundColor = 'rgba(0,0,0,0.9)';
            overlay.style.zIndex = '9999';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.cursor = 'zoom-out';
            overlay.style.padding = '20px';

            // Clone the image into the overlay
            const largeImg = document.createElement('img');
            largeImg.src = img.src;
            largeImg.style.maxWidth = '95%';
            largeImg.style.maxHeight = '95%';
            largeImg.style.borderRadius = '8px';
            largeImg.style.boxShadow = '0 0 50px rgba(0, 229, 255, 0.2)';

            overlay.appendChild(largeImg);
            document.body.appendChild(overlay);

            // Close on click
            overlay.addEventListener('click', () => {
                document.body.removeChild(overlay);
            });
        });
    });
}