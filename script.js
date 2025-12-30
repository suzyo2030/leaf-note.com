// ====================================
// Smooth Scroll Animations
// ====================================

// Smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Scroll-triggered fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Apply observer to elements with animation classes
document.querySelectorAll('[data-animate]').forEach(el => {
  observer.observe(el);
});

// ====================================
// Number Counters for Stats Section
// ====================================

function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  let current = start;

  const counter = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString();
      clearInterval(counter);
    } else {
      element.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
}

// Initialize counters when stats section comes into view
const statsObserver = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      const counters = entry.target.querySelectorAll('[data-counter]');
      counters.forEach(counter => {
        const targetValue = parseInt(counter.getAttribute('data-counter'), 10);
        animateCounter(counter, targetValue);
      });
      entry.target.classList.add('counted');
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

// Observe stats sections
const statsSection = document.querySelector('[data-stats-section]');
if (statsSection) {
  statsObserver.observe(statsSection);
}

// ====================================
// Enhanced Interactivity
// ====================================

// Button ripple effect
function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.classList.add('ripple');

  button.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
}

// Add ripple effect to all buttons
document.querySelectorAll('button, [role="button"]').forEach(button => {
  button.addEventListener('click', createRipple);
  
  // Add hover effect class
  button.addEventListener('mouseenter', function() {
    this.classList.add('hover-active');
  });
  button.addEventListener('mouseleave', function() {
    this.classList.remove('hover-active');
  });
});

// Enhanced hover effects for interactive elements
document.querySelectorAll('[data-interactive]').forEach(element => {
  element.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-4px)';
    this.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
  });
  element.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = '';
  });
});

// ====================================
// Improved Form Validation
// ====================================

class FormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    if (!this.form) return;
    
    this.fields = {
      email: {
        selector: 'input[type="email"]',
        rules: ['required', 'email'],
        message: 'Please enter a valid email address'
      },
      name: {
        selector: 'input[name="name"]',
        rules: ['required', 'minLength:2'],
        message: 'Name must be at least 2 characters'
      },
      phone: {
        selector: 'input[type="tel"]',
        rules: ['phone'],
        message: 'Please enter a valid phone number'
      },
      message: {
        selector: 'textarea[name="message"]',
        rules: ['required', 'minLength:10'],
        message: 'Message must be at least 10 characters'
      }
    };

    this.init();
  }

  init() {
    // Add event listeners to form fields
    Object.values(this.fields).forEach(field => {
      const element = this.form.querySelector(field.selector);
      if (element) {
        element.addEventListener('blur', () => this.validateField(element));
        element.addEventListener('input', () => this.clearError(element));
      }
    });

    // Form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  validateField(element) {
    const rules = this.findRules(element);
    if (!rules) return true;

    for (let rule of rules.rules) {
      if (!this.checkRule(element.value, rule)) {
        this.showError(element, rules.message);
        return false;
      }
    }
    this.clearError(element);
    return true;
  }

  findRules(element) {
    for (let field in this.fields) {
      if (this.form.querySelector(this.fields[field].selector) === element) {
        return this.fields[field];
      }
    }
    return null;
  }

  checkRule(value, rule) {
    if (rule === 'required') {
      return value.trim().length > 0;
    }
    if (rule.startsWith('minLength')) {
      const length = parseInt(rule.split(':')[1], 10);
      return value.length >= length;
    }
    if (rule === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }
    if (rule === 'phone') {
      const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
      return phoneRegex.test(value) || value === '';
    }
    return true;
  }

  showError(element, message) {
    element.classList.add('field-error');
    const errorElement = element.parentElement.querySelector('.error-message') ||
                        this.createErrorElement();
    errorElement.textContent = message;
    element.parentElement.appendChild(errorElement);
  }

  clearError(element) {
    element.classList.remove('field-error');
    const errorElement = element.parentElement.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

  createErrorElement() {
    const error = document.createElement('div');
    error.className = 'error-message';
    error.style.color = '#dc3545';
    error.style.fontSize = '12px';
    error.style.marginTop = '4px';
    return error;
  }

  handleSubmit(e) {
    e.preventDefault();
    
    let isValid = true;
    Object.values(this.fields).forEach(field => {
      const element = this.form.querySelector(field.selector);
      if (element && !this.validateField(element)) {
        isValid = false;
      }
    });

    if (isValid) {
      this.submitForm();
    }
  }

  submitForm() {
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success-message';
    successMessage.textContent = 'Thank you! Your message has been sent successfully.';
    successMessage.style.cssText = `
      background-color: #28a745;
      color: white;
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 16px;
      animation: slideIn 0.3s ease-out;
    `;
    
    this.form.insertBefore(successMessage, this.form.firstChild);

    // Reset form
    setTimeout(() => {
      this.form.reset();
      successMessage.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => successMessage.remove(), 300);
    }, 2000);
  }
}

// Initialize form validation
const contactForm = new FormValidator('form[name="contact"]') || 
                   new FormValidator('form.contact-form') ||
                   new FormValidator('form');

// ====================================
// Keyboard Navigation Enhancements
// ====================================

// Add keyboard accessibility
document.addEventListener('keydown', (e) => {
  // Close modals with Escape key
  if (e.key === 'Escape') {
    document.querySelectorAll('[data-modal].active').forEach(modal => {
      modal.classList.remove('active');
    });
  }

  // Navigate with Tab key
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});

// ====================================
// Utility Functions
// ====================================

// Throttle function for performance
function throttle(func, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return func(...args);
    }
  };
}

// Debounce function for form inputs
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

// Add CSS animations if not present
if (!document.querySelector('style[data-animations]')) {
  const style = document.createElement('style');
  style.setAttribute('data-animations', 'true');
  style.textContent = `
    .animate-fade-in {
      animation: fadeIn 0.6s ease-out forwards;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      pointer-events: none;
    }

    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }

    .field-error {
      border-color: #dc3545 !important;
      background-color: #fff5f5;
    }

    .error-message {
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
      animation: slideIn 0.2s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideOut {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-4px);
      }
    }

    button {
      position: relative;
      overflow: hidden;
    }

    button.hover-active {
      transform: translateY(-2px);
      transition: all 0.2s ease-out;
    }

    body.keyboard-nav *:focus {
      outline: 2px solid #007bff;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);
}

// ====================================
// Initialize on DOM Ready
// ====================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('Script initialized with smooth scrolls, counters, interactivity, and form validation');
});