// ===== SERVICES PAGE JAVASCRIPT =====

export function initServicesPage() {
    // 1. Initialize global site animations (navbar, footer, etc.)
    if (window.siteAnimations && window.siteAnimations.initAll) {
        window.siteAnimations.initAll();
    }

    // 2. Scroll Reveal for Services Cards
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
}