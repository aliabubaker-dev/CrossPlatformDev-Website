window.siteAnimations = (function () {

    let _initialized = false;

    function initScrollReveal() {
        const targets = document.querySelectorAll('.reveal:not([data-observed])');
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
    }




    function scrollChatToBottom(containerId) {
        const el = document.getElementById(containerId);
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }




    window.applyTheme = function (themeClass) {
        document.body.classList.remove('dark-theme', 'light-theme');
        document.body.classList.add(themeClass);
        document.documentElement.style.backgroundColor =
            themeClass === 'dark-theme' ? '#050810' : '#F0F4F8';
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.content = themeClass === 'dark-theme' ? '#050810' : '#F0F4F8';
        }
    };

    window.getCurrentTheme = function () {
        return localStorage.getItem('theme') || 'dark';
    };

    function initNavScroll() {
        const nav = document.querySelector('.site-nav');
        if (!nav) return;
        const onScroll = () => {
            if (window.scrollY > 24) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        };
        window.removeEventListener('scroll', window.__navScrollHandler || (() => { }));
        window.__navScrollHandler = onScroll;
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    function initMobileMenu() {
        const toggle = document.querySelector('.nav-toggle');
        const sidebar = document.querySelector('.site-nav');
        const overlay = document.querySelector('.nav-overlay');
        if (!toggle || !sidebar) {
            console.log('Mobile menu elements not found');
            return;
        }

        // Remove existing event listeners to avoid duplicates
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);

        const newSidebar = sidebar;
        const newOverlay = overlay;

        const close = () => {
            newSidebar.classList.remove('open');
            newToggle.classList.remove('active');
            if (newOverlay) newOverlay.classList.remove('open');
        };

        newToggle.onclick = (e) => {
            e.stopPropagation();
            const isOpen = newSidebar.classList.toggle('open');
            newToggle.classList.toggle('active', isOpen);
            if (newOverlay) newOverlay.classList.toggle('open', isOpen);
        };

        if (newOverlay) {
            newOverlay.onclick = close;
        }

        newSidebar.querySelectorAll('a').forEach(a => a.onclick = close);
    }

    async function typeTerminal(elementId, lines, speed = 22) {
        const el = document.getElementById(elementId);
        if (!el || el.getAttribute('data-typed') === 'true') return;
        el.setAttribute('data-typed', 'true');
        el.innerHTML = '';

        for (const line of lines) {
            const lineEl = document.createElement('div');
            lineEl.className = 'terminal-line';
            el.appendChild(lineEl);

            const span = document.createElement('span');
            if (line.className) span.className = line.className;
            lineEl.appendChild(span);

            for (let i = 0; i < line.text.length; i++) {
                span.textContent += line.text[i];
                await new Promise(r => setTimeout(r, speed));
            }
            await new Promise(r => setTimeout(r, 220));
        }

        const cursor = document.createElement('span');
        cursor.className = 'terminal-cursor';
        el.appendChild(cursor);
    }

    // ===== CODE BLOCK TYPING EFFECT - COLORFUL =====
    function initCodeTyping() {
        const el = document.getElementById('code-body');
        if (!el || el.getAttribute('data-typed') === 'true') return;
        el.setAttribute('data-typed', 'true');

        el.innerHTML = '';

        const lines = [
            // Comments - bright green
            { text: '// ════════════════════════════════════════', cls: 'code-comment' },
            { text: '//  👨‍💻 Full-Stack Developer · 2+ years', cls: 'code-comment' },
            { text: '//  🚀 Building production software since 2019', cls: 'code-comment' },
            { text: '// ════════════════════════════════════════', cls: 'code-comment' },
            { text: '', cls: '' },
            // Imports - purple
            { text: 'import { experience } from "./career";', cls: 'code-import' },
            { text: 'import { projects } from "./portfolio";', cls: 'code-import' },
            { text: '', cls: '' },
            // Skills object
            { text: 'const skills = {', cls: 'code-keyword' },
            { text: '  🎨 frontend: "React, TypeScript, Bootstrap",', cls: 'code-string' },
            { text: '  ⚡ backend: "C#, .NET Core, ASP.NET, Node.js",', cls: 'code-string' },
            { text: '  📱 mobile: "Android, iOS, Cross-platform",', cls: 'code-string' },
            { text: '  ☁️ cloud: "Azure, Heroku, Cloudinary",', cls: 'code-string' },
            { text: '  🗄️ database: "SQL Server, MySQL, MongoDB",', cls: 'code-string' },
            { text: '  🔧 tools: "Git, Azure DevOps, Postman, OWASP ZAP",', cls: 'code-string' },
            { text: '  📋 methodologies: "Agile, Scrum, TDD, RESTful APIs",', cls: 'code-string' },
            { text: '};', cls: 'code-keyword' },
            { text: '', cls: '' },
            // Current role - orange
            { text: 'const currentRole = {', cls: 'code-keyword' },
            { text: '  💼 title: ".NET Software Developer",', cls: 'code-string' },
            { text: '  🏢 company: "Gerrie Electric",', cls: 'code-string' },
            { text: '  📅 since: "September 2024",', cls: 'code-string' },
            { text: '  🎯 focus: "APIs, Full-stack, Cloud",', cls: 'code-string' },
            { text: '};', cls: 'code-keyword' },
            { text: '', cls: '' },
            // Certifications - green
            { text: 'const certifications = [', cls: 'code-keyword' },
            { text: '  ✅ "Microsoft Azure",', cls: 'code-string' },
            { text: '  ✅ "EAP Certified",', cls: 'code-string' },
            { text: '  ✅ "Worker Health & Safety",', cls: 'code-string' },
            { text: '];', cls: 'code-keyword' },
            { text: '', cls: '' },
            // Export - bright cyan
            { text: 'export default { skills, currentRole, certifications };', cls: 'code-export' },
            { text: '', cls: '' },
            { text: '// 🎉 Ready to build something amazing!', cls: 'code-comment' },
            { text: '$', cls: 'code-prompt' },
        ];

        let index = 0;
        let charIndex = 0;
        let currentSpan = null;

        function typeNext() {
            if (index >= lines.length) {
                return;
            }

            if (charIndex === 0) {
                const lineEl = document.createElement('div');
                lineEl.className = 'code-line';
                const indentLines = [7, 8, 9, 10, 11, 12, 13, 18, 19, 20, 21, 25, 26, 27];
                if (indentLines.includes(index)) lineEl.classList.add('code-indent');
                if (index === lines.length - 1) lineEl.className = 'code-line';

                currentSpan = document.createElement('span');
                if (lines[index].cls) currentSpan.className = lines[index].cls;
                lineEl.appendChild(currentSpan);
                el.appendChild(lineEl);
            }

            const line = lines[index];
            if (line.text.length > 0) {
                currentSpan.textContent += line.text[charIndex];
                charIndex++;
            }

            if (charIndex >= line.text.length) {
                charIndex = 0;
                index++;
                const delay = line.text === '' ? 100 : 120;
                setTimeout(typeNext, delay);
            } else {
                setTimeout(typeNext, 15);
            }
        }

        setTimeout(typeNext, 600);
    }


    

    function initAll() {
        
        initScrollReveal();
        initCodeTyping();
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', initAll);

    // Re-initialize after Blazor navigation
    document.addEventListener('enhancedload', initAll);

    // Also re-initialize when Blazor finishes loading
    document.addEventListener('blazorLoad', initAll);

    // Expose initMobileMenu so it can be called from Blazor if needed
    window.initMobileMenu = initMobileMenu;

    return { initAll, initScrollReveal, typeTerminal, initMobileMenu, scrollChatToBottom };
})();