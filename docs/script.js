// Navigation
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const searchInput = document.querySelector('#search');
  const navLinks = document.querySelectorAll('.nav-links a');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // Mobile menu toggle
  menuToggle?.addEventListener('click', () => {
      sidebar?.classList.toggle('active');
  });

  // Search functionality
  searchInput?.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      navLinks.forEach(link => {
          const text = link.textContent?.toLowerCase() || '';
          const listItem = link.parentElement;
          if (listItem) {
              listItem.style.display = text.includes(searchTerm) ? '' : 'none';
          }
      });
  });

  // Smooth scroll for navigation links
  navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href');
          if (targetId) {
              const targetElement = document.querySelector(targetId);
              targetElement?.scrollIntoView({ behavior: 'smooth' });

              // Close mobile menu after click
              sidebar?.classList.remove('active');
          }
      });
  });

  // Installation tabs
  tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
          const tabId = btn.dataset.tab;

          // Update active tab button
          tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          // Update active tab content
          tabContents.forEach(content => {
              content.classList.remove('active');
              if (content.id === tabId) {
                  content.classList.add('active');
              }
          });
      });
  });

  // Highlight active section on scroll
  let currentSection = '';
  window.addEventListener('scroll', () => {
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.clientHeight;
          if (window.scrollY >= sectionTop - 100) {
              currentSection = '#' + section.id;
          }
      });

      navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === currentSection) {
              link.classList.add('active');
          }
      });
  });
});

// Code syntax highlighting
if (typeof Prism !== 'undefined') {
  Prism.highlightAll();
}