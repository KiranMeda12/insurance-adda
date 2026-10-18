/**
 * INSURANCE ADDA - Main Scripts
 * Handles sticky navigation, mobile drawer, 3D cards services slider, plan posters modal, and smooth interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initGetAssistanceNavigation();
  initModals();
  initDynamicYear();
  initScrollAnimations();
  initServicesSlider();
  initPlanPosterModal();
  initFastAnimatedCounters();
  initWelcomeLeadPopup();
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
  const closeBtn = document.getElementById('mobileDrawerClose');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-link, .mobile-nav-item');

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

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  overlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      closeDrawer();
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetEl = document.querySelector(href);
        if (targetEl) {
          setTimeout(() => {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 220);
        }
      }
    });
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
        const enquiryCard = document.querySelector('.enquiry-form-card');
        const serviceSelect = document.getElementById('homeInsuranceService');
        if (serviceSelect) serviceSelect.value = 'Health Insurance';
        if (enquiryCard) {
          enquiryCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const firstInput = enquiryCard.querySelector('input[name="fullName"]');
          if (firstInput) firstInput.focus();
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

/**
 * Open Achievement Photo in Lightbox Modal
 */
function openAchievementLightbox(imgSrc, captionText) {
  openTestimonialLightbox(imgSrc, captionText || 'Achievement & Recognition | INSURANCE ADDA');
}
window.openAchievementLightbox = openAchievementLightbox;

/**
 * 10. Direct "Get Assistance" Smooth Navigation to Form (No Modal)
 * Ensures homepage ALWAYS starts at the very top (Hero section) on initial page load.
 * Scrolls to the Request Personalised Assistance form ONLY when customer clicks the button.
 */
function initGetAssistanceNavigation() {
  const btn = document.getElementById('navGetAssistanceBtn');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const formCard = document.querySelector('.enquiry-form-card');
      const contactForm = document.getElementById('contactPageForm');
      
      if (formCard) {
        // On homepage: smooth scroll directly to the form
        formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          const firstInput = formCard.querySelector('input[name="fullName"]');
          if (firstInput) {
            firstInput.focus();
          }
          formCard.style.transition = 'box-shadow 0.4s ease';
          formCard.style.boxShadow = '0 0 0 4px rgba(200, 164, 93, 0.45), 0 20px 45px rgba(11, 23, 48, 0.2)';
          setTimeout(() => {
            formCard.style.boxShadow = '';
          }, 1800);
        }, 450);
      } else if (contactForm) {
        // On contact page: smooth scroll to form
        contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          const firstInput = contactForm.querySelector('input[name="fullName"]');
          if (firstInput) firstInput.focus();
        }, 450);
      } else {
        // On another page (e.g. testimonials): store flag and go to homepage
        sessionStorage.setItem('openAssistanceForm', 'true');
        window.location.href = 'index.html';
      }
    });
  }

  // Clear any legacy hash from URL so reloads NEVER anchor-jump down
  if (window.location.hash === '#contact' || window.location.hash === '#contactPageForm' || window.location.hash === '#enquiry') {
    history.replaceState(null, document.title, window.location.pathname + window.location.search);
    window.scrollTo(0, 0);
  }

  // ONLY scroll down if customer specifically clicked "Get Assistance" on another page
  if (sessionStorage.getItem('openAssistanceForm') === 'true') {
    sessionStorage.removeItem('openAssistanceForm');
    setTimeout(() => {
      const formCard = document.querySelector('.enquiry-form-card');
      if (formCard) {
        formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const firstInput = formCard.querySelector('input[name="fullName"]');
        if (firstInput) firstInput.focus();
      }
    }, 450);
  } else {
    // Normal visit/load: guarantee the page starts at the very top (Hero section)
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }
}

/**
 * 10. First-Time Welcome Lead Popup Modal
 * Pops up automatically every first time the website is opened in a session.
 * Asks for Full Name and Phone Number with WhatsApp and Ignore buttons.
 */
function initWelcomeLeadPopup() {
  const POPUP_STORAGE_KEY = 'insurance_adda_welcome_popup_seen';
  
  // URL override for testing: ?popup=1 or ?welcome=1
  const urlParams = new URLSearchParams(window.location.search);
  const forceShow = urlParams.has('popup') || urlParams.has('welcome');

  if (!forceShow && sessionStorage.getItem(POPUP_STORAGE_KEY)) {
    return;
  }

  let popupBackdrop = document.getElementById('welcomeLeadPopup');
  if (!popupBackdrop) {
    const popupHtml = `
      <div class="welcome-popup-backdrop" id="welcomeLeadPopup" role="dialog" aria-modal="true" aria-labelledby="welcomePopupTitle" style="display:none;">
        <div class="welcome-popup-card">
          <button class="welcome-popup-close" id="welcomePopupCloseBtn" aria-label="Close dialog">&times;</button>
          
          <div class="welcome-popup-header">
            <div class="welcome-popup-badge">
              <span>👋</span> WELCOME TO INSURANCE ADDA
            </div>
            <h3 class="welcome-popup-title" id="welcomePopupTitle">Get Instant Advisory on WhatsApp</h3>
            <p class="welcome-popup-subtitle">
              Connect directly with <strong>Sri Ravi Kumar G.R.</strong> (15+ Years Trust &bull; 500+ Families Protected). Share your details for quick personalized assistance.
            </p>
          </div>

          <div class="welcome-popup-trust-strip">
            <div class="welcome-trust-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              100% Confidential
            </div>
            <div class="welcome-trust-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Fast Support
            </div>
            <div class="welcome-trust-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Free Guidance
            </div>
          </div>

          <form class="welcome-popup-form" id="welcomeLeadForm" onsubmit="return false;">
            <div class="welcome-form-group">
              <label class="welcome-form-label" for="welcomeLeadName">
                Your Name <span class="welcome-req">*</span>
              </label>
              <div class="welcome-input-wrap" id="welcomeNameWrap">
                <svg class="welcome-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input type="text" id="welcomeLeadName" class="welcome-form-control" placeholder="Enter your full name" required autocomplete="name">
              </div>
              <div class="welcome-error-msg" id="welcomeNameError">Please enter your name</div>
            </div>

            <div class="welcome-form-group">
              <label class="welcome-form-label" for="welcomeLeadPhone">
                Phone Number <span class="welcome-req">*</span>
              </label>
              <div class="welcome-input-wrap" id="welcomePhoneWrap">
                <svg class="welcome-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <input type="tel" id="welcomeLeadPhone" class="welcome-form-control" placeholder="10-digit mobile number" maxlength="10" required autocomplete="tel">
              </div>
              <div class="welcome-error-msg" id="welcomePhoneError">Please enter a valid 10-digit mobile number</div>
            </div>

            <div class="welcome-popup-actions">
              <button type="button" class="welcome-btn-whatsapp" id="welcomeWhatsAppBtn">
                <svg viewBox="0 0 24 24" fill="currentColor" style="width:20px;height:20px;flex-shrink:0;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <span>Connect on WhatsApp</span>
              </button>
              
              <button type="button" class="welcome-btn-ignore" id="welcomeIgnoreBtn">
                <span>Ignore</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHtml);
    popupBackdrop = document.getElementById('welcomeLeadPopup');
  }

  const closeBtn = document.getElementById('welcomePopupCloseBtn');
  const ignoreBtn = document.getElementById('welcomeIgnoreBtn');
  const whatsAppBtn = document.getElementById('welcomeWhatsAppBtn');
  const nameInput = document.getElementById('welcomeLeadName');
  const phoneInput = document.getElementById('welcomeLeadPhone');
  const nameError = document.getElementById('welcomeNameError');
  const phoneError = document.getElementById('welcomePhoneError');

  function openPopup() {
    popupBackdrop.style.display = 'flex';
    requestAnimationFrame(() => {
      popupBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  function closePopup(markSeen = true) {
    popupBackdrop.classList.remove('open');
    if (markSeen) {
      sessionStorage.setItem(POPUP_STORAGE_KEY, 'true');
    }
    setTimeout(() => {
      popupBackdrop.style.display = 'none';
      document.body.style.overflow = '';
    }, 350);
  }

  // Trigger popup automatically after gentle 750ms delay
  setTimeout(() => {
    openPopup();
  }, 750);

  // Close handlers
  if (closeBtn) closeBtn.addEventListener('click', () => closePopup(true));
  if (ignoreBtn) ignoreBtn.addEventListener('click', () => closePopup(true));
  
  popupBackdrop.addEventListener('click', (e) => {
    if (e.target === popupBackdrop) {
      closePopup(true);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popupBackdrop.classList.contains('open')) {
      closePopup(true);
    }
  });

  // Numeric sanitization for phone
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
      if (phoneError) phoneError.classList.remove('visible');
      phoneInput.classList.remove('is-invalid');
    });
  }

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameError) nameError.classList.remove('visible');
      nameInput.classList.remove('is-invalid');
    });
  }

  // WhatsApp Button Handler
  if (whatsAppBtn) {
    whatsAppBtn.addEventListener('click', () => {
      const nameVal = nameInput ? nameInput.value.trim() : '';
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';

      let hasError = false;

      if (!nameVal || nameVal.length < 2) {
        if (nameError) {
          nameError.textContent = 'Please enter your full name';
          nameError.classList.add('visible');
        }
        if (nameInput) {
          nameInput.classList.add('is-invalid');
          nameInput.focus();
        }
        hasError = true;
      }

      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneVal || !phoneRegex.test(phoneVal)) {
        if (phoneError) {
          phoneError.textContent = 'Please enter a valid 10-digit mobile number';
          phoneError.classList.add('visible');
        }
        if (phoneInput) {
          phoneInput.classList.add('is-invalid');
          if (!hasError) phoneInput.focus();
        }
        hasError = true;
      }

      if (hasError) return;

      // Construct pre-filled WhatsApp message
      const msg = `Hello Sri Ravi Kumar G.R.,%0A%0AMy Name: *${encodeURIComponent(nameVal)}*%0APhone Number: *${encodeURIComponent(phoneVal)}*%0A%0AI am visiting INSURANCE ADDA website and would like personalized insurance advisory & assistance.%0APlease connect with me.`;
      const whatsappUrl = `https://wa.me/919844411511?text=${msg}`;

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // Close popup & remember session
      closePopup(true);
    });
  }
}

