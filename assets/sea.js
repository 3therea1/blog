const S = 2;
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

const DEEP = [30, 46, 104];
const BLUE = [62, 98, 170];
const MID = [104, 140, 206];
const FOAM = [152, 184, 232];
const LAV = [140, 154, 216];
const CREAM = [246, 245, 232];
const HAZE = [200, 208, 236];

function mix(a, b, t) {
  return a.map((value, k) => value + (b[k] - value) * t);
}

function hash(x, y) {
  let n = (x * 374761393 + y * 668265263) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);

  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

function noise(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const smooth = (t) => t * t * (3 - 2 * t);
  const u = smooth(x - xi);
  const v = smooth(y - yi);

  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);

  return (a + (b - a) * u) * (1 - v) + (c + (d - c) * u) * v;
}

function sea(u, depth, t, d0) {
  const z = depth >= d0 ? 1 / depth : 1 / d0 + (d0 - depth) / (d0 * d0);
  const px = u * z * 3;
  const pz = z * 2 + t * 0.0006;

  return Math.sin(pz * 6 + noise(px, pz) * 5) * 0.5 + noise(px * 3, pz * 4 - t * 0.0004) * 0.6 + depth * 0.4;
}

function seaColor(value) {
  if (value > 1.05) return FOAM;
  if (value > 0.65) return MID;
  if (value > 0.2) return BLUE;

  return DEEP;
}

function scene(canvas, seed) {
  const w = (canvas.width = Math.max(1, Math.ceil(canvas.clientWidth / S)));
  const h = (canvas.height = Math.max(1, Math.ceil(canvas.clientHeight / S)));
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(w, h);
  const horizon = Math.round(h * (0.3 + (seed % 3) * 0.06));
  const d0 = Math.sqrt(10 / (h - horizon));

  return (t) => {
    const data = img.data;
    const time = t + seed * 9000;

    for (let y = 0, i = 0; y < h; y++) {
      for (let x = 0; x < w; x++, i += 4) {
        const grain = (Math.random() - 0.5) * 0.45;
        let color;

        if (y > horizon) {
          const v = (y - horizon) / (h - horizon);
          const value = sea(x / w + seed, v, time, d0) + grain;
          const haze = Math.max(0, 1 - v / 0.22);

          color = mix(seaColor(value), HAZE, haze * haze * 0.9);
        } else {
          const glow = Math.min(1, Math.exp(-(horizon - y) / (h * 0.35)) * 1.1);

          color = mix(LAV, CREAM, glow).map((value) => value + grain * 18);
        }

        data[i] = color[0];
        data[i + 1] = color[1];
        data[i + 2] = color[2];
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(img, 0, 0);
  };
}

const sky = document.createElement("canvas");
const skyCtx = sky.getContext("2d");

sky.id = "sky";
sky.setAttribute("aria-hidden", "true");
document.body.prepend(sky);

let skyW;
let skyH;
let skyImg;

function sizeSky() {
  skyW = sky.width = Math.ceil(innerWidth / S);
  skyH = sky.height = Math.ceil(innerHeight / S);
  skyImg = skyCtx.createImageData(skyW, skyH);
}

function drawSky() {
  const data = skyImg.data;
  const cx = skyW * 0.7;
  const radius = Math.max(skyW, skyH) * 0.45;

  for (let y = 0, i = 0; y < skyH; y++) {
    for (let x = 0; x < skyW; x++, i += 4) {
      const glow = Math.min(1, Math.exp(-Math.hypot(x - cx, y) / radius) * 1.15);
      const grain = (Math.random() - 0.5) * 8;
      const color = mix(LAV, CREAM, glow).map((value) => value + grain);

      data[i] = color[0];
      data[i + 1] = color[1];
      data[i + 2] = color[2];
      data[i + 3] = 255;
    }
  }

  skyCtx.putImageData(skyImg, 0, 0);
}

let live = [];

function build() {
  live = [...document.querySelectorAll("canvas[data-seed]")]
    .filter((canvas) => canvas.offsetParent)
    .map((canvas) => scene(canvas, Number(canvas.dataset.seed)));

  live.forEach((draw) => draw(0));
}

let last = 0;

function loop(t) {
  if (t - last > 90) {
    drawSky();
    live.forEach((draw) => draw(t));
    last = t;
  }

  requestAnimationFrame(loop);
}

sizeSky();
drawSky();
build();

addEventListener("resize", () => {
  sizeSky();
  drawSky();
  build();
});

if (!still) {
  requestAnimationFrame(loop);
}
