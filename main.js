import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  MeshLambertMaterial,
  ShaderMaterial,
  SphereGeometry,
  AdditiveBlending,
  BackSide,
  Mesh,
  DirectionalLight,
  PointLight,
  AmbientLight,
  TextureLoader,
  Fog,
  EllipseCurve,
  BufferGeometry,
  LineBasicMaterial,
  Line,
} from "three";
import "./create-map/images/output/map7.png";
import "./maps/2k_stars_milky_way.jpg";

const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  150
);

const renderer = new WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById("globe").appendChild(renderer.domElement);

let geometry = new SphereGeometry();

const globeTexture = new TextureLoader().load("map7.png");

let material = new MeshLambertMaterial({
  map: globeTexture,
});

// let material = new ShaderMaterial({
//   vertexShader: `
//   varying vec3 vectorNormal;
//   varying vec2 vertexUV;
//     void main() {
//       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//       vectorNormal = normalize(normal * normalMatrix);
//       vertexUV = uv;
//     }
//   `,

//   fragmentShader: `
//   varying vec3 vectorNormal;
//   varying vec2 vertexUV;
//   uniform sampler2D globeTexture;

//   void main() {
//     float intensity = 1.05 - dot(vectorNormal, vec3(0.0, 0.0, 1.0));
//     vec3 atmosphere = vec3(0.6, 0.4, 0.2) * pow(intensity, 1.5);
//     gl_FragColor = vec4(atmosphere + texture2D(globeTexture, vertexUV).xyz, 1.0);
//     // gl_FragColor = texture2D(globeTexture, vertexUV);
//   }

//   `,
//   uniforms: {
//     globeTexture: {
//       value: globeTexture,
//     },
//   },
// });

// material.map = globeTexture;

const sphere = new Mesh(geometry, material);

scene.add(sphere);

let glowGeometry = new SphereGeometry();

let glowMaterial = new ShaderMaterial({
  vertexShader: `
  varying vec3 vectorNormal;
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      // vectorNormal = normal;
      vectorNormal = normalize(normal * normalMatrix);
    }
  `,

  fragmentShader: `
  varying vec3 vectorNormal;

  void main() {
    float intensity = pow(0.9 - dot(vectorNormal, vec3(0, 0, 1.0)), 2.0);
    gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
  }
  `,
  blending: AdditiveBlending,
  side: BackSide,
});

const glow = new Mesh(glowGeometry, glowMaterial);

glow.scale.set(1.1, 1.1, 1.1);

glow.position.set(-0.1, 0.1, 0);

scene.add(glow);

// const directionalLight = new DirectionalLight(0xffffff, 2);
// directionalLight.position.set(1, 1, 5);
// scene.add(directionalLight);

// const pl = new PointLight(0xff0000, 5, 100);
// pl.position.set(-1, 0, 5);
// scene.add(pl);

const ambientLight = new AmbientLight(0xffffff, 3);
scene.add(ambientLight);

camera.position.z = 2;

const bgTexture = new TextureLoader().load(
  "2k_stars_milky_way.jpg",
  texture => {
    const bgMat = texture;
    scene.background = bgMat;
  }
);

scene.fog = new Fog(0x3d1d45, 0.1, 10);

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
  sphere.rotation.x = clamp(sphere.rotation.x, -0.6, 0.6);
}

// **

const random = (s, e) => s + Math.random() * e;

// *--------------------------------- adding the curves ----------------------*

class Curve {
  constructor() {
    this.len = 25;
    this.value = Math.floor(Math.random() * this.len);
    let a = random(-Math.PI, Math.PI);
    let t = random(-Math.PI, Math.PI);
    this.x = Math.cos(a) * Math.sin(t);
    this.y = Math.sin(a) * Math.sin(t);
    this.z = Math.cos(a);
    this.rx = 0.25;
    this.ry = 0.25;
    this.start = 0;
    this.end = Math.PI * 2;

    this.curve = new EllipseCurve(
      this.x,
      this.y,
      this.rx,
      this.ry,
      this.start,
      this.end
    );

    this.points = this.curve.getPoints(50);

    let curveGeometry = new BufferGeometry().setFromPoints(this.points);

    let curveMaterial = new LineBasicMaterial({ color: 0xb75498 });

    this.trail = new Line(curveGeometry, curveMaterial);

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
    if (e > s)
      return this.points
        .slice(0, s)
        .concat(this.points.slice(e, this.points.length));
    return this.points.slice(e, s);
  }

  update(sphereRotation) {
    this.value += 1;
    this.currentPoints = this.slice();
    this.curveGeometry = new BufferGeometry().setFromPoints(this.currentPoints);
    this.trail.geometry = this.curveGeometry;
    this.trail.rotation.set(0, sphereRotation.y, 0);
  }
}

// *-----------------------------------making curves------------------------------------*

// const curves = [];
// for (let i = 0; i < 10; i++) {
//   curves.push(new Curve());
// }

// *--------------------------------- animate -------------------------------*

function clamp(val, min, max) {
  return val > max ? max : val < min ? min : val;
}

function draw() {
  if (!mouseDown) sphere.rotation.y += rotationSpeed;
  // console.log(sphere.rotation.x);
  // curves.forEach(curve => curve.update(sphere.rotation));
}

let anim = true;

function animate() {
  if (anim) requestAnimationFrame(animate);
  renderer.render(scene, camera);
  draw();
}
animate();
