/**
 * INSURANCE ADDA - Main Scripts
 * Handles sticky navigation, mobile drawer, 3D cards services slider, plan posters modal, and smooth interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initModals();
  initDynamicYear();
  initScrollAnimations();
  initServicesSlider();
  initPlanPosterModal();
  initFastAnimatedCounters();
});

/**
 * 1. Sticky Header Background Transition on Scroll
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 2. Mobile Drawer Navigation
 */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-link');

  if (!toggleBtn || !drawer || !overlay) return;

  const openDrawer = () => {
    toggleBtn.classList.add('open');
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    toggleBtn.classList.remove('open');
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', () => {
    if (drawer.classList.contains('active')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  overlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/**
 * 3. Modal Dialog Controls (Generic)
 */
function initModals() {
  const openButtons = document.querySelectorAll('[data-open-modal]');
  const closeButtons = document.querySelectorAll('[data-close-modal]');
  const modals = document.querySelectorAll('.modal-backdrop');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetModalId = btn.getAttribute('data-open-modal');
      const targetModal = document.getElementById(targetModalId);
      if (targetModal) {
        targetModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentModal = btn.closest('.modal-backdrop');
      if (parentModal) {
        parentModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(m => m.classList.remove('open'));
      document.body.style.overflow = '';
    }
  });
}

/**
 * 4. Dynamic Year in Footer
 */
function initDynamicYear() {
  const yearElements = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearElements.forEach(el => {
    el.textContent = currentYear;
  });
}

/**
 * 5. Scroll Reveal Animations (Respecting reduced motion)
 */
function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const animatables = document.querySelectorAll('.reveal-on-scroll');
  if (!animatables.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  animatables.forEach(el => observer.observe(el));
}

/**
 * ==========================================================================
 * 6. 3D CARDS SERVICES SLIDER (Inspired by Reference Design)
 * Sliding card carousel with center highlight, touch swipe, keyboard, & Life Insurance first
 * ==========================================================================
 */
function initServicesSlider() {
  const track = document.getElementById('servicesSliderTrack');
  const viewport = document.getElementById('servicesSliderViewport');
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');
  const dots = document.querySelectorAll('.slider-dot');
  const statusLabel = document.getElementById('sliderStatusLabel');

  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.slider-card-item'));
  const total = cards.length;
  let activeIndex = 0; // First slide is Life Insurance (index 0)

  const titles = [
    'Life Insurance',
    'Term Insurance',
    'Health Insurance',
    'Vehicle Insurance',
    'Travel Insurance',
    'Shop & Business Insurance'
  ];

  function updateSlider(index) {
    activeIndex = (index + total) % total;

    cards.forEach((card, i) => {
      // Calculate circular distance
      let diff = i - activeIndex;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;

      // Reset classes
      card.classList.remove(
        'is-active', 
        'is-prev', 
        'is-next', 
        'is-far-prev', 
        'is-far-next', 
        'is-hidden'
      );

      if (diff === 0) {
        card.classList.add('is-active');
        card.setAttribute('tabindex', '0');
      } else if (diff === -1) {
        card.classList.add('is-prev');
        card.setAttribute('tabindex', '-1');
      } else if (diff === 1) {
        card.classList.add('is-next');
        card.setAttribute('tabindex', '-1');
      } else if (diff === -2) {
        card.classList.add('is-far-prev');
        card.setAttribute('tabindex', '-1');
      } else if (diff === 2) {
        card.classList.add('is-far-next');
        card.setAttribute('tabindex', '-1');
      } else {
        card.classList.add('is-hidden');
        card.setAttribute('tabindex', '-1');
      }
    });

    // Update Dots
    dots.forEach((dot, dIdx) => {
      if (dIdx === activeIndex) {
        dot.classList.add('is-active');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('is-active');
        dot.setAttribute('aria-selected', 'false');
      }
    });

    // Update Status Label
    if (statusLabel) {
      statusLabel.textContent = `Slide ${activeIndex + 1} of ${total} • ${titles[activeIndex]} (Active) • Click or swipe to slide`;
    }
  }

  // Previous & Next Handlers
  if (prevBtn) {
    prevBtn.addEventListener('click', () => updateSlider(activeIndex - 1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => updateSlider(activeIndex + 1));
  }

  // Dots navigation
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIdx = parseInt(dot.getAttribute('data-dot-index'), 10);
      updateSlider(targetIdx);
    });
  });

  // Card click interaction
  cards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      // If clicking WhatsApp enquiry button, let standard action run
      if (e.target.closest('a, [data-whatsapp-service]')) {
        return;
      }

      const isLifeCard = card.getAttribute('data-card-type') === 'life';
      const isHealthCard = card.id === 'slide-health';

      if (idx !== activeIndex) {
        // Slide non-active card to center
        updateSlider(idx);
        return;
      }

      // If active card is clicked:
      if (isLifeCard) {
        openPlanPoster('yaw');
        return;
      }

      if (isHealthCard) {
        const assistModal = document.getElementById('assistanceModal');
        const serviceSelect = document.getElementById('modalInsuranceService');
        if (serviceSelect) serviceSelect.value = 'Health Insurance';
        if (assistModal) {
          assistModal.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
        return;
      }
    });
  });

  // Touch Swipe & Mouse Drag Support
  if (viewport) {
    let startX = 0;
    let isDragging = false;

    viewport.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.changedTouches[0].clientX;
      const deltaX = endX - startX;

      if (deltaX > 45) {
        updateSlider(activeIndex - 1);
      } else if (deltaX < -45) {
        updateSlider(activeIndex + 1);
      }
    }, { passive: true });

    // Keyboard navigation
    viewport.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        updateSlider(activeIndex - 1);
      } else if (e.key === 'ArrowRight') {
        updateSlider(activeIndex + 1);
      }
    });
  }

  // Initialize first slide (Life Insurance)
  updateSlider(0);
}

/**
 * ==========================================================================
 * 7. DEDICATED LIFE INSURANCE PLAN POSTERS MODAL & LIGHTBOX
 * Displays official posters for Plan YAW, Plan YSS, Plan CTH, Plan YSR, Plan YYA
 * ==========================================================================
 */
const PLAN_POSTERS = {
  yaw: {
    code: 'YAW',
    posterImg: 'assets/images/poster-plan-yaw.jpg',
    badge: 'PLAN CODE: YAW',
    headline: 'Protection & High Maturity Savings Plan',
    subline: 'Save just ₹43 per day to secure a guaranteed ₹14,32,500 maturity corpus with up to ₹8,00,000 life coverage for your family.',
    daily: '₹43 / Day',
    maturity: '₹14,32,500',
    protection: '₹4L / ₹8L Cover',
    tax: 'Sec 80C & 10(10D)',
    waText: 'Hello Ravi Kumar G.R., I am interested in Life Insurance Plan Code: YAW (₹43/day, ₹14,32,500 Maturity). Please share details.'
  },
  yss: {
    code: 'YSS (Kanyadan)',
    posterImg: 'assets/images/poster-plan-yss.jpg',
    badge: 'PLAN CODE: YSS (KANYADAN)',
    headline: 'Kanyadan Plan — Secure Your Daughter\'s Future & Dreams',
    subline: 'A dedicated savings plan for your daughter\'s higher education and marriage. Save ₹118 per day for a massive ₹26,50,000 maturity benefit.',
    daily: '₹118 / Day',
    maturity: '₹26,50,000',
    protection: '₹10L / ₹20L Cover',
    tax: 'Sec 80C & 10(10D)',
    waText: 'Hello Ravi Kumar G.R., I am interested in Life Insurance Kanyadan Plan Code: YSS (₹118/day, ₹26,50,000 Maturity). Please share details.'
  },
  cth: {
    code: 'CTH (Family Shield)',
    posterImg: 'assets/images/poster-plan-cth-en.jpg',
    badge: 'PLAN CODE: CTH (FAMILY SHIELD)',
    headline: 'Family Protection Shield Plan — Complete Security',
    subline: 'Comprehensive family protection shield starting at just ₹10 per day with up to ₹20,00,000 combined life and accidental cover.',
    daily: '₹10 / Day',
    maturity: 'Shield Cover',
    protection: '₹5L / ₹20L Cover',
    tax: 'Section 80C',
    waText: 'Hello Ravi Kumar G.R., I am interested in Life Insurance Plan Code: CTH (₹10/day, ₹20 Lakh Cover). Please share details.'
  },
  ysr: {
    code: 'YSR',
    posterImg: 'assets/images/poster-plan-ysr.jpg',
    badge: 'PLAN CODE: YSR',
    headline: 'ಇಂದಿನ ಸಣ್ಣ ಹೂಡಿಕೆ... ನಾಳೆಯ ದೊಡ್ಡ ಭದ್ರತೆ!',
    subline: 'Small daily savings of just ₹50 per day designed for solid family future security, children\'s education, or milestone savings.',
    daily: '₹50 / Day',
    maturity: '₹9,45,000',
    protection: '₹3,60,000',
    tax: 'Section 80C',
    waText: 'Hello Ravi Kumar G.R., I am interested in Life Insurance Plan Code: YSR (₹50/day, ₹9.45 Lakh Maturity). Please share details.'
  },
  yya: {
    code: 'YYA (Wealth)',
    posterImg: 'assets/images/poster-plan-yya.jpg',
    badge: 'PLAN CODE: YYA (LIFETIME WEALTH)',
    headline: 'A Celebration of Today... A Secure Tomorrow!',
    subline: 'Lifetime financial security and regular annual payout of ₹2,60,000 every year from age 46 to 100 with ₹1.80 Crore total benefit.',
    daily: '₹500 / Day',
    maturity: '₹40,56,000',
    protection: '₹1,80,96,000 Benefit',
    tax: 'Sec 80C / Tax Free',
    waText: 'Hello Ravi Kumar G.R., I am interested in Life Insurance Plan Code: YYA (₹500/day, ₹1.8 Crore Benefit). Please share details.'
  }
};

function openPlanPoster(planKey) {
  const modal = document.getElementById('lifePlanPosterModal');
  if (!modal) return;

  switchPlanTab(planKey || 'yaw');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function switchPlanTab(planKey) {
  const data = PLAN_POSTERS[planKey] || PLAN_POSTERS.yaw;

  // Update tabs active state & ensure active tab is horizontally visible
  const tabButtons = document.querySelectorAll('.poster-tab-btn');
  tabButtons.forEach(btn => {
    if (btn.getAttribute('data-poster-tab') === planKey) {
      btn.classList.add('is-active');
      try {
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } catch (err) {}
    } else {
      btn.classList.remove('is-active');
    }
  });

  // Always reset modal body scroll to top so the poster is immediately visible first
  const modalBody = document.querySelector('.poster-modal-body');
  if (modalBody) {
    modalBody.scrollTop = 0;
  }

  // Update DOM elements
  const activeImage = document.getElementById('activePosterImage');
  const badgeLabel = document.getElementById('posterCodeText');
  const headline = document.getElementById('posterHeadline');
  const subline = document.getElementById('posterSubline');
  const matrixDaily = document.getElementById('matrixDaily');
  const matrixMaturity = document.getElementById('matrixMaturity');
  const matrixProtection = document.getElementById('matrixProtection');
  const matrixTax = document.getElementById('matrixTax');
  const waBtn = document.getElementById('posterWhatsAppBtn');

  if (activeImage) activeImage.src = data.posterImg;
  if (badgeLabel) badgeLabel.textContent = data.badge;
  if (headline) headline.textContent = data.headline;
  if (subline) subline.textContent = data.subline;
  if (matrixDaily) matrixDaily.textContent = data.daily;
  if (matrixMaturity) matrixMaturity.textContent = data.maturity;
  if (matrixProtection) matrixProtection.textContent = data.protection;
  if (matrixTax) matrixTax.textContent = data.tax;

  if (waBtn) {
    waBtn.href = `https://wa.me/919844411511?text=${encodeURIComponent(data.waText)}`;
  }
}

function initPlanPosterModal() {
  // Tab click triggers
  const tabButtons = document.querySelectorAll('.poster-tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-poster-tab');
      switchPlanTab(key);
    });
  });

  // Buttons/Chips with data-open-plan-poster
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open-plan-poster]');
    if (trigger) {
      e.preventDefault();
      const planKey = trigger.getAttribute('data-open-plan-poster') || 'yaw';
      openPlanPoster(planKey);
    }
  });
}

/**
 * ==========================================================================
 * 8. FAST ANIMATED NUMBER COUNTERS (0 to 500, 1 to 15)
 * Rapid count-up effect on page load and scroll into view
 * ==========================================================================
 */
function initFastAnimatedCounters() {
  const counters = document.querySelectorAll('.counter-number');
  if (!counters.length) return;

  function animate(el) {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const start = parseInt(el.getAttribute('data-start'), 10) || 0;
    // Visually rich fast count-up (950ms for 500, 650ms for 15)
    const duration = target > 50 ? 950 : 650;
    const startTime = performance.now();
    el.textContent = start;

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Fast quadratic/cubic ease-out curve
      const ease = 1 - Math.pow(1 - progress, 2.5);
      const val = Math.floor(start + (target - start) * ease);

      el.textContent = val;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  // Trigger after short delay so the user visibly watches it roll up from 0
  setTimeout(() => {
    counters.forEach(c => animate(c));
  }, 180);

  // Observer for counters scrolled into view later
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    counters.forEach(c => observer.observe(c));
  }
}

/**
 * 9. Testimonial Poster Lightbox Viewer
 */
function openTestimonialLightbox(imgSrc, captionText) {
  let modal = document.getElementById('testimonialLightboxModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'testimonialLightboxModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="testimonial-lightbox-dialog">
        <button class="modal-close-btn" data-close-modal aria-label="Close dialog">&times;</button>
        <div class="testimonial-lightbox-img-wrap">
          <img src="${imgSrc}" alt="Customer Testimonial Poster" id="testimonialLightboxImg" class="testimonial-lightbox-img">
        </div>
        <div class="testimonial-lightbox-caption" id="testimonialLightboxCaption">${captionText || 'Customer Testimonial | INSURANCE ADDA'}</div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.modal-close-btn').addEventListener('click', () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  } else {
    const img = document.getElementById('testimonialLightboxImg');
    const caption = document.getElementById('testimonialLightboxCaption');
    if (img) img.src = imgSrc;
    if (caption) caption.textContent = captionText || 'Customer Testimonial | INSURANCE ADDA';
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
window.openTestimonialLightbox = openTestimonialLightbox;
