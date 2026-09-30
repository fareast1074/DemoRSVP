/*
  SYAZA & KHALIS DIGITAL RSVP
  Google Form edition

  IMPORTANT:
  Update WEDDING_CONFIG.googleFormAction and every entry ID.
  Entry IDs come from the Google Form's pre-filled link.
*/

const WEDDING_CONFIG = {
  coupleShortName: "Syaza & Khalis",
  weddingDateISO: "2026-11-14T12:00:00+08:00",
  weddingDateLabel: "Sabtu · 14 November 2026",

  venue: "Dewan XXX",
  address: "Alamat penuh venue, Perak, Malaysia",

  googleMapsUrl: "https://maps.google.com/?q=Dewan+XXX+Perak+Malaysia",
  wazeUrl: "https://www.waze.com/ul?q=Dewan%20XXX%20Perak%20Malaysia",

  whatsappNumber: "60123456789",

  // Google Calendar URL can be generated automatically by the script below.
  calendarTitle: "Walimatulurus Syaza & Khalis",

  // Main RSVP Google Form endpoint.
  // Replace the placeholder with:
  // https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse
  googleFormAction: "https://docs.google.com/forms/d/e/GOOGLE_FORM_ID/formResponse",

  // Match these to your Google Form fields.
  googleFormEntries: {
    name: "entry.000000001",
    phone: "entry.000000002",
    attendance: "entry.000000003",
    guests: "entry.000000004",
    events: "entry.000000005",
    message: "entry.000000006"
  },

  // Optional second Google Form for guestbook.
  guestbookFormUrl: "https://docs.google.com/forms/d/e/GUESTBOOK_FORM_ID/viewform",

  // Add your audio file at assets/music/wedding.mp3
  musicEnabled: true
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

document.addEventListener("DOMContentLoaded", () => {
  const loader = $("#loader");
  const cover = $("#cover");
  const main = $("#mainContent");
  const openBtn = $("#openInvitation");
  const form = $("#rsvpForm");
  const music = $("#bgMusic");
  const musicToggle = $("#musicToggle");

  const setConfigLinks = () => {
    $("#mapsBtn").href = WEDDING_CONFIG.googleMapsUrl;
    $("#wazeBtn").href = WEDDING_CONFIG.wazeUrl;
    $("#guestbookBtn").href = WEDDING_CONFIG.guestbookFormUrl;

    const waText = encodeURIComponent(
      `Assalamualaikum, saya ingin bertanya berkaitan majlis Syaza & Khalis.`
    );
    $("#whatsappBtn").href = `https://wa.me/${WEDDING_CONFIG.whatsappNumber}?text=${waText}`;
  };

  const buildGoogleCalendarUrl = () => {
    // 20261114T040000Z = 12:00 MYT. End = 16:00 MYT.
    // Change the times below if your event starts/ends differently.
    const start = "20261114T040000Z";
    const end = "20261114T080000Z";
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: WEDDING_CONFIG.calendarTitle,
      dates: `${start}/${end}`,
      details: "Walimatulurus Syaza & Khalis",
      location: WEDDING_CONFIG.address
    });
    $("#calendarBtn").href = `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  setConfigLinks();
  buildGoogleCalendarUrl();

  setTimeout(() => loader?.classList.add("hide"), 650);

  openBtn?.addEventListener("click", () => {
    cover.classList.add("open");
    main.setAttribute("aria-hidden", "false");
    document.body.classList.add("invitation-open");
    window.scrollTo({ top: 0, behavior: "instant" });

    if (WEDDING_CONFIG.musicEnabled && music?.src) {
      // Autoplay is attempted only after the user has interacted by pressing the button.
      music.play().then(() => {
        musicToggle.classList.add("playing");
        musicToggle.textContent = "❚❚";
        localStorage.setItem("sk_music", "on");
      }).catch(() => {});
    }
  });

  // Countdown
  const target = new Date(WEDDING_CONFIG.weddingDateISO).getTime();
  const tick = () => {
    const diff = target - Date.now();
    if (diff <= 0) {
      ["days","hours","minutes","seconds"].forEach(id => $(`#${id}`).textContent = "00");
      $("#countdownDone").hidden = false;
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    $("#days").textContent = String(d).padStart(2,"0");
    $("#hours").textContent = String(h).padStart(2,"0");
    $("#minutes").textContent = String(m).padStart(2,"0");
    $("#seconds").textContent = String(s).padStart(2,"0");
  };
  tick();
  setInterval(tick, 1000);

  // Reveal on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});
  $$(".reveal").forEach(el => observer.observe(el));

  // Google Form RSVP
  if (form) {
    form.action = WEDDING_CONFIG.googleFormAction;

    // Make guest count more intuitive.
    $("#attendance")?.addEventListener("change", (e) => {
      const guestField = $("#guests");
      if (e.target.value === "Tidak Hadir") {
        guestField.value = "0";
        guestField.min = "0";
      } else if (!guestField.value || guestField.value === "0") {
        guestField.value = "1";
        guestField.min = "1";
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const selectedEvents = $$('input[name="entry.000000005"]:checked', form);
      if ($("#attendance").value === "Hadir" && selectedEvents.length === 0) {
        alert("Sila pilih sekurang-kurangnya satu acara.");
        return;
      }

      // Re-assign field names from the config so users only need to edit one place.
      $("#name").name = WEDDING_CONFIG.googleFormEntries.name;
      $("#phone").name = WEDDING_CONFIG.googleFormEntries.phone;
      $("#attendance").name = WEDDING_CONFIG.googleFormEntries.attendance;
      $("#guests").name = WEDDING_CONFIG.googleFormEntries.guests;
      $("#message").name = WEDDING_CONFIG.googleFormEntries.message;
      selectedEvents.forEach(cb => cb.name = WEDDING_CONFIG.googleFormEntries.events);

      const submitBtn = $('button[type="submit"]', form);
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Menghantar...";

      // Targeting a hidden iframe avoids the browser CORS restriction of Google Forms.
      form.submit();

      setTimeout(() => {
        $("#successModal").hidden = false;
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 1100);
    });
  }

  // Share invitation
  $("#shareBtn")?.addEventListener("click", async () => {
    const shareData = {
      title: "Syaza & Khalis — Undangan Walimatulurus",
      text: "Assalamualaikum. Jom bersama meraikan hari bahagia Syaza & Khalis 🤍",
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        const wa = `https://wa.me/?text=${encodeURIComponent(`${shareData.text}\n${shareData.url}`)}`;
        window.open(wa, "_blank", "noopener");
      }
    } catch (_) {}
  });

  // Music
  musicToggle?.addEventListener("click", () => {
    if (!music || !music.src) {
      alert("Letakkan fail muzik anda di assets/music/wedding.mp3");
      return;
    }
    if (music.paused) {
      music.play().then(() => {
        musicToggle.classList.add("playing");
        musicToggle.textContent = "❚❚";
        localStorage.setItem("sk_music", "on");
      }).catch(() => {});
    } else {
      music.pause();
      musicToggle.classList.remove("playing");
      musicToggle.textContent = "♫";
      localStorage.setItem("sk_music", "off");
    }
  });

  // Back to top
  $("#topBtn")?.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));

  // Lightbox gallery
  const items = $$(".gallery-item");
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  let currentIndex = 0;

  const openLightbox = (idx) => {
    currentIndex = idx;
    lightboxImage.src = items[currentIndex].dataset.src;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  };

  items.forEach((item, idx) => item.addEventListener("click", () => openLightbox(idx)));
  $("#lightboxClose")?.addEventListener("click", closeLightbox);
  $("#lightboxPrev")?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    lightboxImage.src = items[currentIndex].dataset.src;
  });
  $("#lightboxNext")?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % items.length;
    lightboxImage.src = items[currentIndex].dataset.src;
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.hidden) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") $("#lightboxPrev").click();
      if (e.key === "ArrowRight") $("#lightboxNext").click();
    }
  });

  // Modal
  $("#modalClose")?.addEventListener("click", () => {
    $("#successModal").hidden = true;
  });
  $("#successModal")?.addEventListener("click", (e) => {
    if (e.target.id === "successModal") $("#successModal").hidden = true;
  });

  // Smooth anchors on mobile
  $$(".nav-links a").forEach(a => {
    a.addEventListener("click", (e) => {
      const target = $(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:"smooth", block:"start"});
      }
    });
  });
});
