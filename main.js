const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  150
);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

let geometry = new THREE.SphereGeometry();

const globeTexture = new THREE.TextureLoader().load("2k_earth_nightmap.jpg");
// const globeTexture = new THREE.TextureLoader().load("world-map.png");

let material = new THREE.MeshBasicMaterial({ map: globeTexture });

const sphere = new THREE.Mesh(geometry, material);

const directionalLight = new THREE.DirectionalLight(0xffff00, 1);
scene.add(directionalLight);

scene.add(sphere);

camera.position.z = 2;

const bgTexture = new THREE.TextureLoader().load(
  "2k_stars_milky_way.jpg",
  texture => {
    const bgGeo = new THREE.PlaneGeometry(20, 20);
    const bgMat = new THREE.MeshBasicMaterial({ map: texture });
    const sky = new THREE.Mesh(bgGeo, bgMat);
    sky.position.z = -1;
    scene.add(sky);
  }
);

// *----------------------------------- Handle mouse drag --------------------------------*

let canvas = renderer.domElement;
let mouseDown = false,
  mouseX = 0,
  mouseY = 0;
let rotationSpeed = 0.005;

canvas.addEventListener("mousedown", event => {
  event.preventDefault();
  mouseDown = true;
  mouseX = event.clientX;
  mouseY = event.clientY;
});

canvas.addEventListener("mousemove", event => {
  event.preventDefault();
  if (!mouseDown) return;
  let deltaX = event.clientX - mouseX;
  let deltaY = event.clientY - mouseY;
  mouseX = event.clientX;
  mouseY = event.clientY;
  handleMouseDrag(deltaX, deltaY);
});

canvas.addEventListener("mouseup", event => {
  event.preventDefault();
  mouseDown = false;
});

function handleMouseDrag(x, y) {
  sphere.rotation.y += rotationSpeed * x;
  sphere.rotation.x += rotationSpeed * y;
}

// **

const random = (s, e) => s + Math.random() * e;

// *--------------------------------- adding the curves ----------------------*

class Curve {
  constructor() {
    // this.len = 1;
    this.value = Math.random();
    let a = random(-Math.PI, Math.PI);
    let t = random(-Math.PI, Math.PI);
    this.x = Math.cos(a) * Math.sin(t);
    this.y = Math.sin(a) * Math.sin(t);
    let z = Math.cos(a);
    this.rx = 0.5;
    this.ry = 0.5;
    this.start = 0;
    this.end = 2;

    this.curve = new THREE.EllipseCurve(this.x, this.y, this.rx, this.ry, this.start, this.end);

    let curvePoints = this.curve.getPoints(50);
    let curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);

    let curveMaterial = new THREE.LineBasicMaterial({ color: 0xb75498 });

    this.ellipse = new THREE.Line(curveGeometry, curveMaterial);
    this.ellipse.rotation.set(0, 0, t);

    scene.add(this.ellipse);
  }

  update(sphereRotation) {
    this.value += 0.01;
    this.ellipse.position.set(0, 0);
    this.ellipse.rotation.set(0, sphereRotation, this.value);
    this.ellipse.position.set(this.x, this.y);
  }
}

const curves = [];
for (let i = 0; i < 10; i++) {
    curves.push(new Curve())
}

// *--------------------------------- animate -------------------------------*

function draw() {
  if (!mouseDown) sphere.rotation.y += rotationSpeed;
  curves.forEach(curve => curve.update(sphere.rotation.y));
}

let anim = true;

function animate() {
  if (anim) requestAnimationFrame(animate);
  renderer.render(scene, camera);
  draw();
}
animate();
