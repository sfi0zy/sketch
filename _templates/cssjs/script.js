// eslint-disable-next-line
import Medium from 'https://unpkg.com/css.medium.js@1.0.0/css.medium.js';

class Example {
    static CSS_ROOT = 'my-example';
    static CSS_ROOT_LOADED_VARIANT = '-loaded';

    #root;

    constructor(root) {
        this.#root = root;
        this.#root.classList.add(Example.CSS_ROOT);
        this.#initEventListeners();
        this.#root.classList.add(Example.CSS_ROOT_LOADED_VARIANT);
    }

    #initEventListeners() {
        window.addEventListener('resize', this.#onWindowResize.bind(this));
        document.addEventListener('mousemove', this.#onMouseMove.bind(this));
    }

    // eslint-disable-next-line class-methods-use-this
    #onWindowResize() {
        // . . .
    }

    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    #onMouseMove(e) {
        // . . .
    }
}

function main() {
    // eslint-disable-next-line no-unused-vars
    const medium = new Medium({
        features: {
            xy: true,
            // scroll: true,
            // time: true,
            // random: true,
        },
    });

    const root = document.getElementById('root');
    const example = new Example(root);

    console.log(example);
}

document.addEventListener('DOMContentLoaded', main);
