/**
 * Stunning 3D Timeline City that visualizes parallel futures as magical buildings!
 * Features: Floating islands, glowing effects, particle systems, dynamic lighting
 */

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function ThreeScene({ timelines = [] }) {
  const mountRef = useRef();

  useEffect(() => {
    const el = mountRef.current;
    const width = el.clientWidth;
    const height = el.clientHeight;

    // Create scene with gradient background
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x667eea, 10, 50);
    
    // Create gradient background
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 2;
    canvas.height = 256;
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 2, 256);
    
    const bgTexture = new THREE.CanvasTexture(canvas);
    scene.background = bgTexture;

    // Enhanced camera with better angle
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(8, 12, 15);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      shadowMap: { enabled: true, type: THREE.PCFSoftShadowMap }
    });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    el.appendChild(renderer.domElement);

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);

    // Add magical rim lighting
    const rimLight = new THREE.DirectionalLight(0x4ecdc4, 0.8);
    rimLight.position.set(-5, 5, -5);
    scene.add(rimLight);

    // Create floating islands base
    const createFloatingIsland = (x, z, size) => {
      const islandGroup = new THREE.Group();
      
      // Island base - irregular shape
      const islandGeometry = new THREE.CylinderGeometry(size, size * 0.6, 0.8, 8);
      const islandMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x4a7c59,
        roughness: 0.8,
        metalness: 0.1
      });
      const island = new THREE.Mesh(islandGeometry, islandMaterial);
      island.position.y = -0.5;
      island.castShadow = true;
      island.receiveShadow = true;
      islandGroup.add(island);

      // Add some grass/details
      const grassGeometry = new THREE.CylinderGeometry(size * 1.1, size * 0.8, 0.2, 8);
      const grassMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x7fb069,
        roughness: 0.9
      });
      const grass = new THREE.Mesh(grassGeometry, grassMaterial);
      grass.position.y = -0.1;
      grass.receiveShadow = true;
      islandGroup.add(grass);

      islandGroup.position.set(x, 0, z);
      return islandGroup;
    };

    // Main group for all timeline buildings
    const timelineGroup = new THREE.Group();
    
    const maxTimelines = Math.min(timelines.length, 12); // Limit for performance
    const radius = Math.max(6, maxTimelines * 0.8);
    
    timelines.slice(0, maxTimelines).forEach((timeline, i) => {
      const mult = timeline.simulated?.multiplier ?? 1;
      const emotional = timeline.simulated?.emotional ?? 0.5;
      
      // Position buildings in a circle
      const angle = (i / maxTimelines) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // Create floating island for this timeline
      const island = createFloatingIsland(x, z, 1.5);
      timelineGroup.add(island);
      
      // Building height based on success
      const buildingHeight = Math.max(1.5, Math.min(8, mult * 2.5));
      const buildingWidth = 1.2;
      
      // Create main building with more interesting geometry
      const buildingGeometry = new THREE.BoxGeometry(buildingWidth, buildingHeight, buildingWidth);
      
      // Color based on success level with more vibrant colors
      let buildingColor;
      if (mult >= 2.5) buildingColor = new THREE.Color(0x4caf50); // Bright green
      else if (mult >= 2.0) buildingColor = new THREE.Color(0x8bc34a); // Light green  
      else if (mult >= 1.5) buildingColor = new THREE.Color(0xffc107); // Gold
      else if (mult >= 1.0) buildingColor = new THREE.Color(0xff9800); // Orange
      else buildingColor = new THREE.Color(0xf44336); // Red

      // Create glowing material
      const buildingMaterial = new THREE.MeshStandardMaterial({
        color: buildingColor,
        emissive: buildingColor.clone().multiplyScalar(0.2),
        roughness: 0.3,
        metalness: 0.4
      });
      
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.set(x, buildingHeight / 2 + 0.3, z);
      building.castShadow = true;
      building.receiveShadow = true;
      timelineGroup.add(building);

      // Add glowing top indicator
      const topGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 8);
      const topMaterial = new THREE.MeshStandardMaterial({
        color: buildingColor,
        emissive: buildingColor.clone().multiplyScalar(0.8),
        emissiveIntensity: 1.5
      });
      const top = new THREE.Mesh(topGeometry, topMaterial);
      top.position.set(x, buildingHeight + 0.4, z);
      timelineGroup.add(top);

      // Add floating particles around successful buildings
      if (mult >= 2.0) {
        const particleGroup = new THREE.Group();
        const particleGeometry = new THREE.SphereGeometry(0.02, 4, 4);
        const particleMaterial = new THREE.MeshBasicMaterial({
          color: buildingColor,
          transparent: true,
          opacity: 0.8
        });
        
        for (let p = 0; p < 8; p++) {
          const particle = new THREE.Mesh(particleGeometry, particleMaterial);
          const particleRadius = 2;
          const particleAngle = (p / 8) * Math.PI * 2;
          particle.position.set(
            Math.cos(particleAngle) * particleRadius,
            Math.random() * buildingHeight + 2,
            Math.sin(particleAngle) * particleRadius
          );
          particleGroup.add(particle);
        }
        particleGroup.position.set(x, 0, z);
        timelineGroup.add(particleGroup);
      }

      // Add name labels (floating text effect)
      const canvas2D = document.createElement('canvas');
      const context2D = canvas2D.getContext('2d');
      canvas2D.width = 256;
      canvas2D.height = 64;
      context2D.font = 'Bold 20px Arial';
      context2D.fillStyle = 'white';
      context2D.textAlign = 'center';
      context2D.shadowColor = 'rgba(0,0,0,0.8)';
      context2D.shadowBlur = 4;
      context2D.fillText(timeline.name.substring(0, 20), 128, 40);
      
      const labelTexture = new THREE.CanvasTexture(canvas2D);
      const labelMaterial = new THREE.SpriteMaterial({ 
        map: labelTexture,
        transparent: true,
        opacity: 0.9
      });
      const label = new THREE.Sprite(labelMaterial);
      label.position.set(x, buildingHeight + 2, z);
      label.scale.set(3, 0.8, 1);
      timelineGroup.add(label);
    });

    // Add some magical floating elements
    const createMagicalOrbs = () => {
      const orbGroup = new THREE.Group();
      for (let i = 0; i < 20; i++) {
        const orbGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const orbMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(Math.random(), 0.7, 0.8),
          transparent: true,
          opacity: 0.6
        });
        const orb = new THREE.Mesh(orbGeometry, orbMaterial);
        orb.position.set(
          (Math.random() - 0.5) * 30,
          Math.random() * 15 + 5,
          (Math.random() - 0.5) * 30
        );
        orbGroup.add(orb);
      }
      return orbGroup;
    };

    const magicalOrbs = createMagicalOrbs();
    scene.add(magicalOrbs);
    scene.add(timelineGroup);

    // Enhanced animation with multiple movements
    let time = 0;
    let frameId;
    function animate() {
      time += 0.01;
      
      // Gentle rotation of the main group
      timelineGroup.rotation.y += 0.003;
      
      // Floating animation for islands
      timelineGroup.children.forEach((child, index) => {
        if (child.position) {
          child.position.y = Math.sin(time + index * 0.5) * 0.2;
        }
      });
      
      // Animate magical orbs
      magicalOrbs.children.forEach((orb, index) => {
        orb.position.y += Math.sin(time * 2 + index) * 0.02;
        orb.rotation.x += 0.01;
        orb.rotation.y += 0.015;
      });
      
      // Camera gentle movement
      camera.position.x = Math.sin(time * 0.5) * 2 + 8;
      camera.position.z = Math.cos(time * 0.5) * 2 + 15;
      camera.lookAt(0, 2, 0);
      
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
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (object.material.map) object.material.map.dispose();
          object.material.dispose();
        }
      });
      el.removeChild(renderer.domElement);
    };
  }, [timelines]);

  return <div ref={mountRef} className="canvas-wrap" />;
}