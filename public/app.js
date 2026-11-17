const APP_VERSION = '1.8.0';
const VERSION_STORAGE_KEY = 'pmr_editor_installed_version';
const STORAGE_PREFIX = 'pmr_editor_draft_v1_';
const UPDATE_HIGHLIGHTS = [
  'Perbaikan mekanisme anti-cache Service Worker dengan fetch no-store untuk update instan di iPhone PWA',
  'Deteksi pembaruan otomatis saat pageshow (bfcache iOS), visibilitychange, dan saat koneksi online kembali',
  'Pil versi interaktif di header lengkap dengan modal cek pembaruan & rincian changelog terbaru'
];

const SVG_ICON_PATHS = {
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  alertTriangle: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  alertOctagon: '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  refresh: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  loader: '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',
  fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
  trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
};

function createSvgIcon(name, size = 16, extraClass = '') {
  const wrap = document.createElement('span');
  wrap.className = extraClass ? `ui-icon ${extraClass}` : 'ui-icon';
  wrap.setAttribute('aria-hidden', 'true');
  const inner = SVG_ICON_PATHS[name] || SVG_ICON_PATHS.info;
  wrap.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  return wrap;
}

let currentParameters = [];
let currentOperatorKey = 'operator1';
let currentValues = {};
let currentViewMode = window.innerWidth < 768 ? 'vertical' : 'horizontal';
let currentBadgeText = '';
let importedTimingProfile = null;
let draftPulseTimer = null;
let draftSaveTimer = null;
let loadRequestId = 0;
let activeModalResolver = null;
let activeModalDismissValue = null;
let modalFocusTimer = null;
let modalCleanupFn = null;
let swRegistration = null;
let swHadControllerOnBoot = Boolean('serviceWorker' in navigator && navigator.serviceWorker.controller);
let manualUpdateState = null;
let updatePromptShown = false;
let bgUpdatePromptShown = false;

const OPERATOR_LABELS = {
  operator1: 'Operator 1 (167 Parameter)',
  operator2: 'Operator 2 (51 Parameter)',
  operator3: 'Operator 3 (45 Parameter)'
};

const OPERATOR_SHORT_NAMES = {
  operator1: 'Operator 1',
  operator2: 'Operator 2',
  operator3: 'Operator 3'
};

document.addEventListener('DOMContentLoaded', () => {
  const defaultOp = document.getElementById('selectOperator').value || 'operator1';
  setupNativeTouchGuards();
  setupModalEvents();
  syncResponsiveBadgePlacement();
  updateOnlineStatusUI();
  updateLayoutContainerVisibility();
  loadParameter(defaultOp);
  initPwaForceUpdate();
});

window.addEventListener('pagehide', flushPendingDraftSave);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    flushPendingDraftSave();
  }
});

function triggerHaptic(duration = 12) {
  try {
    if (navigator && typeof navigator.vibrate === 'function') {
      navigator.vibrate(duration);
    }
  } catch (_) {}
}

function setupNativeTouchGuards() {
  // Block iOS Safari pinch-to-zoom gestures
  ['gesturestart', 'gesturechange', 'gestureend'].forEach((evtName) => {
    document.addEventListener(evtName, (e) => {
      e.preventDefault();
    }, { passive: false });
  });

  // Prevent accidental double-tap zoom on UI buttons/headers while keeping inputs & scrolling smooth
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const tag = e.target && e.target.tagName ? e.target.tagName.toUpperCase() : '';
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
    const now = Date.now();
    if (now - lastTouchEnd <= 280) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });
}

window.addEventListener('online', updateOnlineStatusUI);
window.addEventListener('offline', updateOnlineStatusUI);

function updateOnlineStatusUI() {
  const offlineBadge = document.getElementById('offlineBadge');
  if (!offlineBadge) return;
  offlineBadge.style.display = navigator.onLine ? 'none' : 'inline-block';
}

window.addEventListener('resize', () => {
  syncResponsiveBadgePlacement();
  const preferred = window.innerWidth < 768 ? 'vertical' : 'horizontal';
  if (preferred !== currentViewMode) {
    currentViewMode = preferred;
    updateLayoutContainerVisibility();
    renderActiveTable();
    filterParameters();
  }
});

/* ================= RESPONSIVE BADGE RELOCATION ================= */

function syncResponsiveBadgePlacement() {
  const isMobile = window.innerWidth < 768;
  const filledBadge = document.getElementById('filledCountBadge');
  const draftBadge = document.getElementById('draftSavedBadge');
  const mobileSlot = document.getElementById('mobileToolbarStatusSlot');
  const desktopHeaderSlot = document.getElementById('headerDraftSlot');
  const desktopToolbarSlot = document.getElementById('desktopToolbarRightSlot');

  if (!filledBadge || !draftBadge || !mobileSlot || !desktopHeaderSlot || !desktopToolbarSlot) return;

  if (isMobile) {
    if (filledBadge.parentElement !== mobileSlot) mobileSlot.appendChild(filledBadge);
    if (draftBadge.parentElement !== mobileSlot) mobileSlot.appendChild(draftBadge);
  } else {
    if (draftBadge.parentElement !== desktopHeaderSlot) desktopHeaderSlot.appendChild(draftBadge);
    if (filledBadge.parentElement !== desktopToolbarSlot) desktopToolbarSlot.appendChild(filledBadge);
  }
}

/* ================= PWA FORCE UPDATE, VERSION CHECK & UPDATE CARD ================= */

function initPwaForceUpdate() {
  const prevVersion = localStorage.getItem(VERSION_STORAGE_KEY);
  if (prevVersion && prevVersion !== APP_VERSION) {
    showAppUpdateCard({ oldVer: prevVersion, newVer: APP_VERSION, isBackgroundUpdate: false });
  } else if (!prevVersion) {
    localStorage.setItem(VERSION_STORAGE_KEY, APP_VERSION);
  }

  if (!('serviceWorker' in navigator)) return;
  if (location.protocol !== 'http:' && location.protocol !== 'https:') return;

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' });
      swRegistration = reg;

      const triggerBackgroundSwCheck = () => {
        if (!navigator.onLine) return;
        reg.update().catch(() => {});
      };

      if (reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        if (!manualUpdateState) {
          showAppUpdateCard({ oldVer: prevVersion || APP_VERSION, newVer: null, isBackgroundUpdate: true });
        }
      }

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            newWorker.postMessage({ type: 'SKIP_WAITING' });
            if (!manualUpdateState) {
              showAppUpdateCard({ oldVer: prevVersion || APP_VERSION, newVer: null, isBackgroundUpdate: true });
            }
          }
        });
      });

      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!swHadControllerOnBoot) {
          swHadControllerOnBoot = true;
          return;
        }
        if (refreshing) return;
        refreshing = true;

        if (manualUpdateState && typeof manualUpdateState.onControllerChanged === 'function') {
          manualUpdateState.onControllerChanged();
          return;
        }

        bgUpdatePromptShown = false;
        showAppUpdateCard({ oldVer: prevVersion || APP_VERSION, newVer: null, isBackgroundUpdate: true });
      });

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          triggerBackgroundSwCheck();
        }
      });

      window.addEventListener('pageshow', () => {
        triggerBackgroundSwCheck();
      });

      window.addEventListener('online', () => {
        triggerBackgroundSwCheck();
      });

      triggerBackgroundSwCheck();
    } catch (err) {
      console.warn('SW registration skipped:', err.message);
    }
  });
}

async function showAppUpdateCard({ oldVer, newVer, isBackgroundUpdate = false }) {
  if (isBackgroundUpdate) {
    if (bgUpdatePromptShown) return;
    bgUpdatePromptShown = true;
  } else {
    if (updatePromptShown) return;
    updatePromptShown = true;
  }

  const title = isBackgroundUpdate
    ? 'Update Terbaru Tersedia'
    : `Update Tersedia (v${newVer})`;
  const intro = isBackgroundUpdate
    ? 'Versi baru PMR Editor sudah aktif di latar belakang. Muat ulang sekarang agar tampilan & fitur terbaru langsung diterapkan.'
    : `Versi baru PMR Editor siap digunakan${oldVer && oldVer !== newVer ? ` (pembaruan dari v${oldVer})` : ''}. Muat ulang sekarang agar tampilan & fitur terbaru langsung aktif.`;

  const choice = await showModal({
    type: 'success',
    isUpdateCard: true,
    title,
    paragraphs: [intro],
    bullets: isBackgroundUpdate ? [] : UPDATE_HIGHLIGHTS,
    bulletStyle: 'success',
    actions: [
      { label: 'Muat Ulang Sekarang', icon: 'refresh', value: 'reload', className: 'btn btn-primary' },
      { label: 'Nanti Saja', value: 'later', className: 'btn btn-ghost' }
    ],
    dismissValue: 'later'
  });

  if (!isBackgroundUpdate) {
    localStorage.setItem(VERSION_STORAGE_KEY, APP_VERSION);
  }

  if (choice === 'reload') {
    window.location.reload();
  }
}

function parseLatestChangelogBullets(markdownText) {
  if (!markdownText || typeof markdownText !== 'string') return [];
  const lines = markdownText.split(/\r?\n/);
  let inLatestSection = false;
  const bullets = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (/^##\s+\[/.test(line)) {
      if (inLatestSection) break;
      inLatestSection = true;
      continue;
    }
    if (!inLatestSection) continue;
    if (line === '---') break;

    if (/^-\s+/.test(line) && !rawLine.startsWith('  ')) {
      const cleaned = line
        .replace(/^-\s+/, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .trim();
      if (cleaned) bullets.push(cleaned);
      if (bullets.length >= 4) break;
    }
  }
  return bullets;
}

async function fetchLatestChangelogBullets() {
  try {
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const abortTimer = controller ? setTimeout(() => controller.abort(), 4000) : null;
    const res = await fetch('./CHANGELOG.md', {
      cache: 'no-store',
      signal: controller ? controller.signal : undefined
    });
    if (abortTimer) clearTimeout(abortTimer);
    if (!res || !res.ok) return UPDATE_HIGHLIGHTS;
    const text = await res.text();
    const parsed = parseLatestChangelogBullets(text);
    return parsed.length > 0 ? parsed : UPDATE_HIGHLIGHTS;
  } catch (_) {
    return UPDATE_HIGHLIGHTS;
  }
}

function getServiceWorkerStatusSummary(reg) {
  const swSupported = 'serviceWorker' in navigator && (location.protocol === 'http:' || location.protocol === 'https:');
  if (!swSupported) {
    return { label: 'Mode Lokal / Non-SW', tone: 'amber' };
  }
  if (reg && reg.waiting) {
    return { label: 'Update Menunggu Reload', tone: 'sky' };
  }
  if (reg && reg.installing) {
    return { label: 'Mengunduh Update...', tone: 'sky' };
  }
  if ((reg && reg.active) || navigator.serviceWorker.controller) {
    return { label: 'Aktif & Siap Offline', tone: 'emerald' };
  }
  return { label: 'Menyiapkan Cache...', tone: 'amber' };
}

function renderModalBulletsList(ulEl, bullets, bulletVariant = 'success') {
  if (!ulEl) return;
  const iconName = bulletVariant === 'success'
    ? 'check'
    : (bulletVariant === 'danger' ? 'alertOctagon' : (bulletVariant === 'info' ? 'info' : 'alertTriangle'));
  ulEl.innerHTML = '';
  bullets.forEach((bText) => {
    const li = document.createElement('li');
    const bulletIconBox = document.createElement('span');
    bulletIconBox.className = `modal-bullet-icon ${bulletVariant}`;
    bulletIconBox.setAttribute('aria-hidden', 'true');
    bulletIconBox.appendChild(createSvgIcon(iconName, 13));

    const bulletTextSpan = document.createElement('span');
    bulletTextSpan.className = 'modal-bullet-text';
    bulletTextSpan.textContent = bText;

    li.appendChild(bulletIconBox);
    li.appendChild(bulletTextSpan);
    ulEl.appendChild(li);
  });
}

async function openVersionCheckModal() {
  triggerHaptic(10);
  if (activeModalResolver) {
    closeModal(activeModalDismissValue);
  }

  const overlay = document.getElementById('appModalOverlay');
  const card = document.getElementById('appModalCard');
  const iconEl = document.getElementById('modalIcon');
  const titleEl = document.getElementById('modalTitle');
  const bodyEl = document.getElementById('modalBody');
  const actionsEl = document.getElementById('modalActions');
  if (!overlay || !iconEl || !titleEl || !bodyEl || !actionsEl) return;

  if (card) card.classList.add('update-card');
  iconEl.className = 'modal-icon success';
  iconEl.innerHTML = '';
  iconEl.appendChild(createSvgIcon('refresh', 21));
  titleEl.textContent = 'Info Versi & Pembaruan';

  let activeReg = swRegistration;
  if (!activeReg && 'serviceWorker' in navigator && (location.protocol === 'http:' || location.protocol === 'https:')) {
    try {
      activeReg = (await navigator.serviceWorker.getRegistration('./')) || (await navigator.serviceWorker.getRegistration());
      if (activeReg) swRegistration = activeReg;
    } catch (_) {}
  }

  const swStatus = getServiceWorkerStatusSummary(activeReg);
  const isOnline = navigator.onLine;

  bodyEl.innerHTML = '';

  const metaCard = document.createElement('div');
  metaCard.className = 'version-meta-card';

  const makeMetaRow = (label, valueText, toneClass = '') => {
    const row = document.createElement('div');
    row.className = 'version-meta-row';
    const lbl = document.createElement('span');
    lbl.className = 'version-meta-label';
    lbl.textContent = label;
    const val = document.createElement('span');
    val.className = toneClass ? `version-meta-val ${toneClass}` : 'version-meta-val';
    val.textContent = valueText;
    row.appendChild(lbl);
    row.appendChild(val);
    return { row, val };
  };

  metaCard.appendChild(makeMetaRow('Versi Terpasang', `v${APP_VERSION}`, 'emerald').row);
  metaCard.appendChild(makeMetaRow('Status Koneksi', isOnline ? 'Online' : 'Offline', isOnline ? 'emerald' : 'amber').row);
  const swRowObj = makeMetaRow('Service Worker', swStatus.label, swStatus.tone);
  metaCard.appendChild(swRowObj.row);
  bodyEl.appendChild(metaCard);

  const sectionLabel = document.createElement('div');
  sectionLabel.className = 'version-section-label';
  sectionLabel.textContent = `Pembaruan Terbaru (v${APP_VERSION})`;
  bodyEl.appendChild(sectionLabel);

  const changelogUl = document.createElement('ul');
  changelogUl.className = 'modal-bullets success-list';
  renderModalBulletsList(changelogUl, UPDATE_HIGHLIGHTS, 'success');
  bodyEl.appendChild(changelogUl);

  const statusBanner = document.createElement('div');
  statusBanner.className = 'version-check-banner';
  statusBanner.setAttribute('aria-live', 'polite');
  bodyEl.appendChild(statusBanner);

  actionsEl.innerHTML = '';
  actionsEl.className = 'modal-actions';

  const checkBtn = document.createElement('button');
  checkBtn.type = 'button';
  checkBtn.className = 'btn btn-primary';
  const setCheckBtnState = (loading, labelText) => {
    checkBtn.disabled = loading;
    checkBtn.innerHTML = '';
    checkBtn.appendChild(createSvgIcon(loading ? 'loader' : 'refresh', 16, loading ? 'svg-spin' : ''));
    const lbl = document.createElement('span');
    lbl.textContent = labelText;
    checkBtn.appendChild(lbl);
  };
  setCheckBtnState(false, 'Cek & Perbarui Aplikasi');

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'btn btn-ghost';
  closeBtn.textContent = 'Tutup';
  closeBtn.addEventListener('click', () => {
    triggerHaptic(10);
    closeModal('close');
  });

  actionsEl.appendChild(checkBtn);
  actionsEl.appendChild(closeBtn);

  let isDisposed = false;
  let isChecking = false;
  let timeoutId = null;
  let updateGraceId = null;
  let reloadFallbackId = null;
  let watchedWorker = null;
  let watchedWorkerHandler = null;
  let updateFoundTarget = null;
  let updateFoundHandler = null;

  const setBanner = (variant, iconName, message, spinning = false) => {
    if (isDisposed) return;
    statusBanner.className = `version-check-banner visible ${variant}`;
    statusBanner.innerHTML = '';
    statusBanner.appendChild(createSvgIcon(iconName, 16, spinning ? 'svg-spin' : ''));
    const msgSpan = document.createElement('span');
    msgSpan.textContent = message;
    statusBanner.appendChild(msgSpan);
  };

  const cleanupVersionCheck = () => {
    isDisposed = true;
    manualUpdateState = null;
    if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
    if (updateGraceId) { clearTimeout(updateGraceId); updateGraceId = null; }
    if (reloadFallbackId) { clearTimeout(reloadFallbackId); reloadFallbackId = null; }
    if (watchedWorker && watchedWorkerHandler) {
      watchedWorker.removeEventListener('statechange', watchedWorkerHandler);
    }
    if (updateFoundTarget && updateFoundHandler) {
      updateFoundTarget.removeEventListener('updatefound', updateFoundHandler);
    }
  };

  const finishWithResult = (variant, iconName, message, btnLabel = 'Cek & Perbarui Aplikasi') => {
    if (isDisposed) return;
    isChecking = false;
    manualUpdateState = null;
    if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
    if (updateGraceId) { clearTimeout(updateGraceId); updateGraceId = null; }
    setCheckBtnState(false, btnLabel);
    setBanner(variant, iconName, message, false);
  };

  let isReloading = false;
  const performCleanReload = () => {
    if (isDisposed || isReloading) return;
    isReloading = true;
    if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
    if (reloadFallbackId) { clearTimeout(reloadFallbackId); reloadFallbackId = null; }
    setBanner('success', 'checkCircle', 'Pembaruan diterapkan! Memuat ulang aplikasi...');
    setCheckBtnState(true, 'Memuat ulang...');
    setTimeout(() => {
      if (!isDisposed) window.location.reload();
    }, 450);
  };

  const activateWaitingWorker = (worker) => {
    if (!worker || isDisposed) return;
    setCheckBtnState(true, 'Memperbarui...');
    setBanner('success', 'checkCircle', 'Pembaruan siap! Menerapkan versi terbaru...');
    manualUpdateState = {
      onControllerChanged: () => {
        performCleanReload();
      }
    };
    swRowObj.val.textContent = 'Menerapkan Update...';
    swRowObj.val.className = 'version-meta-val sky';
    worker.postMessage({ type: 'SKIP_WAITING' });
    reloadFallbackId = setTimeout(() => {
      performCleanReload();
    }, 2500);
  };

  const attachWorkerWatcher = (worker) => {
    if (!worker || isDisposed) return;
    if (watchedWorker && watchedWorkerHandler) {
      watchedWorker.removeEventListener('statechange', watchedWorkerHandler);
    }
    watchedWorker = worker;
    setCheckBtnState(true, 'Memperbarui...');
    setBanner('info', 'loader', 'Pembaruan ditemukan, mengunduh aset terbaru...', true);
    swRowObj.val.textContent = 'Mengunduh Update...';
    swRowObj.val.className = 'version-meta-val sky';

    watchedWorkerHandler = () => {
      if (isDisposed) return;
      if (worker.state === 'installed') {
        if (navigator.serviceWorker.controller) {
          activateWaitingWorker(worker);
        } else {
          finishWithResult('success', 'checkCircle', `Cache offline siap digunakan (v${APP_VERSION}).`);
        }
      } else if (worker.state === 'redundant') {
        finishWithResult('danger', 'alertOctagon', 'Instalasi pembaruan gagal atau dibatalkan. Silakan coba lagi.');
      }
    };
    worker.addEventListener('statechange', watchedWorkerHandler);
  };

  checkBtn.addEventListener('click', async () => {
    if (isChecking || isDisposed) return;
    triggerHaptic(10);
    isChecking = true;
    setCheckBtnState(true, 'Memeriksa...');
    setBanner('info', 'loader', 'Memeriksa pembaruan terbaru di server...', true);

    timeoutId = setTimeout(() => {
      if (isChecking && !isDisposed) {
        finishWithResult('warning', 'alertTriangle', 'Pemeriksaan melebihi batas waktu 30 detik. Pastikan jaringan stabil lalu coba lagi.');
      }
    }, 30000);

    if (!navigator.onLine) {
      finishWithResult('danger', 'alertOctagon', 'Perangkat sedang offline. Aktifkan internet untuk memeriksa pembaruan.');
      return;
    }

    const swSupported = 'serviceWorker' in navigator && (location.protocol === 'http:' || location.protocol === 'https:');
    if (!swSupported) {
      finishWithResult('danger', 'alertOctagon', 'Service Worker tidak tersedia di mode lokal/file://.');
      return;
    }

    try {
      let reg = activeReg || swRegistration || (await navigator.serviceWorker.getRegistration('./')) || (await navigator.serviceWorker.getRegistration());
      if (!reg) {
        reg = await navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' });
      }
      if (isDisposed || !isChecking) return;
      activeReg = reg;
      swRegistration = reg;

      if (reg.waiting) {
        activateWaitingWorker(reg.waiting);
        return;
      }

      if (reg.installing) {
        attachWorkerWatcher(reg.installing);
        return;
      }

      let foundUpdate = false;
      if (updateFoundTarget && updateFoundHandler) {
        updateFoundTarget.removeEventListener('updatefound', updateFoundHandler);
      }
      updateFoundTarget = reg;
      updateFoundHandler = () => {
        if (isDisposed || foundUpdate) return;
        const candidate = reg.installing || reg.waiting;
        if (candidate) {
          foundUpdate = true;
          if (reg.waiting && !reg.installing) {
            activateWaitingWorker(reg.waiting);
          } else {
            attachWorkerWatcher(candidate);
          }
        }
      };
      reg.addEventListener('updatefound', updateFoundHandler);

      await reg.update();
      if (isDisposed || !isChecking) return;

      if (reg.waiting) {
        foundUpdate = true;
        activateWaitingWorker(reg.waiting);
        return;
      }

      if (reg.installing) {
        foundUpdate = true;
        attachWorkerWatcher(reg.installing);
        return;
      }

      updateGraceId = setTimeout(() => {
        if (isDisposed || foundUpdate || !isChecking) return;
        if (reg.waiting) {
          activateWaitingWorker(reg.waiting);
          return;
        }
        if (reg.installing) {
          attachWorkerWatcher(reg.installing);
          return;
        }
        swRowObj.val.textContent = 'Aktif & Mutakhir';
        swRowObj.val.className = 'version-meta-val emerald';
        finishWithResult('success', 'checkCircle', `Aplikasi sudah menggunakan versi terbaru (v${APP_VERSION}).`);
      }, 250);
    } catch (err) {
      if (isDisposed || !isChecking) return;
      finishWithResult('danger', 'alertOctagon', `Gagal memeriksa pembaruan: ${err && err.message ? err.message : 'kesalahan jaringan'}.`);
    }
  });

  modalCleanupFn = cleanupVersionCheck;
  activeModalDismissValue = 'close';

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  modalFocusTimer = setTimeout(() => {
    modalFocusTimer = null;
    checkBtn.focus();
  }, 30);

  fetchLatestChangelogBullets().then((bullets) => {
    if (!isDisposed && bullets && bullets.length > 0) {
      renderModalBulletsList(changelogUl, bullets, 'success');
    }
  });

  return new Promise((resolve) => {
    activeModalResolver = resolve;
  });
}

/* ================= CUSTOM MODAL ENGINE ================= */

function setupModalEvents() {
  const overlay = document.getElementById('appModalOverlay');
  if (!overlay) return;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay && activeModalDismissValue !== null) {
      closeModal(activeModalDismissValue);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open') && activeModalDismissValue !== null) {
      e.preventDefault();
      closeModal(activeModalDismissValue);
    }
  });
}

function closeModal(resultValue) {
  if (modalFocusTimer) {
    clearTimeout(modalFocusTimer);
    modalFocusTimer = null;
  }
  if (typeof modalCleanupFn === 'function') {
    const cleanup = modalCleanupFn;
    modalCleanupFn = null;
    cleanup();
  }
  const overlay = document.getElementById('appModalOverlay');
  const card = document.getElementById('appModalCard');
  if (overlay) {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
  }
  if (card) {
    card.classList.remove('update-card');
  }
  const resolver = activeModalResolver;
  activeModalResolver = null;
  activeModalDismissValue = null;
  if (resolver) resolver(resultValue);
}

function showModal({
  type = 'info',
  isUpdateCard = false,
  title = 'Informasi',
  paragraphs = [],
  bullets = [],
  bulletStyle = 'warning',
  actions = [{ label: 'OK', value: true, className: 'btn btn-primary' }],
  dismissValue = null
}) {
  if (activeModalResolver) {
    closeModal(activeModalDismissValue);
  }
  return new Promise((resolve) => {
    const overlay = document.getElementById('appModalOverlay');
    const card = document.getElementById('appModalCard');
    const iconEl = document.getElementById('modalIcon');
    const titleEl = document.getElementById('modalTitle');
    const bodyEl = document.getElementById('modalBody');
    const actionsEl = document.getElementById('modalActions');

    if (!overlay || !iconEl || !titleEl || !bodyEl || !actionsEl) {
      resolve(actions[0] ? actions[0].value : null);
      return;
    }

    if (card) {
      card.classList.toggle('update-card', Boolean(isUpdateCard));
    }

    const iconMap = {
      info: 'info',
      success: isUpdateCard ? 'rocket' : 'checkCircle',
      warning: 'alertTriangle',
      danger: 'alertOctagon'
    };

    iconEl.className = `modal-icon ${type}`;
    iconEl.innerHTML = '';
    iconEl.appendChild(createSvgIcon(iconMap[type] || 'info', 21));
    titleEl.textContent = title;

    bodyEl.innerHTML = '';
    paragraphs.forEach((text) => {
      if (!text) return;
      const p = document.createElement('p');
      p.textContent = text;
      bodyEl.appendChild(p);
    });

    if (bullets && bullets.length > 0) {
      const bulletVariant = bulletStyle === 'success'
        ? 'success'
        : (type === 'danger' ? 'danger' : (type === 'info' ? 'info' : 'warning'));
      const bulletIconName = bulletVariant === 'success'
        ? 'check'
        : (bulletVariant === 'danger' ? 'alertOctagon' : (bulletVariant === 'info' ? 'info' : 'alertTriangle'));

      const ul = document.createElement('ul');
      ul.className = `modal-bullets ${bulletStyle === 'success' ? 'success-list' : ''}`;
      bullets.forEach((bText) => {
        const li = document.createElement('li');
        const bulletIconBox = document.createElement('span');
        bulletIconBox.className = `modal-bullet-icon ${bulletVariant}`;
        bulletIconBox.setAttribute('aria-hidden', 'true');
        bulletIconBox.appendChild(createSvgIcon(bulletIconName, 13));

        const bulletTextSpan = document.createElement('span');
        bulletTextSpan.className = 'modal-bullet-text';
        bulletTextSpan.textContent = bText;

        li.appendChild(bulletIconBox);
        li.appendChild(bulletTextSpan);
        ul.appendChild(li);
      });
      bodyEl.appendChild(ul);
    }

    actionsEl.innerHTML = '';
    actionsEl.className = `modal-actions ${actions.length <= 2 && !isUpdateCard ? 'row-layout' : ''}`;

    let primaryBtn = null;
    actions.forEach((act, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = act.className || 'btn btn-secondary';
      if (act.icon) {
        btn.appendChild(createSvgIcon(act.icon, 16));
      }
      const labelSpan = document.createElement('span');
      labelSpan.textContent = act.label;
      btn.appendChild(labelSpan);
      btn.addEventListener('click', () => { triggerHaptic(10); closeModal(act.value); });
      actionsEl.appendChild(btn);
      if (idx === 0) primaryBtn = btn;
    });

    activeModalResolver = resolve;
    activeModalDismissValue = dismissValue;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');

    if (primaryBtn) {
      modalFocusTimer = setTimeout(() => {
        modalFocusTimer = null;
        primaryBtn.focus();
      }, 30);
    }
  });
}

/* ================= DATE, STORAGE & STATUS HELPERS ================= */

function getLocalDateTag() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getLocalTimeShort() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function setImportedFileBadge(text, isDraft = false) {
  currentBadgeText = text || '';
  const container = document.getElementById('importedFileInfo');
  const iconEl = document.getElementById('importedFileIcon');
  const prefixEl = document.getElementById('importedFilePrefix');
  const nameEl = document.getElementById('importedFileName');
  if (!container || !iconEl || !prefixEl || !nameEl) return;

  if (text) {
    iconEl.innerHTML = '';
    iconEl.appendChild(createSvgIcon(isDraft ? 'database' : 'fileText', 15));
    prefixEl.textContent = isDraft ? 'Draft:' : 'File aktif:';
    nameEl.textContent = text;
    nameEl.title = text;
    container.classList.add('visible');
  } else {
    nameEl.textContent = '';
    nameEl.title = '';
    container.classList.remove('visible');
  }
}

function updateDraftSavedIndicator(visible, timestampMs = null) {
  const badge = document.getElementById('draftSavedBadge');
  if (!badge) return;

  if (!visible) {
    badge.classList.remove('visible', 'pulse');
    return;
  }

  let timeStr = getLocalTimeShort();
  if (timestampMs) {
    const d = new Date(timestampMs);
    if (!isNaN(d.getTime())) {
      timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
  }

  const textEl = document.getElementById('draftSavedText');
  if (textEl) {
    textEl.textContent = `Draft tersimpan (${timeStr})`;
  } else {
    badge.textContent = `Draft tersimpan (${timeStr})`;
  }
  badge.classList.add('visible', 'pulse');

  if (draftPulseTimer) clearTimeout(draftPulseTimer);
  draftPulseTimer = setTimeout(() => {
    badge.classList.remove('pulse');
  }, 1400);
}

/* ================= VALUE SANITIZATION & VALIDATION ================= */

function normalizeDecimal(val) {
  if (val === null || val === undefined) return '';
  return val.toString().replace(/,/g, '.');
}

function getChoiceOptions(item) {
  const unit = (item.unit || '').trim().toUpperCase();
  if (unit === 'ON/OFF') return ['on', 'off'];
  if (unit === 'A/B' || unit === 'B') return ['a', 'b'];
  if (unit === 'HURUF') return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
  return null;
}

function sanitizeNumericString(raw) {
  let str = normalizeDecimal(raw).trim();
  if (str === '') return '';

  let result = '';
  let hasDot = false;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch >= '0' && ch <= '9') {
      result += ch;
    } else if (ch === '-' && result.length === 0) {
      result += ch;
    } else if (ch === '.' && !hasDot) {
      result += ch;
      hasDot = true;
    }
  }

  return result;
}

function isValidNumericValue(val) {
  if (val === '') return true;
  if (val.endsWith('.')) return false;
  return /^-?(?:\d+\.?\d*|\.\d+)$/.test(val);
}

function isCellValueValid(val, item) {
  if (val === '') return true;
  const choiceOpts = getChoiceOptions(item);
  if (choiceOpts) {
    return choiceOpts.includes(val);
  }
  return isValidNumericValue(val);
}

function normalizeCellValue(val, item, strictSanitize = false) {
  let str = normalizeDecimal(val);
  if (item && getChoiceOptions(item)) {
    return str.trim().toLowerCase();
  }
  if (strictSanitize) {
    return sanitizeNumericString(str);
  }
  return str.trim();
}

function persistDraftNow() {
  try {
    const hasData = Object.values(currentValues).some(v => v !== '');
    if (!hasData && !importedTimingProfile && !currentBadgeText) {
      localStorage.removeItem(STORAGE_PREFIX + currentOperatorKey);
      updateDraftSavedIndicator(false);
      return;
    }
    const superFastEl = document.getElementById('superFastMode');
    const nowMs = Date.now();
    const payload = {
      values: currentValues,
      badge: currentBadgeText,
      timingProfile: importedTimingProfile,
      superFast: superFastEl ? superFastEl.checked : true,
      updatedAt: nowMs
    };
    localStorage.setItem(STORAGE_PREFIX + currentOperatorKey, JSON.stringify(payload));
    updateDraftSavedIndicator(true, nowMs);
  } catch (e) {
    console.warn('Gagal menyimpan draft localStorage:', e.message);
  }
}

function cancelPendingDraftSave() {
  if (draftSaveTimer) {
    clearTimeout(draftSaveTimer);
    draftSaveTimer = null;
  }
}

function flushPendingDraftSave() {
  if (draftSaveTimer) {
    clearTimeout(draftSaveTimer);
    draftSaveTimer = null;
    persistDraftNow();
  }
}

function saveDraftToStorage(immediate = true) {
  if (immediate) {
    cancelPendingDraftSave();
    persistDraftNow();
    return;
  }
  cancelPendingDraftSave();
  draftSaveTimer = setTimeout(() => {
    draftSaveTimer = null;
    persistDraftNow();
  }, 120);
}

function loadDraftFromStorage(operatorKey) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + operatorKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.values && typeof parsed.values === 'object') {
      return parsed;
    }
  } catch (e) {
    console.warn('Gagal membaca draft localStorage:', e.message);
  }
  return null;
}

function updateFilledStats() {
  const total = currentParameters.length;
  let filled = 0;
  currentParameters.forEach(p => {
    const v = currentValues[p.id];
    if (v !== undefined && v !== null && v.toString().trim() !== '') {
      filled++;
    }
  });

  const badge = document.getElementById('filledCountBadge');
  if (badge) {
    badge.textContent = `Terisi: ${filled} / ${total} Cell`;
    if (total > 0 && filled === total) {
      badge.classList.add('complete');
    } else {
      badge.classList.remove('complete');
    }
  }
}

function updateLayoutContainerVisibility() {
  const hCont = document.getElementById('excelScrollContainer');
  const vCont = document.getElementById('verticalScrollContainer');

  if (currentViewMode === 'vertical') {
    if (hCont) hCont.style.display = 'none';
    if (vCont) vCont.style.display = 'block';
  } else {
    if (hCont) hCont.style.display = 'block';
    if (vCont) vCont.style.display = 'none';
  }
}

async function loadParameter(operatorKey) {
  if (!operatorKey) return;

  flushPendingDraftSave();
  const reqId = ++loadRequestId;
  currentOperatorKey = operatorKey;
  const errorBox = document.getElementById('loadErrorBox');
  if (errorBox) errorBox.style.display = 'none';

  try {
    const response = await fetch(`./data/${operatorKey}.json`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const loadedParams = await response.json();
    if (reqId !== loadRequestId) return;
    currentParameters = loadedParams.map((item) => ({
      ...item,
      _searchText: `${item.index} ${item.equipment} ${item.tag} ${item.label}`.toLowerCase()
    }));
  } catch (err) {
    if (reqId !== loadRequestId) return;
    currentParameters = [];
    if (errorBox) {
      const isFileProto = window.location.protocol === 'file:';
      const errMsg = isFileProto
        ? 'File dibuka langsung via file:// sehingga browser memblokir pembacaan data parameter. Jalankan melalui GitHub Pages atau server lokal (XAMPP).'
        : `Gagal memuat data parameter (${operatorKey}.json). Pastikan koneksi internet aktif saat pertama kali membuka aplikasi agar tersimpan offline.`;
      errorBox.innerHTML = '';
      const errInner = document.createElement('div');
      errInner.className = 'load-error-inner';
      errInner.appendChild(createSvgIcon('alertTriangle', 18, 'load-error-icon'));
      const errText = document.createElement('span');
      errText.textContent = errMsg;
      errInner.appendChild(errText);
      errorBox.appendChild(errInner);
      errorBox.style.display = 'block';
    }
  }

  currentValues = {};
  importedTimingProfile = null;

  const draft = loadDraftFromStorage(operatorKey);
  if (draft) {
    currentParameters.forEach(p => {
      if (draft.values[p.id] !== undefined) {
        currentValues[p.id] = normalizeCellValue(draft.values[p.id], p, false);
      }
    });
    if (draft.timingProfile) {
      importedTimingProfile = draft.timingProfile;
    }
    const superFastEl = document.getElementById('superFastMode');
    if (superFastEl && typeof draft.superFast === 'boolean') {
      superFastEl.checked = draft.superFast;
    }
    if (draft.badge) {
      setImportedFileBadge(draft.badge, true);
    } else {
      setImportedFileBadge(null);
    }
    updateDraftSavedIndicator(true, draft.updatedAt);
  } else {
    setImportedFileBadge(null);
    updateDraftSavedIndicator(false);
  }

  updateLayoutContainerVisibility();
  renderActiveTable();
  updateFilledStats();
  filterParameters();
}

function createCellControl(item, idx) {
  const choiceOpts = getChoiceOptions(item);
  const currentVal = currentValues[item.id] !== undefined ? currentValues[item.id] : '';

  if (choiceOpts) {
    const select = document.createElement('select');
    select.className = 'excel-input';
    select.id = `input_${item.id}`;
    select.name = item.id;
    select.setAttribute('data-index', idx);

    const emptyOpt = document.createElement('option');
    emptyOpt.value = '';
    emptyOpt.textContent = '—';
    select.appendChild(emptyOpt);

    choiceOpts.forEach(optVal => {
      const opt = document.createElement('option');
      opt.value = optVal;
      opt.textContent = optVal.toUpperCase();
      select.appendChild(opt);
    });

    if (currentVal !== '' && !choiceOpts.includes(currentVal)) {
      const customOpt = document.createElement('option');
      customOpt.value = currentVal;
      customOpt.textContent = `${currentVal} (!)`;
      select.appendChild(customOpt);
      select.classList.add('cell-warning');
    }

    select.value = currentVal;
    if (currentVal === '') select.classList.add('cell-empty');

    select.addEventListener('change', () => {
      const val = normalizeCellValue(select.value, item, false);
      currentValues[item.id] = val;
      select.classList.toggle('cell-empty', val === '');
      select.classList.toggle('cell-warning', val !== '' && !choiceOpts.includes(val));
      updateFilledStats();
      saveDraftToStorage();
    });

    select.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        focusInput(idx + 1);
      }
    });

    return select;
  }

  const input = document.createElement('input');
  input.type = 'text';
  input.inputMode = 'decimal';
  input.enterKeyHint = 'next';
  input.setAttribute('enterkeyhint', 'next');
  input.className = 'excel-input';
  input.id = `input_${item.id}`;
  input.name = item.id;
  input.setAttribute('data-index', idx);
  input.placeholder = '...';
  input.value = currentVal;

  if (currentVal === '') {
    input.classList.add('cell-empty');
  } else if (!isValidNumericValue(currentVal)) {
    input.classList.add('cell-warning');
  }

  input.addEventListener('input', () => {
    const raw = input.value;
    const cursorPos = input.selectionStart;
    const sanitized = sanitizeNumericString(raw);

    if (raw !== sanitized) {
      input.value = sanitized;
      if (cursorPos !== null) {
        const diff = raw.length - sanitized.length;
        const nextPos = Math.max(0, cursorPos - diff);
        try {
          input.setSelectionRange(nextPos, nextPos);
        } catch (_) {}
      }
    }

    currentValues[item.id] = sanitized;
    input.classList.toggle('cell-empty', sanitized === '');
    const tempValid = sanitized === '' || sanitized === '-' || sanitized === '.' || sanitized === '-.' || /^-?(?:\d+\.?\d*|\.\d+)$/.test(sanitized);
    input.classList.toggle('cell-warning', !tempValid);
    updateFilledStats();
    saveDraftToStorage(false);
  });

  input.addEventListener('blur', () => {
    const val = currentValues[item.id] || '';
    input.classList.toggle('cell-warning', val !== '' && !isValidNumericValue(val));
    flushPendingDraftSave();
  });

  input.addEventListener('keydown', (e) => {
    if (currentViewMode === 'horizontal') {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        focusInput(idx + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        focusInput(idx - 1);
      }
    } else {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault();
        focusNextVisibleInput(idx, 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        focusNextVisibleInput(idx, -1);
      }
    }
  });

  return input;
}

function renderActiveTable() {
  if (currentViewMode === 'vertical') {
    document.getElementById('inputCellsRow').innerHTML = '';
    renderVerticalTable(currentParameters);
  } else {
    document.getElementById('verticalBodyRows').innerHTML = '';
    renderHorizontalExcel(currentParameters);
  }
}

function renderHorizontalExcel(params) {
  const headerEqRow = document.getElementById('headerEquipmentRow');
  const headerTagRow = document.getElementById('headerTagRow');
  const headerUnitRow = document.getElementById('headerUnitRow');
  const inputCellsRow = document.getElementById('inputCellsRow');

  headerEqRow.innerHTML = '';
  headerTagRow.innerHTML = '';
  headerUnitRow.innerHTML = '';
  inputCellsRow.innerHTML = '';

  if (!params || params.length === 0) return;

  let currentEq = null;
  let currentSpan = 0;
  const eqHeaderCells = [];
  const eqFrag = document.createDocumentFragment();
  const tagFrag = document.createDocumentFragment();
  const unitFrag = document.createDocumentFragment();
  const inputFrag = document.createDocumentFragment();

  params.forEach((item, idx) => {
    const eqName = item.equipment || 'Lain-lain';

    if (eqName !== currentEq) {
      if (currentEq !== null) {
        eqHeaderCells.push({ name: currentEq, span: currentSpan });
      }
      currentEq = eqName;
      currentSpan = 1;
    } else {
      currentSpan++;
    }

    const thTag = document.createElement('th');
    thTag.className = 'tag-header';
    thTag.setAttribute('data-col', idx);
    const idxSpan = document.createElement('span');
    idxSpan.className = 'col-index';
    idxSpan.textContent = `#${item.index}`;
    thTag.appendChild(idxSpan);
    thTag.appendChild(document.createTextNode(item.tag || item.equipment || ''));
    tagFrag.appendChild(thTag);

    const thUnit = document.createElement('th');
    thUnit.className = 'unit-header';
    thUnit.setAttribute('data-col', idx);
    thUnit.textContent = item.unit || '-';
    unitFrag.appendChild(thUnit);

    const tdInput = document.createElement('td');
    tdInput.setAttribute('data-search', item._searchText || `${item.equipment} ${item.tag} ${item.label}`.toLowerCase());
    tdInput.setAttribute('id', `cell_col_${idx}`);

    const control = createCellControl(item, idx);
    tdInput.appendChild(control);
    inputFrag.appendChild(tdInput);
  });

  if (currentEq !== null) {
    eqHeaderCells.push({ name: currentEq, span: currentSpan });
  }

  eqHeaderCells.forEach(eq => {
    const th = document.createElement('th');
    th.className = 'eq-header';
    th.colSpan = eq.span;
    th.textContent = eq.name;
    eqFrag.appendChild(th);
  });

  headerEqRow.appendChild(eqFrag);
  headerTagRow.appendChild(tagFrag);
  headerUnitRow.appendChild(unitFrag);
  inputCellsRow.appendChild(inputFrag);
}

function renderVerticalTable(params) {
  const tbody = document.getElementById('verticalBodyRows');
  tbody.innerHTML = '';

  if (!params || params.length === 0) return;

  const frag = document.createDocumentFragment();

  params.forEach((item, idx) => {
    const tr = document.createElement('tr');
    tr.id = `vrow_${idx}`;
    tr.setAttribute('data-index', idx);
    tr.setAttribute('data-search', item._searchText || `${item.index} ${item.equipment} ${item.tag} ${item.label}`.toLowerCase());

    const tdMeta = document.createElement('td');
    tdMeta.className = 'cell-tap-target';
    tdMeta.addEventListener('click', () => { triggerHaptic(8); focusInput(idx); });

    const metaDiv = document.createElement('div');
    metaDiv.className = 'param-meta';

    const eqDiv = document.createElement('div');
    eqDiv.className = 'param-eq';
    eqDiv.textContent = item.equipment || 'Lain-lain';

    const subDiv = document.createElement('div');
    subDiv.className = 'param-sub';

    const numSpan = document.createElement('span');
    numSpan.className = 'param-num-badge';
    numSpan.textContent = `#${item.index} •`;

    const tagSpan = document.createElement('span');
    tagSpan.className = 'param-tag';
    tagSpan.textContent = item.tag || '-';

    const unitSpan = document.createElement('span');
    unitSpan.className = 'param-unit-pill';
    unitSpan.textContent = item.unit || '-';

    subDiv.appendChild(numSpan);
    subDiv.appendChild(tagSpan);
    subDiv.appendChild(unitSpan);
    metaDiv.appendChild(eqDiv);
    metaDiv.appendChild(subDiv);
    tdMeta.appendChild(metaDiv);

    const tdVal = document.createElement('td');
    const control = createCellControl(item, idx);
    tdVal.appendChild(control);

    tr.appendChild(tdMeta);
    tr.appendChild(tdVal);
    frag.appendChild(tr);
  });

  tbody.appendChild(frag);
}

function focusInput(targetIdx) {
  if (targetIdx >= 0 && targetIdx < currentParameters.length) {
    const targetParam = currentParameters[targetIdx];
    const el = document.getElementById(`input_${targetParam.id}`);
    if (el) {
      try {
        el.focus({ preventScroll: true });
      } catch (_) {
        el.focus();
      }
      if (typeof el.select === 'function') el.select();
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'center' });
    }
  }
}

function focusNextVisibleInput(currentIdx, step) {
  let nextIdx = currentIdx + step;
  while (nextIdx >= 0 && nextIdx < currentParameters.length) {
    const row = document.getElementById(`vrow_${nextIdx}`);
    if (!row || row.style.display !== 'none') {
      focusInput(nextIdx);
      return;
    }
    nextIdx += step;
  }
}

async function jumpToNextEmpty() {
  triggerHaptic(10);
  const total = currentParameters.length;
  if (total === 0) return;

  const searchInput = document.getElementById('searchInput');
  if (searchInput && searchInput.value.trim() !== '') {
    clearSearch();
  }

  let startIdx = 0;
  const activeEl = document.activeElement;
  if (activeEl && activeEl.hasAttribute('data-index')) {
    startIdx = (parseInt(activeEl.getAttribute('data-index'), 10) + 1) % total;
  }

  for (let offset = 0; offset < total; offset++) {
    const idx = (startIdx + offset) % total;
    const p = currentParameters[idx];
    const val = (currentValues[p.id] || '').toString().trim();
    if (val === '') {
      focusInput(idx);
      return;
    }
  }

  await showModal({
    type: 'success',
    title: 'Semua Cell Sudah Terisi',
    paragraphs: [`Mantap! Seluruh ${total} parameter untuk ${OPERATOR_SHORT_NAMES[currentOperatorKey]} sudah terisi penuh.`],
    actions: [{ label: 'Sip, Mantap', value: true, className: 'btn btn-primary' }],
    dismissValue: true
  });
}

function clearWorkspaceData() {
  cancelPendingDraftSave();
  currentValues = {};
  importedTimingProfile = null;
  localStorage.removeItem(STORAGE_PREFIX + currentOperatorKey);
  setImportedFileBadge(null);
  updateDraftSavedIndicator(false);
  const fileInput = document.getElementById('importFileInput');
  if (fileInput) fileInput.value = '';
  clearSearch();
  renderActiveTable();
  updateFilledStats();
}

async function unloadActiveFileConfirm() {
  triggerHaptic(14);
  const fileName = currentBadgeText || 'file aktif';
  const opName = OPERATOR_SHORT_NAMES[currentOperatorKey] || currentOperatorKey.toUpperCase();
  const confirmed = await showModal({
    type: 'warning',
    title: 'Lepas File & Mulai Kosongan Baru?',
    paragraphs: [
      `File "${fileName}" akan dilepas dan seluruh sel pada ${opName} akan dikosongkan agar Anda bisa membuat data baru dari nol.`
    ],
    actions: [
      { label: 'Ya, Kosongkan', icon: 'trash', value: true, className: 'btn btn-danger-ghost' },
      { label: 'Batal', value: false, className: 'btn btn-ghost' }
    ],
    dismissValue: false
  });

  if (!confirmed) return;
  clearWorkspaceData();
}

async function resetFormConfirm() {
  triggerHaptic(14);
  const opName = OPERATOR_SHORT_NAMES[currentOperatorKey] || currentOperatorKey.toUpperCase();
  const hasFile = Boolean(currentBadgeText);
  const desc = hasFile
    ? `File "${currentBadgeText}" akan dilepas serta semua angka dan draft tersimpan untuk ${opName} akan dikosongkan.`
    : `Semua angka dan draft tersimpan untuk ${opName} akan dihapus bersih.`;

  const confirmed = await showModal({
    type: 'danger',
    title: `Reset Isian ${opName}?`,
    paragraphs: [desc],
    actions: [
      { label: 'Ya, Reset', icon: 'trash', value: true, className: 'btn btn-danger-ghost' },
      { label: 'Batal', value: false, className: 'btn btn-ghost' }
    ],
    dismissValue: false
  });

  if (!confirmed) return;
  clearWorkspaceData();
}

function clearSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  filterParameters();
}

function filterParameters() {
  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  const filterInfo = document.getElementById('filterMatchInfo');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  if (clearBtn) {
    clearBtn.style.display = query ? 'block' : 'none';
  }

  if (currentViewMode === 'vertical') {
    let matchCount = 0;
    currentParameters.forEach((p, idx) => {
      const row = document.getElementById(`vrow_${idx}`);
      if (!row) return;
      const textData = p._searchText || `${p.index} ${p.equipment} ${p.tag} ${p.label}`.toLowerCase();
      const isMatch = !query || textData.includes(query);
      row.style.display = isMatch ? '' : 'none';
      row.classList.toggle('row-highlight', Boolean(query && isMatch));
      if (isMatch) matchCount++;
    });

    if (filterInfo) {
      if (query) {
        filterInfo.textContent = `Menampilkan ${matchCount} dari ${currentParameters.length} parameter`;
        filterInfo.style.display = 'inline';
      } else {
        filterInfo.style.display = 'none';
      }
    }
    return;
  }

  // Horizontal mode
  const prevHighlighted = document.querySelectorAll('#inputCellsRow .excel-input.highlight');
  prevHighlighted.forEach(input => input.classList.remove('highlight'));

  if (!query) {
    if (filterInfo) filterInfo.style.display = 'none';
    return;
  }

  let firstMatch = null;
  let matchCount = 0;

  currentParameters.forEach((p) => {
    const textData = p._searchText || `${p.index} ${p.equipment} ${p.tag} ${p.label}`.toLowerCase();
    if (textData.includes(query)) {
      matchCount++;
      const input = document.getElementById(`input_${p.id}`);
      if (input) {
        input.classList.add('highlight');
        if (!firstMatch) firstMatch = input;
      }
    }
  });

  if (filterInfo) {
    filterInfo.textContent = `Ditemukan ${matchCount} tag cocok`;
    filterInfo.style.display = 'inline';
  }

  if (firstMatch) {
    firstMatch.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}

/* ================= TIMING & MACRO PARSER ================= */

function getMedian(arr, fallback) {
  const valid = arr.filter(n => typeof n === 'number' && !isNaN(n) && n > 0 && n < 2).sort((a, b) => a - b);
  if (valid.length === 0) return fallback;
  const mid = Math.floor(valid.length / 2);
  const med = valid.length % 2 !== 0 ? valid[mid] : (valid[mid - 1] + valid[mid]) / 2;
  return Math.round(med * 10000) / 10000;
}

function extractTimingProfile(events, settings = null) {
  const nextColKeys = ['Key.right', 'Key.tab', 'Key.enter', 'Key.return'];
  const charDelays = [];
  const navDelays = [];
  const pressDurations = [];

  events.forEach((ev, idx) => {
    if (!ev || typeof ev !== 'object') return;
    if (ev.type === 'keyboardEvent' && typeof ev.timestamp === 'number') {
      if (ev.pressed === false) {
        pressDurations.push(ev.timestamp);
      } else if (ev.pressed === true) {
        if (nextColKeys.includes(ev.key)) {
          navDelays.push(ev.timestamp);
        } else if (idx > 0) {
          charDelays.push(ev.timestamp);
        }
      }
    }
  });

  return {
    charDelay: getMedian(charDelays, 0.03),
    navDelay: getMedian(navDelays, 0.03),
    pressDuration: getMedian(pressDurations, 0.015),
    settings: settings || null
  };
}

function importData(event) {
  const inputEl = event.target;
  const file = inputEl && inputEl.files ? inputEl.files[0] : null;
  if (!file) return;

  const reader = new FileReader();
  reader.onerror = async () => {
    if (inputEl) inputEl.value = '';
    await showModal({
      type: 'danger',
      title: 'Gagal Membaca File',
      paragraphs: ['File tidak dapat dibaca oleh browser. Pastikan file tidak rusak atau masih tersedia di penyimpanan.'],
      actions: [{ label: 'Tutup', value: true, className: 'btn btn-secondary' }],
      dismissValue: true
    });
  };
  reader.onload = async (e) => {
    try {
      const content = e.target.result;
      const json = JSON.parse(content);

      // Format 1: Backup JSON lama (json.data)
      if (json && typeof json === 'object' && json.data && typeof json.data === 'object' && !Array.isArray(json.data)) {
        const appliedCount = applyMappedValues(
          currentParameters.map(p => {
            if (json.data[p.id] === undefined) return '';
            return json.data[p.id].value !== undefined ? json.data[p.id].value : json.data[p.id];
          }),
          file.name,
          null
        );
        await showImportResultModal(file.name, currentParameters.length, appliedCount);
        return;
      }

      // Format 2: PyMacroRecord (.pmr) / PMR Web Runner (.json)
      if (json && typeof json === 'object' && Array.isArray(json.events)) {
        const extractedValues = parsePmrMacroEventsAccurate(json.events);
        const timingProfile = extractTimingProfile(json.events, json.settings || null);
        const total = extractedValues.length;

        let detectedOp = null;
        if (total > 60 && currentOperatorKey !== 'operator1') {
          detectedOp = 'operator1';
        } else if (total >= 48 && total <= 60 && currentOperatorKey !== 'operator2') {
          detectedOp = 'operator2';
        } else if (total >= 35 && total <= 47 && currentOperatorKey !== 'operator3') {
          detectedOp = 'operator3';
        }

        if (detectedOp) {
          const targetLabel = OPERATOR_LABELS[detectedOp];
          const targetShort = OPERATOR_SHORT_NAMES[detectedOp];
          const currentShort = OPERATOR_SHORT_NAMES[currentOperatorKey];

          const choice = await showModal({
            type: 'warning',
            title: `File Cocok dengan ${targetShort}`,
            paragraphs: [
              `File "${file.name}" berisi ${total} cell (cocok dengan ${targetLabel}), sedangkan posisi aktif sekarang di ${currentShort}.`
            ],
            actions: [
              { label: `Pindah ke ${targetShort}`, icon: 'refresh', value: 'switch', className: 'btn btn-primary' },
              { label: `Tetap Isi di ${currentShort}`, icon: 'download', value: 'stay', className: 'btn btn-share' },
              { label: 'Batal', icon: 'x', value: 'cancel', className: 'btn btn-ghost' }
            ],
            dismissValue: 'cancel'
          });

          if (choice === 'cancel') return;

          if (choice === 'switch') {
            document.getElementById('selectOperator').value = detectedOp;
            await loadParameter(detectedOp);
            if (currentParameters.length === 0) return;
          }
        }

        const populatedCount = applyMappedValues(extractedValues, file.name, timingProfile);
        await showImportResultModal(file.name, total, populatedCount);
        return;
      }

      // Format 3: Array JSON sederhana
      if (Array.isArray(json)) {
        const rawList = json.map(val => (typeof val === 'object' && val !== null) ? (val.value ?? val.val ?? '') : val);
        const populatedCount = applyMappedValues(rawList, file.name, null);
        await showImportResultModal(file.name, rawList.length, populatedCount);
        return;
      }

      await showModal({
        type: 'warning',
        title: 'Format File Tidak Dikenali',
        paragraphs: ['Pastikan file yang dipilih adalah file makro .pmr atau .json PMR Web Runner yang valid.'],
        actions: [{ label: 'Tutup', value: true, className: 'btn btn-secondary' }],
        dismissValue: true
      });
    } catch (err) {
      await showModal({
        type: 'danger',
        title: 'Gagal Membaca File',
        paragraphs: [`Terjadi kesalahan saat memproses file: ${err.message}`],
        actions: [{ label: 'Tutup', value: true, className: 'btn btn-secondary' }],
        dismissValue: true
      });
    } finally {
      if (inputEl) inputEl.value = '';
    }
  };
  reader.readAsText(file);
}

function applyMappedValues(rawValues, fileName, timingProfile = null) {
  currentValues = {};
  importedTimingProfile = timingProfile;
  let populatedCount = 0;

  rawValues.forEach((val, idx) => {
    if (idx < currentParameters.length) {
      const paramObj = currentParameters[idx];
      const cleanVal = normalizeCellValue(val, paramObj, false);
      currentValues[paramObj.id] = cleanVal;
      if (cleanVal !== '') populatedCount++;
    }
  });

  if (fileName) setImportedFileBadge(fileName, false);
  renderActiveTable();
  updateFilledStats();
  saveDraftToStorage();
  filterParameters();
  return populatedCount;
}

async function showImportResultModal(fileName, totalRead, populatedCount) {
  const invalidItems = [];
  currentParameters.forEach((p) => {
    const val = (currentValues[p.id] || '').toString().trim();
    if (val !== '' && !isCellValueValid(val, p)) {
      invalidItems.push(`#${p.index} ${p.tag} (${val})`);
    }
  });

  const bullets = [
    `File: ${fileName}`,
    `Target aktif: ${OPERATOR_LABELS[currentOperatorKey]}`,
    `Terbaca ${totalRead} cell (${populatedCount} cell terisi)`
  ];

  if (invalidItems.length > 0) {
    const preview = invalidItems.slice(0, 4).join(', ');
    const more = invalidItems.length > 4 ? ` (+${invalidItems.length - 4} lainnya)` : '';
    bullets.push(`${invalidItems.length} nilai perlu dicek: ${preview}${more}`);
  }

  await showModal({
    type: invalidItems.length > 0 ? 'warning' : 'success',
    title: 'Import Data Berhasil',
    bullets,
    bulletStyle: invalidItems.length > 0 ? 'warning' : 'success',
    actions: [{ label: 'Siap, Lanjut', value: true, className: 'btn btn-primary' }],
    dismissValue: true
  });
}

function parsePmrMacroEventsAccurate(events) {
  const cells = [''];
  let colIndex = 0;
  let justNavigated = true;

  const nextColKeys = ['Key.right', 'Key.tab', 'Key.enter', 'Key.return'];
  const ignoreKeys = ['Key.up', 'Key.down'];

  const keyMap = {
    '<96>': '0', '<97>': '1', '<98>': '2', '<99>': '3', '<100>': '4',
    '<101>': '5', '<102>': '6', '<103>': '7', '<104>': '8', '<105>': '9',
    '<106>': '*', '<107>': '+', '<109>': '-', '<110>': '.', '<111>': '/',
    '<187>': '+', '<188>': '.', '<189>': '-', '<190>': '.', '<191>': '/',
    'Key.period': '.', 'Key.decimal': '.', 'Key.numpad_decimal': '.', 'Key.kp_decimal': '.',
    'Key.comma': '.',
    'Key.minus': '-', 'Key.hyphen': '-', 'Key.numpad_subtract': '-', 'Key.kp_subtract': '-',
    'Key.plus': '+', 'Key.numpad_add': '+',
    'Key.slash': '/', 'Key.divide': '/', 'Key.numpad_divide': '/',
    'Key.space': ' '
  };

  for (let i = 0; i <= 9; i++) {
    keyMap[`Key.numpad${i}`] = i.toString();
    keyMap[`Key.numpad_${i}`] = i.toString();
    keyMap[`Key.kp_${i}`] = i.toString();
    keyMap[`[${i}]`] = i.toString();
  }

  events.forEach(ev => {
    if (!ev || typeof ev !== 'object') return;
    if (ev.type === 'keyboardEvent' && ev.pressed === true && typeof ev.key === 'string') {
      const key = ev.key;

      if (nextColKeys.includes(key)) {
        colIndex++;
        while (cells.length <= colIndex) {
          cells.push('');
        }
        justNavigated = true;
      } else if (key === 'Key.left') {
        if (colIndex > 0) colIndex--;
        justNavigated = true;
      } else if (ignoreKeys.includes(key)) {
        justNavigated = true;
      } else if (key === 'Key.backspace') {
        if (justNavigated) {
          cells[colIndex] = '';
          justNavigated = false;
        } else {
          cells[colIndex] = (cells[colIndex] || '').slice(0, -1);
        }
      } else {
        let ch = null;
        if (keyMap[key] !== undefined) {
          ch = keyMap[key];
        } else if (key.startsWith('Key.') || (key.startsWith('<') && key.endsWith('>'))) {
          return;
        } else {
          const cleanKey = key.split("'").join('');
          if (cleanKey.length === 1) {
            ch = cleanKey;
          }
        }

        if (ch !== null) {
          if (justNavigated) {
            cells[colIndex] = ch;
            justNavigated = false;
          } else {
            cells[colIndex] = (cells[colIndex] || '') + ch;
          }
        }
      }
    }
  });

  while (cells.length > 1 && cells[cells.length - 1] === '') {
    cells.pop();
  }

  return cells.map(normalizeDecimal);
}

/* ================= CONSOLIDATED EXPORT VALIDATION & BUILD ================= */

async function validateBeforeExport() {
  flushPendingDraftSave();
  const total = currentParameters.length;
  if (total === 0) {
    await showModal({
      type: 'warning',
      title: 'Data Parameter Belum Termuat',
      paragraphs: ['Daftar parameter operator gagal dimuat. Pastikan koneksi internet aktif lalu muat ulang halaman.'],
      actions: [{ label: 'Tutup', value: true, className: 'btn btn-secondary' }],
      dismissValue: true
    });
    return false;
  }
  let filledCount = 0;
  let lastFilledIdx = -1;
  const emptyParams = [];
  const invalidParams = [];

  currentParameters.forEach((p, idx) => {
    const val = (currentValues[p.id] || '').toString().trim();
    if (val !== '') {
      filledCount++;
      lastFilledIdx = idx;
      if (!isCellValueValid(val, p)) {
        invalidParams.push({ idx, item: p, val });
      }
    } else {
      emptyParams.push({ idx, item: p });
    }
  });

  if (filledCount === 0) {
    await showModal({
      type: 'warning',
      title: 'Belum Ada Data Diisi',
      paragraphs: ['Isi minimal 1 parameter terlebih dahulu sebelum melakukan Export atau Share.'],
      actions: [{ label: 'Isi Sekarang', value: true, className: 'btn btn-primary' }],
      dismissValue: true
    });
    jumpToNextEmpty();
    return false;
  }

  const issues = [];
  let firstFixIdx = null;

  if (invalidParams.length > 0) {
    firstFixIdx = invalidParams[0].idx;
    const preview = invalidParams.slice(0, 4).map(x => `#${x.item.index} ${x.item.tag} ("${x.val}")`).join(', ');
    const more = invalidParams.length > 4 ? ` (+${invalidParams.length - 4} lainnya)` : '';
    issues.push(`Format angka/pilihan belum lengkap pada ${invalidParams.length} parameter: ${preview}${more}.`);
  }

  const gapsBeforeLast = emptyParams.filter(e => e.idx < lastFilledIdx);
  if (gapsBeforeLast.length > 0) {
    if (firstFixIdx === null) firstFixIdx = gapsBeforeLast[0].idx;
    const preview = gapsBeforeLast.slice(0, 4).map(e => `#${e.item.index} ${e.item.tag}`).join(', ');
    const more = gapsBeforeLast.length > 4 ? ` (+${gapsBeforeLast.length - 4} lainnya)` : '';
    issues.push(`Ada ${gapsBeforeLast.length} sel kosong di TENGAH urutan (${preview}${more}). Sel kosong tetap mengirim Key.right dan berisiko menggeser kolom di DILOC.`);
  }

  if (emptyParams.length > 0 && gapsBeforeLast.length < emptyParams.length) {
    const trailingCount = emptyParams.length - gapsBeforeLast.length;
    const firstTrailing = emptyParams.find(e => e.idx > lastFilledIdx);
    if (firstFixIdx === null && firstTrailing) firstFixIdx = firstTrailing.idx;
    const startLabel = firstTrailing ? `, mulai #${firstTrailing.item.index} ${firstTrailing.item.tag}` : '';
    issues.push(`Baru terisi ${filledCount} dari ${total} cell (${trailingCount} sel terakhir belum diisi${startLabel}).`);
  }

  if (issues.length > 0) {
    const choice = await showModal({
      type: gapsBeforeLast.length > 0 || invalidParams.length > 0 ? 'danger' : 'warning',
      title: 'Periksa Sebelum Export / Share',
      paragraphs: ['Ditemukan beberapa catatan pada data logsheet:'],
      bullets: issues,
      bulletStyle: 'warning',
      actions: [
        { label: 'Periksa Sel', icon: 'search', value: 'fix', className: 'btn btn-primary' },
        { label: 'Tetap Lanjut', value: 'proceed', className: 'btn btn-ghost' }
      ],
      dismissValue: 'fix'
    });

    if (choice !== 'proceed') {
      clearSearch();
      if (firstFixIdx !== null) {
        focusInput(firstFixIdx);
      } else {
        jumpToNextEmpty();
      }
      return false;
    }
  }

  return true;
}

function getActivePlaybackTiming() {
  const superFastEl = document.getElementById('superFastMode');
  const isSuperFast = superFastEl ? superFastEl.checked : true;

  if (isSuperFast) {
    return {
      charDelay: 0.005,
      navDelay: 0.005,
      pressDuration: 0.002
    };
  }

  if (importedTimingProfile) {
    return {
      charDelay: importedTimingProfile.charDelay,
      navDelay: importedTimingProfile.navDelay,
      pressDuration: importedTimingProfile.pressDuration
    };
  }

  return {
    charDelay: 0.03,
    navDelay: 0.03,
    pressDuration: 0.015
  };
}

function buildExportArtifact() {
  const formatSelect = document.getElementById('exportFormat');
  const format = formatSelect ? formatSelect.value : 'pmr';
  const dateTag = getLocalDateTag();
  const timing = getActivePlaybackTiming();

  let lastFilledIdx = -1;
  currentParameters.forEach((p, idx) => {
    const val = (currentValues[p.id] || '').toString().trim();
    if (val !== '') lastFilledIdx = idx;
  });

  const events = [];

  for (let idx = 0; idx <= lastFilledIdx; idx++) {
    const p = currentParameters[idx];
    const val = (currentValues[p.id] || '').toString().trim();

    for (const char of val) {
      events.push({ type: 'keyboardEvent', key: char, pressed: true, timestamp: timing.charDelay });
      events.push({ type: 'keyboardEvent', key: char, pressed: false, timestamp: timing.pressDuration });
    }

    if (idx < lastFilledIdx) {
      events.push({ type: 'keyboardEvent', key: 'Key.right', pressed: true, timestamp: timing.navDelay });
      events.push({ type: 'keyboardEvent', key: 'Key.right', pressed: false, timestamp: timing.pressDuration });
    }
  }

  const superFastEl = document.getElementById('superFastMode');
  const isSuperFast = superFastEl ? superFastEl.checked : true;
  const baseSettings = (!isSuperFast && importedTimingProfile && importedTimingProfile.settings)
    ? importedTimingProfile.settings
    : {
        Playback: { Speed: 1.0, Repeat: { Times: 1, For: 0, Interval: 0, Delay: 0, Scheduled: 0, Infinite: false } },
        Minimization: { When_Playing: false, When_Recording: false },
        After_Playback: { Mode: 'Idle' }
      };

  const macroData = {
    settings: baseSettings,
    events: events
  };

  const isWebRunner = format === 'webrunner';
  const fileName = isWebRunner
    ? `WebRunner_${currentOperatorKey}_${dateTag}.json`
    : `Logsheet_${currentOperatorKey}_${dateTag}.pmr`;

  // Use application/octet-stream for .pmr so iOS Safari saves exact .pmr extension without renaming to .pmr.json
  const mimeType = isWebRunner ? 'application/json' : 'application/octet-stream';

  return {
    content: JSON.stringify(macroData, null, 2),
    fileName,
    mimeType
  };
}

async function handleExport() {
  triggerHaptic(12);
  if (!(await validateBeforeExport())) return;
  const artifact = buildExportArtifact();
  downloadBlob(artifact.content, artifact.fileName, artifact.mimeType);
}

async function handleShare() {
  triggerHaptic(12);
  if (!(await validateBeforeExport())) return;
  const artifact = buildExportArtifact();

  try {
    let shareFile = new File([artifact.content], artifact.fileName, { type: artifact.mimeType });
    if (!(navigator.canShare && navigator.canShare({ files: [shareFile] }))) {
      shareFile = new File([artifact.content], artifact.fileName, { type: 'text/plain' });
    }

    if (navigator.canShare && navigator.canShare({ files: [shareFile] })) {
      await navigator.share({
        files: [shareFile],
        title: artifact.fileName,
        text: `Logsheet DILOC ${currentOperatorKey.toUpperCase()}`
      });
      return;
    }
  } catch (err) {
    if (err && err.name === 'AbortError') return;
    console.warn('Web Share API gagal, fallback ke download:', err.message);
  }

  await showModal({
    type: 'info',
    title: 'Share File Tidak Didukung Browser',
    paragraphs: ['Perangkat/browser ini belum mendukung fitur Share File langsung. File akan diunduh otomatis ke penyimpanan perangkat.'],
    actions: [{ label: 'Unduh File', value: true, className: 'btn btn-primary' }],
    dismissValue: true
  });
  downloadBlob(artifact.content, artifact.fileName, artifact.mimeType);
}

function downloadBlob(content, fileName, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
