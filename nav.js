// ═══════════════════════════════════════════════
//  FOX ARENA — NAV MODULE
//  Hamburger mobile, état actif automatique,
//  overlay menu, fermeture au clic extérieur
// ═══════════════════════════════════════════════

(function() {
  // ── Détection page active ──────────────────
  function getActivePage() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    if (path === '' || path === 'index.html') return 'index';
    if (path.startsWith('game'))        return 'game';
    if (path.startsWith('leaderboard')) return 'leaderboard';
    if (path.startsWith('about'))       return 'about';
    if (path.startsWith('admin'))       return 'admin';
    return 'index';
  }

  // ── Inject hamburger styles ───────────────
  function injectNavStyles() {
    if (document.getElementById('fa-nav-styles')) return;
    const s = document.createElement('style');
    s.id = 'fa-nav-styles';
    s.textContent = `
      /* ── HAMBURGER BUTTON ── */
      #nav-hamburger {
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
        width: 42px;
        height: 42px;
        background: rgba(255,107,26,0.1);
        border: 1px solid rgba(255,107,26,0.3);
        border-radius: 10px;
        cursor: pointer;
        padding: 0;
        transition: all 0.2s;
        flex-shrink: 0;
        z-index: 201;
      }
      #nav-hamburger:hover {
        background: rgba(255,107,26,0.2);
        border-color: rgba(255,107,26,0.6);
      }
      #nav-hamburger span {
        display: block;
        width: 20px;
        height: 2px;
        background: #FF6B1A;
        border-radius: 2px;
        transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        transform-origin: center;
      }
      #nav-hamburger.open span:nth-child(1) {
        transform: translateY(7px) rotate(45deg);
      }
      #nav-hamburger.open span:nth-child(2) {
        opacity: 0;
        transform: scaleX(0);
      }
      #nav-hamburger.open span:nth-child(3) {
        transform: translateY(-7px) rotate(-45deg);
      }

      /* ── MOBILE OVERLAY ── */
      #nav-mobile-overlay {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 150;
        background: rgba(10,5,0,0.7);
        backdrop-filter: blur(4px);
        opacity: 0;
        transition: opacity 0.25s;
        pointer-events: none;
      }
      #nav-mobile-overlay.visible {
        opacity: 1;
        pointer-events: all;
      }

      /* ── MOBILE MENU PANEL ── */
      #nav-mobile-menu {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 199;
        width: min(300px, 85vw);
        background: linear-gradient(180deg, #140900 0%, #0A0500 100%);
        border-left: 1px solid #5C3300;
        box-shadow: -20px 0 60px rgba(0,0,0,0.6);
        display: flex;
        flex-direction: column;
        padding: 0;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        overflow: hidden;
      }
      #nav-mobile-menu.open {
        transform: translateX(0);
      }

      .nav-mobile-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid #3D2200;
        background: rgba(0,0,0,0.3);
      }
      .nav-mobile-logo {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.4rem;
        color: #FF6B1A;
        text-decoration: none;
        letter-spacing: 3px;
        text-shadow: 0 0 12px rgba(255,107,26,0.5);
      }
      .nav-mobile-close {
        width: 36px;
        height: 36px;
        background: rgba(255,107,26,0.1);
        border: 1px solid rgba(255,107,26,0.3);
        border-radius: 8px;
        color: #FF6B1A;
        font-size: 1.1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        line-height: 1;
      }
      .nav-mobile-close:hover {
        background: rgba(255,107,26,0.25);
        border-color: #FF6B1A;
      }

      .nav-mobile-links {
        display: flex;
        flex-direction: column;
        padding: 16px 12px;
        gap: 6px;
        flex: 1;
        overflow-y: auto;
      }
      .nav-mobile-links a {
        display: flex;
        align-items: center;
        gap: 12px;
        color: #FFB347;
        text-decoration: none;
        font-weight: 800;
        font-size: 1rem;
        padding: 14px 18px;
        border-radius: 14px;
        transition: all 0.2s;
        border: 1px solid transparent;
        letter-spacing: 0.3px;
      }
      .nav-mobile-links a:hover {
        background: rgba(255,179,71,0.1);
        border-color: rgba(255,179,71,0.3);
        color: #FFD700;
        transform: translateX(4px);
      }
      .nav-mobile-links a.active {
        background: rgba(255,107,26,0.15);
        border-color: rgba(255,107,26,0.4);
        color: #FFD700;
      }
      .nav-mobile-links a.nav-cta-mobile {
        background: linear-gradient(135deg, #FF6B1A, #AA3300);
        border-color: rgba(255,179,71,0.5);
        color: white !important;
        margin-top: 6px;
        box-shadow: 0 0 20px rgba(255,107,26,0.3);
        justify-content: center;
        font-size: 1.05rem;
      }
      .nav-mobile-links a.nav-cta-mobile:hover {
        box-shadow: 0 0 30px rgba(255,107,26,0.5);
        transform: translateY(-2px);
      }

      .nav-mobile-footer {
        padding: 16px 20px;
        border-top: 1px solid #3D2200;
        text-align: center;
      }
      .nav-mobile-footer p {
        font-size: 0.65rem;
        color: #3D2200;
        font-weight: 700;
      }

      /* ── AUTH BUTTON in mobile menu ── */
      #nav-mobile-auth {
        padding: 0 12px 8px;
      }
      #nav-mobile-auth #auth-nav-btn {
        width: 100%;
        justify-content: center;
        border-radius: 14px;
        padding: 12px 16px;
        font-size: 0.9rem;
      }

      /* ── RESPONSIVE ── */
      @media (max-width: 768px) {
        #nav-hamburger {
          display: flex !important;
        }
        nav .nav-links {
          display: none !important;
        }
        #nav-mobile-overlay {
          display: block;
        }
      }

      /* ── ACTIVE STATE for desktop nav ── */
      nav .nav-links a.active {
        background: rgba(255,107,26,0.2) !important;
        border-color: #FF6B1A !important;
        color: #FFD700 !important;
      }
    `;
    document.head.appendChild(s);
  }

  // ── Inject hamburger button into nav ─────
  function injectHamburger() {
    const nav = document.querySelector('nav');
    if (!nav || document.getElementById('nav-hamburger')) return;

    const btn = document.createElement('button');
    btn.id = 'nav-hamburger';
    btn.setAttribute('aria-label', 'Menu');
    btn.innerHTML = '<span></span><span></span><span></span>';
    btn.onclick = toggleMobileMenu;
    nav.appendChild(btn);
  }

  // ── Inject mobile menu panel ─────────────
  function injectMobileMenu() {
    if (document.getElementById('nav-mobile-menu')) return;

    const active = getActivePage();
    const links = [
      { href: 'index.html',       icon: '🏠', label: 'Accueil',    key: 'index' },
      { href: 'game.html',        icon: '⚔️', label: 'Jouer',      key: 'game' },
      { href: 'leaderboard.html', icon: '🏆', label: 'Classement', key: 'leaderboard' },
      { href: 'about.html',       icon: 'ℹ️', label: 'À propos',   key: 'about' },
    ];

    const overlay = document.createElement('div');
    overlay.id = 'nav-mobile-overlay';
    overlay.onclick = closeMobileMenu;
    document.body.appendChild(overlay);

    const menu = document.createElement('div');
    menu.id = 'nav-mobile-menu';
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-modal', 'true');
    menu.setAttribute('aria-label', 'Menu navigation');

    menu.innerHTML = `
      <div class="nav-mobile-header">
        <a class="nav-mobile-logo" href="index.html">🦊 FOX ARENA</a>
        <button class="nav-mobile-close" onclick="closeMobileMenu()" aria-label="Fermer le menu">✕</button>
      </div>
      <div class="nav-mobile-links" id="nav-mobile-links">
        ${links.map(l => `
          <a href="${l.href}" class="${l.key === active ? 'active' : ''}">
            <span>${l.icon}</span>
            <span>${l.label}</span>
          </a>
        `).join('')}
        <a href="game.html" class="nav-cta-mobile">⚔️ Jouer maintenant</a>
      </div>
      <div id="nav-mobile-auth"></div>
      <div class="nav-mobile-footer">
        <p>© 2025 Fox Arena 🌲</p>
      </div>
    `;
    document.body.appendChild(menu);
  }

  // ── Toggle / close ────────────────────────
  window.toggleMobileMenu = function() {
    const menu    = document.getElementById('nav-mobile-menu');
    const overlay = document.getElementById('nav-mobile-overlay');
    const btn     = document.getElementById('nav-hamburger');
    if (!menu) return;
    const isOpen = menu.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      menu.classList.add('open');
      overlay.classList.add('visible');
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      // Move auth button into mobile menu
      syncAuthToMobile();
    }
  };

  window.closeMobileMenu = function() {
    const menu    = document.getElementById('nav-mobile-menu');
    const overlay = document.getElementById('nav-mobile-overlay');
    const btn     = document.getElementById('nav-hamburger');
    if (!menu) return;
    menu.classList.remove('open');
    overlay.classList.remove('visible');
    if (btn) { btn.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    document.body.style.overflow = '';
  };

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  // ── Sync auth button to mobile panel ─────
  function syncAuthToMobile() {
    const mobileAuth = document.getElementById('nav-mobile-auth');
    const authBtn    = document.getElementById('auth-nav-btn');
    if (!mobileAuth || !authBtn) return;
    // Clone auth button into mobile panel
    const clone = authBtn.cloneNode(true);
    clone.id = 'auth-nav-btn-mobile';
    clone.onclick = () => {
      closeMobileMenu();
      setTimeout(() => openAuthModal(), 200);
    };
    mobileAuth.innerHTML = '';
    mobileAuth.appendChild(clone);
  }

  // ── Set active state on desktop nav links ─
  function setActiveNavLinks() {
    const active = getActivePage();
    document.querySelectorAll('nav .nav-links a').forEach(a => {
      const href = a.getAttribute('href') || '';
      const key = href.replace('.html','').replace('index','') || 'index';
      const isActive = (active === 'index' && (key === '' || key === 'index' || href === 'index.html'))
        || (active !== 'index' && href.startsWith(active));
      // Don't mark nav-cta (play button) as active unless explicitly game page
      const isCta = a.classList.contains('nav-cta');
      if (isCta) return;
      if (isActive) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  // ── Init ──────────────────────────────────
  function init() {
    injectNavStyles();
    injectHamburger();
    injectMobileMenu();
    setActiveNavLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
