const { h, render } = window.preact;
const { htm } = window;

const html = htm.bind(h);

function App() {
    return html`<h1>Hello, world!</h1>`;
}

function main() {
    render(
        html`<${App}/>`,
        document.getElementById('root'),
    );
}

document.addEventListener('DOMContentLoaded', main);
