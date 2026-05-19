import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AuroraSky() {

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    const container = containerRef.current;

    if (!container) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera =
      new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

    camera.position.z = 5;

    // Renderer
    const renderer =
      new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    renderer.setClearColor(0x000000, 1);

    container.appendChild(renderer.domElement);

    // ─────────────────────────────
    // AURORA
    // ─────────────────────────────

    const auroraGeometry =
      new THREE.PlaneGeometry(
        12,
        6,
        200,
        40
      );

    const auroraMaterial =
      new THREE.ShaderMaterial({

        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,

        uniforms: {
          uTime: { value: 0 }
        },

        vertexShader: `
uniform float uTime;

varying vec2 vUv;

void main() {

  vUv = uv;

  vec3 pos = position;

  // flowing waves
  pos.y +=
      sin(pos.x * 2.0 + uTime)
    * 0.25;

  pos.y +=
      sin(pos.x * 4.0 - uTime * 0.7)
    * 0.12;

  // curtain depth
  pos.z +=
      sin(pos.x * 1.5 + uTime * 0.5)
    * 0.3;

  gl_Position =
      projectionMatrix *
      modelViewMatrix *
      vec4(pos, 1.0);
}
`,

fragmentShader: `
uniform float uTime;

varying vec2 vUv;

void main() {

  vec2 uv = vUv;

  float ribbon =
      smoothstep(
        0.4,
        0.0,
        abs(uv.y - 0.5)
      );

  float glow =
      sin(
        uv.x * 10.0 +
        uTime * 1.5
      ) * 0.5 + 0.5;

  float fade =
      smoothstep(0.0, 0.08, uv.x)
    *
      smoothstep(0.0, 0.08, 1.0 - uv.x);

  float alpha =
      ribbon
    * glow
    * fade
    * 0.75;

  vec3 color =
      mix(
        vec3(0.0, 1.0, 0.7),
        vec3(0.3, 1.0, 1.0),
        uv.y
      );

  gl_FragColor =
      vec4(color, alpha);
}
`
      });

    const aurora =
      new THREE.Mesh(
        auroraGeometry,
        auroraMaterial
      );

    aurora.position.y = 1;

    aurora.rotation.x =
      -Math.PI * 0.15;

    scene.add(aurora);

    // ─────────────────────────────
    // STARS
    // ─────────────────────────────

    const starCount = 1200;

    const starPositions =
      new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {

      starPositions[i * 3] =
        (Math.random() - 0.5) * 80;

      starPositions[i * 3 + 1] =
        Math.random() * 40;

      starPositions[i * 3 + 2] =
        -Math.random() * 50;
    }

    const starGeometry =
      new THREE.BufferGeometry();

    starGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(
        starPositions,
        3
      )
    );

    const starMaterial =
      new THREE.PointsMaterial({
        color: '#ffffff',
        size: 0.06,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

    const stars =
      new THREE.Points(
        starGeometry,
        starMaterial
      );

    scene.add(stars);

    // ─────────────────────────────
    // ANIMATION
    // ─────────────────────────────

    const clock = new THREE.Clock();

    let raf: number;

    const animate = () => {

      raf =
        requestAnimationFrame(animate);

      const elapsed =
        clock.getElapsedTime();

      auroraMaterial.uniforms.uTime.value =
        elapsed;

      // subtle star movement
      stars.rotation.y =
        elapsed * 0.01;

      renderer.render(
        scene,
        camera
      );
    };

    animate();

    // ─────────────────────────────
    // RESIZE
    // ─────────────────────────────

    const onResize = () => {

      camera.aspect =
        window.innerWidth /
        window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );
    };

    window.addEventListener(
      'resize',
      onResize
    );

    // ─────────────────────────────
    // CLEANUP
    // ─────────────────────────────

    return () => {

      cancelAnimationFrame(raf);

      window.removeEventListener(
        'resize',
        onResize
      );

      auroraGeometry.dispose();
      auroraMaterial.dispose();

      starGeometry.dispose();
      starMaterial.dispose();

      renderer.dispose();

      container.removeChild(
        renderer.domElement
      );
    };

  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
      }}
    />
  );
}