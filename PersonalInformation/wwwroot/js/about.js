// ===== ABOUT PAGE JAVASCRIPT =====
export function aboutPageInit() {
    
    // ===== SCROLL REVEAL =====
    (function () {
        const targets = document.querySelectorAll('.about-hero .reveal, .bio-section .reveal, .skills-section .reveal, .timeline-section .reveal, .certs-section .reveal, .section-tight .reveal');

        if (!targets.length) return;

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
    })();

    // ===== COUNTER ANIMATION =====
    (function () {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'));
                    let current = 0;
                    const increment = Math.ceil(target / 40);
                    const duration = 1500;
                    const step = Math.floor(duration / 40);

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        el.textContent = current + (target > 1 ? '+' : '');
                    }, step);

                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(el => observer.observe(el));
    })();
    
}// <--- THIS IS THE CORRECT CLOSING BRACKET