// Fade-in animation when scrolling
const elements = document.querySelectorAll('.fade-in, .fade-in-up');

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  elements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 100) {
      el.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);
