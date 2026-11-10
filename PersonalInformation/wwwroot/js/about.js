// About page behaviour: below-the-fold reveals, counters, timeline line, 3D photo tilt.
// Nothing here hides content that is already on screen, so a Blazor re-render cannot cause a flash.
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

export function aboutPageInit() {
    aboutPageDispose();
    const root = document.querySelector('.ab-root');
    if (!root) return;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const fold = window.innerHeight * 0.92;
    const on = (t, e, f, o) => { t.addEventListener(e, f, o); cleanups.push(() => t.removeEventListener(e, f, o)); };

    // ----- scroll reveal + counters, only for elements still below the fold -----
    if (!reduce && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                e.target.classList.remove('ab-pre');
                e.target.querySelectorAll('[data-count]').forEach(count);
                io.unobserve(e.target);
            });
        }, { threshold: 0.15 });
        root.querySelectorAll('[data-reveal]').forEach((el) => {
            if (el.getBoundingClientRect().top > fold) {
                el.classList.add('ab-pre');
                el.querySelectorAll('[data-count]').forEach((c) => { c.textContent = '0'; });
                io.observe(el);
            }
        });
        cleanups.push(() => io.disconnect());
    }

    // ----- timeline line fills while scrolling -----
    const tl = root.querySelector('.ab-tl');
    if (tl) {
        const items = [...tl.children];
        if (reduce) {
            items.forEach((li) => li.classList.add('is-on'));
        } else {
            let tick = false;
            const update = () => {
                const r = tl.getBoundingClientRect();
                const mid = window.innerHeight * 0.65;
                tl.style.setProperty('--p', clamp((mid - r.top) / r.height, 0, 1).toFixed(3));
                items.forEach((li) => li.classList.toggle('is-on', li.getBoundingClientRect().top < mid));
                tick = false;
            };
            on(window, 'scroll', () => { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
            update();
        }
    }

    // ----- 3D photo tilt (mouse only; touch screens use the CSS sway) -----
    const photo = root.querySelector('.ab-photo');
    const tilt = root.querySelector('.ab-tilt');
    if (photo && tilt && canHover && !reduce) {
        on(photo, 'pointermove', (e) => {
            const r = photo.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            tilt.classList.add('is-moving');
            tilt.style.setProperty('--ry', (x * 18).toFixed(2) + 'deg');
            tilt.style.setProperty('--rx', (-y * 14).toFixed(2) + 'deg');
            tilt.style.setProperty('--gx', ((x + 0.5) * 100).toFixed(0) + '%');
            tilt.style.setProperty('--gy', ((y + 0.5) * 100).toFixed(0) + '%');
        });
        on(photo, 'pointerleave', () => {
            tilt.classList.remove('is-moving');
            tilt.style.setProperty('--ry', '0deg');
            tilt.style.setProperty('--rx', '0deg');
        });
    }
}

export function aboutPageDispose() {
    cleanups.forEach((fn) => { try { fn(); } catch (e) { /* ignore */ } });
    cleanups = [];
}