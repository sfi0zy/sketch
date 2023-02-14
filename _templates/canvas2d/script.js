const COLOR_SCHEME = Object.freeze({
    background: '#000000',
    default: '#777777',
});

class FullScreen2DExample {
    static CSS_ROOT = 'full-screen-2d-example';
    static CSS_ROOT_LOADED_VARIANT = '-loaded';

    #root;
    #canvas;
    #context;
    #frameRequestId;
    #clearColor;

    constructor(root) {
        this.#root = root;
        this.#root.classList.add(FullScreen2DExample.CSS_ROOT);
        this.#canvas = document.createElement('canvas');
        this.#context = this.#canvas.getContext('2d');
        this.#root.appendChild(this.#canvas);

        this.#onWindowResize();
        this.#clear();
        this.#initEventListeners();
        this.#root.classList.add(FullScreen2DExample.CSS_ROOT_LOADED_VARIANT);
    }

    #initEventListeners() {
        window.addEventListener('resize', this.#onWindowResize.bind(this));
        document.addEventListener('mousemove', this.#onMouseMove.bind(this));
    }

    #onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const scale = window.devicePixelRatio;

        this.#canvas.width = Math.floor(width * scale);
        this.#canvas.height = Math.floor(height * scale);
        this.#context.scale(scale, scale);
    }

    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    #onMouseMove(e) {
        // . . .
    }

    #clear() {
        this.#context.fillStyle = COLOR_SCHEME.background;
        this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
    }

    #draw() {
        const width = this.#canvas.width / window.devicePixelRatio;
        const height = this.#canvas.height / window.devicePixelRatio;

        this.#context.fillStyle = COLOR_SCHEME.default;
        this.#context.fillRect(0, 0, width / 2, height / 2);
    }

    start() {
        this.#draw();

        this.#frameRequestId = requestAnimationFrame(this.start.bind(this));
    }

    stop() {
        cancelAnimationFrame(this.#frameRequestId);
    }
}

function main() {
    const root = document.getElementById('root');
    const example = new FullScreen2DExample(root);

    example.start();
}

document.addEventListener('DOMContentLoaded', main);
