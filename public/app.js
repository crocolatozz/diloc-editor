const APP_VERSION = '1.12.3';
const MASTER_SCHEMA_VERSION = '1.12.2';
const VERSION_STORAGE_KEY = 'pmr_editor_installed_version';
const POST_UPDATE_TOAST_KEY = 'pmr_editor_post_update_reload';
const STORAGE_PREFIX = 'pmr_editor_draft_v1_';
const FIRESTORE_PROJECT_ID = 'urea1b-project-database';
const FIRESTORE_MASTER_COLLECTION = 'diloc_master_parameter';
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/${FIRESTORE_MASTER_COLLECTION}`;
const MASTER_CACHE_PREFIX = 'diloc_master_cache_v1_';
const MASTER_SYNC_META_KEY = 'diloc_master_sync_meta_v1';
const EXPECTED_OPERATOR_COUNTS = {
  operator1: 167,
  operator2: 51,
  operator3: 45
};
const UPDATE_HIGHLIGHTS = [
  'Penyeragaman seluruh stempel waktu (draft tersimpan & sinkronisasi Database Master) ke format waktu lokal 24-jam DD/MM/YY HH:mm yang aman dari Invalid Date',
  'Penambahan skrip npm run lint berbasis node --check di package.json serta pemeriksaan sintaks otomatis sebelum build di workflow GitHub Actions',
  'Pembaruan versi ke v1.12.3 serta penyegaran cache PWA (diloc-editor-v1.12.3)'
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
  chevronDown: '<polyline points="6 9 12 15 18 9"/>',
  fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
  cloudUpload: '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/>',
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
let currentChecked = {};
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
let bgUpdateToastShown = false;
let pendingRemoteVersion = null;
let lastRemoteCheckAt = 0;
let isReloadScheduled = false;
let activeToastTimer = null;
let activeToastRemoveTimer = null;
let activeToastEl = null;
let searchNoMatchToastTimer = null;
let lastSearchNoMatchQuery = '';
let masterSyncStatus = 'local'; // 'local' | 'synced'
let isPushingMaster = false;
let activeModalSyncUpdater = null;

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
  document.body.classList.remove('page-leaving');
  const defaultOp = document.getElementById('selectOperator').value || 'operator1';
  setupNativeTouchGuards();
  setupModalEvents();
  setupScrollTopButton();
  updateOnlineStatusUI();
  updateLayoutContainerVisibility();
  loadParameter(defaultOp);
  autoPullMasterFromFirestore();
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

window.addEventListener('online', () => {
  updateOnlineStatusUI();
  autoPullMasterFromFirestore();
});
window.addEventListener('offline', updateOnlineStatusUI);

function updateOnlineStatusUI() {
  const offlineBadge = document.getElementById('offlineBadge');
  if (!offlineBadge) return;
  offlineBadge.style.display = navigator.onLine ? 'none' : 'inline-block';
}

window.addEventListener('resize', () => {
  const preferred = window.innerWidth < 768 ? 'vertical' : 'horizontal';
  if (preferred !== currentViewMode) {
    currentViewMode = preferred;
    updateLayoutContainerVisibility();
    renderActiveTable();
    filterParameters();
  }
});

/* ================= TOAST NOTIFICATION & ANTI-FLICKER TRANSITIONS ================= */

function dismissActiveToast(immediate = false) {
  if (activeToastTimer) {
    clearTimeout(activeToastTimer);
    activeToastTimer = null;
  }
  if (activeToastRemoveTimer) {
    clearTimeout(activeToastRemoveTimer);
    activeToastRemoveTimer = null;
  }
  if (!activeToastEl) return;
  const el = activeToastEl;
  activeToastEl = null;
  if (immediate) {
    if (el.parentNode) el.parentNode.removeChild(el);
    return;
  }
  el.classList.remove('visible');
  el.classList.add('leaving');
  activeToastRemoveTimer = setTimeout(() => {
    activeToastRemoveTimer = null;
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 240);
}

function showToast(message, variant = 'success', duration = 3400) {
  const region = document.getElementById('appToastRegion');
  if (!region || !message) return;

  // Smart replace: remove any active toast immediately so table is never stacked over
  dismissActiveToast(true);

  const safeVariant = ['success', 'info', 'warning', 'error'].includes(variant) ? variant : 'success';
  const iconName = safeVariant === 'success'
    ? 'checkCircle'
    : (safeVariant === 'info' ? 'loader' : (safeVariant === 'warning' ? 'alertTriangle' : 'alertOctagon'));

  const toast = document.createElement('div');
  toast.className = `app-toast ${safeVariant}`;
  toast.setAttribute('role', safeVariant === 'error' ? 'alert' : 'status');
  toast.title = 'Ketuk untuk menutup notifikasi';

  const iconBox = document.createElement('span');
  iconBox.className = 'app-toast-icon';
  iconBox.setAttribute('aria-hidden', 'true');
  iconBox.appendChild(createSvgIcon(iconName, 16, safeVariant === 'info' ? 'svg-spin' : ''));

  const msgSpan = document.createElement('span');
  msgSpan.className = 'app-toast-msg';
  msgSpan.textContent = message;

  toast.appendChild(iconBox);
  toast.appendChild(msgSpan);
  toast.addEventListener('click', () => {
    triggerHaptic(8);
    dismissActiveToast(false);
  });

  region.appendChild(toast);
  activeToastEl = toast;

  requestAnimationFrame(() => {
    if (activeToastEl === toast) {
      toast.classList.add('visible');
    }
  });

  if (duration > 0) {
    activeToastTimer = setTimeout(() => {
      if (activeToastEl === toast) {
        dismissActiveToast(false);
      }
    }, duration);
  }
}

function setupScrollTopButton() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;
  const syncScrollBtn = () => {
    const show = window.scrollY > 320;
    btn.classList.toggle('visible', show);
  };
  window.addEventListener('scroll', syncScrollBtn, { passive: true });
  syncScrollBtn();
}

function scrollToTopSmooth() {
  triggerHaptic(10);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function fadeOutAndReload() {
  if (isReloadScheduled) return;
  isReloadScheduled = true;
  try {
    sessionStorage.setItem(POST_UPDATE_TOAST_KEY, '1');
  } catch (_) {}
  document.body.classList.add('page-leaving');
  setTimeout(() => {
    window.location.reload();
  }, 240);
}

window.addEventListener('pageshow', (e) => {
  isReloadScheduled = false;
  document.body.classList.remove('page-leaving');
  const appContainer = document.querySelector('.app-container');
  if (appContainer) {
    appContainer.style.removeProperty('opacity');
    if (e && e.persisted) {
      appContainer.style.animation = 'none';
    }
  }
});

/* ================= PWA FORCE UPDATE, VERSION CHECK & ACCORDION ================= */

function compareSemver(verA, verB) {
  const parse = (v) => String(v || '0.0.0')
    .replace(/^v/i, '')
    .split('.')
    .slice(0, 3)
    .map((n) => {
      const num = parseInt(n, 10);
      return Number.isFinite(num) ? num : 0;
    });
  const a = parse(verA);
  const b = parse(verB);
  for (let i = 0; i < 3; i++) {
    const diff = (a[i] || 0) - (b[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

function setVersionNotifDot(visible, remoteVer = '') {
  const dot = document.getElementById('versionNotifDot');
  const btn = document.getElementById('versionBadgeBtn');
  if (dot) dot.classList.toggle('visible', Boolean(visible));
  if (btn) {
    btn.setAttribute(
      'aria-label',
      visible && remoteVer
        ? `Versi ${APP_VERSION} — Pembaruan v${remoteVer} tersedia`
        : `Versi ${APP_VERSION} — Cek pembaruan aplikasi`
    );
    btn.title = visible && remoteVer
      ? `Pembaruan v${remoteVer} tersedia — klik untuk perbarui`
      : 'Cek versi & pembaruan aplikasi';
  }
}

async function fetchRemoteVersionInfo(timeoutMs = 4500) {
  if (!navigator.onLine) return null;
  if (location.protocol !== 'http:' && location.protocol !== 'https:') return null;
  try {
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
    const res = await fetch('./version.json', {
      cache: 'no-store',
      signal: controller ? controller.signal : undefined
    });
    if (timer) clearTimeout(timer);
    if (!res || !res.ok) return null;
    const data = await res.json();
    const ver = data && typeof data.version === 'string' ? data.version.replace(/^v/i, '').trim() : '';
    return /^\d+\.\d+\.\d+$/.test(ver) ? ver : null;
  } catch (_) {
    return null;
  }
}

async function checkBackgroundRemoteUpdate(force = false) {
  if (!navigator.onLine) return;
  const now = Date.now();
  if (!force && now - lastRemoteCheckAt < 15000) return;
  lastRemoteCheckAt = now;

  const remoteVer = await fetchRemoteVersionInfo(4500);
  if (!remoteVer) return;

  if (compareSemver(remoteVer, APP_VERSION) > 0) {
    pendingRemoteVersion = remoteVer;
    setVersionNotifDot(true, remoteVer);
    if (!bgUpdateToastShown) {
      bgUpdateToastShown = true;
      showToast(`Pembaruan v${remoteVer} tersedia. Ketuk pil versi untuk update.`, 'warning', 4500);
    }
    if (!bgUpdatePromptShown && !activeModalResolver) {
      showAppUpdateCard({ oldVer: APP_VERSION, newVer: remoteVer, isBackgroundUpdate: true });
    }
  }
}

function initPwaForceUpdate() {
  let justReloadedAfterUpdate = false;
  try {
    if (sessionStorage.getItem(POST_UPDATE_TOAST_KEY) === '1') {
      sessionStorage.removeItem(POST_UPDATE_TOAST_KEY);
      justReloadedAfterUpdate = true;
    }
  } catch (_) {}

  const prevVersion = localStorage.getItem(VERSION_STORAGE_KEY);
  if (prevVersion && prevVersion !== APP_VERSION) {
    ['operator1', 'operator2', 'operator3'].forEach((opKey) => {
      try {
        localStorage.removeItem(getMasterCacheKey(opKey));
      } catch (_) {}
    });
  }
  localStorage.setItem(VERSION_STORAGE_KEY, APP_VERSION);

  if (justReloadedAfterUpdate || (prevVersion && prevVersion !== APP_VERSION)) {
    setTimeout(() => {
      showToast(`Aplikasi berhasil diperbarui ke v${APP_VERSION}`, 'success', 4000);
    }, 180);
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
        checkBackgroundRemoteUpdate(false);
      };

      const notifyBackgroundSwReady = () => {
        setVersionNotifDot(true, pendingRemoteVersion || '');
        if (!bgUpdateToastShown) {
          bgUpdateToastShown = true;
          showToast('Pembaruan aplikasi siap diterapkan. Ketuk pil versi untuk reload.', 'warning', 4500);
        }
        if (!manualUpdateState && !activeModalResolver) {
          showAppUpdateCard({ oldVer: APP_VERSION, newVer: pendingRemoteVersion || null, isBackgroundUpdate: true });
        }
      };

      if (reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        if (!manualUpdateState) {
          notifyBackgroundSwReady();
        }
      }

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            newWorker.postMessage({ type: 'SKIP_WAITING' });
            if (!manualUpdateState) {
              notifyBackgroundSwReady();
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
        notifyBackgroundSwReady();
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

  const targetVerLabel = newVer ? `v${newVer}` : 'Terbaru';
  const title = isBackgroundUpdate
    ? `Update ${targetVerLabel} Tersedia`
    : `Update Tersedia (v${newVer})`;
  const intro = isBackgroundUpdate
    ? `Versi baru DILOC Editor${newVer ? ` (v${newVer})` : ''} sudah tersedia. Muat ulang sekarang agar tampilan & fitur terbaru langsung aktif.`
    : `Versi baru DILOC Editor siap digunakan${oldVer && oldVer !== newVer ? ` (pembaruan dari v${oldVer})` : ''}. Muat ulang sekarang agar tampilan & fitur terbaru langsung aktif.`;

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
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    fadeOutAndReload();
  }
}

function parseAllChangelogSections(markdownText) {
  if (!markdownText || typeof markdownText !== 'string') return [];
  const headingRegex = /^##\s+\[?v?(\d+\.\d+\.\d+)\]?(.*)$/gm;
  const matches = [...markdownText.matchAll(headingRegex)];
  if (matches.length === 0) return [];

  const sections = [];
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const version = match[1];
    const rawMeta = (match[2] || '').replace(/^[\s—-]+/, '').trim();
    const startIdx = match.index + match[0].length;
    const endIdx = i + 1 < matches.length ? matches[i + 1].index : markdownText.length;
    const blockBody = markdownText.slice(startIdx, endIdx);

    const bullets = [];
    const lines = blockBody.split(/\r?\n/);
    for (const rawLine of lines) {
      const trimmed = rawLine.trim();
      if (trimmed === '---') break;
      if (/^-\s+/.test(trimmed)) {
        const cleaned = trimmed
          .replace(/^-\s+/, '')
          .replace(/\*\*([^*]+)\*\*/g, '$1')
          .replace(/`([^`]+)`/g, '$1')
          .trim();
        if (cleaned) bullets.push(cleaned);
      }
    }

    if (bullets.length > 0) {
      sections.push({
        version,
        meta: rawMeta,
        bullets
      });
    }
  }
  return sections;
}

async function fetchAllChangelogSections() {
  const fallback = [{
    version: APP_VERSION,
    meta: 'Rilis Terkini',
    bullets: UPDATE_HIGHLIGHTS
  }];
  try {
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const abortTimer = controller ? setTimeout(() => controller.abort(), 4000) : null;
    const res = await fetch('./CHANGELOG.md', {
      cache: 'no-store',
      signal: controller ? controller.signal : undefined
    });
    if (abortTimer) clearTimeout(abortTimer);
    if (!res || !res.ok) return fallback;
    const text = await res.text();
    const parsed = parseAllChangelogSections(text);
    return parsed.length > 0 ? parsed : fallback;
  } catch (_) {
    return fallback;
  }
}

function renderChangelogAccordion(containerEl, sections) {
  if (!containerEl) return;
  containerEl.innerHTML = '';

  const list = document.createElement('div');
  list.className = 'changelog-acc-list';

  sections.forEach((sec, idx) => {
    const isFirst = idx === 0;
    const item = document.createElement('div');
    item.className = isFirst ? 'changelog-acc-item open' : 'changelog-acc-item';

    const headerBtn = document.createElement('button');
    headerBtn.type = 'button';
    headerBtn.className = 'changelog-acc-header';
    headerBtn.setAttribute('aria-expanded', isFirst ? 'true' : 'false');

    const titleWrap = document.createElement('span');
    titleWrap.className = 'changelog-acc-title-wrap';

    const verPill = document.createElement('span');
    verPill.className = 'changelog-acc-ver';
    verPill.textContent = `v${sec.version}`;
    titleWrap.appendChild(verPill);

    if (sec.meta) {
      const metaSpan = document.createElement('span');
      metaSpan.className = 'changelog-acc-meta';
      metaSpan.textContent = sec.meta;
      titleWrap.appendChild(metaSpan);
    }

    const chevron = createSvgIcon('chevronDown', 16, 'changelog-acc-chevron');
    headerBtn.appendChild(titleWrap);
    headerBtn.appendChild(chevron);

    const panel = document.createElement('div');
    panel.className = 'changelog-acc-panel';

    const inner = document.createElement('div');
    inner.className = 'changelog-acc-inner';

    const ul = document.createElement('ul');
    ul.className = 'changelog-acc-bullets';
    sec.bullets.forEach((bText) => {
      const li = document.createElement('li');
      const bulletIconBox = document.createElement('span');
      bulletIconBox.className = 'modal-bullet-icon success';
      bulletIconBox.setAttribute('aria-hidden', 'true');
      bulletIconBox.appendChild(createSvgIcon('check', 12));

      const bulletTextSpan = document.createElement('span');
      bulletTextSpan.className = 'modal-bullet-text';
      bulletTextSpan.textContent = bText;

      li.appendChild(bulletIconBox);
      li.appendChild(bulletTextSpan);
      ul.appendChild(li);
    });

    inner.appendChild(ul);
    panel.appendChild(inner);

    headerBtn.addEventListener('click', () => {
      triggerHaptic(6);
      const nextOpen = !item.classList.contains('open');
      item.classList.toggle('open', nextOpen);
      headerBtn.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
    });

    item.appendChild(headerBtn);
    item.appendChild(panel);
    list.appendChild(item);
  });

  containerEl.appendChild(list);
}

/* ================= FIRESTORE REST API MASTER SYNC ================= */

function getMasterCacheKey(operatorKey) {
  return `${MASTER_CACHE_PREFIX}${operatorKey}`;
}

function normalizeMasterParameters(rawList) {
  if (!Array.isArray(rawList) || rawList.length === 0) return null;
  return rawList.map((item, i) => {
    const tag = (item && item.tag !== null && item.tag !== undefined) ? String(item.tag) : '';
    const equipment = (item && item.equipment !== null && item.equipment !== undefined) ? String(item.equipment) : '';
    const unit = (item && item.unit !== null && item.unit !== undefined) ? String(item.unit) : '';
    const rawType = String((item && item.type) || 'number').trim().toLowerCase();
    const type = rawType === 'text' ? 'text' : 'number';
    return {
      id: `p${i + 1}`,
      index: i + 1,
      equipment,
      tag,
      unit,
      label: equipment ? (tag ? `${equipment} (${tag})` : equipment) : tag,
      type
    };
  });
}

function parseLocalDateTimeInput(tsInput) {
  if (tsInput === null || tsInput === undefined || tsInput === '') return null;
  if (tsInput instanceof Date) {
    return isNaN(tsInput.getTime()) ? null : tsInput;
  }
  if (typeof tsInput === 'number') {
    if (!Number.isFinite(tsInput) || tsInput <= 0) return null;
    const d = new Date(tsInput);
    return isNaN(d.getTime()) ? null : d;
  }
  const str = String(tsInput).trim();
  if (!str) return null;
  if (/^\d+$/.test(str)) {
    const num = Number(str);
    if (!Number.isFinite(num) || num <= 0) return null;
    const d = new Date(num);
    return isNaN(d.getTime()) ? null : d;
  }

  // Legacy DD/MM/YY HH:mm, DD/MM/YYYY HH:mm, or DD/MM(, )HH:mm
  const legacyFull = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})[\s,]+(\d{1,2}):(\d{2})$/);
  if (legacyFull) {
    const day = parseInt(legacyFull[1], 10);
    const month = parseInt(legacyFull[2], 10);
    const rawYear = parseInt(legacyFull[3], 10);
    const year = legacyFull[3].length === 2 ? 2000 + rawYear : rawYear;
    const hour = parseInt(legacyFull[4], 10);
    const minute = parseInt(legacyFull[5], 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      const d = new Date(year, month - 1, day, hour, minute, 0, 0);
      if (d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day) {
        return d;
      }
    }
    return null;
  }

  const legacyShort = str.match(/^(\d{1,2})\/(\d{1,2})[\s,]+(\d{1,2}):(\d{2})$/);
  if (legacyShort) {
    const day = parseInt(legacyShort[1], 10);
    const month = parseInt(legacyShort[2], 10);
    const hour = parseInt(legacyShort[3], 10);
    const minute = parseInt(legacyShort[4], 10);
    const year = new Date().getFullYear();
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      const d = new Date(year, month - 1, day, hour, minute, 0, 0);
      if (d.getMonth() === month - 1 && d.getDate() === day) {
        return d;
      }
    }
    return null;
  }

  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function parseMasterSyncDate(tsInput) {
  return parseLocalDateTimeInput(tsInput);
}

function formatLocalDateTime(tsInput) {
  const dateObj = parseLocalDateTimeInput(tsInput);
  if (!dateObj) return '';
  const dd = String(dateObj.getDate()).padStart(2, '0');
  const mo = String(dateObj.getMonth() + 1).padStart(2, '0');
  const yy = String(dateObj.getFullYear() % 100).padStart(2, '0');
  const hh = String(dateObj.getHours()).padStart(2, '0');
  const mi = String(dateObj.getMinutes()).padStart(2, '0');
  return `${dd}/${mo}/${yy} ${hh}:${mi}`;
}

function formatMasterSyncTimestamp(tsInput) {
  return formatLocalDateTime(tsInput);
}

function getMasterSyncMeta() {
  try {
    const raw = localStorage.getItem(MASTER_SYNC_META_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const candidate = parsed.syncedAtMs ?? parsed.syncedAt;
    const dateObj = parseMasterSyncDate(candidate);
    if (!dateObj) return null;
    const formatted = formatMasterSyncTimestamp(dateObj);
    if (!formatted) return null;
    return {
      syncedAt: dateObj.toISOString(),
      syncedAtMs: dateObj.getTime(),
      formatted
    };
  } catch (_) {}
  return null;
}

function saveMasterSyncMeta(dateInput = new Date()) {
  try {
    const dateObj = parseMasterSyncDate(dateInput) || new Date();
    localStorage.setItem(MASTER_SYNC_META_KEY, JSON.stringify({
      syncedAt: dateObj.toISOString(),
      syncedAtMs: dateObj.getTime()
    }));
  } catch (_) {}
}

function updateOperatorOptionLabelCount(operatorKey, count) {
  if (!operatorKey || !Number.isFinite(count) || count <= 0) return;
  const opNum = parseInt(operatorKey.replace(/\D+/g, ''), 10);
  if (![1, 2, 3].includes(opNum)) return;
  OPERATOR_LABELS[operatorKey] = `Operator ${opNum} (${count} Parameter)`;
  const opSelect = document.getElementById('selectOperator');
  if (opSelect) {
    const opt = Array.from(opSelect.options).find(o => o.value === operatorKey);
    if (opt) opt.textContent = `Operator ${opNum} (${count})`;
  }
}

function getCachedFirestoreMaster(operatorKey) {
  try {
    const raw = localStorage.getItem(getMasterCacheKey(operatorKey));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const expectedCount = EXPECTED_OPERATOR_COUNTS[operatorKey];
    if (Array.isArray(parsed) && parsed.length > 0 && (!expectedCount || parsed.length === expectedCount)) {
      return normalizeMasterParameters(parsed);
    }
  } catch (_) {}
  return null;
}

function saveCachedFirestoreMaster(operatorKey, items) {
  try {
    const normalized = normalizeMasterParameters(items);
    if (!normalized || normalized.length === 0) return;
    localStorage.setItem(getMasterCacheKey(operatorKey), JSON.stringify(normalized));
  } catch (_) {}
}

function parseFirestoreMasterDoc(docJson) {
  const fields = docJson && docJson.fields;
  if (!fields || typeof fields !== 'object') return null;

  const arrayField = fields.parameters
    || fields.cells
    || fields.items
    || fields.data
    || Object.values(fields).find(v => v && v.arrayValue && Array.isArray(v.arrayValue.values));

  const rawValues = arrayField && arrayField.arrayValue && Array.isArray(arrayField.arrayValue.values)
    ? arrayField.arrayValue.values
    : null;
  if (!rawValues || rawValues.length === 0) return null;

  const normalized = [];
  rawValues.forEach((entry, idx) => {
    const f = entry && entry.mapValue && entry.mapValue.fields;
    if (!f || typeof f !== 'object') return;
    const rawIdx = Number(
      (f.index && (f.index.integerValue ?? f.index.doubleValue ?? f.index.stringValue)) ?? idx
    );
    const sortIdx = Number.isFinite(rawIdx) ? rawIdx : idx;
    const tag = String((f.tag && f.tag.stringValue) || '');
    const equipment = String((f.equipment && f.equipment.stringValue) || '');
    const unit = String((f.unit && f.unit.stringValue) || '');
    const rawType = String((f.type && f.type.stringValue) || 'number').trim().toLowerCase();
    const type = rawType === 'text' ? 'text' : 'number';
    normalized.push({ sortIdx, tag, equipment, unit, type });
  });

  if (normalized.length === 0) return null;
  normalized.sort((a, b) => a.sortIdx - b.sortIdx);

  return normalizeMasterParameters(normalized);
}

function extractFirestoreSchemaVersion(docJson) {
  const fields = docJson && docJson.fields;
  if (!fields || typeof fields !== 'object') return '';
  const svField = fields.schemaVersion;
  if (!svField || typeof svField !== 'object') return '';
  const raw = svField.stringValue ?? svField.integerValue ?? svField.doubleValue ?? '';
  const cleaned = String(raw).replace(/^v/i, '').trim();
  return /^\d+\.\d+\.\d+$/.test(cleaned) ? cleaned : '';
}

function buildFirestoreMasterPayload(opNum, params) {
  return {
    fields: {
      opLap: { integerValue: String(opNum) },
      schemaVersion: { stringValue: MASTER_SCHEMA_VERSION },
      updatedAt: { stringValue: new Date().toISOString() },
      parameters: {
        arrayValue: {
          values: params.map((p, idx) => ({
            mapValue: {
              fields: {
                index: { integerValue: String(idx) },
                tag: { stringValue: String(p.tag || '') },
                equipment: { stringValue: String(p.equipment || '') },
                type: { stringValue: isTextParameter(p) ? 'text' : 'number' },
                unit: { stringValue: (p.unit !== null && p.unit !== undefined) ? String(p.unit) : '' }
              }
            }
          }))
        }
      }
    }
  };
}

async function loadLocalMasterDataset(operatorKey) {
  try {
    const res = await fetch(`./data/${operatorKey}.json`, { cache: 'no-store' });
    if (res && res.ok) {
      const json = await res.json();
      const normalized = normalizeMasterParameters(json);
      if (normalized && normalized.length > 0) return normalized;
    }
  } catch (_) {}
  return getCachedFirestoreMaster(operatorKey);
}

function refreshMasterSyncBadgeUI() {
  if (typeof activeModalSyncUpdater === 'function') {
    activeModalSyncUpdater();
  }
}

async function autoPullMasterFromFirestore() {
  if (!navigator.onLine) return;
  if (location.protocol !== 'http:' && location.protocol !== 'https:') return;

  const opNums = [1, 2, 3];
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), 6000) : null;

  try {
    const results = await Promise.all(
      opNums.map(async (num) => {
        const res = await fetch(`${FIRESTORE_BASE_URL}/oplap_${num}`, {
          cache: 'no-store',
          signal: controller ? controller.signal : undefined
        });
        if (!res || !res.ok) return null;
        const docJson = await res.json();
        return {
          params: parseFirestoreMasterDoc(docJson),
          schemaVersion: extractFirestoreSchemaVersion(docJson)
        };
      })
    );
    if (timer) clearTimeout(timer);

    const allDocsValid = results.every((entry, idx) => {
      if (!entry || !Array.isArray(entry.params)) return false;
      const opKey = `operator${opNums[idx]}`;
      const expectedCount = EXPECTED_OPERATOR_COUNTS[opKey];
      if (entry.params.length !== expectedCount) return false;
      if (!entry.schemaVersion) return false;
      return compareSemver(entry.schemaVersion, MASTER_SCHEMA_VERSION) >= 0;
    });

    if (!allDocsValid) {
      return;
    }

    opNums.forEach((num, idx) => {
      const opKey = `operator${num}`;
      const list = results[idx].params;
      saveCachedFirestoreMaster(opKey, list);
      updateOperatorOptionLabelCount(opKey, list.length);
    });

    saveMasterSyncMeta(new Date());
    masterSyncStatus = 'synced';
    refreshMasterSyncBadgeUI();

    const activeIdx = parseInt(currentOperatorKey.replace(/\D+/g, ''), 10) - 1;
    const pulledEntry = results[activeIdx];
    const pulledActive = pulledEntry ? pulledEntry.params : null;
    if (Array.isArray(pulledActive) && pulledActive.length > 0) {
      const prevSig = JSON.stringify(currentParameters.map(p => [p.tag, p.equipment, p.type, p.unit]));
      const nextSig = JSON.stringify(pulledActive.map(p => [p.tag, p.equipment, p.type, p.unit]));
      if (prevSig !== nextSig) {
        currentParameters = pulledActive.map((item) => ({
          ...item,
          _searchText: `${item.index} ${item.equipment} ${item.tag} ${item.label}`.toLowerCase()
        }));
        renderActiveTable();
        updateFilledStats();
        filterParameters();
      }
    }
  } catch (_) {
    if (timer) clearTimeout(timer);
  }
}

async function handlePushMasterToFirestore() {
  if (isPushingMaster) return;
  triggerHaptic(10);

  if (!navigator.onLine) {
    showToast('Perangkat sedang offline. Push ke Firestore memerlukan koneksi internet.', 'warning', 3800);
    return;
  }

  const [d1, d2, d3] = await Promise.all([
    loadLocalMasterDataset('operator1'),
    loadLocalMasterDataset('operator2'),
    loadLocalMasterDataset('operator3')
  ]);

  const datasetsValid = Array.isArray(d1) && d1.length === EXPECTED_OPERATOR_COUNTS.operator1
    && Array.isArray(d2) && d2.length === EXPECTED_OPERATOR_COUNTS.operator2
    && Array.isArray(d3) && d3.length === EXPECTED_OPERATOR_COUNTS.operator3
    && [d1, d2, d3].every((list) =>
      list.every((item) => item && typeof item === 'object'
        && typeof item.tag === 'string'
        && typeof item.equipment === 'string'
        && typeof item.unit === 'string'
        && (item.type === 'number' || item.type === 'text'))
    );

  if (!datasetsValid) {
    showToast('Data master parameter lokal tidak lengkap atau belum termuat.', 'error', 4200);
    return;
  }

  const confirmed = await showModal({
    type: 'warning',
    title: 'Push Database Master ke Firestore?',
    paragraphs: [
      `Data master parameter lokal Op 1 (${d1.length}), Op 2 (${d2.length}), dan Op 3 (${d3.length}) akan dikirim ke Firestore collection "${FIRESTORE_MASTER_COLLECTION}" (${FIRESTORE_PROJECT_ID}).`
    ],
    actions: [
      { label: 'Ya, Push Sekarang', icon: 'cloudUpload', value: true, className: 'btn btn-primary' },
      { label: 'Batal', icon: 'x', value: false, className: 'btn btn-ghost' }
    ],
    dismissValue: false
  });

  if (!confirmed) {
    openVersionCheckModal();
    return;
  }

  isPushingMaster = true;
  openVersionCheckModal();
  refreshMasterSyncBadgeUI();
  showToast('Mengirim master parameter ke cloud...', 'info', 0);

  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), 15000) : null;

  try {
    const entries = [
      { opNum: 1, key: 'operator1', data: d1 },
      { opNum: 2, key: 'operator2', data: d2 },
      { opNum: 3, key: 'operator3', data: d3 }
    ];

    for (const entry of entries) {
      const payload = buildFirestoreMasterPayload(entry.opNum, entry.data);
      const res = await fetch(`${FIRESTORE_BASE_URL}/oplap_${entry.opNum}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller ? controller.signal : undefined
      });
      if (!res || !res.ok) {
        const errBody = res ? await res.text().catch(() => '') : '';
        throw new Error(`HTTP ${res ? res.status : 'Network'}${errBody ? ` — ${errBody.slice(0, 90)}` : ''}`);
      }
      saveCachedFirestoreMaster(entry.key, entry.data);
    }

    if (timer) clearTimeout(timer);
    saveMasterSyncMeta(new Date());
    masterSyncStatus = 'synced';
    showToast('Master parameter berhasil di-push ke Firestore', 'success', 3800);
  } catch (err) {
    if (timer) clearTimeout(timer);
    const msg = err && err.name === 'AbortError'
      ? 'Koneksi timeout saat menghubungi Firestore.'
      : (err && err.message ? err.message : 'Kesalahan jaringan');
    showToast(`Gagal push ke Firestore: ${msg}`, 'error', 4800);
  } finally {
    isPushingMaster = false;
    refreshMasterSyncBadgeUI();
  }
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
  titleEl.textContent = 'Info Versi & Riwayat Update';

  let activeReg = swRegistration;
  if (!activeReg && 'serviceWorker' in navigator && (location.protocol === 'http:' || location.protocol === 'https:')) {
    try {
      activeReg = (await navigator.serviceWorker.getRegistration('./')) || (await navigator.serviceWorker.getRegistration());
      if (activeReg) swRegistration = activeReg;
    } catch (_) {}
  }

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

  // Database Master row with sync status on left & compact Push pill button on right
  const dbRow = document.createElement('div');
  dbRow.className = 'version-meta-row';

  const dbLeft = document.createElement('div');
  dbLeft.className = 'version-meta-sync-left';
  const dbLabel = document.createElement('span');
  dbLabel.className = 'version-meta-label';
  dbLabel.textContent = 'Database Master';
  const dbStatusPill = document.createElement('span');
  dbStatusPill.className = 'version-sync-pill amber';
  dbLeft.appendChild(dbLabel);
  dbLeft.appendChild(dbStatusPill);

  const pushBtn = document.createElement('button');
  pushBtn.type = 'button';
  pushBtn.id = 'masterPushBtn';
  pushBtn.className = 'btn-push-pill';
  pushBtn.title = 'Kirim master parameter ke Firestore';
  pushBtn.appendChild(createSvgIcon('cloudUpload', 15));
  const pushLabel = document.createElement('span');
  pushLabel.textContent = 'Push';
  pushBtn.appendChild(pushLabel);
  pushBtn.addEventListener('click', handlePushMasterToFirestore);

  dbRow.appendChild(dbLeft);
  dbRow.appendChild(pushBtn);
  metaCard.appendChild(dbRow);

  const dbSyncTimeRow = document.createElement('div');
  dbSyncTimeRow.id = 'masterSyncTimeText';
  dbSyncTimeRow.className = 'version-meta-sync-time muted';
  metaCard.appendChild(dbSyncTimeRow);

  bodyEl.appendChild(metaCard);

  const syncMasterRowUI = () => {
    if (isPushingMaster) {
      dbStatusPill.textContent = 'Mengirim...';
      dbStatusPill.className = 'version-sync-pill sky';
      pushBtn.disabled = true;
    } else if (masterSyncStatus === 'synced') {
      dbStatusPill.textContent = 'Tersinkron';
      dbStatusPill.className = 'version-sync-pill emerald';
      pushBtn.disabled = false;
    } else {
      dbStatusPill.textContent = 'Lokal';
      dbStatusPill.className = 'version-sync-pill amber';
      pushBtn.disabled = false;
    }

    const syncMeta = getMasterSyncMeta();
    const formattedTime = syncMeta ? (syncMeta.formatted || formatMasterSyncTimestamp(syncMeta.syncedAt)) : '';
    if (formattedTime) {
      dbSyncTimeRow.textContent = `Disinkronkan ${formattedTime}`;
      dbSyncTimeRow.className = 'version-meta-sync-time';
    } else {
      dbSyncTimeRow.textContent = 'Belum pernah disinkronkan ke cloud';
      dbSyncTimeRow.className = 'version-meta-sync-time muted';
    }
  };
  syncMasterRowUI();
  activeModalSyncUpdater = syncMasterRowUI;

  const sectionLabel = document.createElement('div');
  sectionLabel.className = 'version-section-label';
  sectionLabel.textContent = 'Riwayat Perubahan (Changelog)';
  bodyEl.appendChild(sectionLabel);

  const accordionContainer = document.createElement('div');
  renderChangelogAccordion(accordionContainer, [{
    version: APP_VERSION,
    meta: 'Rilis Terkini',
    bullets: UPDATE_HIGHLIGHTS
  }]);
  bodyEl.appendChild(accordionContainer);

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
  setCheckBtnState(false, pendingRemoteVersion ? `Perbarui ke v${pendingRemoteVersion}` : 'Cek & Perbarui Aplikasi');

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

  if (pendingRemoteVersion && compareSemver(pendingRemoteVersion, APP_VERSION) > 0) {
    setBanner('warning', 'alertTriangle', `Versi baru v${pendingRemoteVersion} terdeteksi di server. Tekan tombol di bawah untuk memperbarui.`);
  }

  const cleanupVersionCheck = () => {
    isDisposed = true;
    activeModalSyncUpdater = null;
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
    setVersionNotifDot(false);
    setBanner('success', 'checkCircle', 'Pembaruan diterapkan! Memuat ulang aplikasi...');
    setCheckBtnState(true, 'Memuat ulang...');
    fadeOutAndReload();
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
        showToast('Instalasi pembaruan gagal. Silakan coba lagi.', 'error');
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
        showToast('Cek pembaruan timeout (30 detik). Periksa koneksi.', 'error');
      }
    }, 30000);

    if (!navigator.onLine) {
      finishWithResult('warning', 'alertTriangle', 'Perangkat sedang offline. Aktifkan internet untuk memeriksa pembaruan.');
      showToast('Perangkat sedang offline. Cek update memerlukan internet.', 'warning');
      return;
    }

    const swSupported = 'serviceWorker' in navigator && (location.protocol === 'http:' || location.protocol === 'https:');
    if (!swSupported) {
      finishWithResult('danger', 'alertOctagon', 'Service Worker tidak tersedia di mode lokal/file://.');
      showToast('Service Worker tidak tersedia di mode lokal.', 'error');
      return;
    }

    try {
      const remotePromise = fetchRemoteVersionInfo(5000);
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
      const remoteVer = await remotePromise;
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
        if (remoteVer && compareSemver(remoteVer, APP_VERSION) > 0) {
          pendingRemoteVersion = remoteVer;
          setVersionNotifDot(true, remoteVer);
          performCleanReload();
          return;
        }
        pendingRemoteVersion = null;
        setVersionNotifDot(false);
        finishWithResult('success', 'checkCircle', `Aplikasi sudah menggunakan versi terbaru (v${APP_VERSION}).`);
        showToast(`Aplikasi sudah versi terbaru (v${APP_VERSION})`, 'success');
      }, 280);
    } catch (err) {
      if (isDisposed || !isChecking) return;
      finishWithResult('danger', 'alertOctagon', `Gagal memeriksa pembaruan: ${err && err.message ? err.message : 'kesalahan jaringan'}.`);
      showToast('Gagal memeriksa pembaruan dari server.', 'error');
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

  fetchAllChangelogSections().then((sections) => {
    if (!isDisposed && sections && sections.length > 0) {
      renderChangelogAccordion(accordionContainer, sections);
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

function getLocalDateTimeFileTag() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}_${hh}-${mi}`;
}

function getLocalDateTimeShort(dateInput = new Date()) {
  const parsed = parseLocalDateTimeInput(dateInput) || new Date();
  return formatLocalDateTime(parsed);
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

function updateDraftSavedIndicator(visible, timestampInput = null) {
  const badge = document.getElementById('draftSavedBadge');
  if (!badge) return;

  if (!visible) {
    badge.classList.remove('visible', 'pulse');
    return;
  }

  const dateObj = parseLocalDateTimeInput(timestampInput) || new Date();
  const timeStr = formatLocalDateTime(dateObj);

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

function isTextParameter(item) {
  return Boolean(item && String(item.type || '').trim().toLowerCase() === 'text');
}

function isEmptyCellValue(val) {
  if (val === null || val === undefined) return true;
  const trimmed = String(val).trim();
  return trimmed === '' || trimmed === '-';
}

function isCellValueValid(val, item) {
  if (isEmptyCellValue(val)) return true;
  const choiceOpts = getChoiceOptions(item);
  if (choiceOpts) {
    return choiceOpts.includes(val);
  }
  if (isTextParameter(item)) {
    return true;
  }
  return isValidNumericValue(val);
}

function normalizeCellValue(val, item, strictSanitize = false) {
  if (val === null || val === undefined) return '';
  if (item && getChoiceOptions(item)) {
    const normalized = normalizeDecimal(val).trim().toLowerCase();
    return normalized === '-' ? '' : normalized;
  }
  if (item && isTextParameter(item)) {
    const trimmed = String(val).trim();
    return trimmed === '-' ? '' : trimmed;
  }
  const str = normalizeDecimal(val);
  if (strictSanitize) {
    return sanitizeNumericString(str);
  }
  return str.trim();
}

function persistDraftNow() {
  try {
    const hasData = Object.values(currentValues).some(v => !isEmptyCellValue(v)) || Object.values(currentChecked).some(Boolean);
    if (!hasData && !importedTimingProfile && !currentBadgeText) {
      localStorage.removeItem(STORAGE_PREFIX + currentOperatorKey);
      updateDraftSavedIndicator(false);
      return;
    }
    const nowMs = Date.now();
    const payload = {
      values: currentValues,
      checked: currentChecked,
      badge: currentBadgeText,
      timingProfile: importedTimingProfile,
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
    if (!isEmptyCellValue(currentValues[p.id])) {
      filled++;
    }
  });

  const emptyCount = Math.max(0, total - filled);

  const badge = document.getElementById('filledCountBadge');
  if (badge) {
    badge.textContent = `Terisi: ${filled} / ${total} Cell`;
    if (total > 0 && filled === total) {
      badge.classList.add('complete');
    } else {
      badge.classList.remove('complete');
    }
  }

  const nextEmptyTextEl = document.getElementById('nextEmptyBtnText');
  if (nextEmptyTextEl) {
    nextEmptyTextEl.textContent = total > 0 ? `Sel Kosong (${emptyCount})` : 'Sel Kosong';
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

  const hCont = document.getElementById('excelScrollContainer');
  const vCont = document.getElementById('verticalScrollContainer');
  if (hCont) hCont.classList.add('table-fade-switching');
  if (vCont) vCont.classList.add('table-fade-switching');

  try {
    let loadedParams = getCachedFirestoreMaster(operatorKey);
    if (!loadedParams) {
      const response = await fetch(`./data/${operatorKey}.json`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const rawJson = await response.json();
      loadedParams = normalizeMasterParameters(rawJson) || [];
    }
    if (reqId !== loadRequestId) return;
    updateOperatorOptionLabelCount(operatorKey, loadedParams.length);
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
  currentChecked = {};
  importedTimingProfile = null;

  const draft = loadDraftFromStorage(operatorKey);
  if (draft) {
    currentParameters.forEach(p => {
      if (draft.values[p.id] !== undefined) {
        currentValues[p.id] = normalizeCellValue(draft.values[p.id], p, false);
      }
      if (draft.checked && typeof draft.checked === 'object' && draft.checked[p.id] !== undefined) {
        currentChecked[p.id] = Boolean(draft.checked[p.id]);
      }
    });
    if (draft.timingProfile) {
      importedTimingProfile = draft.timingProfile;
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
  requestAnimationFrame(() => {
    if (hCont) hCont.classList.remove('table-fade-switching');
    if (vCont) vCont.classList.remove('table-fade-switching');
  });
}

function createCellControl(item, idx) {
  const choiceOpts = getChoiceOptions(item);
  const rawStoredVal = currentValues[item.id] !== undefined ? currentValues[item.id] : '';
  const currentVal = choiceOpts
    ? (isEmptyCellValue(rawStoredVal) ? '' : normalizeCellValue(rawStoredVal, item, false))
    : rawStoredVal;

  if (choiceOpts) {
    const select = document.createElement('select');
    select.className = 'excel-input';
    select.id = `input_${item.id}`;
    select.name = item.id;
    select.setAttribute('data-index', idx);
    select.setAttribute('enterkeyhint', 'next');

    const emptyOpt = document.createElement('option');
    emptyOpt.value = '';
    emptyOpt.textContent = '-';
    select.appendChild(emptyOpt);

    choiceOpts.forEach(optVal => {
      const opt = document.createElement('option');
      opt.value = optVal;
      opt.textContent = optVal.toUpperCase();
      select.appendChild(opt);
    });

    if (!isEmptyCellValue(currentVal) && !choiceOpts.includes(currentVal)) {
      const customOpt = document.createElement('option');
      customOpt.value = currentVal;
      customOpt.textContent = `${currentVal} (!)`;
      select.appendChild(customOpt);
      select.classList.add('cell-warning');
    }

    select.value = currentVal;
    if (isEmptyCellValue(currentVal)) select.classList.add('cell-empty');

    select.addEventListener('change', () => {
      const val = normalizeCellValue(select.value, item, false);
      currentValues[item.id] = val;
      currentChecked[item.id] = false;
      select.classList.toggle('cell-empty', isEmptyCellValue(val));
      select.classList.toggle('cell-warning', !isEmptyCellValue(val) && !choiceOpts.includes(val));
      updateFilledStats();
      saveDraftToStorage();
    });

    select.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        if (currentViewMode === 'vertical') {
          focusNextVisibleInput(idx, 1);
        } else {
          focusInput(idx + 1);
        }
      }
    });

    return select;
  }

  const isFreeText = isTextParameter(item);
  const input = document.createElement('input');
  input.type = 'text';
  input.inputMode = isFreeText ? 'text' : 'decimal';
  input.enterKeyHint = 'next';
  input.setAttribute('enterkeyhint', 'next');
  input.className = 'excel-input';
  input.id = `input_${item.id}`;
  input.name = item.id;
  input.setAttribute('data-index', idx);
  input.placeholder = '...';
  input.value = currentVal;

  if (isEmptyCellValue(currentVal)) {
    input.classList.add('cell-empty');
  } else if (!isFreeText && !isValidNumericValue(currentVal)) {
    input.classList.add('cell-warning');
  }

  input.addEventListener('input', () => {
    const raw = input.value;
    if (isFreeText) {
      const storedVal = raw.trim() === '-' ? '' : raw;
      currentValues[item.id] = storedVal;
      currentChecked[item.id] = false;
      input.classList.toggle('cell-empty', isEmptyCellValue(raw));
      input.classList.remove('cell-warning');
      updateFilledStats();
      saveDraftToStorage(false);
      return;
    }

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
    currentChecked[item.id] = false;
    input.classList.toggle('cell-empty', isEmptyCellValue(sanitized));
    const tempValid = sanitized === '' || sanitized === '-' || sanitized === '.' || sanitized === '-.' || /^-?(?:\d+\.?\d*|\.\d+)$/.test(sanitized);
    input.classList.toggle('cell-warning', !tempValid);
    updateFilledStats();
    saveDraftToStorage(false);
  });

  input.addEventListener('blur', () => {
    if (isFreeText) {
      const trimmed = input.value.trim();
      const normalized = trimmed === '-' ? '' : trimmed;
      if (input.value !== normalized) input.value = normalized;
      currentValues[item.id] = normalized;
      input.classList.toggle('cell-empty', isEmptyCellValue(normalized));
      input.classList.remove('cell-warning');
      updateFilledStats();
      flushPendingDraftSave();
      return;
    }
    let val = currentValues[item.id] || '';
    if (val.trim() === '-') {
      val = '';
      currentValues[item.id] = '';
      input.value = '';
      updateFilledStats();
    }
    input.classList.toggle('cell-empty', isEmptyCellValue(val));
    input.classList.toggle('cell-warning', !isEmptyCellValue(val) && !isValidNumericValue(val));
    flushPendingDraftSave();
  });

  input.addEventListener('keydown', (e) => {
    const isEnter = e.key === 'Enter' || e.keyCode === 13;
    if (currentViewMode === 'horizontal') {
      if (e.key === 'ArrowRight' || isEnter) {
        e.preventDefault();
        focusInput(idx + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        focusInput(idx - 1);
      }
    } else {
      if (isEnter || e.key === 'ArrowDown') {
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

      if (currentViewMode === 'vertical') {
        const row = document.getElementById(`vrow_${targetIdx}`) || el;
        const toolbar = document.querySelector('.quick-toolbar');
        const rect = row.getBoundingClientRect();
        if (toolbar) {
          const stickyTop = parseFloat(getComputedStyle(toolbar).top) || 0;
          const desiredViewportTop = stickyTop + toolbar.offsetHeight + 10;
          const targetScrollY = Math.max(0, window.scrollY + rect.top - desiredViewportTop);
          window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
        } else {
          row.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
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

function jumpToNextEmpty() {
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
    if (isEmptyCellValue(currentValues[p.id])) {
      focusInput(idx);
      return;
    }
  }

  showToast(`Mantap! Seluruh ${total} parameter ${OPERATOR_SHORT_NAMES[currentOperatorKey]} sudah terisi.`, 'warning');
}

function clearWorkspaceData() {
  cancelPendingDraftSave();
  currentValues = {};
  currentChecked = {};
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
  showToast('File aktif dilepas & tabel dikosongkan', 'success');
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
  showToast(`Isian ${opName} berhasil direset`, 'success');
}

function clearSearch() {
  triggerHaptic(8);
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  lastSearchNoMatchQuery = '';
  if (searchNoMatchToastTimer) {
    clearTimeout(searchNoMatchToastTimer);
    searchNoMatchToastTimer = null;
  }
  filterParameters();
}

function filterParameters() {
  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  const filterInfo = document.getElementById('filterMatchInfo');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  if (clearBtn) {
    clearBtn.style.display = query ? 'inline-flex' : 'none';
  }

  if (searchNoMatchToastTimer) {
    clearTimeout(searchNoMatchToastTimer);
    searchNoMatchToastTimer = null;
  }

  let matchCount = 0;

  if (currentViewMode === 'vertical') {
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
  } else {
    const prevHighlighted = document.querySelectorAll('#inputCellsRow .excel-input.highlight');
    prevHighlighted.forEach(input => input.classList.remove('highlight'));

    if (!query) {
      if (filterInfo) filterInfo.style.display = 'none';
      lastSearchNoMatchQuery = '';
      return;
    }

    let firstMatch = null;
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

  if (!query || matchCount > 0) {
    lastSearchNoMatchQuery = '';
  } else if (currentParameters.length > 0 && lastSearchNoMatchQuery !== query) {
    searchNoMatchToastTimer = setTimeout(() => {
      searchNoMatchToastTimer = null;
      const currentQ = searchInput ? searchInput.value.toLowerCase().trim() : '';
      if (currentQ && currentQ === query) {
        lastSearchNoMatchQuery = currentQ;
        showToast(`Tag atau parameter "${currentQ}" tidak ditemukan`, 'warning', 2800);
      }
    }, 320);
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

function getFilledCellCount() {
  let count = 0;
  Object.values(currentValues).forEach((v) => {
    if (!isEmptyCellValue(v)) count++;
  });
  return count;
}

async function importData(event) {
  const inputEl = event.target;
  const file = inputEl && inputEl.files ? inputEl.files[0] : null;
  if (!file) return;

  const existingCount = getFilledCellCount();
  if (existingCount > 0 || Boolean(currentBadgeText)) {
    const opName = OPERATOR_SHORT_NAMES[currentOperatorKey] || currentOperatorKey.toUpperCase();
    const confirmed = await showModal({
      type: 'warning',
      title: 'Timpa Draft Logsheet Aktif?',
      paragraphs: [
        `Logsheet ${opName} saat ini sudah berisi ${existingCount} sel terisi${currentBadgeText ? ` (dari "${currentBadgeText}")` : ''}. Mengimpor "${file.name}" akan menggantikan isian yang ada.`
      ],
      actions: [
        { label: 'Ya, Timpa & Import', icon: 'download', value: true, className: 'btn btn-primary' },
        { label: 'Batal', icon: 'x', value: false, className: 'btn btn-ghost' }
      ],
      dismissValue: false
    });
    if (!confirmed) {
      if (inputEl) inputEl.value = '';
      return;
    }
  }

  const reader = new FileReader();
  reader.onerror = () => {
    if (inputEl) inputEl.value = '';
    showToast('File tidak dapat dibaca oleh browser. Pastikan file tidak rusak.', 'error', 4200);
  };
  reader.onload = async (e) => {
    try {
      const content = e.target.result;
      const json = JSON.parse(content);
      const isJsonExt = Boolean(file.name && file.name.toLowerCase().endsWith('.json'));

      // Format 1: DILOC Automator Native Preset (.json)
      if (json && typeof json === 'object' && json.format === 'diloc-automator-preset') {
        if (!Array.isArray(json.cells)) {
          showToast('File JSON DILOC Automator tidak valid: daftar "cells" tidak ditemukan.', 'warning', 4500);
          return;
        }

        const fileOpLap = parseInt(json.opLap, 10);
        if ([1, 2, 3].includes(fileOpLap)) {
          const targetOpKey = `operator${fileOpLap}`;
          if (targetOpKey !== currentOperatorKey) {
            const opSelect = document.getElementById('selectOperator');
            if (opSelect) opSelect.value = targetOpKey;
            await loadParameter(targetOpKey);
            if (currentParameters.length === 0) {
              showToast(`Gagal memuat parameter ${OPERATOR_SHORT_NAMES[targetOpKey] || targetOpKey}.`, 'error', 4200);
              return;
            }
          }
        }

        const populatedCount = applyDilocAutomatorPreset(json.cells, file.name);
        showToast(`Import "${file.name}" berhasil (${populatedCount} sel terisi)`, 'success');
        await showImportResultModal(file.name, json.cells.length, populatedCount);
        return;
      }

      // Format 2: PyMacroRecord (.pmr)
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
              { label: `Tetap Isi di ${currentShort}`, icon: 'download', value: 'stay', className: 'btn btn-secondary' },
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
        showToast(`Import "${file.name}" berhasil (${populatedCount} sel terisi)`, 'success');
        await showImportResultModal(file.name, total, populatedCount);
        return;
      }

      if (isJsonExt) {
        showToast('Format JSON tidak sesuai standar DILOC Automator ("diloc-automator-preset").', 'warning', 4500);
        return;
      }

      // Format 3: Backup JSON lama (json.data)
      if (json && typeof json === 'object' && json.data && typeof json.data === 'object' && !Array.isArray(json.data)) {
        const appliedCount = applyMappedValues(
          currentParameters.map(p => {
            if (json.data[p.id] === undefined) return '';
            return json.data[p.id].value !== undefined ? json.data[p.id].value : json.data[p.id];
          }),
          file.name,
          null
        );
        showToast(`Import "${file.name}" berhasil (${appliedCount} sel terisi)`, 'success');
        await showImportResultModal(file.name, currentParameters.length, appliedCount);
        return;
      }

      // Format 4: Array JSON sederhana
      if (Array.isArray(json)) {
        const rawList = json.map(val => (typeof val === 'object' && val !== null) ? (val.value ?? val.val ?? '') : val);
        const populatedCount = applyMappedValues(rawList, file.name, null);
        showToast(`Import "${file.name}" berhasil (${populatedCount} sel terisi)`, 'success');
        await showImportResultModal(file.name, rawList.length, populatedCount);
        return;
      }

      showToast('Format file tidak dikenali. Pilih file .json DILOC Automator atau .pmr yang valid.', 'warning', 4200);
    } catch (err) {
      showToast(`File import rusak atau format salah (${err.message}).`, 'error', 4200);
    } finally {
      if (inputEl) inputEl.value = '';
    }
  };
  reader.readAsText(file);
}

function applyDilocAutomatorPreset(cells, fileName) {
  currentValues = {};
  currentChecked = {};
  importedTimingProfile = null;
  let populatedCount = 0;

  cells.forEach((cell) => {
    if (!cell || typeof cell !== 'object') return;
    const rawIdx = cell.index !== undefined ? parseInt(cell.index, 10) : -1;
    if (!Number.isInteger(rawIdx) || rawIdx < 0 || rawIdx >= currentParameters.length) return;

    const paramObj = currentParameters[rawIdx];
    const rawVal = (cell.value !== undefined && cell.value !== null) ? String(cell.value) : '';
    const cleanVal = normalizeCellValue(rawVal, paramObj, false);
    const isEmpty = isEmptyCellValue(cleanVal);
    currentValues[paramObj.id] = isEmpty ? '' : cleanVal;
    currentChecked[paramObj.id] = isEmpty ? false : Boolean(cell.checked);
    if (!isEmpty) populatedCount++;
  });

  if (fileName) setImportedFileBadge(fileName, false);
  renderActiveTable();
  updateFilledStats();
  saveDraftToStorage();
  filterParameters();
  return populatedCount;
}

function applyMappedValues(rawValues, fileName, timingProfile = null) {
  currentValues = {};
  currentChecked = {};
  importedTimingProfile = timingProfile;
  let populatedCount = 0;

  rawValues.forEach((val, idx) => {
    if (idx < currentParameters.length) {
      const paramObj = currentParameters[idx];
      const cleanVal = normalizeCellValue(val, paramObj, false);
      const isEmpty = isEmptyCellValue(cleanVal);
      currentValues[paramObj.id] = isEmpty ? '' : cleanVal;
      if (!isEmpty) populatedCount++;
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
    if (!isEmptyCellValue(val) && !isCellValueValid(val, p)) {
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
    showToast('Data parameter belum termuat. Muat ulang halaman.', 'error');
    return false;
  }
  let filledCount = 0;
  let lastFilledIdx = -1;
  const emptyParams = [];
  const invalidParams = [];

  currentParameters.forEach((p, idx) => {
    const val = (currentValues[p.id] || '').toString().trim();
    if (!isEmptyCellValue(val)) {
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
    showToast('Belum ada parameter diisi. Isi minimal 1 sel terlebih dahulu.', 'warning');
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

  const formatSelect = document.getElementById('exportFormat');
  const exportFormat = formatSelect ? formatSelect.value : 'diloc';

  const gapsBeforeLast = emptyParams.filter(e => e.idx < lastFilledIdx);
  if (gapsBeforeLast.length > 0) {
    if (firstFixIdx === null) firstFixIdx = gapsBeforeLast[0].idx;
    const preview = gapsBeforeLast.slice(0, 4).map(e => `#${e.item.index} ${e.item.tag}`).join(', ');
    const more = gapsBeforeLast.length > 4 ? ` (+${gapsBeforeLast.length - 4} lainnya)` : '';
    const gapMsg = exportFormat === 'pmr'
      ? `Ada ${gapsBeforeLast.length} sel kosong di TENGAH urutan (${preview}${more}). Sel kosong tetap mengirim Key.right dan berisiko menggeser kolom di DILOC.`
      : `Ada ${gapsBeforeLast.length} sel kosong di tengah urutan (${preview}${more}).`;
    issues.push(gapMsg);
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
      title: 'Periksa Sebelum Export',
      paragraphs: [`Masih ada ${emptyParams.length} sel kosong atau catatan validasi pada logsheet:`],
      bullets: issues,
      bulletStyle: 'warning',
      actions: [
        { label: 'Cek Sel Kosong', icon: 'search', value: 'fix', className: 'btn btn-primary' },
        { label: 'Tetap Export', value: 'proceed', className: 'btn btn-ghost' }
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
  const format = formatSelect ? formatSelect.value : 'diloc';
  const dateTimeTag = getLocalDateTimeFileTag();
  const opNumber = parseInt(currentOperatorKey.replace(/\D+/g, ''), 10) || 1;

  if (format === 'diloc') {
    const expectedCount = EXPECTED_OPERATOR_COUNTS[currentOperatorKey];
    if (expectedCount && currentParameters.length !== expectedCount) {
      throw new Error(`Jumlah parameter Op Lap ${opNumber} harus ${expectedCount} item (terbaca ${currentParameters.length})`);
    }
    const presetData = {
      format: 'diloc-automator-preset',
      version: '2.1.2',
      opLap: opNumber,
      exportedAt: new Date().toISOString(),
      cells: currentParameters.map((p, idx) => {
        const rawVal = currentValues[p.id];
        const valStr = isEmptyCellValue(rawVal) ? '' : String(rawVal).trim();
        const cellType = isTextParameter(p) ? 'text' : 'number';
        return {
          index: idx,
          tag: p.tag || '',
          equipment: p.equipment || '',
          type: cellType,
          value: valStr,
          checked: valStr === '' ? false : Boolean(currentChecked[p.id])
        };
      })
    };

    return {
      content: JSON.stringify(presetData, null, 2),
      fileName: `DILOC_OpLap${opNumber}_${dateTimeTag}.json`,
      mimeType: 'application/json'
    };
  }

  const timing = getActivePlaybackTiming();
  let lastFilledIdx = -1;
  currentParameters.forEach((p, idx) => {
    if (!isEmptyCellValue(currentValues[p.id])) lastFilledIdx = idx;
  });

  const events = [];

  for (let idx = 0; idx <= lastFilledIdx; idx++) {
    const p = currentParameters[idx];
    const val = isEmptyCellValue(currentValues[p.id]) ? '' : String(currentValues[p.id]).trim();

    for (const char of val) {
      events.push({ type: 'keyboardEvent', key: char, pressed: true, timestamp: timing.charDelay });
      events.push({ type: 'keyboardEvent', key: char, pressed: false, timestamp: timing.pressDuration });
    }

    if (idx < lastFilledIdx) {
      events.push({ type: 'keyboardEvent', key: 'Key.right', pressed: true, timestamp: timing.navDelay });
      events.push({ type: 'keyboardEvent', key: 'Key.right', pressed: false, timestamp: timing.pressDuration });
    }
  }

  const baseSettings = (importedTimingProfile && importedTimingProfile.settings)
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

  // Use application/octet-stream for .pmr so iOS Safari saves exact .pmr extension without renaming to .pmr.json
  return {
    content: JSON.stringify(macroData, null, 2),
    fileName: `DILOC_OpLap${opNumber}_${dateTimeTag}.pmr`,
    mimeType: 'application/octet-stream'
  };
}

async function handleExport() {
  triggerHaptic(12);
  if (!(await validateBeforeExport())) return;
  try {
    const artifact = buildExportArtifact();
    downloadBlob(artifact.content, artifact.fileName, artifact.mimeType);
    showToast(`Berhasil export ${artifact.fileName}`, 'success');
  } catch (err) {
    showToast(`Gagal export file: ${err && err.message ? err.message : 'kesalahan sistem'}`, 'error', 4200);
  }
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
