 /* ========== NAVBAR: beddel page-yada ========== */
(function () {
  const buttons = document.querySelectorAll(".nav button");
  const pages = document.querySelectorAll(".page");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.toggle("active", b === btn));
      pages.forEach(p => p.classList.toggle("active", p.id === btn.dataset.page));
    });
  });
})();

/* ========== EVC-PLUS ========== */
(function () {
  const CORRECT_PIN = "1234"; // PIN tijaabo ah (demo)
  const STORAGE_KEY = "evc-data-v2";

  const balanceEl = document.getElementById("balance");
  const phoneEl = document.getElementById("phone");
  const amountEl = document.getElementById("amount");
  const pinEl = document.getElementById("pin");
  const messageEl = document.getElementById("message");

  let balance = 2000;

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved.balance === "number") balance = saved.balance;
  } catch (e) {}

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ balance })); } catch (e) {}
  }

  function money(n) {
    return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function showMessage(text, ok = false) {
    messageEl.textContent = text;
    messageEl.className = "msg " + (ok ? "success" : "error");
  }

  function validPhone(value) {
    const digits = value.replace(/[\s+\-]/g, "");
    return /^(252)?[67]\d{7,8}$/.test(digits);
  }

  function sendMoney() {
    const phone = phoneEl.value.trim();
    const amount = parseFloat(amountEl.value);
    const pin = pinEl.value;

    if (!validPhone(phone)) return showMessage("Lambarka taleefanka waa khalad.");
    if (isNaN(amount) || amount <= 0) return showMessage("Geli lacag sax ah.");
    if (amount > balance) return showMessage("Haraagaagu kuma filna.");
    if (!/^\d{4}$/.test(pin)) return showMessage("PIN-ku waa inuu ahaadaa 4 tiro.");
    if (pin !== CORRECT_PIN) return showMessage("PIN-ka waa khalad.");

    balance -= amount;
    save();
    balanceEl.textContent = money(balance);
    showMessage(`Waxaad u dirtay ${money(amount)} ${phone}`, true);
    phoneEl.value = amountEl.value = pinEl.value = "";
  }

  document.getElementById("sendBtn").addEventListener("click", sendMoney);
  balanceEl.textContent = money(balance);
})();

/* ========== AGE CALCULATOR ========== */
(function () {
  const birthEl = document.getElementById("birthDate");
  const resultEl = document.getElementById("ageResult");

  document.getElementById("ageBtn").addEventListener("click", () => {
    if (!birthEl.value) {
      resultEl.className = "msg error";
      return (resultEl.textContent = "Dooro taariikh.");
    }
    const birth = new Date(birthEl.value);
    const today = new Date();

    if (birth > today) {
      resultEl.className = "msg error";
      return (resultEl.textContent = "Taariikhdu waa mustaqbal.");
    }

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    resultEl.className = "msg success";
    resultEl.textContent = `Da'daadu waa ${years} sano, ${months} bilood, ${days} maalmood.`;
  });
})();

/* ========== STOPWATCH ========== */
(function () {
  const timeEl = document.getElementById("swTime");
  let startTime = 0;
  let elapsed = 0;
  let timer = null;

  function format(ms) {
    const tenths = Math.floor(ms / 100) % 10;
    const s = Math.floor(ms / 1000) % 60;
    const m = Math.floor(ms / 60000) % 60;
    const h = Math.floor(ms / 3600000);
    const p = n => String(n).padStart(2, "0");
    return `${p(h)}:${p(m)}:${p(s)}.${tenths}`;
  }

  function update() {
    timeEl.textContent = format(elapsed + (Date.now() - startTime));
  }

  document.getElementById("swStart").addEventListener("click", () => {
    if (timer) return;
    startTime = Date.now();
    timer = setInterval(update, 100);
  });

  document.getElementById("swStop").addEventListener("click", () => {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
    elapsed += Date.now() - startTime;
  });

  document.getElementById("swReset").addEventListener("click", () => {
    clearInterval(timer);
    timer = null;
    elapsed = 0;
    timeEl.textContent = format(0);
  });
});

/* ========== TESTIMONIAL SLIDER ========== */
(function () {
  const track = document.getElementById("track");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const dotsEl = document.getElementById("dots");
  const total = track.children.length;
  let index = 0;

  for (let i = 0; i < total; i++) {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", "Slide " + (i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsEl.appendChild(dot);
  }

  function goTo(i) {
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    Array.from(dotsEl.children).forEach((d, n) =>
      d.classList.toggle("active", n === index)
    );
  }

  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));

  goTo(0);
})();