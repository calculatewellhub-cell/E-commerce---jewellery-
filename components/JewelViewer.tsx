"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

interface Props {
  metal?: string;
  gem?: string | null;
  /** Hero adds floating gold dust and a slower, cinematic drift. */
  variant?: "hero" | "product";
  className?: string;
  label?: string;
}

/** Real-time 3D ring rendered with three.js: physically based metal and a refractive brilliant-cut stone. */
export default function JewelViewer({ metal = "#e6c068", gem = "#dff3ff", variant = "product", className, label = "Interactive 3D jewellery model" }: Props) {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.6, variant === "hero" ? 6.6 : 5.4);
    camera.lookAt(0, 0.15, 0);

    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 4, 5);
    const rim = new THREE.DirectionalLight(0xffe2b0, 1.4);
    rim.position.set(-4, 2, -3);
    scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.25));

    const jewel = new THREE.Group();
    scene.add(jewel);

    const metalMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(metal),
      metalness: 1,
      roughness: 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.6,
    });

    // Band
    const band = new THREE.Mesh(new THREE.TorusGeometry(1, 0.11, 64, 220), metalMat);
    band.scale.set(1, 1, 1.6);
    jewel.add(band);

    const disposables: { dispose: () => void }[] = [band.geometry, metalMat, envTex, pmrem];

    if (gem) {
      // Head: four prongs rising from the top of the band
      const prongGeo = new THREE.CylinderGeometry(0.025, 0.035, 0.42, 12);
      disposables.push(prongGeo);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const prong = new THREE.Mesh(prongGeo, metalMat);
        prong.position.set(Math.cos(a) * 0.2, 1.24, Math.sin(a) * 0.2);
        prong.rotation.z = -Math.cos(a) * 0.35;
        prong.rotation.x = Math.sin(a) * 0.35;
        jewel.add(prong);
      }
      const basket = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 12, 48), metalMat);
      basket.rotation.x = Math.PI / 2;
      basket.position.y = 1.12;
      jewel.add(basket);
      disposables.push(basket.geometry);

      // Brilliant cut: lathe profile (culet → pavilion → girdle → crown → table), faceted.
      const profile = [
        new THREE.Vector2(0.0, -0.36),
        new THREE.Vector2(0.4, 0.0),
        new THREE.Vector2(0.4, 0.035),
        new THREE.Vector2(0.24, 0.2),
        new THREE.Vector2(0.0, 0.2),
      ];
      const gemGeo = new THREE.LatheGeometry(profile, 16).toNonIndexed();
      gemGeo.computeVertexNormals();
      const isOpaque = gem === "#1b1b1b" || gem === "#f7efe6";
      const gemMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(gem),
        metalness: 0,
        roughness: isOpaque ? 0.25 : 0,
        transmission: isOpaque ? 0 : 1,
        thickness: 0.8,
        ior: 2.2,
        dispersion: 4,
        iridescence: isOpaque ? 0.4 : 0.15,
        envMapIntensity: 3.5,
        flatShading: !isOpaque,
        clearcoat: 1,
      });
      const stone = new THREE.Mesh(isOpaque ? new THREE.SphereGeometry(0.3, 48, 48) : gemGeo, gemMat);
      stone.position.y = 1.42;
      jewel.add(stone);
      disposables.push(gemGeo, gemMat, stone.geometry);
    } else {
      // No stone: a stacked second band with a hammered twist
      const band2 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.95, 0.045, 400, 12, 1, 24), metalMat);
      band2.scale.set(1, 1, 1.4);
      band2.position.y = -0.02;
      jewel.add(band2);
      disposables.push(band2.geometry);
    }

    jewel.rotation.x = -0.25;
    jewel.position.y = gem ? -0.35 : 0.1;

    // Gold dust
    let dust: THREE.Points | null = null;
    if (variant === "hero") {
      const n = 380;
      const pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 9;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 5 - 1;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const m = new THREE.PointsMaterial({ color: 0xf3d58a, size: 0.025, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending });
      dust = new THREE.Points(g, m);
      scene.add(dust);
      disposables.push(g, m);
    }

    // Interaction: drag to rotate, hover parallax
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let velY = 0;
    let tiltX = 0;
    const target = { x: 0, y: 0 };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!dragging) return;
      velY = (e.clientX - lastX) * 0.01;
      tiltX = Math.max(-0.8, Math.min(0.8, tiltX + (e.clientY - lastY) * 0.005));
      jewel.rotation.y += velY;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = () => (dragging = false);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onUp);

    const resize = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);

    const clock = new THREE.Clock();
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const t = clock.getElapsedTime();
      if (!dragging) {
        velY *= 0.94;
        jewel.rotation.y += reduced ? 0 : 0.006 + velY;
      }
      jewel.rotation.x += (-0.25 + tiltX + target.y * 0.12 - jewel.rotation.x) * 0.05;
      jewel.rotation.z += (target.x * -0.08 - jewel.rotation.z) * 0.05;
      if (!reduced) jewel.position.y = (gem ? -0.35 : 0.1) + Math.sin(t * 1.2) * 0.06;
      if (dust && !reduced) {
        dust.rotation.y = t * 0.02;
        dust.position.y = Math.sin(t * 0.3) * 0.1;
      }
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onUp);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [metal, gem, variant]);

  return <div ref={mount} className={className} role="img" aria-label={label} style={{ touchAction: "pan-y", cursor: "grab" }} />;
}
