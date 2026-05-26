/* -------------------------------------------------------------
 * Custom Interactive Logic - Alex Rivera Freelance Portfolio
 * Vanilla ES6 JavaScript for sticky header, scrolling, active
 * links, project filtering, counter animation, & form submission.
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Sticky Header Navigation
     ========================================================================== */
  const header = document.getElementById('header');
  
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  // Initialize and attach scroll listener
  handleScroll();
  window.addEventListener('scroll', handleScroll);


  /* ==========================================================================
     2. Mobile Hamburger Navigation Overlay
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  
  const toggleMobileMenu = () => {
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    
    mobileToggle.setAttribute('aria-expanded', !isExpanded);
    mobileNav.classList.toggle('open');
    mobileNav.setAttribute('aria-hidden', isExpanded);
    
    // Prevent background scrolling while menu is open
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  };
  
  const closeMobileMenu = () => {
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  
  // Toggler trigger
  mobileToggle.addEventListener('click', toggleMobileMenu);
  
  // Close menu when clicking on any navigation links
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  
  // Close menu when resizing the window to desktop sizes
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });


  /* ==========================================================================
     3. Active Link Highlighter on Scroll
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  
  const highlightNavigation = () => {
    const scrollPosition = window.scrollY + 160; // Offset for sticky navigation bar
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  
  window.addEventListener('scroll', highlightNavigation);


  /* ==========================================================================
     4. Interactive Projects Category Filter
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Manage active state of buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        // Remove animation display helper class first
        card.classList.remove('show-project');
        
        // Timeout allows CSS display to refresh smoothly for animated enter
        setTimeout(() => {
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.classList.add('show-project');
          } else {
            card.style.display = 'none';
          }
        }, 50);
      });
    });
  });


  /* ==========================================================================
     5. Scroll-Triggered Stats Counter Animation (Intersection Observer)
     ========================================================================== */
  const statsContainer = document.getElementById('stats-container');
  const statNumbers = document.querySelectorAll('.stat-number');
  let animationTriggered = false;
  
  const animateStats = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const duration = 2000; // Total count-up animation duration in ms
      const startTime = performance.now();
      
      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // Clamp to 1 max
        
        // Ease-out quad equation for visual smoothness
        const easeProgress = progress * (2 - progress);
        const currentValue = Math.floor(easeProgress * target);
        
        stat.textContent = currentValue;
        
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          stat.textContent = target; // Ensure perfect ending value
        }
      };
      
      requestAnimationFrame(step);
    });
  };
  
  // Set up observer
  if (statsContainer && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animationTriggered) {
          animationTriggered = true;
          animateStats();
          statsObserver.unobserve(entry.target); // Kill observer after completion
        }
      });
    }, { threshold: 0.25 });
    
    statsObserver.observe(statsContainer);
  } else if (statsContainer) {
    // Fallback if observer is unsupported
    animateStats();
  }


  /* ==========================================================================
     6. Client Form Validation & Simulated Submission
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const formStatusOverlay = document.getElementById('form-status');
  const stateSending = document.getElementById('state-sending');
  const stateSuccess = document.getElementById('state-success');
  const resetFormBtn = document.getElementById('btn-reset-form');
  
  // Input References
  const fields = {
    name: {
      input: document.getElementById('form-name'),
      error: document.getElementById('error-name'),
      validate: (val) => val.trim().length > 0
    },
    email: {
      input: document.getElementById('form-email'),
      error: document.getElementById('error-email'),
      validate: (val) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(val.trim());
      }
    },
    service: {
      input: document.getElementById('form-service'),
      error: document.getElementById('error-service'),
      validate: (val) => val !== '' && val !== null
    },
    budget: {
      input: document.getElementById('form-budget'),
      error: document.getElementById('error-budget'),
      validate: (val) => val !== '' && val !== null
    },
    message: {
      input: document.getElementById('form-message'),
      error: document.getElementById('error-message-field'),
      validate: (val) => val.trim().length > 0
    }
  };
  
  // Input / Change Listener to remove errors on-the-fly when typing
  Object.keys(fields).forEach(key => {
    const field = fields[key];
    const eventType = field.input.tagName === 'SELECT' ? 'change' : 'input';
    
    field.input.addEventListener(eventType, () => {
      if (field.validate(field.input.value)) {
        field.input.classList.remove('input-error');
        field.error.style.display = 'none';
      }
    });
  });
  
  // Form submission handler
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isFormValid = true;
    
    // Validate all fields
    Object.keys(fields).forEach(key => {
      const field = fields[key];
      const isValid = field.validate(field.input.value);
      
      if (!isValid) {
        field.input.classList.add('input-error');
        field.error.style.display = 'block';
        isFormValid = false;
      } else {
        field.input.classList.remove('input-error');
        field.error.style.display = 'none';
      }
    });
    
    // Intercept if invalid
    if (!isFormValid) return;
    
    // Simulate API request lifecycle
    formStatusOverlay.classList.add('show-overlay');
    stateSending.classList.add('active-state');
    stateSuccess.classList.remove('active-state');
    
    // Step 1: Simulate network sending (2 seconds)
    setTimeout(() => {
      stateSending.classList.remove('active-state');
      stateSuccess.classList.add('active-state');
    }, 2000);
  });
  
  // Reset form handler
  resetFormBtn.addEventListener('click', () => {
    contactForm.reset();
    formStatusOverlay.classList.remove('show-overlay');
    stateSuccess.classList.remove('active-state');
    stateSending.classList.remove('active-state');
    
    // Reset all error UI indicators
    Object.keys(fields).forEach(key => {
      const field = fields[key];
      field.input.classList.remove('input-error');
      field.error.style.display = 'none';
    });
  });

  /* ==========================================================================
     6b. Direct Project Order Auto-Selection Linkage
     ========================================================================== */
  const orderButtons = document.querySelectorAll('.btn-order-project, .btn-overlay-action');
  
  orderButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedService = btn.getAttribute('data-service');
      const selectDropdown = document.getElementById('form-service');
      
      if (selectedService && selectDropdown) {
        selectDropdown.value = selectedService;
        // Trigger a 'change' event manually so validation updates the UI instantly
        selectDropdown.dispatchEvent(new Event('change'));
      }
    });
  });


  /* ==========================================================================
     7. Scroll-Driven Elements Slide-up Animations (Intersection Observer)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          revealObserver.unobserve(entry.target); // Only trigger animation once
        }
      });
    }, {
      root: null, // Viewport
      threshold: 0.12, // Trigger when 12% of the element is visible
      rootMargin: '0px 0px -20px 0px' // Slightly offset trigger points
    });
    
    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: Reveal immediately if browser doesn't support Intersection Observer
    revealElements.forEach(el => el.classList.add('reveal-active'));
  }


  /* ==========================================================================
     8. Dynamic Copyright Year Script
     ========================================================================== */
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

});
