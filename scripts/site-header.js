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
                }

                /* ===== Mobile responsive ===== */
                @media screen and (max-width: 56.25em) {
                    :host([variant="default"]) header {
                        position: relative;
                    }

                    .nav {
                        display: none;
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: auto;
                        background-color: var(--header, #171d25);
                        padding: 2rem;
                        z-index: 1000;
                    }

                    .nav.open {
                        display: block;
                    }

                    .nav ul {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .nav a {
                        display: block;
                        margin-left: 0;
                        padding: 1rem 0;
                    }

                    .menu-toggle {
                        display: block;
                        position: fixed;
                        bottom: 0.5rem;
                        right: 0.5rem;
                        font-size: 2rem;
                        text-align: center;
                        padding: 2rem;
                        border-radius: 100px;
                        background-color: var(--card, #141520ed);
                    }
                }
            </style>
            <header>
                <nav class="nav">
                    <ul>
                        ${navItems
                          .map(
                            item => `
                            <li><a href="${item.href}" ${this.activePage === item.id ? 'class="active"' : ''}>${item.label}</a></li>
                        `,
                          )
                          .join('')}
                    </ul>
                </nav>
                <button class="menu-toggle" aria-label="菜单">
                    <span class="material-symbols-rounded">menu</span>
                </button>
            </header>
        `
  }

  setupInteractions() {
    const menuToggle = this.shadowRoot.querySelector('.menu-toggle')
    const nav = this.shadowRoot.querySelector('.nav')

    if (menuToggle && nav) {
      menuToggle.addEventListener('click', () => {
        this._navOpen = !this._navOpen
        nav.classList.toggle('open', this._navOpen)
        const icon = menuToggle.querySelector('.material-symbols-rounded')
        if (icon) {
          icon.textContent = this._navOpen ? 'close' : 'menu'
        }
      })
    }
  }
}

customElements.define('site-header', SiteHeader)
