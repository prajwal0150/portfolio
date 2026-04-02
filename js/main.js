/* ============================================================
   PRAJWAL RAI PORTFOLIO — main.js
   ============================================================ */

'use strict';

/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Active nav link on scroll ── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

function setActiveLink() {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY + 120 >= s.offsetTop) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', setActiveLink, { passive: true });
setActiveLink();

/* ── Mobile hamburger ── */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
  const bars = hamburger.querySelectorAll('span');
  const open  = navLinksEl.classList.contains('open');
  bars[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
  bars[1].style.opacity   = open ? '0' : '1';
  bars[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
});

// close on nav link click
navLinksEl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
  });
});

/* ── Intersection Observer for scroll animations ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Don't unobserve — keep in-view state
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up, .fade-in').forEach(el => observer.observe(el));

// Section tags
const tagObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.3 });
document.querySelectorAll('.section-tag').forEach(el => tagObserver.observe(el));

/* ── Initialize EmailJS ── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof emailjs !== 'undefined') {
    emailjs.init('BwvpcmbCxehPS0PCB');
    console.log('EmailJS initialized successfully');
  } else {
    console.error('EmailJS library not loaded');
  }
});

/* ── Contact form ── */
function setupContactForm() {
  const form = document.getElementById('contactForm');
  const sendBtn = document.getElementById('sendBtn');

  if (!form || !sendBtn) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const nameField    = document.getElementById('name');
    const emailField   = document.getElementById('email');
    const subjectField = document.getElementById('subject');
    const messageField = document.getElementById('message');

    // Validation
    if (!nameField.value.trim() || !emailField.value.trim() || !messageField.value.trim()) {
      shakeBtnEffect(sendBtn);
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    
    if (!isValidEmail(emailField.value)) {
      emailField.style.borderColor = '#ef4444';
      emailField.addEventListener('input', () => { emailField.style.borderColor = ''; }, { once: true });
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    if (typeof emailjs === 'undefined') {
      showToast('Email service is unavailable. Please refresh and try again.', 'error');
      return;
    }

    // Show loading state
    sendBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending…';
    sendBtn.disabled = true;

    try {
      if (!subjectField.value.trim()) {
        subjectField.value = 'New Message from Portfolio';
      }

      const serviceIds = ['service_niq451a'];
      const templateIds = ['template_99cmmzo'];
      let response = null;
      let lastError = null;

      for (const serviceId of serviceIds) {
        for (const templateId of templateIds) {
          try {
            response = await emailjs.sendForm(serviceId, templateId, form);
            console.log('Email sent using service/template:', serviceId, templateId);
            break;
          } catch (err) {
            lastError = err;
            const errText = (err && err.text) ? String(err.text).toLowerCase() : '';
            console.warn('EmailJS attempt failed:', serviceId, templateId, errText || err);

            // Keep trying other service/template combinations for common ID mismatch errors.
            const retryable = errText.includes('template id not found') || errText.includes('service id not found');
            if (!retryable) {
              throw err;
            }
          }
        }

        if (response) break;
      }

      if (!response) {
        throw lastError || new Error('EmailJS configuration mismatch (service/template/public key).');
      }

      console.log('Email sent successfully:', response);
      
      // Reset form
      nameField.value = '';
      emailField.value = '';
      subjectField.value = '';
      messageField.value = '';
      
      showToast('Message sent successfully!', 'success');
      
    } catch (error) {
      const details = (error && error.text) ? error.text : (error && error.message) ? error.message : String(error);
      console.error('EmailJS Error details:', details, error);
      showToast('Failed to send message: ' + details, 'error');
    } finally {
      // Reset button
      sendBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
      sendBtn.disabled = false;
    }
  });
}

// Initialize contact form when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupContactForm);
} else {
  setupContactForm();
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function shakeBtnEffect(btn) {
  btn.style.animation = 'shake .4s ease';
  btn.addEventListener('animationend', () => { btn.style.animation = ''; }, { once: true });
}

const toast = document.getElementById('toast');

function showToast(msg = 'Message sent successfully!', type = 'success') {
  if (!toast) return;
  toast.innerHTML = type === 'success' 
    ? '<i class="fas fa-check-circle"></i><span>' + msg + '</span>'
    : '<i class="fas fa-exclamation-circle"></i><span>' + msg + '</span>';
  toast.style.backgroundColor = type === 'success' ? '#10b981' : '#ef4444';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// Shake keyframes injected via JS (avoids extra CSS)
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100%{ transform:translateX(0); }
    20%     { transform:translateX(-6px); }
    40%     { transform:translateX(6px); }
    60%     { transform:translateX(-4px); }
    80%     { transform:translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);

/* ── Smooth internal links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = document.querySelector('.navbar').offsetHeight;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ── Parallax subtle on hero orbs ── */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  if (orb1) orb1.style.transform = `translateY(${scrollY * 0.12}px)`;
  if (orb2) orb2.style.transform = `translateY(${scrollY * -0.08}px)`;
}, { passive: true });

/* ── Console greeting ── */
console.log('%c Prajwal Rai Portfolio ', 'background:#4F46E5;color:#fff;font-size:14px;padding:6px 14px;border-radius:6px;font-family:monospace');
console.log('%c Built with HTML, CSS & JavaScript ', 'color:#3B82F6;font-size:11px;font-family:monospace');

/* ── Theme toggle (Dark / Light) ── */
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Initialize theme from localStorage or system preference
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }
}

function setTheme(theme) {
  if (theme === 'dark') {
    htmlElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    htmlElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
}

// Toggle theme on button click
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
}

// Initialize theme when page loads
document.addEventListener('DOMContentLoaded', initTheme);
if (document.readyState !== 'loading') {
  initTheme();
}
