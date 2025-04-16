document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  
  menuToggle.addEventListener('click', function(event) {
    event.stopPropagation();
    navLinks.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });
  
  document.addEventListener('click', function(event) {
    if (!event.target.closest('nav') && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
  
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
});
