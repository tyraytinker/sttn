(function () {
  const page = document.body.dataset.page;
  document.querySelectorAll(".site-nav a[data-nav]").forEach((link) => {
    if (link.dataset.nav === page) {
      link.setAttribute("aria-current", "page");
    }
  });

  const BOX_LABELS = {
    closed: "Box closed",
    transport: "Box in transport",
    open: "Box open",
  };

  const chicagoToday = () =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Chicago",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

  const daysUntil = (night, today) => {
    const toUtc = (ymd) => {
      const [year, month, day] = ymd.split("-").map(Number);
      return Date.UTC(year, month - 1, day);
    };
    return Math.round((toUtc(night) - toUtc(today)) / 86400000);
  };

  const boxState = (nights, today) => {
    let state = "closed";
    for (const night of nights) {
      const delta = daysUntil(night, today);
      if (delta === 0) return "open";
      if (delta >= 1 && delta <= 7) state = "transport";
    }
    return state;
  };

  const nightDatesFrom = (doc) =>
    [...doc.querySelectorAll("[data-night-date]")]
      .map((el) => el.getAttribute("data-night-date"))
      .filter(Boolean);

  const readNightDates = () => {
    const local = nightDatesFrom(document);
    if (local.length) return Promise.resolve(local);
    return fetch("nights.html")
      .then((res) => (res.ok ? res.text() : ""))
      .then((html) => {
        if (!html) return [];
        return nightDatesFrom(new DOMParser().parseFromString(html, "text/html"));
      })
      .catch(() => []);
  };

  const statusRoot = document.querySelector("[data-box-status]");
  if (statusRoot) {
    const label = statusRoot.querySelector("[data-status-label]");
    const setState = (state) => {
      statusRoot.dataset.state = state;
      statusRoot.querySelectorAll("[data-lamp]").forEach((lamp) => {
        lamp.classList.toggle("is-lit", lamp.dataset.lamp === state);
      });
      if (label) label.textContent = BOX_LABELS[state];
      statusRoot.setAttribute("aria-label", BOX_LABELS[state]);
    };
    setState("closed");
    readNightDates().then((dates) => setState(boxState(dates, chicagoToday())));
  }

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
      ctx.fillStyle = "rgba(26, 26, 26, 0.22)";
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
  if (form && success) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const name = (form.elements.namedItem("name") || {}).value || "friend";
      if (nameOut) nameOut.textContent = name.trim().split(/\s+/)[0];
      form.classList.add("is-off");
      success.classList.add("is-on");
      success.focus();
    });
  }
})();
