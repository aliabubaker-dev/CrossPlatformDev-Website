// Home page behaviour: scroll reveals, counters, process line, subtle parallax.
// Nothing here hides content that is already on screen, so a Blazor re-render cannot cause a flash.
(function () {
    'use strict';
    let cleanups = [];
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const easeOut = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    function count(el) {
        const target = parseFloat(el.dataset.count), start = performance.now();
        (function frame(now) {
            const p = Math.min(1, (now - start) / 1500);
            el.textContent = Math.round(target * easeOut(p));
            if (p < 1) requestAnimationFrame(frame);
        })(start);
    }

    window.initHomePage = function () {
        window.disposeHomePage();
        const root = document.querySelector('.hx-root');
        if (!root) return;
        requestAnimationFrame(() => root.classList.add('hx-live'));
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
        const fold = window.innerHeight * 0.92;
        const on = (t, e, f, o) => { t.addEventListener(e, f, o); cleanups.push(() => t.removeEventListener(e, f, o)); };

        // ----- scroll reveal + counters: only for elements still below the fold -----
        if (!reduce && 'IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach((e) => {
                    if (!e.isIntersecting) return;
                    e.target.classList.remove('hx-pre');
                    e.target.querySelectorAll('[data-count]').forEach(count);
                    io.unobserve(e.target);
                });
            }, { threshold: 0.15 });
            root.querySelectorAll('[data-reveal]').forEach((el) => {
                if (el.getBoundingClientRect().top > fold) {
                    el.classList.add('hx-pre');
                    el.querySelectorAll('[data-count]').forEach((c) => { c.textContent = '0'; });
                    io.observe(el);
                }
            });
            cleanups.push(() => io.disconnect());
        }

        // ----- process line fills while the section scrolls through -----
        const steps = root.querySelector('.hx-steps');
        if (steps && !reduce) {
            const items = [...steps.children];
            let tick = false;
            const update = () => {
                const r = steps.getBoundingClientRect();
                const p = clamp((window.innerHeight * 0.75 - r.top) / r.height, 0, 1);
                steps.style.setProperty('--p', p.toFixed(3));
                items.forEach((li, i) => li.classList.toggle('is-on', p >= (i + 0.2) / items.length));
                tick = false;
            };
            on(window, 'scroll', () => { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
            update();
        } else if (steps) {
            [...steps.children].forEach((li) => li.classList.add('is-on'));
        }

        // ----- hero parallax (2D, mouse only) -----
        const art = root.querySelector('.hx-art');
        if (art && canHover && !reduce) {
            const hero = root.querySelector('.hx-hero');
            on(hero, 'pointermove', (e) => {
                const r = hero.getBoundingClientRect();
                art.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
                art.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
            });
            on(hero, 'pointerleave', () => { art.style.setProperty('--px', 0); art.style.setProperty('--py', 0); });
        }
    };

    window.disposeHomePage = function () {
        cleanups.forEach((fn) => { try { fn(); } catch (e) { /* ignore */ } });
        cleanups = [];
    };
})();