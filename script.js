/* =========================================================
 * script.js — 화면 전환 / 앱 실행 / 카톡 시나리오
 * 새 앱 추가: ICONS 에 아이콘, APPS 에 { name, bg, render } 추가
 * ========================================================= */
(function () {
  const D = window.PHONE_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- 오리지널 SVG 아이콘 ---------- */
  const ICONS = {
    kakao: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3C6.5 3 2 6.5 2 10.8c0 2.8 1.9 5.2 4.7 6.6L5.8 21l4.1-2.7c.7.1 1.4.2 2.1.2 5.5 0 10-3.5 10-7.8S17.5 3 12 3z"/></svg>',
    insta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    gallery: '<svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" fill="#ffb347"/><circle cx="7" cy="14" r="4" fill="#ff6b8b" opacity=".85"/><circle cx="17" cy="14" r="4" fill="#5ab0f0" opacity=".85"/><circle cx="12" cy="17" r="4" fill="#7ed37a" opacity=".8"/></svg>',
    memo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 12h12M6 16h8"/></svg>',
    cal: '<svg viewBox="0 0 24 24"><text x="12" y="8" text-anchor="middle" font-size="5" fill="#e2583e" font-weight="700">수</text><text x="12" y="20" text-anchor="middle" font-size="12" fill="#222" font-weight="300">28</text></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></svg>',
    dday: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 21s-7.5-4.6-9.5-9.3C1 8.3 3.2 4.5 6.8 4.5c2.1 0 3.5 1.2 5.2 3 1.7-1.8 3.1-3 5.2-3 3.6 0 5.8 3.8 4.3 7.2C19.5 16.4 12 21 12 21z"/></svg>',
    yt: '<svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor"/><path d="M10 9l5 3-5 3z" fill="#fff"/></svg>',
  };
  const BG = { kakao: "bg-kakao", insta: "bg-insta", gallery: "bg-gallery", memo: "bg-memo", cal: "bg-cal", settings: "bg-settings", dday: "bg-dday", yt: "bg-yt" };
  document.querySelectorAll("[data-icon]").forEach((el) => { el.classList.add(BG[el.dataset.icon]); el.innerHTML = ICONS[el.dataset.icon]; });

  /* ---------- 공통 요소 ---------- */
  const statusbar = $("#statusbar"), homebar = $("#homebar"), appWin = $("#app"), viewer = $("#viewer");
  $(".sb-time").textContent = D.clock;
  function setChrome(show, dark) {
    statusbar.classList.toggle("show", show);
    statusbar.classList.toggle("dark", !!dark);
    homebar.classList.toggle("dark", !!dark);
  }
  function openViewer(src) { $("img", viewer).src = src; viewer.classList.add("show"); }
  viewer.addEventListener("click", () => viewer.classList.remove("show"));

  /* ---------- 1. 잠금화면 ---------- */
  const lock = $("#lock"), pass = $("#passcode"), home = $("#home");
  $(".lock-clock").textContent = D.clock;
  $(".lock-date").textContent = D.dateText;
  $(".noti-app", lock).textContent = D.lockNotification.app;
  $(".noti-text", lock).textContent = D.lockNotification.text;
  $(".noti-time", lock).textContent = D.lockNotification.time;

  let state = "lock";
  function showPass() {
    if (state !== "lock") return;
    state = "pass";
    lock.classList.add("out"); lock.classList.remove("active");
    pass.classList.add("active");
  }
  let startY = null;
  lock.addEventListener("pointerdown", (e) => (startY = e.clientY));
  lock.addEventListener("pointerup", () => { startY = null; showPass(); }); // 탭 또는 스와이프 모두 해제
  lock.addEventListener("pointermove", (e) => { if (startY !== null && startY - e.clientY > 40) showPass(); });

  /* ---------- 비밀번호 ---------- */
  const dots = [...pass.querySelectorAll(".pc-dots i")], dotsWrap = $(".pc-dots");
  const pad = $(".pc-pad");
  ["1","2","3","4","5","6","7","8","9","","0","⌫"].forEach((k) => {
    const b = document.createElement("button");
    b.textContent = k; if (!k) b.className = "blank";
    b.addEventListener("click", () => press(k));
    pad.appendChild(b);
  });
  let code = "";
  function paint() { dots.forEach((d, i) => d.classList.toggle("on", i < code.length)); }
  function press(k) {
    if (k === "⌫") { code = code.slice(0, -1); return paint(); }
    if (!k || code.length >= 4) return;
    code += k; paint();
    if (code.length === 4) setTimeout(() => {
      if (code === D.password) unlock();
      else { dotsWrap.classList.add("shake"); setTimeout(() => { dotsWrap.classList.remove("shake"); code = ""; paint(); }, 450); }
    }, 120);
  }
  $(".pc-cancel").addEventListener("click", () => {
    code = ""; paint(); state = "lock";
    pass.classList.remove("active"); lock.classList.remove("out"); lock.classList.add("active");
  });

  /* ---------- 2. 홈 ---------- */
  const c = D.calendarWidget, w = D.weather;
  $(".w-cal").innerHTML = `<div class="m">${c.month}</div><div class="d"><span>${c.day}</span></div><div class="wd">${c.weekday}</div>`;
  $(".w-weather").innerHTML = `<div class="loc">${esc(w.location)} ➤</div><div class="t">${esc(w.temp)}</div><div class="sun"></div><div class="ds">${esc(w.desc)}</div>`;

  let homeStarted = false;
  function unlock() {
    state = "home";
    pass.classList.remove("active"); home.classList.add("active");
    setChrome(true, false);
    if (!homeStarted) { homeStarted = true; setTimeout(kakaoNotify, D.kakaoNotifyDelay); } // 최초 1회만
  }

  /* ---------- 앱 레지스트리 ---------- */
  const APPS = {
    kakao: { name: "카카오톡", dark: true, render: renderKakaoList },
    insta: { name: "인스타그램", dark: true, render: () =>
      `<div class="app-pad"><div class="app-title">Instagram</div>${D.instagram.map((p) =>
        `<div class="feed"><div class="h"><i></i>${esc(p.user)}</div><div class="p" style="background:${p.color}">📷</div><div class="c"><b>${esc(p.user)}</b> ${esc(p.caption)}</div></div>`).join("")}</div>` },
    gallery: { name: "갤러리", dark: true, render: (el) => {
      setTimeout(() => el.querySelectorAll(".gal img").forEach((img) => img.addEventListener("click", () => openViewer(img.src))));
      return `<div class="app-pad"><div class="app-title">갤러리</div><div class="gal">${D.gallery.map((s) => `<img src="${s}" alt="">`).join("")}</div></div>`; } },
    memo: { name: "메모", dark: true, render: () =>
      `<div class="app-pad"><div class="app-title">메모</div>${D.memos.map((m) => `<div class="memo-item"><b>${esc(m.title)}</b><span>${esc(m.body)}</span></div>`).join("")}</div>` },
    cal: { name: "캘린더", dark: true, render: renderCalendar },
    settings: { name: "설정", dark: true, render: () =>
      `<div class="app-pad"><div class="app-title">설정</div><div class="set-list">${D.settings.map((s) => `<div>${esc(s)}</div>`).join("")}</div></div>` },
    dday: { name: "디데이", dark: false, render: () => `<img class="dday-img" src="images/dday.jpg" alt="">` },
    yt: { name: "유튜브", dark: true, render: () =>
      `<div class="app-pad"><div class="app-title" style="color:#ff2d2d">▶ YouTube</div>${D.youtube.map((v) =>
        `<div class="yt-item"><div class="th" style="background:${v.color}">▶</div><b>${esc(v.title)}</b><span>${esc(v.channel)}</span></div>`).join("")}</div>` },
  };

  const grid = $(".app-grid");
  let kakaoBadge;
  Object.entries(APPS).forEach(([id, app]) => {
    const b = document.createElement("button");
    b.className = "app-icon";
    b.innerHTML = `<div class="ic ${BG[id]}">${ICONS[id]}</div><span>${app.name}</span>${id === "kakao" ? '<span class="badge">1</span>' : ""}`;
    b.addEventListener("click", () => openApp(id, b));
    grid.appendChild(b);
    if (id === "kakao") kakaoBadge = b.querySelector(".badge");
  });

  let currentApp = null;
  function openApp(id, fromEl, opts = {}) {
    const app = APPS[id];
    if (fromEl) { // 아이콘 위치에서 확대
      const r = fromEl.getBoundingClientRect(), p = $("#phone").getBoundingClientRect();
      appWin.style.transformOrigin = `${r.left - p.left + r.width / 2}px ${r.top - p.top + r.height / 2}px`;
    } else appWin.style.transformOrigin = "50% 0%";
    appWin.className = "app-window" + (id === "kakao" ? " kk" : "");
    appWin.innerHTML = app.render(appWin) || "";
    if (id === "kakao") { kakaoBadge.classList.remove("show"); if (opts.room) openRoom(); else bindKakaoList(); }
    requestAnimationFrame(() => appWin.classList.add("open"));
    home.classList.add("behind");
    setChrome(true, app.dark);
    currentApp = id;
  }
  function closeApp() {
    if (!currentApp) return;
    appWin.classList.remove("open"); home.classList.remove("behind");
    setChrome(true, false); currentApp = null;
    viewer.classList.remove("show");
  }
  homebar.addEventListener("click", () => { if (state === "home") closeApp(); });

  /* ---------- 캘린더 앱 ---------- */
  function renderCalendar() {
    const first = new Date(2026, 9, 1).getDay(); // 2026년 10월
    let cells = "일월화수목금토".split("").map((d) => `<div class="wd">${d}</div>`).join("");
    for (let i = 0; i < first; i++) cells += "<div></div>";
    for (let d = 1; d <= 31; d++) {
      const ev = D.calendarEvents[d];
      cells += `<div class="day ${d === D.calendarWidget.day ? "today" : ""}"><b>${d}</b>${ev ? `<div class="ev">${esc(ev)}</div>` : ""}</div>`;
    }
    return `<div class="app-pad"><div class="app-title">2026년 10월</div><div class="cal-grid">${cells}</div></div>`;
  }

  /* ---------- 카카오톡 ---------- */
  const K = D.kakao;
  let sent = false;
  const log = []; // 전송 후 추가된 메시지 기억 (앱 재진입 시 유지)

  function renderKakaoList() {
    const last = log.length ? log[log.length - 1].text : K.messages[K.messages.length - 1].text;
    return `<div class="kk-top"><span class="name" style="font-size:22px;font-weight:800">채팅</span><button>🔍</button></div>
      <div class="kk-list app-pad" style="padding-top:0">
        <div class="row" data-room="1"><div class="avatar">☀️</div><div class="t"><b>${esc(K.partnerName)}</b><span>${esc(last)}</span></div><small>오전 9:41${sent ? "" : '<br><span class="unread">1</span>'}</small></div>
        ${K.otherChats.map((c) => `<div class="row"><div class="avatar" style="background:#d8e2ea">👤</div><div class="t"><b>${esc(c.name)}</b><span>${esc(c.text)}</span></div><small>${esc(c.time)}</small></div>`).join("")}
      </div>`;
  }
  function bindKakaoList() { $("[data-room]", appWin).addEventListener("click", openRoom); }

  function openRoom() {
    appWin.innerHTML = `<div class="kk-top"><button class="back">‹</button><span class="name">${esc(K.partnerName)}</span><button>☰</button></div>
      <div class="chat"></div>
      <div class="kk-input"><input readonly /><button class="send">전송</button></div>`;
    const chat = $(".chat", appWin), input = $("input", appWin), send = $(".send", appWin);
    let prevFrom = null;
    [...K.messages, ...log].forEach((m) => { addMsg(chat, m, prevFrom); prevFrom = m.type ? null : m.from; });
    if (sent) { input.placeholder = "메시지 입력"; send.disabled = true; } else input.value = K.draft;
    chat.style.scrollBehavior = "auto"; chat.scrollTop = chat.scrollHeight; chat.style.scrollBehavior = "";
    $(".back", appWin).addEventListener("click", () => { appWin.innerHTML = renderKakaoList(); bindKakaoList(); });
    send.addEventListener("click", () => {
      if (sent) return; sent = true;
      const mine = { from: "me", text: K.draft, time: "오전 9:42" };
      log.push(mine); addMsg(chat, mine, "them"); scroll(chat);
      input.value = ""; input.placeholder = "메시지 입력"; send.disabled = true;
      let t = 0;
      K.replies.forEach((r, i) => {
        t += r.delay;
        setTimeout(() => {
          const typing = addTyping(chat); scroll(chat);
          setTimeout(() => {
            typing.remove();
            const m = { from: "them", text: r.text, time: "오전 9:42" };
            log.push(m); addMsg(chat, m, i === 0 ? "me" : "them"); scroll(chat);
          }, 1200);
        }, t);
        t += 1200;
      });
    });
  }
  function scroll(chat) { chat.scrollTop = chat.scrollHeight; }
  function addMsg(chat, m, prevFrom) {
    const el = document.createElement("div");
    if (m.type === "date") { el.className = "date-sep"; el.innerHTML = `<span>${esc(m.text)}</span>`; }
    else {
      el.className = `msg ${m.from}` + (m.from === "them" && prevFrom === "them" ? " cont" : "");
      const body = m.image ? `<img class="photo" src="${m.image}" alt="">` : `<div class="bubble">${esc(m.text)}</div>`;
      el.innerHTML = (m.from === "them" ? `<div class="av">☀️</div>` : "") +
        `<div class="col">${m.from === "them" ? `<span class="who">${esc(K.partnerName)}</span>` : ""}${body}</div><span class="time">${m.time}</span>`;
      const img = el.querySelector(".photo");
      if (img) { img.addEventListener("click", () => openViewer(img.src)); img.addEventListener("load", () => scroll(chat)); }
    }
    chat.appendChild(el);
    return el;
  }
  function addTyping(chat) {
    const el = document.createElement("div");
    el.className = "msg them typing";
    el.innerHTML = `<div class="av">☀️</div><div class="col"><span class="who">${esc(K.partnerName)}</span><div class="bubble"><i></i><i></i><i></i></div></div>`;
    chat.appendChild(el); return el;
  }

  /* ---------- 카톡 푸시 배너 ---------- */
  const banner = $("#banner");
  $("b", banner).textContent = K.partnerName;
  $(".noti-body span", banner).textContent = K.banner;
  function kakaoNotify() {
    if (!sent) kakaoBadge.classList.add("show");
    banner.classList.add("show", "buzz");
    if (navigator.vibrate) navigator.vibrate([120, 80, 120]);
    setTimeout(() => banner.classList.remove("show", "buzz"), D.bannerHideDelay);
  }
  banner.addEventListener("click", () => {
    banner.classList.remove("show");
    if (currentApp) { appWin.classList.remove("open"); }
    setTimeout(() => openApp("kakao", null, { room: true }), currentApp ? 200 : 0);
  });
})();
