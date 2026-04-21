class BlogPost extends HTMLElement {
  static get observedAttributes() {
    return ['avatar', 'avatar-alt', 'nickname', 'date']
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

  get avatar() {
    return this.getAttribute('avatar') || ''
  }

  get avatarAlt() {
    return this.getAttribute('avatar-alt') || ''
  }

  get nickname() {
    return this.getAttribute('nickname') || ''
  }

  get date() {
    return this.getAttribute('date') || ''
  }

  render() {
    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin: 2vw;
                    background-color: #141520ed;
                    border-radius: 2rem;
                    border: #333 3px double;
                    backdrop-filter: blur(5px);
                    padding: 1.5vw;
                    display: grid;
                    grid-template:
                        "head name" 2vmax
                        "head time" 2vmax
                        "post-content post-content"
                        "comment comment"
                        "interaction-bar interaction-bar" /4vmax 1fr;
                    grid-gap: 0 1vmin;
                }

                :host(:hover) {
                    outline: 4px solid var(--blue, #b3eaff);
                    transform: scale(1.01);
                }

                .avatar {
                    display: block;
                    height: 3.5vmax;
                    width: 3.5vmax;
                    grid-area: head;
                    border-radius: 50%;
                    overflow: hidden;
                    justify-self: center;
                    align-self: center;
                }

                .avatar img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .nickname {
                    grid-area: name;
                    align-self: end;
                    display: flex;
                    align-items: end;
                }

                time {
                    grid-area: time;
                    color: gray;
                    font-size: 1.4rem;
                    display: flex;
                    align-items: center;
                }

                .post-content {
                    padding: 1vmin;
                    grid-area: post-content;
                }

                .post-content ::slotted(iframe) {
                    margin-top: 2vh;
                }

                .comment {
                    display: block;
                    grid-area: comment;
                    border: #00000022 solid 1px;
                    background-color: #00000011;
                    border-radius: 1vmin;
                    padding: 2px 0;
                }

                interaction-bar {
                    grid-area: interaction-bar;
                }
            </style>
            <div class="avatar">
                <img src="${this.avatar}" alt="${this.avatarAlt}" width="64" height="64" loading="lazy">
            </div>
            <div class="nickname">${this.nickname}</div>
            <time>${this.date}</time>
            <div class="post-content">
                <slot name="content"></slot>
            </div>
            <div class="comment">
                <slot name="comments"></slot>
            </div>
            <interaction-bar></interaction-bar>
        `
  }
}

customElements.define('blog-post', BlogPost)
