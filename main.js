const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  100
);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry();

const globeTexture = new THREE.TextureLoader().load("2k_earth_nightmap.jpg");

const material = new THREE.MeshBasicMaterial({ map: globeTexture });

const sphere = new THREE.Mesh(geometry, material);

const directionalLight = new THREE.DirectionalLight( 0xffff00, 1 );
scene.add( directionalLight );

scene.add(sphere);

camera.position.z = 2;

const bgTexture = new THREE.TextureLoader().load("2k_stars_milky_way.jpg", (texture) => {
    const bgGeo = new THREE.PlaneGeometry(7, 7);
    const bgMat = new THREE.MeshBasicMaterial({map: texture});
    const sky = new THREE.Mesh(bgGeo, bgMat);
    scene.add(sky);
});

let canvas = renderer.domElement;
let mouseDown = false, mouseX = 0;
// let mouseY = 0;

canvas.addEventListener("mousedown", (event) => {
    event.preventDefault();
    mouseDown = true;
    mouseX = event.clientX;
    // mouseY = event.clientY;
});

canvas.addEventListener("mousemove", event => {
    event.preventDefault();
    if (!mouseDown) return;
    let deltaX = event.clientX - mouseX;
    // let deltaY = event.clientY - mouseY;
    mouseX = event.clientX;
    // mouseY = event.clientY;
    handleMouseDrag(deltaX);
});

canvas.addEventListener("mouseup", event => {
    event.preventDefault();
    mouseDown = false;
})

function handleMouseDrag(x) {
    sphere.rotation.y += 0.005 * x;
}

function draw() {
  sphere.rotation.y += 0.005;
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  draw();
}
animate();
