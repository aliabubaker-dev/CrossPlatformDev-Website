// ===== PORTFOLIO PAGE JAVASCRIPT =====
export function portfolioPageInit() {
    // 1. Initialize global site animations
    if (window.siteAnimations && window.siteAnimations.initAll) {
        window.siteAnimations.initAll();
    }

    // 2. Scroll Reveal for Portfolio Cards
    const targets = document.querySelectorAll('.portfolio-hero .reveal, .projects-section .reveal, .skills-showcase .reveal, .section-tight .reveal');
    
    if (targets.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        targets.forEach(el => observer.observe(el));
    }
}