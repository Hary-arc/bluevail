import { useRef, useEffect } from 'react';
import * as THREE from 'three';

// ── Base vertex shader for fullscreen quad ──
const baseVertexShader = `
  varying vec2 v_uv;
  void main() {
    v_uv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// ── Splat shader ──
const splatShader = {
  uniforms: {
    uTarget: { value: null },
    uPoint: { value: new THREE.Vector2(0.5, 0.5) },
    uColor: { value: new THREE.Vector3(0.0, 0.0, 0.0) },
    uRadius: { value: 0.15 },
  },
  vertexShader: baseVertexShader,
  fragmentShader: `
    uniform sampler2D uTarget;
    uniform vec2 uPoint;
    uniform vec3 uColor;
    uniform float uRadius;
    varying vec2 v_uv;

    void main() {
      vec2 p = v_uv - uPoint;
      p.x *= 1.0; // aspect handled by caller
      float splat = exp(-dot(p, p) / (uRadius * uRadius));
      vec3 base = texture2D(uTarget, v_uv).xyz;
      gl_FragColor = vec4(base + uColor * splat, 1.0);
    }
  `
};

// ── Advection shader ──
const advectionShader = {
  uniforms: {
    uVelocity: { value: null },
    uSource: { value: null },
    uTexelSize: { value: new THREE.Vector2(1, 1) },
    uDt: { value: 0.016 },
    uDissipation: { value: 0.99 },
  },
  vertexShader: baseVertexShader,
  fragmentShader: `
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 uTexelSize;
    uniform float uDt;
    uniform float uDissipation;
    varying vec2 v_uv;

    void main() {
      vec2 coord = v_uv - uDt * texture2D(uVelocity, v_uv).xy * uTexelSize;
      vec4 result = uDissipation * texture2D(uSource, coord);
      gl_FragColor = result;
    }
  `
};

// ── Divergence shader ──
const divergenceShader = {
  uniforms: {
    uVelocity: { value: null },
    uTexelSize: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: baseVertexShader,
  fragmentShader: `
    uniform sampler2D uVelocity;
    uniform vec2 uTexelSize;
    varying vec2 v_uv;

    void main() {
      float L = texture2D(uVelocity, v_uv - vec2(uTexelSize.x, 0.0)).x;
      float R = texture2D(uVelocity, v_uv + vec2(uTexelSize.x, 0.0)).x;
      float B = texture2D(uVelocity, v_uv - vec2(0.0, uTexelSize.y)).y;
      float T = texture2D(uVelocity, v_uv + vec2(0.0, uTexelSize.y)).y;
      float div = 0.5 * (R - L + T - B);
      gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
  `
};

// ── Pressure solve shader ──
const pressureShader = {
  uniforms: {
    uPressure: { value: null },
    uDivergence: { value: null },
    uTexelSize: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: baseVertexShader,
  fragmentShader: `
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;
    uniform vec2 uTexelSize;
    varying vec2 v_uv;

    void main() {
      float L = texture2D(uPressure, v_uv - vec2(uTexelSize.x, 0.0)).x;
      float R = texture2D(uPressure, v_uv + vec2(uTexelSize.x, 0.0)).x;
      float B = texture2D(uPressure, v_uv - vec2(0.0, uTexelSize.y)).x;
      float T = texture2D(uPressure, v_uv + vec2(0.0, uTexelSize.y)).x;
      float div = texture2D(uDivergence, v_uv).x;
      float pressure = (L + R + B + T - div) * 0.25;
      gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
    }
  `
};

// ── Gradient subtraction shader ──
const gradientSubShader = {
  uniforms: {
    uPressure: { value: null },
    uVelocity: { value: null },
    uTexelSize: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: baseVertexShader,
  fragmentShader: `
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;
    uniform vec2 uTexelSize;
    varying vec2 v_uv;

    void main() {
      float L = texture2D(uPressure, v_uv - vec2(uTexelSize.x, 0.0)).x;
      float R = texture2D(uPressure, v_uv + vec2(uTexelSize.x, 0.0)).x;
      float B = texture2D(uPressure, v_uv - vec2(0.0, uTexelSize.y)).x;
      float T = texture2D(uPressure, v_uv + vec2(0.0, uTexelSize.y)).x;
      vec2 vel = texture2D(uVelocity, v_uv).xy;
      vel -= 0.5 * vec2(R - L, T - B);
      gl_FragColor = vec4(vel, 0.0, 1.0);
    }
  `
};

// ── Display shader with SDF dental cross ──
const displayShader = {
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uFluid: { value: null },
    uFluidColor: { value: new THREE.Vector3(0.96, 0.97, 0.93) },
  },
  vertexShader: baseVertexShader,
  fragmentShader: `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform sampler2D uFluid;
    uniform vec3 uFluidColor;
    varying vec2 v_uv;

    float sdCross(vec2 p, vec2 b, float r) {
      p = abs(p);
      float q = p.y - p.x;
      float w = max(q, 0.0);
      float v = max(-q, 0.0);
      float d1 = length(p - b * vec2(step(0.0, q))) - r;
      float d2 = length(vec2(p.x, q) - w * vec2(0.0, 1.0)) - r;
      float d3 = length(vec2(p.y, -q) - v * vec2(0.0, 1.0)) - r;
      return min(max(d1, d2), d3);
    }

    float smootherstep(float edge0, float edge1, float x) {
      float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
      return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
    }

    void main() {
      vec4 fluidState = texture2D(uFluid, v_uv);
      vec2 fluidVel = fluidState.rg;
      float fluidInk = fluidState.b;
      vec2 uv = v_uv + fluidVel * (0.038 + 0.18 * fluidInk);
      vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
      float d = sdCross(p, vec2(0.12, 0.04), 0.015);
      float mask = 1.0 - smootherstep(-0.005, 0.0, d);
      vec3 col = vec3(0.0);
      col += fluidInk * uFluidColor * mask * 0.8;
      col += uFluidColor * mask * 0.08;
      gl_FragColor = vec4(col, 1.0);
    }
  `
};

// ── FBO Helper ──
function createFBO(width: number, height: number) {
  const rt = new THREE.WebGLRenderTarget(width, height, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.HalfFloatType,
  });
  return rt;
}

function createDoubleFBO(width: number, height: number) {
  let fbo1 = createFBO(width, height);
  let fbo2 = createFBO(width, height);
  return {
    get read() { return fbo1; },
    get write() { return fbo2; },
    swap() { const temp = fbo1; fbo1 = fbo2; fbo2 = temp; },
  };
}

export default function FluidLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);
  const isInitRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const SIM_SCALE = 0.25;
    const PRESSURE_ITERATIONS = 20;
    const w = Math.floor(container.offsetWidth * SIM_SCALE) || 256;
    const h = Math.floor(container.offsetHeight * SIM_SCALE) || 128;
    const _aspect = container.offsetWidth / container.offsetHeight; // eslint-disable-line @typescript-eslint/no-unused-vars
    void _aspect;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(1);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    // Camera for fullscreen quad
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quadGeo = new THREE.PlaneGeometry(2, 2);

    // Simulation FBOs
    const velocityFBO = createDoubleFBO(w, h);
    const pressureFBO = createDoubleFBO(w, h);
    const divergenceFBO = createFBO(w, h);
    const densityFBO = createDoubleFBO(w, h);

    // Materials
    const splatMat = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(splatShader.uniforms),
      vertexShader: splatShader.vertexShader,
      fragmentShader: splatShader.fragmentShader,
    });

    const advectVelMat = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(advectionShader.uniforms),
      vertexShader: advectionShader.vertexShader,
      fragmentShader: advectionShader.fragmentShader,
    });
    advectVelMat.uniforms.uTexelSize.value.set(1 / w, 1 / h);

    const advectDensMat = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(advectionShader.uniforms),
      vertexShader: advectionShader.vertexShader,
      fragmentShader: advectionShader.fragmentShader,
    });
    advectDensMat.uniforms.uTexelSize.value.set(1 / w, 1 / h);
    advectDensMat.uniforms.uDissipation.value = 0.97;

    const divMat = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(divergenceShader.uniforms),
      vertexShader: divergenceShader.vertexShader,
      fragmentShader: divergenceShader.fragmentShader,
    });
    divMat.uniforms.uTexelSize.value.set(1 / w, 1 / h);

    const pressureMat = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(pressureShader.uniforms),
      vertexShader: pressureShader.vertexShader,
      fragmentShader: pressureShader.fragmentShader,
    });
    pressureMat.uniforms.uTexelSize.value.set(1 / w, 1 / h);

    const gradSubMat = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(gradientSubShader.uniforms),
      vertexShader: gradientSubShader.vertexShader,
      fragmentShader: gradientSubShader.fragmentShader,
    });
    gradSubMat.uniforms.uTexelSize.value.set(1 / w, 1 / h);

    const displayMat = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(displayShader.uniforms),
      vertexShader: displayShader.vertexShader,
      fragmentShader: displayShader.fragmentShader,
    });
    displayMat.uniforms.uResolution.value.set(container.offsetWidth, container.offsetHeight);

    const quad = new THREE.Mesh(quadGeo, displayMat);
    const scene = new THREE.Scene();
    scene.add(quad);

    const simScene = new THREE.Scene();
    const simQuad = new THREE.Mesh(quadGeo);
    simScene.add(simQuad);

    // Splash function
    const splash = (x: number, y: number, dx: number, dy: number, force: number, radius: number) => {
      // Velocity splat
      splatMat.uniforms.uTarget.value = velocityFBO.read.texture;
      splatMat.uniforms.uPoint.value.set(x, y);
      splatMat.uniforms.uColor.value.set(dx * force, dy * force, 0);
      splatMat.uniforms.uRadius.value = radius;
      simQuad.material = splatMat;
      renderer.setRenderTarget(velocityFBO.write);
      renderer.render(simScene, camera);
      velocityFBO.swap();

      // Density splat
      splatMat.uniforms.uTarget.value = densityFBO.read.texture;
      splatMat.uniforms.uColor.value.set(0.96 * force * 0.0005, 0.97 * force * 0.0005, 0.93 * force * 0.0005);
      simQuad.material = splatMat;
      renderer.setRenderTarget(densityFBO.write);
      renderer.render(simScene, camera);
      densityFBO.swap();
    };

    // Initial splash to reveal logo
    setTimeout(() => {
      splash(0.5, 0.5, 0, 0, 2000, 0.2);
    }, 500);

    // Auto-splash timer
    const autoSplashTimer = setInterval(() => {
      if (!isVisibleRef.current) return;
      const ax = Math.random() * 0.6 + 0.2;
      const ay = Math.random() * 0.6 + 0.2;
      const adx = (Math.random() - 0.5) * 2;
      const ady = (Math.random() - 0.5) * 2;
      splash(ax, ay, adx, ady, 1500, 0.1);
    }, 5000);

    // Click handler
    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      splash(x, y, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, 4000, 0.15);
    };
    container.addEventListener('click', onClick);

    // Visibility observer
    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    observer.observe(container);
    isInitRef.current = true;

    // Animation loop
    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!isVisibleRef.current) return;

      // Advect velocity
      advectVelMat.uniforms.uVelocity.value = velocityFBO.read.texture;
      advectVelMat.uniforms.uSource.value = velocityFBO.read.texture;
      advectVelMat.uniforms.uDt.value = 0.016;
      simQuad.material = advectVelMat;
      renderer.setRenderTarget(velocityFBO.write);
      renderer.render(simScene, camera);
      velocityFBO.swap();

      // Advect density
      advectDensMat.uniforms.uVelocity.value = velocityFBO.read.texture;
      advectDensMat.uniforms.uSource.value = densityFBO.read.texture;
      advectDensMat.uniforms.uDt.value = 0.016;
      simQuad.material = advectDensMat;
      renderer.setRenderTarget(densityFBO.write);
      renderer.render(simScene, camera);
      densityFBO.swap();

      // Compute divergence
      divMat.uniforms.uVelocity.value = velocityFBO.read.texture;
      simQuad.material = divMat;
      renderer.setRenderTarget(divergenceFBO);
      renderer.render(simScene, camera);

      // Solve pressure
      pressureMat.uniforms.uDivergence.value = divergenceFBO.texture;
      for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
        pressureMat.uniforms.uPressure.value = pressureFBO.read.texture;
        simQuad.material = pressureMat;
        renderer.setRenderTarget(pressureFBO.write);
        renderer.render(simScene, camera);
        pressureFBO.swap();
      }

      // Subtract gradient
      gradSubMat.uniforms.uPressure.value = pressureFBO.read.texture;
      gradSubMat.uniforms.uVelocity.value = velocityFBO.read.texture;
      simQuad.material = gradSubMat;
      renderer.setRenderTarget(velocityFBO.write);
      renderer.render(simScene, camera);
      velocityFBO.swap();

      // Display
      displayMat.uniforms.uFluid.value = densityFBO.read.texture;
      displayMat.uniforms.uTime.value += 0.016;
      quad.material = displayMat;
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      const cw = container.offsetWidth;
      const ch = container.offsetHeight;
      renderer.setSize(cw, ch);
      displayMat.uniforms.uResolution.value.set(cw, ch);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(autoSplashTimer);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative cursor-pointer"
    />
  );
}
