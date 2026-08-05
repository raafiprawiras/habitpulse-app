/**
 * HabitPulse Landing Page & IntersectionObserver Controller
 */
import { $, $$ } from './utils.js';

export const LandingController = {
  init() {
    this.initMobileDrawer();
    this.initScrollReveal();
    this.initActiveNavObserver();
  },

  initMobileDrawer() {
    const hamburgerBtn = $('#hamburger-btn');
    const mobileDrawer = $('#mobile-drawer');
    const mobileLinks = $$('.mobile-nav-link');

    if (hamburgerBtn && mobileDrawer) {
      hamburgerBtn.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.contains('active');
        if (isOpen) {
          mobileDrawer.classList.remove('active');
          hamburgerBtn.setAttribute('aria-expanded', 'false');
        } else {
          mobileDrawer.classList.add('active');
          hamburgerBtn.setAttribute('aria-expanded', 'true');
        }
      });

      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileDrawer.classList.remove('active');
          hamburgerBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }
  },

  initScrollReveal() {
    const revealElements = $$('.reveal-on-scroll');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  },

  initActiveNavObserver() {
    const sections = $$('section[id]');
    const navLinks = $$('.nav-link');
    const bottomItems = $$('.mobile-bottom-item');

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });

          bottomItems.forEach(item => {
            if (item.getAttribute('href') === `#${id}`) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        }
      });
    }, {
      threshold: 0.3
    });

    sections.forEach(section => sectionObserver.observe(section));
  }
};
