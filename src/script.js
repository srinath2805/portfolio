window.addEventListener('load', () => {
  // hide overlay
  setTimeout(() => {
    document.getElementById('welcome-overlay').style.display = 'none';
  }, 3000);

  // put your scroll/slider JS here:
  const slider = document.getElementById('navSlider');
  const sectionIds = ['summary', 'skills', 'experience', 'education', 'projects', 'certificates'];
  let currentIndex = 0;

  function navigateSection(index) {
    const sections = document.querySelectorAll('.section');
    currentIndex = parseInt(index);
    if (slider) slider.value = currentIndex;

    sections.forEach((section, i) => {
      section.classList.toggle('active', i === currentIndex);
    });
  }

  if (slider) {
    slider.addEventListener('input', (e) => {
      navigateSection(e.target.value);
    });
  }

  let lastScrollTime = 0;
  let scrollBuffer = 0;
  let lastDirection = 0;

  window.addEventListener('wheel', (e) => {
    const now = Date.now();
    const SCROLL_THRESHOLD = 50;
    const SCROLL_COOLDOWN = 300;

    if (Math.abs(e.deltaY) < 10) return;

    const currentDirection = Math.sign(e.deltaY);
    if (currentDirection !== lastDirection) {
      scrollBuffer = 0;
      lastDirection = currentDirection;
    }

    scrollBuffer += e.deltaY;

    if (now - lastScrollTime > SCROLL_COOLDOWN) {
      if (scrollBuffer > SCROLL_THRESHOLD && currentIndex < sectionIds.length - 1) {
        currentIndex++;
        scrollBuffer = 0;
        lastScrollTime = now;
      } else if (scrollBuffer < -SCROLL_THRESHOLD && currentIndex > 0) {
        currentIndex--;
        scrollBuffer = 0;
        lastScrollTime = now;
      }

      if (slider) slider.value = currentIndex;
      navigateSection(currentIndex);
    }
  });
});
