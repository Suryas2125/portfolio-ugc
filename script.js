const progress = document.querySelector(".scroll-progress");
const sections = [...document.querySelectorAll(".page")];
const revealSections = [...document.querySelectorAll(".reveal-section")];
const dots = [...document.querySelectorAll(".section-dots a")];
const filterButtons = [...document.querySelectorAll(".filters button")];
const cards = [...document.querySelectorAll(".work-card")];
const heroMedia = document.querySelector(".hero-media");
const videoLinks = [...document.querySelectorAll("[data-video-open]")];
const videoLightbox = document.querySelector("#video-lightbox");
const videoPlayer = videoLightbox?.querySelector("video");
const videoEmbed = videoLightbox?.querySelector("iframe");
const videoCloseButton = videoLightbox?.querySelector(".video-lightbox-close");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("in-view", entry.isIntersecting);
    });
  },
  { threshold: 0.28 }
);

revealSections.forEach((section) => revealObserver.observe(section));

function updateScrollUi() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${amount}%`;

  if (heroMedia) {
    heroMedia.style.setProperty("--parallax", `${Math.min(window.scrollY * 0.18, 120)}px`);
  }

  const midpoint = window.scrollY + window.innerHeight / 2;
  const activeIndex = sections.findIndex((section) => {
    return midpoint >= section.offsetTop && midpoint < section.offsetTop + section.offsetHeight;
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === Math.max(activeIndex, 0));
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    cards.forEach((card) => {
      card.classList.toggle("hidden", filter !== "all" && card.dataset.category !== filter);
    });
  });
});

function closeVideo() {
  if (!videoLightbox || !videoPlayer || !videoEmbed) return;

  videoLightbox.hidden = true;
  videoPlayer.pause();
  videoPlayer.removeAttribute("src");
  videoPlayer.removeAttribute("poster");
  videoPlayer.load();
  videoPlayer.hidden = false;
  videoEmbed.removeAttribute("src");
  videoEmbed.hidden = true;
  document.body.classList.remove("video-open");
}

videoLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!videoLightbox || !videoPlayer || !videoEmbed) return;

    event.preventDefault();

    if (link.dataset.embedSrc) {
      videoPlayer.pause();
      videoPlayer.removeAttribute("src");
      videoPlayer.removeAttribute("poster");
      videoPlayer.load();
      videoPlayer.hidden = true;
      videoEmbed.src = link.dataset.embedSrc;
      videoEmbed.hidden = false;
    } else {
      videoEmbed.removeAttribute("src");
      videoEmbed.hidden = true;
      videoPlayer.hidden = false;
      videoPlayer.src = link.dataset.videoSrc || "";
      videoPlayer.poster = link.dataset.videoPoster || "";
      videoPlayer.play().catch(() => {});
    }

    videoLightbox.hidden = false;
    document.body.classList.add("video-open");
    videoCloseButton?.focus();
  });
});

videoCloseButton?.addEventListener("click", closeVideo);

videoLightbox?.addEventListener("click", (event) => {
  if (event.target === videoLightbox) {
    closeVideo();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && videoLightbox && !videoLightbox.hidden) {
    closeVideo();
  }
});

window.addEventListener("scroll", updateScrollUi, { passive: true });
window.addEventListener("resize", updateScrollUi);
updateScrollUi();
