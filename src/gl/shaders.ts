export const vertexShader = `
attribute vec2 aPosition;

void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

export const fragmentShader = `
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform float uDepth;
uniform float uDescent;
uniform vec3 uPointer;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

vec2 hash2(vec2 p) {
  float h = hash(p);
  return vec2(h, hash(p + h));
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.03;
    amplitude *= 0.5;
  }
  return value;
}

float caustic(vec2 uv, float time) {
  vec2 p = mod(uv * 6.28318, 6.28318) - 250.0;
  vec2 i = p;
  float c = 1.0;
  for (int n = 0; n < 4; n++) {
    float t = time * (1.0 - 3.5 / float(n + 1));
    i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + t) / 0.005), p.y / (cos(i.y + t) / 0.005)));
  }
  c = 1.17 - pow(c / 4.0, 1.4);
  return pow(abs(c), 8.0);
}

float specks(vec2 p, float scale, float size, float seed) {
  vec2 g = p * scale;
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;
  vec2 offset = (hash2(id + seed) - 0.5) * 0.7;
  float visible = step(0.55, hash(id + seed + 7.0));
  return visible * smoothstep(size, 0.0, length(f - offset));
}

vec3 bioluminescence(vec2 p, float time, float drift) {
  vec2 shift = vec2(0.0, drift * 0.8 + time * 0.012);
  vec2 bp = p * 3.0 + shift;
  vec2 id = floor(bp);
  vec2 f = fract(bp);
  vec3 light = vec3(0.0);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 cell = id + vec2(float(x), float(y));
      float h = hash(cell + 3.0);
      if (h < 0.45) continue;
      vec2 seed = hash2(cell);
      vec2 offset = 0.5 + 0.35 * sin(time * (0.2 + 0.3 * seed) + 6.28 * seed);
      vec2 world = (cell + offset - shift) / 3.0;
      float excited = smoothstep(0.45, 0.0, distance(world, uPointer.xy)) * uPointer.z;
      float pulse = 0.5 + 0.5 * sin(time * (1.0 + h * 2.0) + h * 20.0);
      float r = length(cell + offset - bp);
      float glow = exp(-r * r * 900.0) * 2.2 + exp(-r * 22.0) * 0.22;
      vec3 hue = mix(vec3(0.2, 0.95, 0.85), vec3(0.35, 0.5, 1.0), fract(h * 7.0));
      hue = mix(hue, vec3(0.8, 0.4, 1.0), step(0.9, fract(h * 13.0)));
      light += hue * glow * (pulse * 0.5 + 0.12 + excited * 2.4);
    }
  }
  return light;
}

float bandf(float a, float b, float f, float x) {
  return smoothstep(a, a + f, x) * (1.0 - smoothstep(b - f, b, x));
}

float fishShape(vec2 q, float wag) {
  q.y += sin(q.x * 6.0 + wag) * 0.05 * (q.x + 0.5);
  float body = smoothstep(0.03, 0.0, length(q * vec2(1.0, 2.8)) - 0.45);
  float tx = q.x - 0.38;
  float tail = step(0.0, tx) * step(tx, 0.3) * smoothstep(0.02, 0.0, abs(q.y) - tx * 0.9);
  return max(body, tail);
}

float school(vec2 p, float aspect, float time, float seed, float size, float speed, float lane, float spread) {
  float mask = 0.0;
  float span = aspect + 0.8;
  for (int i = 0; i < 12; i++) {
    float fi = float(i);
    vec2 h = hash2(vec2(fi, seed));
    float dir = step(0.5, hash(vec2(floor(fi / 4.0), seed))) * 2.0 - 1.0;
    float x = dir * (0.5 * aspect + 0.4 - fract(h.x + time * speed * (0.85 + 0.3 * h.y) + seed * 0.37) * span);
    float y = lane + (h.y - 0.5) * spread + sin(time * 0.7 + fi) * 0.01;
    vec2 q = (p - vec2(x, y)) / (size * (0.7 + 0.6 * h.x));
    q.x *= dir;
    mask = max(mask, fishShape(q, time * 9.0 + fi * 2.0));
  }
  return mask;
}

float jelly(vec2 q, float time) {
  float bell = smoothstep(0.03, 0.0, length(q * vec2(1.0, 1.5)) - 0.5) * step(-0.04, q.y);
  float tentacles = 0.0;
  for (int k = 0; k < 4; k++) {
    float fk = float(k);
    float x = -0.3 + fk * 0.2 + sin(q.y * 7.0 + time * 2.0 + fk) * 0.05;
    tentacles += smoothstep(0.035, 0.0, abs(q.x - x)) * step(q.y, 0.0) * step(-1.2, q.y) * (1.0 + q.y * 0.8);
  }
  return max(bell, tentacles * 0.8);
}

vec3 seabed(vec2 p, vec3 col, float aspect, float time, float rise) {
  float ground = mix(-0.35, 0.2, rise) + fbm(vec2(p.x * 1.4, 3.0)) * 0.1 + sin(p.x * 2.6) * 0.02;
  vec3 silt = vec3(0.05, 0.07, 0.085) + vec3(0.03, 0.05, 0.05) * smoothstep(ground - 0.25, ground, p.y);
  col = mix(col, silt, smoothstep(ground + 0.004, ground - 0.004, p.y));
  for (int k = 0; k < 14; k++) {
    float fk = float(k);
    float h = hash(vec2(fk, 9.0));
    float x0 = (h - 0.5) * aspect * 1.1;
    float base = mix(-0.35, 0.2, rise) + fbm(vec2(x0 * 1.4, 3.0)) * 0.1 + sin(x0 * 2.6) * 0.02;
    float height = 0.12 + 0.22 * hash(vec2(fk, 4.0));
    float along = clamp((p.y - base) / height, 0.0, 1.0);
    float x = x0 + sin(along * 3.0 + time * 1.1 + fk) * 0.025 * along;
    float width = 0.006 * (1.0 - along * 0.6);
    float stem = smoothstep(width, 0.0, abs(p.x - x)) * step(base - 0.01, p.y) * step(p.y, base + height);
    col = mix(col, vec3(0.03, 0.12, 0.11), stem * 0.9);
    vec2 tip = vec2(x0 + sin(3.0 + time * 1.1 + fk) * 0.025, base + height);
    vec3 tint = mix(vec3(0.3, 1.0, 0.85), vec3(1.0, 0.45, 0.8), step(0.6, h));
    col += tint * exp(-pow(length(p - tip) * 70.0, 2.0)) * (0.6 + 0.4 * sin(time * 2.0 + fk));
    col += tint * exp(-length(p - vec2(x0 * 0.7 + 0.1, base)) * 60.0) * 0.25;
  }
  return col;
}


void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y);
  float d = uDepth;
  float t = uTime;

  float shallow = 1.0 - smoothstep(0.08, 0.66, d);
  vec3 top = mix(vec3(0.02, 0.05, 0.1), vec3(0.16, 0.62, 0.72), shallow);
  vec3 bottom = mix(vec3(0.0, 0.008, 0.02), vec3(0.04, 0.3, 0.45), shallow * shallow);
  vec3 col = mix(bottom, top, pow(uv.y, 1.4));
  col = mix(col, vec3(0.0, 0.01, 0.025), smoothstep(0.62, 0.95, d));

  float sunlight = 1.0 - smoothstep(0.05, 0.5, d);
  float c = caustic(p * 1.6 + vec2(0.0, uDescent * 0.3), t * 0.5);
  col += vec3(0.6, 0.9, 0.95) * c * 0.22 * sunlight * smoothstep(0.15, 1.0, uv.y);
  float rays = pow(fbm(vec2(p.x * 2.5 + p.y * 0.8, t * 0.04)), 3.0) * 2.0;
  col += vec3(0.7, 0.95, 1.0) * rays * 0.22 * sunlight * uv.y;

  float snow = specks(p + vec2(0.0, uDescent * 0.6 + t * 0.004), 26.0, 0.06, 1.0) * 0.5;
  snow += specks(p + vec2(0.0, uDescent * 1.2 + t * 0.008), 14.0, 0.07, 2.0);
  col += vec3(0.75, 0.85, 0.95) * snow * mix(0.2, 0.45, smoothstep(0.3, 0.7, d));

  col += bioluminescence(p, t, uDescent) * smoothstep(0.56, 0.68, d);

  float sunFish = bandf(0.06, 0.44, 0.06, d);
  if (sunFish > 0.0) {
    float m = school(p, aspect, t, 1.0, 0.035, 0.035, 0.55 + (d - 0.25) * 2.4, 0.18);
    m = max(m, school(p, aspect, t, 5.0, 0.06, 0.02, 0.3 + (d - 0.3) * 2.0, 0.12));
    col = mix(col, col * 0.4 + vec3(0.04, 0.07, 0.09), m * sunFish);
  }
  float twilight = bandf(0.36, 0.68, 0.06, d);
  if (twilight > 0.0) {
    float m = school(p, aspect, t, 11.0, 0.03, 0.025, 0.4 + (d - 0.52) * 2.6, 0.3);
    col = mix(col, vec3(0.01, 0.03, 0.06), m * twilight);
    col += vec3(0.25, 0.6, 1.0) * m * 0.35 * twilight;
    for (int j = 0; j < 3; j++) {
      float fj = float(j);
      vec2 center = vec2((fj - 1.0) * 0.45 * aspect * 0.6, fract(0.3 * fj + t * 0.01 + d * 1.8) * 1.4 - 0.2);
      float jm = jelly((p - center) / 0.09, t + fj);
      col += vec3(1.0, 0.5, 0.85) * jm * 0.45 * twilight;
    }
  }
  float midnightFish = bandf(0.62, 0.92, 0.05, d);
  if (midnightFish > 0.0) {
    float m = school(p, aspect, t, 21.0, 0.045, 0.015, 0.5 + (d - 0.77) * 2.4, 0.5);
    col += vec3(0.3, 0.95, 0.85) * m * 0.3 * midnightFish;
  }
  float rise = smoothstep(0.9, 1.0, d);
  if (rise > 0.0) col = seabed(p, col, aspect, t, rise);
  float lamp = smoothstep(0.55, 0.0, distance(p, uPointer.xy)) * uPointer.z;
  col += vec3(0.08, 0.16, 0.2) * lamp * lamp * smoothstep(0.45, 0.75, d);

  float surface = 0.74 + d * 14.0;
  float wave = surface + 0.012 * sin(p.x * 9.0 + t * 1.4) + 0.008 * sin(p.x * 17.0 - t * 2.1);
  vec3 sky = mix(vec3(0.62, 0.84, 0.9), vec3(0.99, 0.93, 0.8), smoothstep(wave, 1.0, uv.y));
  sky += vec3(1.0, 0.95, 0.8) * smoothstep(0.1, 0.0, distance(p, vec2(0.25 * aspect, 0.9))) * 0.7;
  col = mix(col, sky, smoothstep(wave - 0.003, wave + 0.003, uv.y));

  col *= 1.0 - 0.35 * pow(length(uv - 0.5) * 1.2, 2.0);
  gl_FragColor = vec4(col, 1.0);
}
`
