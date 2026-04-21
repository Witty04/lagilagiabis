// ===== HAMBURGER MENU =====
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('mobile-open');
    });

    // Tutup menu saat link diklik
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('mobile-open');
      });
    });

    // ===== NAVBAR SCROLL SHADOW =====
    window.addEventListener('scroll', () => {
      document.querySelector('nav').classList.toggle('scrolled', window.scrollY > 10);
    });

    // ===== SMOOTH SCROLL NAVBAR =====
    document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');

    // kalau bukan anchor → biarin pindah halaman
    if (href.includes('.html')) return;

    // khusus anchor saja
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });

      document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    }
  });
});

    // ===== ACTIVE NAVBAR ON SCROLL =====
    const sectionIds = ['home', 'analisis','cara-kerja'];
    window.addEventListener('scroll', () => {
      let current = 'home';
      sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) current = id;
      });
      document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === '#' + current);
      });
    });

    // ===== TOMBOL MULAI ANALISIS =====
    document.querySelector('.btn-mulai').addEventListener('click', function() {
      window.location.href = 'halaman 2/analisisfix.html';
    });

    // ===== SCROLL REVEAL ANIMATION =====
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));