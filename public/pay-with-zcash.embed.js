/**
 * Pay with Zcash Widget - Premium Design
 * Lean, framework-free, beautiful
 */
(function () {
  const script = document.currentScript;
  const addr = script?.dataset.address;
  const amount = script?.dataset.amount;
  const label = script?.dataset.label || "Pay with Zcash";
  const theme = script?.dataset.theme || "light";
  const memo = script?.dataset.memo || "";
  const customCSS = script?.dataset.css || null;

  if (!addr || !amount) {
    console.error("[Pay-with-Zcash] Missing address or amount.");
    return;
  }

  if (customCSS) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = customCSS;
    document.head.appendChild(link);
  }

  // Inject minimal CSS
  const style = document.createElement("style");
  style.textContent = `
    .zwg-btn{position:relative;display:inline-flex;align-items:center;gap:10px;padding:14px 28px;background:linear-gradient(135deg,#F4B728 0%,#E5A420 100%);color:#1a1a1a;font:600 15px/1 system-ui,-apple-system,sans-serif;border:0;border-radius:14px;cursor:pointer;box-shadow:0 4px 24px -4px rgba(244,183,40,0.5),inset 0 1px 0 rgba(255,255,255,0.3);transition:all .2s ease;overflow:hidden}
    .zwg-btn:hover{transform:translateY(-2px);box-shadow:0 8px 32px -4px rgba(244,183,40,0.6),inset 0 1px 0 rgba(255,255,255,0.3)}
    .zwg-btn:active{transform:translateY(0) scale(.98)}
    .zwg-btn::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);transform:translateX(-100%);transition:transform .6s}
    .zwg-btn:hover::after{transform:translateX(100%)}
    .zwg-btn svg{width:18px;height:18px}
    .zwg-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:99999;padding:20px;animation:zwg-fade .25s ease}
    @keyframes zwg-fade{from{opacity:0}to{opacity:1}}
    .zwg-modal{width:100%;max-width:400px;background:var(--zwg-bg);color:var(--zwg-text);border-radius:28px;padding:28px;font-family:system-ui,-apple-system,sans-serif;box-shadow:0 32px 64px -16px rgba(0,0,0,.4),0 0 0 1px var(--zwg-border);animation:zwg-pop .35s cubic-bezier(.16,1,.3,1)}
    @keyframes zwg-pop{from{opacity:0;transform:scale(.92) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
    .zwg-light{--zwg-bg:#fff;--zwg-text:#111;--zwg-muted:#6b7280;--zwg-surface:#f3f4f6;--zwg-border:rgba(0,0,0,.08)}
    .zwg-dark{--zwg-bg:#18181b;--zwg-text:#fafafa;--zwg-muted:#a1a1aa;--zwg-surface:#27272a;--zwg-border:rgba(255,255,255,.1)}
    .zwg-head{text-align:center;margin-bottom:24px}
    .zwg-icon{width:56px;height:56px;margin:0 auto 14px;background:linear-gradient(145deg,#F4B728,#D4940F);border-radius:16px;display:flex;align-items:center;justify-content:center;font:700 24px/1 system-ui;color:#1a1a1a;box-shadow:0 8px 20px -6px rgba(244,183,40,.5)}
    .zwg-title{margin:0 0 4px;font:700 22px/1.2 system-ui}
    .zwg-label{margin:0;font-size:13px;color:var(--zwg-muted)}
    .zwg-qr{background:#fff;border-radius:20px;padding:20px;margin-bottom:20px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.05)}
    .zwg-qr img{display:block;width:180px;height:180px;margin:0 auto;border-radius:12px}
    .zwg-amt{background:var(--zwg-surface);border-radius:16px;padding:16px;text-align:center;margin-bottom:16px}
    .zwg-amt-lbl{margin:0 0 2px;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--zwg-muted)}
    .zwg-amt-val{margin:0;font:700 32px/1.2 system-ui}
    .zwg-amt-val b{color:#F4B728}
    .zwg-amt-val small{font-size:16px;color:var(--zwg-muted);margin-left:6px;font-weight:500}
    .zwg-fld{margin-bottom:14px}
    .zwg-fld-lbl{display:block;margin-bottom:6px;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--zwg-muted)}
    .zwg-fld-row{display:flex;align-items:center;gap:8px;background:var(--zwg-surface);border-radius:12px;padding:10px 12px}
    .zwg-fld-txt{flex:1;margin:0;font:500 12px/1.4 ui-monospace,SFMono-Regular,monospace;word-break:break-all;color:var(--zwg-text)}
    .zwg-fld-inp{flex:1;background:0;border:0;outline:0;font:500 12px/1.4 ui-monospace,SFMono-Regular,monospace;color:var(--zwg-text);width:100%}
    .zwg-memo{background:var(--zwg-surface);border-radius:12px;padding:12px 14px;font-size:13px;line-height:1.5;color:var(--zwg-text)}
    .zwg-copy{flex-shrink:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:0;border:0;border-radius:8px;cursor:pointer;color:var(--zwg-muted);transition:all .15s}
    .zwg-copy:hover{background:var(--zwg-bg);color:var(--zwg-text)}
    .zwg-copy.ok{background:rgba(34,197,94,.15);color:#22c55e}
    .zwg-copy svg{width:14px;height:14px}
    .zwg-acts{display:flex;gap:10px;margin-top:20px}
    .zwg-btn2{flex:1;padding:14px;font:600 13px/1 system-ui;border:0;border-radius:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .15s}
    .zwg-btn2 svg{width:14px;height:14px}
    .zwg-sec{background:var(--zwg-surface);color:var(--zwg-text)}
    .zwg-sec:hover{filter:brightness(1.05)}
    .zwg-pri{background:linear-gradient(135deg,#F4B728,#E5A420);color:#1a1a1a}
    .zwg-pri:hover{box-shadow:0 6px 20px -4px rgba(244,183,40,.5);transform:translateY(-1px)}
    .zwg-pri:disabled{opacity:.5;cursor:not-allowed;transform:none}
    .zwg-spin{width:14px;height:14px;border:2px solid rgba(26,26,26,.2);border-top-color:#1a1a1a;border-radius:50%;animation:zwg-sp .7s linear infinite}
    @keyframes zwg-sp{to{transform:rotate(360deg)}}
    .zwg-link{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:14px;font-size:13px;color:var(--zwg-muted);text-decoration:none;transition:color .15s}
    .zwg-link:hover{color:var(--zwg-text)}
    .zwg-link svg{width:14px;height:14px}
    .zwg-x{position:absolute;top:14px;right:14px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:0;border:0;border-radius:50%;cursor:pointer;color:var(--zwg-muted);transition:all .15s}
    .zwg-x:hover{background:var(--zwg-surface);color:var(--zwg-text)}
    .zwg-x svg{width:16px;height:16px}
    @media(max-width:480px){.zwg-modal{padding:22px;border-radius:24px}.zwg-acts{flex-direction:column}}
  `;
  document.head.appendChild(style);

  // Minimal SVGs
  const ic = {
    z: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M8 9h8M8 15h8M15 9l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
    cp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`,
    ok: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>`,
    lnk: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>`,
    ext: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>`
  };

  // Create trigger button
  const btn = document.createElement("button");
  btn.className = "zwg-btn";
  btn.innerHTML = `${ic.z}<span>${label}</span>`;
  btn.onclick = openModal;
  script.parentNode?.insertBefore(btn, script.nextSibling);

  function openModal() {
    const uri = `zcash:${addr}?amount=${amount}${memo ? `&memo=${encodeURIComponent(memo)}` : ""}`;
    const cls = theme === "dark" ? "zwg-dark" : "zwg-light";

    const ov = document.createElement("div");
    ov.className = "zwg-overlay";
    ov.onclick = e => e.target === ov && ov.remove();

    ov.innerHTML = `
      <div class="zwg-modal ${cls}" style="position:relative">
        <button class="zwg-x" aria-label="Close">${ic.x}</button>
        <div class="zwg-head">
          <div class="zwg-icon">Z</div>
          <h2 class="zwg-title">Pay with Zcash</h2>
          ${label ? `<p class="zwg-label">${label}</p>` : ""}
        </div>
        <div class="zwg-qr">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(uri)}&bgcolor=ffffff&color=1a1a1a&margin=0" alt="QR">
        </div>
        <div class="zwg-amt">
          <p class="zwg-amt-lbl">Amount Due</p>
          <p class="zwg-amt-val"><b>${amount}</b><small>ZEC</small></p>
        </div>
        <div class="zwg-fld">
          <span class="zwg-fld-lbl">Address</span>
          <div class="zwg-fld-row">
            <p class="zwg-fld-txt">${addr}</p>
            <button class="zwg-copy" data-c="${addr}">${ic.cp}</button>
          </div>
        </div>
        ${memo ? `<div class="zwg-fld"><span class="zwg-fld-lbl">Memo</span><div class="zwg-memo">${memo}</div></div>` : ""}
        <div class="zwg-fld">
          <span class="zwg-fld-lbl">Payment URI</span>
          <div class="zwg-fld-row">
            <input class="zwg-fld-inp" value="${uri}" readonly>
            <button class="zwg-copy" data-c="${uri}">${ic.cp}</button>
          </div>
        </div>
        <div class="zwg-acts">
          <button class="zwg-btn2 zwg-sec zwg-close">Close</button>
          <button class="zwg-btn2 zwg-pri zwg-short">${ic.lnk} Short URL</button>
        </div>
        <a href="${uri}" class="zwg-link">${ic.ext} Open in Wallet</a>
      </div>
    `;

    document.body.appendChild(ov);

    // Event handlers
    ov.querySelector(".zwg-x").onclick = () => ov.remove();
    ov.querySelector(".zwg-close").onclick = () => ov.remove();

    ov.querySelectorAll(".zwg-copy").forEach(b => {
      b.onclick = async () => {
        try {
          await navigator.clipboard.writeText(b.dataset.c);
          b.classList.add("ok");
          b.innerHTML = ic.ok;
          setTimeout(() => { b.classList.remove("ok"); b.innerHTML = ic.cp; }, 1500);
        } catch (e) { console.error(e); }
      };
    });

    const shortBtn = ov.querySelector(".zwg-short");
    shortBtn.onclick = async () => {
      shortBtn.disabled = true;
      shortBtn.innerHTML = `<span class="zwg-spin"></span>`;
      try {
        const res = await fetch("http://localhost:4000/api/shorten", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uri })
        });
        const { shortUrl } = await res.json();
        shortBtn.innerHTML = `${ic.ok} Done`;

        const fld = document.createElement("div");
        fld.className = "zwg-fld";
        fld.innerHTML = `
          <span class="zwg-fld-lbl">Short URL</span>
          <div class="zwg-fld-row">
            <input class="zwg-fld-inp" value="${shortUrl}" readonly>
            <button class="zwg-copy" data-c="${shortUrl}">${ic.cp}</button>
          </div>
        `;
        ov.querySelector(".zwg-acts").before(fld);
        fld.querySelector(".zwg-copy").onclick = async function() {
          try {
            await navigator.clipboard.writeText(shortUrl);
            this.classList.add("ok");
            this.innerHTML = ic.ok;
            setTimeout(() => { this.classList.remove("ok"); this.innerHTML = ic.cp; }, 1500);
          } catch (e) { console.error(e); }
        };
      } catch (e) {
        console.error(e);
        shortBtn.innerHTML = `${ic.lnk} Retry`;
        shortBtn.disabled = false;
      }
    };
  }
})();
