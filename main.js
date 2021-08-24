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
})

function draw() {
  sphere.rotation.y += 0.01;
  sphere.rotation.x += 0.005;
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  draw();
}
animate();
