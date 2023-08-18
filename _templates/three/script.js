const { THREE } = window;

// https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
function isMobile() {
    let check = false;

    // eslint-disable-next-line
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);

    return check;
}

const IS_MOBILE_DEVICE = isMobile();

const FLAGS = Object.freeze({
    ENABLE_ORBIT_CONTROLS: true,
    ENABLE_SHADOWS: !IS_MOBILE_DEVICE,
    ENABLE_BLOOM: !IS_MOBILE_DEVICE,
    ENABLE_SHADER_PASS: !IS_MOBILE_DEVICE,
});

const COLOR_PALETTE = Object.freeze({
    black: 0x010101,
    white: 0xeeeeee,
});

const COLOR_PALETTE_GLSL = Object.freeze({
    black: 'vec4(0.04, 0.04, 0.04, 1.0)',
    white: 'vec4(0.933, 0.933, 0.933, 1.0)',
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

class DefaultMaterial extends THREE.MeshStandardMaterial {
    constructor() {
        super({
            color: COLOR_PALETTE.white,
        });
    }
}

class CustomMaterial extends THREE.MeshStandardMaterial {
    onBeforeCompile(shader) {
        // eslint-disable-next-line no-param-reassign
        shader.uniforms.uTime = { value: 0.0 };

        // eslint-disable-next-line no-param-reassign
        shader.vertexShader = shader.vertexShader.replace(
            '#include <uv_pars_vertex>',
            `varying vec2 vUv;
            uniform float uTime;`,
        );

        // eslint-disable-next-line no-param-reassign
        shader.vertexShader = shader.vertexShader.replace(
            '#include <uv_vertex>',
            'vUv = uv;',
        );

        // eslint-disable-next-line no-param-reassign
        shader.fragmentShader = shader.fragmentShader.replace(
            'varying vec3 vViewPosition;',
            `varying vec3 vViewPosition;
            varying vec2 vUv;
            uniform float uTime;`,
        );

        this.userData.shader = shader;
    }
}

class CustomTransparentMaterial extends CustomMaterial {
    constructor() {
        super({
            transparent: true,
        });
    }
}

class TestMaterial extends CustomTransparentMaterial {
    onBeforeCompile(shader) {
        super.onBeforeCompile(shader);

        // eslint-disable-next-line no-param-reassign
        shader.fragmentShader = shader.fragmentShader.replace(
            // eslint-disable-next-line sonarjs/no-duplicate-string
            '#include <map_fragment>',
            `
            diffuseColor = ${COLOR_PALETTE_GLSL.black};
            `,
        );

        this.userData.shader = shader;
    }
}

class MaterialsLibrary {
    static default = new DefaultMaterial();
    static test = new TestMaterial();
}

class SandboxWorld extends THREE.Group {
    constructor() {
        super();

        this.#initObjects();
        this.#initLights();
    }

    #initObjects() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = MaterialsLibrary.default;
        const cube = new THREE.Mesh(geometry, material);

        this.add(cube);
    }

    #initLights() {
        const ambient = new THREE.AmbientLight(COLOR_PALETTE.white, 0.5);

        this.add(ambient);
    }

    // eslint-disable-next-line
    update() {

    }
}

class FullScreen3DExample {
    static CSS_ROOT = 'full-screen-3d-example';
    static CSS_ROOT_LOADED_VARIANT = '-loaded';

    #root;
    #frameRequestId;
    #scene;
    #world;
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
        this.#world = new SandboxWorld();

        this.#scene.add(this.#world);
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
        const clearColor = COLOR_PALETTE.black;
        const clearColorAlpha = 1;

        this.#renderer = new THREE.WebGLRenderer({
            alpha: true,
            logarithmicDepthBuffer: true,
        });

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

        if (FLAGS.ENABLE_BLOOM) {
            this.#initBloomPass();
        }

        if (FLAGS.ENABLE_SHADER_PASS) {
            this.#initShaderPass();
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

    #initShaderPass() {
        const pass = new THREE.ShaderPass({
            uniforms: {
                tDiffuse: {
                    type: 't',
                    value: null,
                },
                uTime: {
                    value: 1,
                },
            },
            vertexShader: `
                varying vec2 vUv;

                void main() {
                    vUv = uv;

                    gl_Position = projectionMatrix
                        * modelViewMatrix
                        * vec4(position, 1.0);
                }`,
            fragmentShader: `
                uniform float uTime;
                uniform sampler2D tDiffuse;

                varying vec2 vUv;

                void main() {
                    gl_FragColor = texture2D(tDiffuse, vUv);
                }
            `,
        });

        pass.renderToScreen = true;

        this.#composer.addPass(pass);
    }

    #initControls() {
        if (FLAGS.ENABLE_ORBIT_CONTROLS) {
            this.#controls = new THREE.OrbitControls(
                this.#camera,
                this.#renderer.domElement,
            );
        }
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

    #updateEverything() {
        const t = performance.now() / 1000;

        this.#world.update();

        this.#scene.traverse((child) => {
            if (child.isMesh) {
                const { shader } = child.material.userData;

                if (shader) {
                    shader.uniforms.uTime.value = t;
                }
            }
        });

        this.#composer.passes.forEach((pass) => {
            if (pass instanceof THREE.ShaderPass) {
                // eslint-disable-next-line no-param-reassign
                pass.uniforms.uTime.value = t;
            }
        });
    }

    #render() {
        this.#updateEverything();

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
