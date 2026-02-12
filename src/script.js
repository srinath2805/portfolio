window.addEventListener('load', () => {
  // Force scroll to top (Summary section) on refresh
  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // Disable scroll initially
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden'; // For iOS

  // hide overlay with smooth fade out
  const overlay = document.getElementById('welcome-overlay');
  if (overlay) {
    // Wait for entrance animations to complete (approx 2.5s total time)
    setTimeout(() => {
      overlay.classList.add('fade-out');

      // Re-enable scroll
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';

      // Remove from DOM after transition completes (0.8s transition in CSS)
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 800);
    }, 3500); // 3.5s total display time
  }

  // Scroll/Slider Logic
  const slider = document.getElementById('navSlider');
  // Ordered list of section IDs corresponding to slider values 0-5
  const sectionIds = ['summary', 'skills', 'experience', 'projects', 'education', 'certificates'];

  // Function to smooth scroll to a section
  function navigateSection(index) {
    const sectionId = sectionIds[index];
    const section = document.getElementById(sectionId);
    if (section) {
      document.getElementById('sliderContainer').setAttribute('data-manual', 'true'); // Flag manual nav
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Update desktop slider value and active label immediately
      updateActiveNav(index);

      // Reset flag after animation roughly finishes
      setTimeout(() => {
        const sliderContainer = document.getElementById('sliderContainer');
        if (sliderContainer) {
          sliderContainer.removeAttribute('data-manual');
        }
      }, 1000);
    }
  }

  // Helper to update active state on both desktop and mobile
  function updateActiveNav(index) {
    // Desktop Slider
    const slider = document.getElementById('navSlider');
    if (slider) {
      slider.value = index;
    }
    const desktopLabels = document.querySelectorAll('.slider-labels span');
    desktopLabels.forEach((label, idx) => {
      if (idx == index) {
        label.classList.add('active');
      } else {
        label.classList.remove('active');
      }
    });

    // Mobile Slider
    const mobileItems = document.querySelectorAll('.mobile-nav-item');
    if (mobileItems.length > 0) {
      mobileItems.forEach((item, idx) => {
        if (idx == index) {
          item.classList.add('active');
          // Scroll the active item into view
          item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          item.classList.remove('active');
        }
      });
    }
  }

  // Bind slider input to navigation
  if (slider) {
    slider.addEventListener('input', (e) => {
      navigateSection(e.target.value);
    });
  }

  // Bind click on labels to navigation
  window.navigateSection = navigateSection; // Expose for onclick attributes in HTML

  // ScrollSpy: Update slider based on scroll position
  const sections = sectionIds.map(id => document.getElementById(id));

  window.addEventListener('scroll', () => {
    // Don't update slider if user is currently dragging/clicking it
    const sliderContainer = document.getElementById('sliderContainer');
    if (sliderContainer && sliderContainer.getAttribute('data-manual') === 'true') return;

    let currentSectionIndex = 0;

    // Check which section is closest to top of viewport
    sections.forEach((section, index) => {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const offset = window.innerWidth <= 768 ? 150 : window.innerHeight / 2; // Adjust offset for mobile header

      // If section top is above or near the offset
      if (rect.top <= offset) {
        currentSectionIndex = index;
      }
    });

    // Detect bottom of page to force last section active
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
      currentSectionIndex = sections.length - 1;
    }

    updateActiveNav(currentSectionIndex);
  });

});

// Mobile Menu Toggle
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) {
    menu.classList.toggle('active');
  }
}
window.toggleMenu = toggleMenu; // Expose to global scope for onclick
