const { THREE } = window;

const FLAGS = Object.freeze({
    ENABLE_ORBIT_CONTROLS: true,
    ENABLE_SHADOWS: true,
});

const COLOR_SCHEME = Object.freeze({
    background: 0x000000,
    default: 0x777777,
});

class Utils3D {
    static getMousePosition3D(event, camera, targetZ) {
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;
        const tmp = new THREE.Vector3();

        tmp.set(x, y, 0.5);
        tmp.unproject(camera);
        tmp.sub(camera.position).normalize();

        const distance = (targetZ - camera.position.z) / tmp.z;

        const mousePosition3D = new THREE.Vector3();

        mousePosition3D.copy(camera.position);
        mousePosition3D.add(tmp.multiplyScalar(distance));

        return mousePosition3D;
    }
}

class DefaultMaterial extends THREE.MeshBasicMaterial {
    constructor() {
        super({ color: COLOR_SCHEME.default });
    }
}

class MaterialsLibrary {
    static default = new DefaultMaterial();
}

class SandboxWorld extends THREE.Group {
    constructor() {
        super();

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = MaterialsLibrary.default;
        const cube = new THREE.Mesh(geometry, material);

        this.add(cube);
    }
}

class FullScreen3DExample {
    static CSS_ROOT = 'full-screen-3d-example';
    static CSS_ROOT_LOADED_VARIANT = '-loaded';

    #root;
    #frameRequestId;
    #scene;
    #camera;
    #controls;
    #renderer;
    #composer;

    constructor(root) {
        this.#root = root;
        this.#root.classList.add(FullScreen3DExample.CSS_ROOT);
        this.#initScene();
        this.#initObjects();
        this.#initCamera();
        this.#initRenderer();
        this.#initComposer();
        this.#initControls();
        this.#initEventListeners();
        this.#onWindowResize();
        this.#root.classList.add(FullScreen3DExample.CSS_ROOT_LOADED_VARIANT);
        this.#render();
    }

    #initScene() {
        this.#scene = new THREE.Scene();
    }

    #initObjects() {
        const world = new SandboxWorld();

        this.#scene.add(world);
    }

    #initCamera() {
        const fov = 45;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 1;
        const far = 1000;

        this.#camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.#camera.position.set(0, 0, 10);
    }

    #initRenderer() {
        const alpha = true;
        const clearColor = COLOR_SCHEME.background;
        const clearColorAlpha = 1;

        this.#renderer = new THREE.WebGLRenderer({ alpha });
        this.#renderer.setClearColor(clearColor, clearColorAlpha);
        this.#renderer.setPixelRatio(window.devicePixelRatio);

        if (FLAGS.ENABLE_SHADOWS) {
            this.#renderer.shadowMap.enabled = true;
            this.#renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }

        this.#root.appendChild(this.#renderer.domElement);
    }

    #initComposer() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.#composer = new THREE.EffectComposer(this.#renderer);
        this.#composer.setSize(width, height);
        this.#initRenderPass();
        this.#initBloomPass();
    }

    #initControls() {
        if (FLAGS.ENABLE_ORBIT_CONTROLS) {
            this.#controls = new THREE.OrbitControls(
                this.#camera,
                this.#renderer.domElement,
            );
        }
    }

    #initRenderPass() {
        const renderPass = new THREE.RenderPass(this.#scene, this.#camera);

        this.#composer.addPass(renderPass);
    }

    #initBloomPass() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const resolution = new THREE.Vector2(width, height);
        const strength = 0.29;
        const radius = 1;
        const threshold = 0.1;

        const bloomPass = new THREE.UnrealBloomPass(
            resolution,
            strength,
            radius,
            threshold,
        );

        bloomPass.renderToScreen = true;

        this.#composer.addPass(bloomPass);
    }

    #initEventListeners() {
        window.addEventListener('resize', this.#onWindowResize.bind(this));
        document.addEventListener('mousemove', this.#onMouseMove.bind(this));
    }

    #onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.#camera.aspect = width / height;
        this.#camera.updateProjectionMatrix();
        this.#renderer.setSize(width, height);
        this.#composer.setSize(width, height);
    }

    #onMouseMove(e) {
        if (FLAGS.ENABLE_ORBIT_CONTROLS) {
            return;
        }

        const targetZ = 0;

        // eslint-disable-next-line no-unused-vars
        const mousePosition3D = Utils3D.getMousePosition3D(
            e, this.#camera, targetZ);

        // . . .
    }

    #render() {
        this.#composer.render(this.#scene, this.#camera);
    }

    start() {
        this.#render();

        if (FLAGS.ENABLE_ORBIT_CONTROLS) {
            this.#controls.update();
        }

        this.#frameRequestId = requestAnimationFrame(this.start.bind(this));
    }

    stop() {
        cancelAnimationFrame(this.#frameRequestId);
    }
}

function main() {
    const root = document.getElementById('root');
    const example = new FullScreen3DExample(root);

    example.start();
}

document.addEventListener('DOMContentLoaded', main);
