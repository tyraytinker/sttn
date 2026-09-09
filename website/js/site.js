(function () {
  const page = document.body.dataset.page;
  document.querySelectorAll(".site-nav a[data-nav]").forEach((link) => {
    if (link.dataset.nav === page) {
      link.setAttribute("aria-current", "page");
    }
  });

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Close" : "Menu";
    });
  }

  const clock = document.querySelector("[data-clock]");
  if (clock) {
    const tick = () => {
      const now = new Date();
      clock.textContent = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    };
    tick();
    window.setInterval(tick, 1000);
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scopes = document.querySelectorAll("[data-scope]");
  scopes.forEach((canvas) => {
    if (!canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const scale = Number(canvas.dataset.scopeScale) || 1;
    const fade = Number(canvas.dataset.scopeFade);
    const trail = Number.isFinite(fade) ? fade : 0.22;
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    window.addEventListener("resize", fit);

    let t = 0;
    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.fillStyle = `rgba(26, 26, 26, ${trail})`;
      ctx.fillRect(0, 0, width, height);
      ctx.beginPath();
      ctx.strokeStyle = "#e1e1e1";
      ctx.lineWidth = Math.max(1, 1.2 * Math.min(1, scale + 0.4));
      for (let x = 0; x < width; x += 1) {
        const n = x / width;
        const y =
          height * 0.52 +
          (Math.sin(n * 18 + t) * 22 +
            Math.sin(n * 47 + t * 1.6) * 11 +
            Math.sin(n * 90 + t * 0.45) * 4 +
            Math.sin(n * 7.5 - t * 0.8) * 8) *
            scale;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      if (!reduce) {
        t += 0.045;
        requestAnimationFrame(draw);
      }
    };
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    draw();
  });

  const form = document.querySelector("[data-join-form]");
  const success = document.querySelector("[data-join-success]");
  const nameOut = document.querySelector("[data-join-name]");
  const errorOut = document.querySelector("[data-join-error]");
  const submitBtn = document.querySelector("[data-join-submit]");
  if (form && success) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const endpoint = form.getAttribute("action");
      if (!endpoint) return;

      if (errorOut) {
        errorOut.hidden = true;
        errorOut.textContent = "";
      }
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Signing…";
      }
      form.setAttribute("aria-busy", "true");

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          let message = "Couldn’t send that. Try again in a moment.";
          try {
            const payload = await response.json();
            if (payload && payload.errors && payload.errors[0] && payload.errors[0].message) {
              message = payload.errors[0].message;
            }
          } catch (_) {
            /* keep default */
          }
          throw new Error(message);
        }

        const name = (form.elements.namedItem("name") || {}).value || "friend";
        if (nameOut) nameOut.textContent = name.trim().split(/\s+/)[0];
        form.classList.add("is-off");
        success.classList.add("is-on");
        success.focus();
      } catch (err) {
        if (errorOut) {
          errorOut.textContent =
            (err && err.message) || "Couldn’t send that. Try again in a moment.";
          errorOut.hidden = false;
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Sign";
        }
      } finally {
        form.removeAttribute("aria-busy");
      }
    });
  }
})();
