const leadForm = document.getElementById("leadForm");
const trigger = document.getElementById("whatsappTrigger");
const formStatus = document.getElementById("formStatus");
const submitLead = document.getElementById("submitLead");

const APPS_SCRIPT_URL = "https://google-sheet-xlee.onrender.com/submit-form"; // Backend API

// Toast notification system
function showToast(message, type = "success", duration = 4000) {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");

  const iconMap = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    loading: "⟳",
  };

  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${iconMap[type] || "•"}</span>
      <span class="toast-message">${message}</span>
    </div>
  `;

  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add("toast-show");
  });

  if (duration > 0) {
    setTimeout(() => {
      toast.classList.remove("toast-show");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  }

  return toast;
}

function initPageEffects() {
  const progress = document.querySelector(".scroll-progress");
  const cursorGlow = document.querySelector(".cursor-glow");
  const navLinks = [...document.querySelectorAll(".site-nav a")];
  const cards = [
    ...document.querySelectorAll(
      ".stat-card, .about-card, .service-card, .process-card, .pipeline-card, .contact-card",
    ),
  ];
  const magneticItems = [
    ...document.querySelectorAll(".button, .gallery-card, .glow-card"),
  ];

  function updateProgress() {
    if (!progress) {
      return;
    }

    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.transform = `scaleX(${amount})`;
  }

  function updateActiveNav() {
    const sections = ["home", "about", "services", "contact"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const current = sections.reduce((active, section) => {
      const top = section.getBoundingClientRect().top;
      return top <= 160 ? section.id : active;
    }, "home");

    navLinks.forEach((link) => {
      link.classList.toggle(
        "is-active",
        link.getAttribute("href") === `#${current}`,
      );
    });
  }

  function handleCardLight(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty("--mx", `${x}%`);
    event.currentTarget.style.setProperty("--my", `${y}%`);
  }

  cards.forEach((card) => {
    card.addEventListener("pointermove", handleCardLight);
  });

  window.addEventListener(
    "scroll",
    () => {
      updateProgress();
      updateActiveNav();
    },
    { passive: true },
  );

  window.addEventListener("resize", updateProgress);
  updateProgress();
  updateActiveNav();

  if (
    !window.gsap ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const { gsap } = window;
  const moveGlowX = cursorGlow
    ? gsap.quickTo(cursorGlow, "x", { duration: 0.45, ease: "power3.out" })
    : null;
  const moveGlowY = cursorGlow
    ? gsap.quickTo(cursorGlow, "y", { duration: 0.45, ease: "power3.out" })
    : null;

  if (cursorGlow && moveGlowX && moveGlowY) {
    window.addEventListener(
      "pointermove",
      (event) => {
        moveGlowX(event.clientX);
        moveGlowY(event.clientY);
      },
      { passive: true },
    );
  }

  magneticItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      gsap.to(item, {
        x: x * 0.06,
        y: y * 0.08,
        rotateX: y * -0.025,
        rotateY: x * 0.025,
        duration: 0.35,
        ease: "power3.out",
      });
    });

    item.addEventListener("pointerleave", () => {
      gsap.to(item, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.45)",
      });
    });
  });
}

function initAnimations() {
  if (!window.gsap) {
    document.body.classList.add("animations-ready");
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    document.body.classList.add("animations-ready");
    return;
  }

  const { gsap } = window;

  if (window.ScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);
  }

  gsap.set(
    ".site-header, .hero-copy, .hero-visual, .stat-card, .about-card, .service-card, .gallery-card, .process-card, .pipeline-card, .contact-card, .contact-form",
    {
      autoAlpha: 0,
      y: 26,
    },
  );

  gsap
    .timeline({ defaults: { ease: "power3.out" } })
    .to(".site-header", { autoAlpha: 1, y: 0, duration: 0.75 })
    .to(".hero-copy", { autoAlpha: 1, y: 0, duration: 0.9 }, "-=0.35")
    .to(".hero-visual", { autoAlpha: 1, y: 0, duration: 0.9 }, "-=0.65")
    .from(
      ".hero-kicker, .hero h2, .hero-text, .hero-actions, .hero-trust, .hero-points li",
      {
        autoAlpha: 0,
        y: 18,
        duration: 0.65,
        stagger: 0.07,
      },
      "-=0.45",
    );

  if (window.ScrollTrigger) {
    gsap.utils
      .toArray(
        ".stat-card, .about-card, .service-card, .gallery-card, .process-card, .pipeline-card, .contact-card",
      )
      .forEach((card, index) => {
        gsap.to(card, {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          delay: (index % 4) * 0.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 86%",
          },
        });
      });

    gsap.to(".contact-form", {
      autoAlpha: 1,
      y: 0,
      duration: 0.85,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".contact-form",
        start: "top 88%",
      },
    });

    gsap.utils.toArray(".gallery-card img").forEach((image) => {
      gsap.fromTo(
        image,
        {
          yPercent: -4,
        },
        {
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: image,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });
  } else {
    gsap.to(
      ".stat-card, .about-card, .service-card, .gallery-card, .process-card, .pipeline-card, .contact-card, .contact-form",
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.72,
        stagger: 0.05,
        ease: "power3.out",
      },
    );
  }

  gsap.to(".card-icon", {
    rotate: 4,
    duration: 1.8,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    stagger: 0.12,
  });

  gsap.to(".ambient-one", {
    x: 28,
    y: -18,
    scale: 1.12,
    duration: 5,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });

  gsap.to(".ambient-two", {
    x: -22,
    y: 24,
    scale: 1.08,
    duration: 6,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });

  document.body.classList.add("animations-ready");
}

function getFormData() {
  return {
    name: document.querySelector('input[name="name"]')?.value.trim() || "",
    phone: document.querySelector('input[name="phone"]')?.value.trim() || "",
    email: document.querySelector('input[name="email"]')?.value.trim() || "",
    domain: document.querySelector('input[name="domain"]')?.value.trim() || "",
    branch: document.querySelector('input[name="branch"]')?.value.trim() || "",
    degree: document.querySelector('input[name="degree"]')?.value.trim() || "",
    message:
      document.querySelector('textarea[name="message"]')?.value.trim() || "",
    userMessage:
      document.querySelector('textarea[name="userMessage"]')?.value.trim() ||
      "",
    source: "Website Form",
    status: "Received",
  };
}

function setStatus(message, type) {
  if (!formStatus) {
    return;
  }

  formStatus.textContent = message;
  formStatus.dataset.state = type;
}

if (leadForm) {
  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!leadForm.reportValidity()) {
      return;
    }

    const formData = getFormData();

    if (!APPS_SCRIPT_URL) {
      showToast(
        "Connect the Google Apps Script Web App URL to start saving entries in Google Sheets.",
        "error",
      );
      return;
    }

    submitLead.disabled = true;
    const loadingToast = showToast("Submitting your query...", "loading", 0);

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Remove loading toast
      if (loadingToast) {
        loadingToast.remove();
      }

      if (response.status && response.status === 200) {
        leadForm.reset();
        showToast(
          "Your query has been recorded. You will get response soon",
          "success",
          5000,
        );
      }
    } catch (error) {
      // Remove loading toast
      if (loadingToast) {
        loadingToast.remove();
      }
      leadForm.reset();
      showToast(
        error.message || "Something went wrong while submitting your query.",
        "error",
      );
    } finally {
      submitLead.disabled = false;
    }
  });
}

if (trigger) {
  trigger.addEventListener("click", () => {
    const formData = getFormData();
    const text = [
      "Hello NextGen Engineering Solutions,",
      formData.name ? `Name: ${formData.name}` : "",
      formData.phone ? `Phone/WhatsApp: ${formData.phone}` : "",
      formData.email ? `Email: ${formData.email}` : "",
      formData.domain ? `Domain: ${formData.domain}` : "",
      formData.branch ? `Branch: ${formData.branch}` : "",
      formData.degree ? `Current/Pursuing Degree: ${formData.degree}` : "",
      formData.message ? `Requirement: ${formData.message}` : "",
      formData.userMessage ? `Your Message: ${formData.userMessage}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const url = `https://wa.me/918789967749?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

window.addEventListener("load", () => {
  initPageEffects();
  initAnimations();
});
