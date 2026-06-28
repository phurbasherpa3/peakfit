/* ==============================================
   PEAKFIT FITNESS – JavaScript
   ============================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar scroll effect ---- */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
    updateActiveNavLink();
  }, { passive: true });

  /* ---- Hamburger Menu ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu on nav link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      if (
        section.offsetTop <= scrollPos &&
        section.offsetTop + section.offsetHeight > scrollPos
      ) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }

  /* ---- Scroll Animation (Intersection Observer) ---- */
  const animateEls = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('animated');
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  animateEls.forEach(el => observer.observe(el));

  /* ---- Hero Particles ---- */
  const particleContainer = document.getElementById('particles');
  if (particleContainer) {
    const colors = ['rgba(255,107,44,0.5)', 'rgba(255,179,71,0.4)', 'rgba(255,140,90,0.35)'];
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration: ${Math.random() * 12 + 8}s;
        animation-delay: ${Math.random() * 8}s;
      `;
      particleContainer.appendChild(p);
    }
  }

  /* ---- Reviews Carousel ---- */
  const track = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('reviewPrev');
  const nextBtn = document.getElementById('reviewNext');
  const dotsContainer = document.getElementById('carouselDots');

  if (track && prevBtn && nextBtn) {
    const cards = track.querySelectorAll('.review-card');
    let currentIndex = 0;
    let cardsVisible = getCardsVisible();
    const totalSlides = Math.ceil(cards.length / cardsVisible);

    function getCardsVisible() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    }

    function buildDots() {
      dotsContainer.innerHTML = '';
      const slides = Math.ceil(cards.length / getCardsVisible());
      for (let i = 0; i < slides; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      document.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentIndex);
      });
    }

    function goTo(index) {
      cardsVisible = getCardsVisible();
      const maxIndex = Math.ceil(cards.length / cardsVisible) - 1;
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      const cardWidth = cards[0].offsetWidth + 24;
      track.style.transform = `translateX(-${currentIndex * cardsVisible * cardWidth}px)`;
      updateDots();
    }

    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    // Auto-play
    let autoPlay = setInterval(() => {
      cardsVisible = getCardsVisible();
      const maxIndex = Math.ceil(cards.length / cardsVisible) - 1;
      goTo(currentIndex < maxIndex ? currentIndex + 1 : 0);
    }, 5000);

    track.parentElement.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.parentElement.addEventListener('mouseleave', () => {
      autoPlay = setInterval(() => {
        cardsVisible = getCardsVisible();
        const maxIndex = Math.ceil(cards.length / cardsVisible) - 1;
        goTo(currentIndex < maxIndex ? currentIndex + 1 : 0);
      }, 5000);
    });

    // Touch swipe
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
      }
    });

    // Resize
    window.addEventListener('resize', () => {
      currentIndex = 0;
      buildDots();
      goTo(0);
    });

    buildDots();
  }

  /* ---- Contact Form: Send to WhatsApp / Instagram ---- */
  const sendWhatsApp = document.getElementById('sendWhatsApp');
  const sendInstagram = document.getElementById('sendInstagram');
  const contactForm = document.getElementById('contactForm');

  function buildMessage() {
    const name = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phoneNum').value.trim();
    const email = document.getElementById('emailAddr').value.trim();
    const service = document.getElementById('serviceSelect').value;
    const message = document.getElementById('userMessage').value.trim();

    if (!name || !phone || !message) {
      alert('Please fill in your name, phone number, and message.');
      return null;
    }
    let text = `Hello PeakFit! 👋\n\n`;
    text += `*Name:* ${name}\n`;
    text += `*Phone:* ${phone}\n`;
    if (email) text += `*Email:* ${email}\n`;
    if (service) text += `*Interested In:* ${service}\n`;
    text += `\n*Message:*\n${message}\n\n`;
    text += `_(Sent via PeakFit website)_`;
    return text;
  }

  if (sendWhatsApp) {
    sendWhatsApp.addEventListener('click', () => {
      const text = buildMessage();
      if (text) {
        const encoded = encodeURIComponent(text);
        window.open(`https://wa.me/9779743216949?text=${encoded}`, '_blank');
      }
    });
  }

  if (sendInstagram) {
    sendInstagram.addEventListener('click', () => {
      const text = buildMessage();
      if (text) {
        // Copy message to clipboard, then open Instagram DM
        navigator.clipboard.writeText(text).then(() => {
          if (confirm('Your message has been copied to clipboard!\n\nClick OK to open PeakFit\'s Instagram. You can paste and send your message there.')) {
            window.open('https://www.instagram.com/peakfit.fitness/', '_blank');
          }
        }).catch(() => {
          // Fallback if clipboard not available
          if (confirm('Please copy your message and send it via Instagram DM.\n\nClick OK to open PeakFit\'s Instagram.')) {
            window.open('https://www.instagram.com/peakfit.fitness/', '_blank');
          }
        });
      }
    });
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Number Counter Animation for Stats ---- */
  const statNums = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const num = parseInt(text.replace(/[^0-9]/g, ''));
        const suffix = text.replace(/[0-9]/g, '');
        let count = 0;
        const step = Math.ceil(num / 40);
        const timer = setInterval(() => {
          count += step;
          if (count >= num) { count = num; clearInterval(timer); }
          el.textContent = count + suffix;
        }, 40);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));

  /* ---- Navbar initial state ---- */
  if (window.scrollY > 50) navbar.classList.add('scrolled');

});
