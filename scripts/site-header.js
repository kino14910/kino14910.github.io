class SiteHeader extends HTMLElement {
  static get observedAttributes() {
    return ['active', 'variant']
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this._navOpen = false
  }

  connectedCallback() {
    if (!this.hasAttribute('variant')) {
      this.setAttribute('variant', 'default')
    }
    this.render()
    this.setupInteractions()
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal && this.isConnected) {
      this.render()
      this.setupInteractions()
    }
  }

  get activePage() {
    return this.getAttribute('active') || ''
  }

  get variant() {
    return this.getAttribute('variant') || 'default'
  }

  render() {
    const navItems = [
      { href: 'index.html', label: '首页', id: 'index' },
      { href: 'blog.html', label: '博客', id: 'blog' },
      { href: 'server.html', label: '服务器', id: 'server' },
      { href: 'note.html', label: '笔记', id: 'note' },
      { href: 'login.html', label: '登录', id: 'login' },
    ]

    const menuList = `<ul>
                    ${navItems
                      .map(
                        item => `
                        <li><a href="${item.href}" ${this.activePage === item.id ? 'class="active"' : ''}>${item.label}</a></li>
                    `,
                      )
                      .join('')}
                </ul>`

    this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="symbols/font.css">
            <style>
                :host {
                    display: block;
                    width: 100%;
                }

                *, *::before, *::after {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                a {
                    text-decoration: none;
                }

                ul {
                    list-style: none;
                }

                /* ===== Nav link base ===== */
                .nav a {
                    color: inherit;
                    padding: 1rem 0.5rem;
                    display: block;
                    position: relative;
                    min-width: 7rem;
                    text-align: center;
                    user-select: none;
                    font-weight: 600;
                    transition: color 0.3s;
                }

                .nav a:not(.active) {
                    opacity: 0.7;
                }

                .nav a::before {
                    content: '';
                    position: absolute;
                    transition: transform 0.3s ease;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    height: 2px;
                    background: var(--pink2, #f8e2f0);
                    transform: scaleX(0);
                }

                .nav a:hover::before,
                .nav a.active::before {
                    transform: scaleX(1);
                }

                /* ===== Default variant ===== */
                :host([variant="default"]) header {
                    width: 100%;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                :host([variant="default"]) .nav {
                    display: flex;
                    justify-content: right;
                    align-items: center;
                    height: 8rem;
                    width: 100%;
                    background-color: #171d25;
                    color: white;
                    padding-right: 10rem;
                    font-size: 1.8rem;
                    line-height: 1.8;
                }

                :host([variant="default"]) .nav ul {
                    display: flex;
                    gap: 2rem;
                }

                :host([variant="default"]) .nav a.active {
                    color: var(--pink, #ffd9e6);
                    opacity: 1;
                }

                :host([variant="default"]) .nav a {
                    margin-left: 2rem;
                }

                :host([variant="default"]) .nav a:hover {
                    color: var(--blue, #b3eaff);
                }

                :host([variant="default"]) .nav a:hover::before {
                    background: var(--blue, #b3eaff);
                }

                /* ===== Index variant ===== */
                :host([variant="index"]) header {
                    width: 100%;
                    position: fixed;
                    top: 0;
                    z-index: 100;
                }

                :host([variant="index"]) .nav {
                    display: flex;
                    justify-content: end;
                    align-items: center;
                    height: 10rem;
                    width: 100%;
                    background-color: transparent;
                    padding-right: 10rem;
                    font-size: 1.8rem;
                    line-height: 1.8;
                    animation: fadeInEntry 1s ease forwards;
                }

                :host([variant="index"]) .nav ul {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 1rem;
                }

                :host([variant="index"]) .nav a {
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    color: var(--pink, #ffd9e6);
                }

                :host([variant="index"]) .nav a:hover,
                :host([variant="index"]) .nav a:active {
                    color: var(--blue, #b3eaff);
                }

                :host([variant="index"]) .nav a:hover::before {
                    background: var(--blue, #b3eaff);
                }

                :host([variant="index"]) .nav li:first-child a {
                    color: var(--blue, #b3eaff);
                }

                :host([variant="index"]) .nav a.active {
                    color: var(--blue, #b3eaff);
                    opacity: 1;
                }

                @keyframes fadeInEntry {
                    from {
                        transform: translateY(48px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                /* ===== Menu toggle button ===== */
                .menu-toggle {
                    display: none;
                    background-color: transparent;
                    border: none;
                    cursor: pointer;
                    z-index: 1001;
                    padding: 0;
                    anchor-name: --menu-toggle;
                }

                .menu-toggle .material-symbols-rounded {
                    font-family: 'Material Symbols Rounded';
                    font-weight: normal;
                    font-style: normal;
                    font-size: 2.4rem;
                    line-height: 1;
                    letter-spacing: normal;
                    text-transform: none;
                    display: inline-block;
                    white-space: nowrap;
                    word-wrap: normal;
                    direction: ltr;
                    -webkit-font-feature-settings: 'liga';
                    -webkit-font-smoothing: antialiased;
                    color: white;
                    font-variation-settings: "FILL" 0, "wght" 600, "GRAD" 0, "opsz" 48;
                    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                /* ===== Mobile popover nav ===== */
                .mobile-nav {
                    position-anchor: --menu-toggle;
                    position: fixed;
                    position-area: top;
                    margin-bottom: 0.5rem;
                    margin-right: 1.6rem;   
                    padding: 1.6rem;
                    background-color: #171d25;
                    border-radius: 1.6rem;
                    width: max-content;
                    min-width: 22rem;
                    z-index: 1000;
                    overflow: hidden;
                }

                .mobile-nav[popover] {
                    border: none;
                    padding: 1.6rem;
                    background-color: #171d25;
                    overflow: visible;
                }

                .mobile-nav ul {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                }

                .mobile-nav a {
                    color: white;
                    padding: 1.2rem 1.6rem;
                    display: block;
                    position: relative;
                    border-radius: 0.8rem;
                    font-size: 1.8rem;
                    font-weight: 600;
                    user-select: none;
                    transition: color 0.3s, background-color 0.3s;
                }

                .mobile-nav a:hover {
                    color: var(--blue, #b3eaff);
                    background-color: #ffffff10;
                }

                .mobile-nav a.active {
                    color: var(--pink, #ffd9e6);
                    background-color: #ffffff08;
                }

                .mobile-nav a::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%) scaleY(0);
                    width: 3px;
                    height: 60%;
                    background: var(--pink, #ffd9e6);
                    border-radius: 2px;
                    transition: transform 0.3s ease;
                }

                .mobile-nav a.active::before {
                    background: var(--pink, #ffd9e6);
                    transform: translateY(-50%) scaleY(1);
                }

                .mobile-nav a:hover::before {
                    background: var(--blue, #b3eaff);
                    transform: translateY(-50%) scaleY(1);
                }

                /* ===== Popover animations ===== */
                @keyframes popoverSlideUp {
                    from {
                        transform: translateY(2rem);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes popoverSlideDown {
                    from {
                        transform: translateY(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateY(2rem);
                        opacity: 0;
                    }
                }

                @keyframes linkSlideIn {
                    from {
                        transform: translateX(-2rem);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes linkSlideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(-2rem);
                        opacity: 0;
                    }
                }

                .mobile-nav.opening {
                    animation: popoverSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                .mobile-nav.opening li {
                    opacity: 0;
                    animation: linkSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                .mobile-nav.closing {
                    animation: popoverSlideDown 0.3s cubic-bezier(0.5, 0, 0.75, 0) forwards;
                }

                .mobile-nav.closing li {
                    animation: linkSlideOut 0.25s cubic-bezier(0.5, 0, 0.75, 0) forwards;
                }

                /* ===== Mobile responsive ===== */
                @media (width <= 768px) {
                    :host([variant="default"]) header {
                        position: relative;
                    }

                    .nav {
                        display: none!important;
                    }

                    .menu-toggle {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        position: fixed;
                        bottom: 1.6rem;
                        right: 1.6rem;
                        padding: 1.4rem;
                        border-radius: 100px;
                        background-color: #141520ed;
                        backdrop-filter: blur(5px);
                        border: 1px solid #ffffff15;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
                                    background-color 0.2s;
                    }

                    .menu-toggle:hover {
                        background-color: #1d1b20;
                        transform: scale(1.05);
                    }

                    .menu-toggle:active {
                        transform: scale(0.95);
                    }

                    .menu-toggle.is-open .material-symbols-rounded {
                        transform: rotate(90deg);
                    }
                }
            </style>
            <header>
                <nav class="nav">
                    ${menuList}
                </nav>
                <button class="menu-toggle" aria-label="菜单">
                    <span class="material-symbols-rounded">menu</span>
                </button>
            </header>
            <div class="mobile-nav" popover="manual">
                ${menuList}
            </div>
        `
  }

  setupInteractions() {
    const menuToggle = this.shadowRoot.querySelector('.menu-toggle')
    const mobileNav = this.shadowRoot.querySelector('.mobile-nav')

    if (!menuToggle || !mobileNav) return

    const links = mobileNav.querySelectorAll('li')

    menuToggle.addEventListener('click', () => {
      if (this._navOpen) {
        this.closeNav(mobileNav, menuToggle, links)
      } else {
        this.openNav(mobileNav, menuToggle, links)
      }
    })

    mobileNav.addEventListener('toggle', (e) => {
      if (e.newState === 'closed') {
        this._navOpen = false
        mobileNav.classList.remove('opening', 'closing')
        menuToggle.classList.remove('is-open')
        const icon = menuToggle.querySelector('.material-symbols-rounded')
        if (icon) icon.textContent = 'menu'
      }
    })
  }

  openNav(mobileNav, menuToggle, links) {
    this._navOpen = true
    const icon = menuToggle.querySelector('.material-symbols-rounded')
    if (icon) icon.textContent = 'close'
    menuToggle.classList.add('is-open')

    mobileNav.classList.remove('closing')
    mobileNav.showPopover()

    requestAnimationFrame(() => {
      mobileNav.classList.add('opening')
      links.forEach((li, i) => {
        li.style.animationDelay = `${0.06 + i * 0.07}s`
      })
    })

    const onEnd = () => {
      mobileNav.classList.remove('opening')
      mobileNav.removeEventListener('animationend', onEnd)
    }
    mobileNav.addEventListener('animationend', onEnd)
  }

  closeNav(mobileNav, menuToggle, links) {
    const icon = menuToggle.querySelector('.material-symbols-rounded')
    if (icon) icon.textContent = 'menu'
    menuToggle.classList.remove('is-open')

    mobileNav.classList.remove('opening')
    mobileNav.classList.add('closing')

    links.forEach((li, i) => {
      li.style.animationDelay = `${i * 0.04}s`
    })

    const onEnd = () => {
      mobileNav.classList.remove('closing')
      mobileNav.hidePopover()
      this._navOpen = false
      mobileNav.removeEventListener('animationend', onEnd)
    }
    mobileNav.addEventListener('animationend', onEnd)
  }
}

customElements.define('site-header', SiteHeader)
