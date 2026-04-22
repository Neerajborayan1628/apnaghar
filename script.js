const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const topbar = document.querySelector(".topbar");
const preloader = document.getElementById("preloader");
const backToTop = document.getElementById("backToTop");

document.body.classList.add("loading");
window.addEventListener("load", () => {
  if (preloader) preloader.classList.add("hidden");
  document.body.classList.remove("loading");
});

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navLinks.classList.remove("open"));
  });
}

if (topbar) {
  const updateTopbar = () => {
    if (window.scrollY > 8) topbar.classList.add("scrolled");
    else topbar.classList.remove("scrolled");
  };
  updateTopbar();
  window.addEventListener("scroll", updateTopbar, { passive: true });
}

// A/B-ready hero button copy variants (use ?ab=b to switch).
const heroVariantParam = new URLSearchParams(window.location.search).get("ab");
const heroVariant = heroVariantParam && heroVariantParam.toLowerCase() === "b" ? "b" : "a";
const abButtons = document.querySelectorAll("[data-ab-key]");
if (abButtons.length) {
  abButtons.forEach((button) => {
    const label = button.querySelector(".btn-copy");
    if (!label) return;
    const text = button.dataset[`copy${heroVariant.toUpperCase()}`];
    if (text) label.textContent = text;
  });
}

if (backToTop) {
  const toggleBackToTop = () => {
    if (window.scrollY > 380) backToTop.classList.add("show");
    else backToTop.classList.remove("show");
  };
  toggleBackToTop();
  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const reveals = document.querySelectorAll("[data-reveal]");
if (reveals.length) {
  reveals.forEach((item, index) => {
    const stagger = (index % 4) * 0.08;
    item.style.setProperty("--reveal-delay", `${stagger}s`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach((item) => observer.observe(item));
}

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const messageInput = document.getElementById("message");
  const serviceInput = document.getElementById("serviceNeeded");
  const contactTimeInput = document.getElementById("contactTime");
  const nameError = document.getElementById("nameError");
  const phoneError = document.getElementById("phoneError");
  const messageError = document.getElementById("messageError");
  const serviceError = document.getElementById("serviceError");
  const timeError = document.getElementById("timeError");
  const formSuccess = document.getElementById("formSuccess");
  const params = new URLSearchParams(window.location.search);
  const selectedPlan = params.get("plan");
  const selectedBilling = params.get("billing");

  if (selectedPlan && messageInput) {
    const serviceValueMap = {
      Basic: "inspection",
      Standard: "cleaning",
      Premium: "full",
      "Custom Service": "full",
    };

    if (serviceInput && serviceValueMap[selectedPlan]) {
      serviceInput.value = serviceValueMap[selectedPlan];
    }

    const billingLabel = selectedBilling === "yearly" ? "Yearly" : "Monthly";
    messageInput.value = `Hello, I want to book the ${selectedPlan} plan (${billingLabel}) from Apna Ghar Care.`;
  }

  const phoneRegex = /^[0-9+\-\s]{10,15}$/;

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let valid = true;
    nameError.textContent = "";
    phoneError.textContent = "";
    messageError.textContent = "";
    if (serviceError) serviceError.textContent = "";
    if (timeError) timeError.textContent = "";
    formSuccess.textContent = "";

    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      nameError.textContent = "Please enter a valid name.";
      valid = false;
    }

    if (!phoneRegex.test(phoneInput.value.trim())) {
      phoneError.textContent = "Please enter a valid phone number.";
      valid = false;
    }

    if (serviceInput && !serviceInput.value) {
      if (serviceError) serviceError.textContent = "Please select a service.";
      valid = false;
    }

    if (contactTimeInput && !contactTimeInput.value) {
      if (timeError) timeError.textContent = "Please choose a contact time.";
      valid = false;
    }

    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      messageError.textContent = "Message should be at least 10 characters.";
      valid = false;
    }

    if (valid) {
      formSuccess.textContent =
        "Thanks! Your enquiry has been submitted successfully.";
      contactForm.reset();
    }
  });
}

// Animated trust counter when badges appear.
const counters = document.querySelectorAll("[data-counter]");
if (counters.length) {
  const runCounter = (counter) => {
    const target = Number(counter.dataset.counter || 0);
    const duration = 1300;
    const start = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = `${Math.floor(target * eased)}`;
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

// Keep effects light and business-focused: no heavy mouse-tracking animations.

// Section transition glow as user scrolls.
const transitionSections = document.querySelectorAll(".section-transition");
if (transitionSections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    { threshold: 0.25 }
  );

  transitionSections.forEach((section) => sectionObserver.observe(section));
}

// Visual highlights: category filters.
const visualFilterButtons = document.querySelectorAll(".visual-filter-btn");
const visualCards = document.querySelectorAll(".visual-card");
if (visualFilterButtons.length && visualCards.length) {
  visualFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.filter || "all";

      visualFilterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      visualCards.forEach((card) => {
        const category = card.dataset.category || "";
        const showCard = selected === "all" || category === selected;
        card.classList.toggle("is-hidden", !showCard);
      });
    });
  });
}

// Before/after comparison sliders.
const compareSliders = document.querySelectorAll(".compare-slider");
if (compareSliders.length) {
  compareSliders.forEach((compareSlider) => {
    const range = compareSlider.querySelector(".compare-range");
    const afterWrap = compareSlider.querySelector(".compare-after-wrap");
    const divider = compareSlider.querySelector(".compare-divider");

    if (range && afterWrap && divider) {
      const updateCompare = (value) => {
        const percentage = Math.max(0, Math.min(100, Number(value)));
        afterWrap.style.width = `${percentage}%`;
        divider.style.left = `${percentage}%`;
      };

      updateCompare(range.value);
      range.addEventListener("input", (event) => {
        updateCompare(event.target.value);
      });
    }
  });
}

// Visual highlights: lightbox popup on image click.
const lightbox = document.getElementById("visualLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.querySelector(".lightbox-close");
const visualImages = document.querySelectorAll(".visual-image");

if (lightbox && lightboxImage && visualImages.length) {
  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
  };

  visualImages.forEach((image) => {
    image.addEventListener("click", () => {
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("open")) {
      closeLightbox();
    }
  });
}
