/**
 * Simple Three.js scene that renders multiple "panels" representing timelines.
 * Each panel is a colored box whose color/height is driven by timeline.simulated.multiplier.
 *
 * This is intentionally simple: it's a demo visualization you can extend.
 */

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function ThreeScene({ timelines = [] }) {
  const mountRef = useRef();

  useEffect(() => {
    const el = mountRef.current;
    const width = el.clientWidth;
    const height = el.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 5, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    el.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 0.9);
    light.position.set(5, 10, 7);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040, 0.8));

    const group = new THREE.Group();
    const gap = 2.2;
    timelines.forEach((t, i) => {
      const mult = t.simulated?.multiplier ?? 1;
      const h = Math.max(0.8, Math.min(5, mult * 1.6));
      const geom = new THREE.BoxGeometry(1.6, h, 0.6);
      const normalized = Math.max(0, Math.min(1, (mult - 0.2) / (3.0 - 0.2)));
      const color = new THREE.Color().setHSL(0.35 * normalized, 0.7, 0.5);
      const mat = new THREE.MeshStandardMaterial({ color });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set((i - Math.floor(timelines.length / 2)) * gap, h / 2, 0);
      group.add(mesh);
    });

    scene.add(group);

    let frameId;
    function animate() {
      group.rotation.y += 0.005;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }
    animate();

    function handleResize() {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [timelines]);

  return <div ref={mountRef} className="canvas-wrap" />;
}