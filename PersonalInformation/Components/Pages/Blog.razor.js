// ===== BLOG PAGE JAVASCRIPT =====
export function blogPageInit() {
    // Initialize the site animations (scroll reveal, etc.)
    if (window.siteAnimations && window.siteAnimations.initAll) {
        window.siteAnimations.initAll();
    }

    // Optional: Add specific blog page animations here
    const targets = document.querySelectorAll('.blog-hero .reveal, .blog-posts-section .reveal, .newsletter-section .reveal');
    
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