import chroma from 'chroma-js';
import { SVG } from '@svgdotjs/svg.js';

import * as utils from './utils';

let draw;

let imageWidth = 800;
let imageHeight = 600;

let darkness = 8;
let lightness = 2;
let diffuse = 0.1;

let renderPattern = renderTriangles;

window.clickSave = () => {
  utils.saveFile('export.svg', draw.svg());
}

window.changePattern = (pattern) => {
  switch (pattern) {
    case 0:
      renderPattern = renderTriangles;
      break;
    case 1:
      renderPattern = renderRectangles;
      break;
    case 2:
      renderPattern = renderDiamonds;
      break;
      case 3:
        renderPattern = renderBricks;
        break;
        case 4:
          renderPattern = renderTriangles2;
          break;
  }

  renderPattern();
}

window.addEventListener('load', () => {
  draw = SVG().size(imageWidth, imageHeight).addTo(document.getElementById('render'));
  renderPattern();

  const widthEl = document.getElementById('width');
  widthEl.value = imageWidth;

  widthEl.addEventListener('input', e => {
    imageWidth = parseInt(e.target.value);
    draw.size(imageWidth, imageHeight);
    requestAnimationFrame(renderPattern);
  });

  const heightEl = document.getElementById('height');
  heightEl.value = imageHeight;

  heightEl.addEventListener('input', e => {
    imageHeight = parseInt(e.target.value);
    draw.size(imageWidth, imageHeight);
    requestAnimationFrame(renderPattern);
  });

  const darkenEl = document.getElementById('darken');
  darkenEl.value = darkness;

  darkenEl.addEventListener('input', e => {
    darkness = parseInt(e.target.value);
    requestAnimationFrame(renderPattern);
  });

  const lightenEl = document.getElementById('lighten');
  lightenEl.value = lightness;

  lightenEl.addEventListener('input', e => {
    lightness = parseInt(e.target.value);
    requestAnimationFrame(renderPattern);
  });

  const diffuseEl = document.getElementById('diffuse');
  diffuseEl.value = diffuse;

  diffuseEl.addEventListener('input', e => {
    diffuse = parseInt(e.target.value) / 100;
    requestAnimationFrame(renderPattern);
  });
});

function renderBricks() {
  draw.clear();

  const BRICK_WIDTH = 24;
  const BRICK_HEIGHT = 12;
  const NY = Math.ceil(imageHeight / BRICK_HEIGHT);
  const NX = Math.ceil(imageWidth / BRICK_WIDTH) + 1;

  const f1 = chroma.scale(chroma.brewer.Spectral);
  const f2 = f1;

  for (let i = 0; i < NX; i++) {
    let baseX = i * BRICK_WIDTH - BRICK_WIDTH;

    for (let j = 0; j < NY; j++) {
      const originY = j * BRICK_HEIGHT;
      const originX = baseX + (j % 2 == 0 ? 0 : BRICK_WIDTH / 2);

      const r1 = (random('diffuse1', i, j) - .5) * diffuse;
      const r2 = (random('diffuse2', i, j) - .5) * diffuse;
      const c5 = f1(j / (NY - 1) + r1);
      const c6 = f2(i / (NX - 1) + r2);
      let color = chroma.mix(c5, c6, 0.5, 'lab');
      // let color = f1((i + j) / (NY - 1 + NX - 1) + r1);

      color = color.darken(darkness * random('darkness', i, j));
      color = color.brighten(lightness * random('lightness', i, j));
      drawRectangle([BRICK_WIDTH, BRICK_HEIGHT], [originX, originY], color);
    }
  }
}

function renderDiamonds() {
  draw.clear();

  const ANGLE = degToRad(90);
  const WIDTH = 16;
  const HEIGHT_HALF = WIDTH / 2 * Math.tan(ANGLE / 2);

  const NY = Math.ceil(imageHeight / HEIGHT_HALF) + 1;
  const NX = Math.ceil(imageWidth / WIDTH) + 1;

  const f1 = chroma.scale(chroma.brewer.Spectral);
  const f2 = f1;

  for (let i = 0; i < NX; i++) {
    let baseX = i * WIDTH;

    for (let j = 0; j < NY; j++) {
      const originY = j * HEIGHT_HALF - HEIGHT_HALF;
      const originX = baseX + (j % 2 == 0 ? 0 : WIDTH / 2);

      const r1 = (random('diffuse1', i, j) - .5) * diffuse;
      const r2 = (random('diffuse2', i, j) - .5) * diffuse;
      const c5 = f1(j / (NY - 1) + r1);
      const c6 = f2(i / (NX - 1) + r2);
      let color = chroma.mix(c5, c6, 0.5, 'lab');
      // let color = f1((i + j) / (NY - 1 + NX - 1) + r1);

      color = color.darken(darkness * random('darkness', i, j));
      color = color.brighten(lightness * random('lightness', i, j));

      const p1 = [originX, originY];
      const p2 = [originX + WIDTH / 2, originY + HEIGHT_HALF];
      const p3 = [originX, originY + 2 * HEIGHT_HALF];
      const p4 = [originX - WIDTH / 2, originY + HEIGHT_HALF];
      drawDiamond(p1, p2, p3, p4, color);
    }
  }
}

function renderRectangles() {
  draw.clear();

  const N = 10;
  const NY = Math.ceil(imageHeight / N);
  const NX = Math.ceil(imageWidth / N);

  const f1 = chroma.scale(chroma.brewer.Spectral);
  const f2 = f1;

  for (let i = 0; i < NX; i++) {
    for (let j = 0; j < NY; j++) {
      const r1 = (random('diffuse1', i, j) - .5) * diffuse;
      const r2 = (random('diffuse2', i, j) - .5) * diffuse;
      const c5 = f1(j / (NY - 1) + r1);
      const c6 = f2(i / (NX - 1) + r2);
      let color = chroma.mix(c5, c6, 0.5, 'lab');
      // let color = f1((i + j) / (NY - 1 + NX - 1) + r1);

      color = color.darken(darkness * random('darkness', i, j));
      color = color.brighten(lightness * random('lightness', i, j));
      drawRectangle([N, N], [i * N, j * N], color);
    }
  }
}

function renderTriangles() {
  draw.clear();

  const ANGLE = degToRad(60);
  const WIDTH = 16;
  const HEIGHT_HALF = WIDTH * Math.tan(ANGLE / 2);

  const NY = Math.ceil(imageHeight / HEIGHT_HALF) + 1;
  const NX = Math.ceil(imageWidth / WIDTH);

  const f1 = chroma.scale(chroma.brewer.Spectral);
  const f2 = f1;

  for (let i = 0; i < NX; i++) {
    let baseX = i * WIDTH;
    let c = i % 2;

    for (let j = 0; j < NY; j++) {
      const y = j * HEIGHT_HALF - HEIGHT_HALF;

      const r1 = (random('diffuse1', i, j) - .5) * diffuse;
      const r2 = (random('diffuse2', i, j) - .5) * diffuse;
      const c5 = f1(j / (NY - 1) + r1);
      const c6 = f2(i / (NX - 1) + r2);
      let color = chroma.mix(c5, c6, 0.5, 'lab');
      // let color = f1((i + j) / (NY - 1 + NX - 1) + r1);

      color = color.darken(darkness * random('darkness', i, j));
      color = color.brighten(lightness * random('lightness', i, j));

      if (c == 0) {
        const p1 = [baseX, y];
        const p2 = [baseX + WIDTH, y + HEIGHT_HALF];
        const p3 = [baseX, y + 2 * HEIGHT_HALF];
        drawTriangle(p1, p2, p3, color);
      } else {
        const p1 = [baseX + WIDTH, y];
        const p2 = [baseX + WIDTH, y + 2 * HEIGHT_HALF];
        const p3 = [baseX, y + HEIGHT_HALF];
        drawTriangle(p1, p2, p3, color);
      }

      c = (c + 1) % 2;
    }
  }
}

function renderTriangles2() {
  draw.clear();

  const WIDTH = 16;

  const NY = Math.ceil(imageHeight / WIDTH);
  const NX = Math.ceil(imageWidth / WIDTH);

  const f1 = chroma.scale(chroma.brewer.Spectral);
  const f2 = f1;

  for (let i = 0; i < NX; i++) {
    const baseX = i * WIDTH;

    for (let j = 0; j < NY; j++) {
      const y = j * WIDTH;

      const p1 = [baseX, y];
      const p2 = [baseX + WIDTH, y];
      const p3 = [baseX + WIDTH, y + WIDTH];
      const p4 = [baseX, y + WIDTH];

      const c = random('cut', i, j);

      if (c < 0.5) {
        drawTriangle(p1, p2, p3, genColor(i, j, NX, NY, f1, f2));
        drawTriangle(p1, p3, p4, genColor(i + 0.5, j + 0.5, NX, NY, f1, f2));
      } else {
        drawTriangle(p1, p2, p4, genColor(i, j, NX, NY, f1, f2));
        drawTriangle(p2, p3, p4, genColor(i + 0.5, j + 0.5, NX, NY, f1, f2));
      }
    }
  }
}

function genColor(x, y, width, height, f1, f2) {
  const r1 = (random('diffuse1', x, y) - .5) * diffuse;
  const r2 = (random('diffuse2', x, y) - .5) * diffuse;
  const c5 = f1(y / (height - 1) + r1);
  const c6 = f2(x / (width - 1) + r2);
  let color = chroma.mix(c5, c6, 0.5, 'lab');
  // let color = f1((i + j) / (NY - 1 + NX - 1) + r1);

  color = color.darken(darkness * random('darkness', x, y));
  color = color.brighten(lightness * random('lightness', x, y));

  return color;
}

const randomTable = {};

function random(name, x, y) {
  if (randomTable[name] == null) {
    randomTable[name] = [];
  }

  if (y != null) {
    if (randomTable[name].length <= x) {
      randomTable[name].length = x + 1;
    }

    if (randomTable[name][x] == null) {
      randomTable[name][x] = [];
    }

    if (randomTable[name][x][y] == null) {
      randomTable[name][x][y] = Math.random();
    }

    return randomTable[name][x][y];
  } else {
    if (randomTable[name].length <= x) {
      randomTable[name].length = x + 1;
    }

    if (randomTable[name][x] == null) {
      randomTable[name][x] = Math.random();
    }

    return randomTable[name][x];
  }
}

function drawTriangle(p1, p2, p3, color) {
  draw.polygon([p1, p2, p3]).fill(chroma(color).hex());
}

function drawDiamond(p1, p2, p3, p4, color) {
  draw.polygon([p1, p2, p3, p4]).fill(chroma(color).hex());
}

function drawRectangle(size, pos, color) {
  draw.rect(size[0], size[1]).fill(chroma(color).hex()).move(pos[0], pos[1]);
}

function degToRad(deg) {
  return Math.PI / 180 * deg;
}