class Comment extends HTMLElement {
  static get observedAttributes() {
    return ['commenter', 'mention']
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.render()
    }
  }

  get commenter() {
    return this.getAttribute('commenter') || ''
  }

  get mention() {
    return this.getAttribute('mention') || ''
  }

  render() {
    const isReply = this.mention !== ''

    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    line-height: 1.5;
                    margin-left: 5px;
                    padding: 2px 0;
                }

                :host([mention]) {
                    padding-left: 1em;
                    border-left: 2px solid #ffffff15;
                    margin-left: 1em;
                }

                a {
                    text-decoration: none;
                    color: inherit;
                }

                .commenter {
                    display: inline-block;
                    color: var(--link-blue, #4a9eff);
                    cursor: pointer;
                    margin-right: 5px;
                }

                .reply-text {
                    color: #ffffff99;
                    font-size: 0.9em;
                }

                .mention {
                    display: inline-block;
                    color: var(--link-blue, #4a9eff);
                    cursor: pointer;
                    margin-left: 5px;
                }

                .separator {
                    color: inherit;
                }

                ::slotted(*) {
                    display: inline;
                }
            </style>
            <a><span class="commenter">${this.commenter}</span></a>${
      isReply
        ? `<span class="reply-text">回复</span><a><span class="mention">${this.mention}</span></a>`
        : ''
    }<span class="separator">：</span><slot></slot>
        `
  }
}

customElements.define('blog-comment', Comment)
