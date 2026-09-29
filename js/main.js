/* Aryan Shrivastava Portfolio — interactions */

(function () {
    "use strict";

    const root = document.documentElement;

    /* ---------- Theme toggle ---------- */
    const THEME_KEY = "aryan-portfolio-theme";
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "light" || savedTheme === "dark") {
        root.setAttribute("data-theme", savedTheme);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
        root.setAttribute("data-theme", "light");
    }

    const themeBtn = document.getElementById("themeToggle");
    themeBtn?.addEventListener("click", () => {
        const current = root.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        localStorage.setItem(THEME_KEY, next);
    });

    /* ---------- Navbar scroll state ---------- */
    const navbar = document.getElementById("navbar");
    const onScroll = () => {
        if (window.scrollY > 30) navbar.classList.add("scrolled");
        else navbar.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------- Mobile menu ---------- */
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    menuBtn?.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));
    mobileMenu?.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => mobileMenu.classList.add("hidden"))
    );

    /* ---------- AOS init ---------- */
    if (window.AOS) {
        AOS.init({
            duration: 800,
            once: true,
            offset: 60,
            easing: "ease-out-cubic",
        });
    }

    /* ---------- Stat counters ---------- */
    const nums = document.querySelectorAll(".stat-num[data-target]");
    const counterObs = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10) || 0;
                const suffix = el.querySelector("span")?.outerHTML || "";
                const dur = 1400;
                const start = performance.now();
                const tick = (now) => {
                    const t = Math.min((now - start) / dur, 1);
                    const eased = 1 - Math.pow(1 - t, 3);
                    const val = Math.round(eased * target);
                    el.innerHTML = val + suffix;
                    if (t < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
                counterObs.unobserve(el);
            });
        },
        { threshold: 0.4 }
    );
    nums.forEach((n) => counterObs.observe(n));

    /* ---------- Proficiency bars ---------- */
    const bars = document.querySelectorAll(".prof-fill");
    const barObs = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    barObs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.3 }
    );
    bars.forEach((b) => barObs.observe(b));

    /* ---------- Active nav link on scroll ---------- */
    const sections = document.querySelectorAll("section[id]");
    const links = document.querySelectorAll(".nav-link[href^='#']");
    const sectionObs = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const id = entry.target.id;
                links.forEach((l) => {
                    const active = l.getAttribute("href") === "#" + id;
                    l.classList.toggle("text-brand-400", active);
                    l.style.opacity = active ? "1" : "";
                });
            });
        },
        { threshold: 0.5 }
    );
    sections.forEach((s) => sectionObs.observe(s));

    /* ---------- Year ---------- */
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
})();
