(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const pageNow = document.getElementById("pageNow");
  const pageTotal = document.getElementById("pageTotal");
  const progressFill = document.getElementById("progressFill");
  const printBtn = document.getElementById("printBtn");

  let current = 0;

  function clamp(n) {
    return Math.max(0, Math.min(slides.length - 1, n));
  }

  function render() {
    slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === current);
    });

    const total = slides.length;
    pageNow.textContent = String(current + 1);
    pageTotal.textContent = String(total);
    progressFill.style.width = `${((current + 1) / total) * 100}%`;

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
    prevBtn.style.opacity = prevBtn.disabled ? "0.35" : "1";
    nextBtn.style.opacity = nextBtn.disabled ? "0.35" : "1";

    const active = slides[current];
    if (active) {
      active.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }

  function go(delta) {
    current = clamp(current + delta);
    render();
  }

  prevBtn.addEventListener("click", () => go(-1));
  nextBtn.addEventListener("click", () => go(1));

  document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (key === "ArrowRight" || key === "PageDown" || key === " ") {
      event.preventDefault();
      go(1);
    }
    if (key === "ArrowLeft" || key === "PageUp") {
      event.preventDefault();
      go(-1);
    }
    if (key === "Home") {
      event.preventDefault();
      current = 0;
      render();
    }
    if (key === "End") {
      event.preventDefault();
      current = slides.length - 1;
      render();
    }
  });

  printBtn.addEventListener("click", () => {
    window.print();
  });

  let touchStartX = null;
  document.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  document.addEventListener("touchend", (event) => {
    if (touchStartX === null) return;
    const dx = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 60) {
      go(dx < 0 ? 1 : -1);
    }
    touchStartX = null;
  }, { passive: true });

  render();
})();