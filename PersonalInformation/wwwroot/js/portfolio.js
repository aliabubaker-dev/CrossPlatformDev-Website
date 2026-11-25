// ===== PORTFOLIO PAGE JAVASCRIPT =====

export function portfolioPageInit() {
    // 1. Initialize global site animations
    if (window.siteAnimations && window.siteAnimations.initAll) {
        window.siteAnimations.initAll();
    }

    // 2. Scroll reveal for portfolio / C# page cards
    const targets = document.querySelectorAll(
        '.portfolio-hero .reveal, .projects-section .reveal, .skills-showcase .reveal, .section-tight .reveal'
    );

    if (targets.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
        );

        targets.forEach((el) => observer.observe(el));
    }

    // 3. C# Mastery Hub — cursor-follow glow on feature + overview cards.
    //    Only writes CSS vars (--mx / --my). Never touches `transform`,
    //    so no conflict with the reveal animation or the hover lift.
    document
        .querySelectorAll('.csharp-hub-page .cs-feature, .csharp-hub-page .cs-overview-card')
        .forEach((el) => {
            // Guard against double-binding when Blazor navigates back
            if (el.dataset.glowBound === '1') return;
            el.dataset.glowBound = '1';

            const onMove = (e) => {
                const r = el.getBoundingClientRect();
                el.style.setProperty('--mx', `${e.clientX - r.left}px`);
                el.style.setProperty('--my', `${e.clientY - r.top}px`);
            };

            const onLeave = () => {
                el.style.removeProperty('--mx');
                el.style.removeProperty('--my');
            };

            el.addEventListener('pointermove', onMove);
            el.addEventListener('pointerleave', onLeave);
        });
}