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

// scene.add(sphere);

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
    this.z = Math.cos(a);
    this.rx = 0.25;
    this.ry = 0.25;
    this.start = 0;
    this.end = Math.PI * 2;

    this.curve = new THREE.EllipseCurve(this.x, this.y, this.rx, this.ry, this.start, this.end);

    this.points = this.curve.getPoints(50);

    this.len = 25;
    
    let curveGeometry = new THREE.BufferGeometry().setFromPoints(this.points);

    let curveMaterial = new THREE.LineBasicMaterial({ color: 0xb75498 });

    this.trail = new THREE.Line(curveGeometry, curveMaterial);

    scene.add(this.trail);
  }

  // iters(a, b) {
  //   let n = 0;
  //   while (a > 0) {
  //     a = a - b;
  //     n++;
  //   }
  //   return n;
  // }

  // slice() {
  //   let len = this.points.length;
  //   let start = this.value;
  //   let end = start + this.len;
  //   if (start > end % len) {
  //     let first = this.points.slice(0, start);
  //     let inBetween = [];
  //     let last = this.points.slice(end, len);
  //     let n = this.iters(end, len);
  //     for (let i = 0; i < n; i++) {
  //       inBetween.concat(this.points);
  //     }
  //     return [...first, ...inBetween, ...last];
  //   }
  //   return this.points.slice(start, end);
  // }

  slice() {
    let s = this.value % this.points.length;
    let e = (s + this.len) % this.points.length;
    if (e > s) return this.points.slice(0, s).concat(this.points.slice(e, this.points.length));
    return this.points.slice(e, s);
  }

  update(sphereRotation) {
    this.value += 1;
    this.currentPoints = this.slice();
    this.curveGeometry = new THREE.BufferGeometry().setFromPoints(this.currentPoints);
    this.trail.geometry = this.curveGeometry;
  }
}

const curves = [];
for (let i = 0; i < 10; i++) {
    curves.push(new Curve())
}

// *--------------------------------- animate -------------------------------*

function draw() {
  if (!mouseDown) sphere.rotation.y += rotationSpeed;
  curves.forEach(curve => curve.update(sphere.rotation));
}

let anim = true;

function animate() {
  if (anim) requestAnimationFrame(animate);
  renderer.render(scene, camera);
  draw();
}
animate();
