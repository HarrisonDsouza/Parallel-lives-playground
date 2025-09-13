import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

export default function MinecraftBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      20000
    );
    camera.position.set(0, 300, 1000);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(500, 1000, 500);
    scene.add(sun);

    // Terrain generation
    const worldWidth = 128;
    const worldDepth = 128;
    const worldHalfWidth = worldWidth / 2;
    const worldHalfDepth = worldDepth / 2;

    const data = generateHeight(worldWidth, worldDepth);

    const matrix = new THREE.Matrix4();

    const pxGeometry = new THREE.PlaneGeometry(100, 100);
    pxGeometry.attributes.uv.array[1] = 0.5;
    pxGeometry.attributes.uv.array[3] = 0.5;
    pxGeometry.rotateY(Math.PI / 2);
    pxGeometry.translate(50, 0, 0);

    const nxGeometry = new THREE.PlaneGeometry(100, 100);
    nxGeometry.attributes.uv.array[1] = 0.5;
    nxGeometry.attributes.uv.array[3] = 0.5;
    nxGeometry.rotateY(-Math.PI / 2);
    nxGeometry.translate(-50, 0, 0);

    const pyGeometry = new THREE.PlaneGeometry(100, 100);
    pyGeometry.attributes.uv.array[5] = 0.5;
    pyGeometry.attributes.uv.array[7] = 0.5;
    pyGeometry.rotateX(-Math.PI / 2);
    pyGeometry.translate(0, 50, 0);

    const pzGeometry = new THREE.PlaneGeometry(100, 100);
    pzGeometry.attributes.uv.array[1] = 0.5;
    pzGeometry.attributes.uv.array[3] = 0.5;
    pzGeometry.translate(0, 0, 50);

    const nzGeometry = new THREE.PlaneGeometry(100, 100);
    nzGeometry.attributes.uv.array[1] = 0.5;
    nzGeometry.attributes.uv.array[3] = 0.5;
    nzGeometry.rotateY(Math.PI);
    nzGeometry.translate(0, 0, -50);

    const geometries = [];

    const getY = (x, z) => {
      return (data[x + z * worldWidth] * 0.15) | 0;
    };

    for (let z = 0; z < worldDepth; z++) {
      for (let x = 0; x < worldWidth; x++) {
        const h = getY(x, z);
        matrix.makeTranslation(
          x * 100 - worldHalfWidth * 100,
          h * 100,
          z * 100 - worldHalfDepth * 100
        );

        const px = getY(x + 1, z);
        const nx = getY(x - 1, z);
        const pz = getY(x, z + 1);
        const nz = getY(x, z - 1);

        geometries.push(pyGeometry.clone().applyMatrix4(matrix));
        if ((px !== h && px !== h + 1) || x === 0) geometries.push(pxGeometry.clone().applyMatrix4(matrix));
        if ((nx !== h && nx !== h + 1) || x === worldWidth - 1) geometries.push(nxGeometry.clone().applyMatrix4(matrix));
        if ((pz !== h && pz !== h + 1) || z === worldDepth - 1) geometries.push(pzGeometry.clone().applyMatrix4(matrix));
        if ((nz !== h && nz !== h + 1) || z === 0) geometries.push(nzGeometry.clone().applyMatrix4(matrix));
      }
    }

    const terrainGeometry = BufferGeometryUtils.mergeGeometries(geometries, false);
    terrainGeometry.computeBoundingSphere();

    const texture = new THREE.TextureLoader().load(
      "https://threejs.org/examples/textures/minecraft/atlas.png"
    );
    texture.magFilter = THREE.NearestFilter;

    const terrainMesh = new THREE.Mesh(
      terrainGeometry,
      new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide })
    );
    scene.add(terrainMesh);

    // Clouds
    const clouds = [];
    const cloudGeo = new THREE.BoxGeometry(200, 100, 100);
    const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    for (let i = 0; i < 30; i++) {
      const cloud = new THREE.Mesh(cloudGeo, cloudMat);
      cloud.position.set(
        Math.random() * 4000 - 2000,
        500 + Math.random() * 200,
        Math.random() * 4000 - 2000
      );
      cloud.scale.set(1 + Math.random() * 2, 1, 1 + Math.random() * 2);
      scene.add(cloud);
      clouds.push(cloud);
    }

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);

      camera.position.z -= 0.5;

      clouds.forEach(cloud => {
        cloud.position.x += 0.2;
        if (cloud.position.x > 3000) cloud.position.x = -3000;
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Height generation
    function generateHeight(width, height) {
      const data = [];
      const perlin = new ImprovedNoise();
      const size = width * height;
      const z = Math.random() * 100;
      let quality = 2;

      for (let j = 0; j < 4; j++) {
        if (j === 0) for (let i = 0; i < size; i++) data[i] = 0;
        for (let i = 0; i < size; i++) {
          const x = i % width;
          const y = (i / width) | 0;
          data[i] += perlin.noise(x / quality, y / quality, z) * quality;
        }
        quality *= 4;
      }
      return data;
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100%",
        height: "100%",
      }}
    />
  );
}
