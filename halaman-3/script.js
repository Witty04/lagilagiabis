// ===== HAMBURGER MENU =====
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('mobile-open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('mobile-open');
      });
    });

    // ===== NAVBAR SCROLL SHADOW =====
    window.addEventListener('scroll', () => {
      document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 10);
    });

    // ===== NAV LOGO → HOME =====
    document.getElementById('navLogo').addEventListener('click', () => {
      window.location.href = '../halaman 1/indexfix.html';
    });

     // ===== NAV LOGO → HOME =====
    // document.getElementById('navAnalisis').addEventListener('click', () => {
    //   window.location.href = '../halaman 2/analisisfix.html';
    // });

    // ===== TOMBOL ABOUT US (aktif, halaman ini) =====
    document.getElementById('btnAboutUs').addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== TOMBOL MULAI ANALISIS =====
    document.getElementById('btnMulaiAnalisis').addEventListener('click', () => {
      window.location.href = '../halaman 2/analisisfix.html';
    });

    // ===== SCROLL REVEAL ANIMATION =====
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ===== MEMBER CARD HOVER EFFECT =====
    document.querySelectorAll('.member-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.background = 'var(--peach-dark)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.background = 'var(--peach-hover)';
      });
    });

    // ===== MARK ACTIVE NAV LINK =====
    // Tidak ada section scroll di halaman ini — About Us sudah aktif via tombol
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.remove('active');
    });