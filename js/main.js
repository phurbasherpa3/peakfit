// ===================================================
// PEAKFIT FITNESS – MAIN JAVASCRIPT
// ===================================================

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  // Scroll top button
  const scrollTop = document.getElementById('scrollTop');
  if (scrollTop) {
    if (window.scrollY > 400) {
      scrollTop.classList.add('visible');
    } else {
      scrollTop.classList.remove('visible');
    }
  }
});

// ---- HAMBURGER MENU ----
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ---- HERO SLIDER ----
const slides = document.querySelectorAll('.hero-slide');
if (slides.length > 0) {
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 5000);
}

// ---- SCROLL TOP BUTTON (inject) ----
const scrollTopBtn = document.createElement('button');
scrollTopBtn.id = 'scrollTop';
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.setAttribute('aria-label', 'Back to top');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.body.appendChild(scrollTopBtn);

// ---- GALLERY FILTER ----
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item-full');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ---- LIGHTBOX ----
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let lightboxImages = [];
let lightboxIndex = 0;

if (lightbox) {
  // Collect gallery images
  document.querySelectorAll('.gallery-item-full img').forEach((img, index) => {
    lightboxImages.push({ src: img.src, caption: img.alt });
    img.parentElement.addEventListener('click', () => {
      lightboxIndex = index;
      openLightbox();
    });
  });

  function openLightbox() {
    lightboxImg.src = lightboxImages[lightboxIndex].src;
    lightboxImg.alt = lightboxImages[lightboxIndex].caption;
    if (lightboxCaption) lightboxCaption.textContent = lightboxImages[lightboxIndex].caption;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
      openLightbox();
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
      lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
      openLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
  });
}

// ---- CONTACT FORM – WhatsApp / Instagram ----
const contactForm = document.getElementById('contactForm');
const platformBtns = document.querySelectorAll('.platform-btn');
const sendBtnText = document.getElementById('sendBtnText');

let selectedPlatform = 'whatsapp';

platformBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    platformBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedPlatform = btn.dataset.platform;
    if (sendBtnText) {
      sendBtnText.textContent = selectedPlatform === 'whatsapp'
        ? 'Send via WhatsApp'
        : 'Send via Instagram';
    }
  });
});

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('userName')?.value.trim();
    const phone = document.getElementById('userPhone')?.value.trim();
    const service = document.getElementById('userService')?.value;
    const message = document.getElementById('userMessage')?.value.trim();

    if (!name || !message) {
      showFormError('Please fill in your name and message.');
      return;
    }

    // Build message text
    let text = `Hello PeakFit Fitness! 🏋️\n\n`;
    text += `*Name:* ${name}\n`;
    if (phone) text += `*Phone:* ${phone}\n`;
    if (service) text += `*Interested In:* ${service}\n`;
    text += `\n*Message:*\n${message}\n\n`;
    text += `_Sent from PeakFit Website_`;

    if (selectedPlatform === 'whatsapp') {
      const encoded = encodeURIComponent(text);
      const url = `https://wa.me/9779743216949?text=${encoded}`;
      window.open(url, '_blank');
    } else {
      // Instagram doesn't support pre-filled messages via URL directly.
      // Open Instagram profile and alert user to send a DM.
      alert(`📸 Please send us a DM on Instagram!\n\nCopy your message:\n\n${text}`);
      window.open('https://www.instagram.com/peakfit_fitness', '_blank');
    }

    contactForm.reset();
    showFormSuccess();
  });
}

function showFormError(msg) {
  removeFormMessages();
  const el = document.createElement('div');
  el.className = 'form-message form-error';
  el.style.cssText = `background:rgba(230,57,70,0.12);border:1px solid rgba(230,57,70,0.3);color:#e63946;padding:12px 18px;border-radius:10px;font-size:0.9rem;margin-bottom:16px;`;
  el.textContent = msg;
  contactForm.insertBefore(el, contactForm.firstChild);
}

function showFormSuccess() {
  removeFormMessages();
  const el = document.createElement('div');
  el.className = 'form-message form-success';
  el.style.cssText = `background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.3);color:#22c55e;padding:12px 18px;border-radius:10px;font-size:0.9rem;margin-bottom:16px;`;
  el.textContent = '✅ Message prepared! Your platform has been opened.';
  contactForm.insertBefore(el, contactForm.firstChild);
  setTimeout(removeFormMessages, 5000);
}

function removeFormMessages() {
  contactForm.querySelectorAll('.form-message').forEach(el => el.remove());
}

// ---- INTERSECTION OBSERVER (animate in) ----
const animateElements = document.querySelectorAll('.service-card, .gallery-item, .review-img-card, .review-card-img, .video-card, .gallery-item-full');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

animateElements.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity 0.6s ease ${i * 0.05}s, transform 0.6s ease ${i * 0.05}s`;
  observer.observe(el);
});
