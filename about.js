// Select DOM elements
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Toggle navigation menu on click
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('show');
  const expanded = navLinks.classList.contains('show');
  menuToggle.setAttribute('aria-expanded', expanded);
  menuToggle.innerHTML = expanded ? '&times;' : '&#9776;'; // Change icon to close or hamburger
});

// Close menu when clicking a nav link on mobile
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('show')) {
      navLinks.classList.remove('show');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.innerHTML = '&#9776;';
    }
  });
});