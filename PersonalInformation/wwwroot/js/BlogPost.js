
export function blogPostInit() {
    
    // 1. Initialize global site animations
    if (window.siteAnimations && window.siteAnimations.initAll) {
        window.siteAnimations.initAll();
    }

    // 2. Reading Progress Bar
    const bar = document.getElementById('reading-progress');
    if (bar) {
        const onScroll = () => {
            const doc = document.documentElement;
            const scrollTop = doc.scrollTop || document.body.scrollTop;
            const scrollHeight = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
            const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            bar.style.width = pct + '%';
        };
        
        // Add the scroll listener
        window.addEventListener('scroll', onScroll, { passive: true });
        
        // Run once on load to set the initial width
        onScroll();
    }
}