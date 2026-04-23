class InteractionBar extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    connectedCallback() {
        this.render()
    }

    render () {
        this.shadowRoot.innerHTML = `
            <style>
                                @import url(../symbols/font.css);
                .interaction-bar {
                    display: flex;
                    justify-content: end;

                    .interaction-bar-item {
                        font-size: small;
                        margin-right: 1vw;

                        .interaction {
                            cursor: pointer;

                            .material-symbols-rounded {
                                color: whitesmoke;
                                font-size: 22px;

                                &:hover {
                                    color: skyblue;
                                }
                            }
                        }
                    }
                }
            </style>
            <div class="interaction-bar">
                <div class="interaction-bar-item"><a class="interaction" aria-label="点赞"><span
                            class="material-symbols-rounded">favorite</span></a></div>
                <div class="interaction-bar-item"><a class="interaction" aria-label="评论"><span
                            class="material-symbols-rounded">comment</span></a></div>
                <div class="interaction-bar-item"><a class="interaction" aria-label="分享"><span
                            class="material-symbols-rounded">ios_share</span></a></div>
            </div>
        `
    }
}

customElements.define('interaction-bar', InteractionBar)