import React, { useEffect } from 'react';
import MainLoop from 'mainloop.js';

const gravity = 0.001;
const iterations = 3;
const halfPI = Math.PI * 0.5;

let canvas, ctx;
let points = [];
let sticks = [];
let targetSticks = [];
let assetLoader = new AssetLoader([
  require('../../assets/cheese.png'),
  require('../../assets/star.png'),
]);
let ready = false;
let mousePos = { x: 0, y: 0 };

export const SpaceCanvas = () => {
  useEffect(() => {
    // get the canvas context
    ctx = canvas.getContext('2d');

    // add event listener for window resize events
    window.addEventListener('resize', setup, false);
    window.addEventListener('click', clickHandler, false);
    window.addEventListener('mousemove', mouseMoveHandler, false);

    // load our assets
    assetLoader.load().then(() => {
      ready = true;
      // run the canvas setup function
      setup();
      // setup and start main loop
      MainLoop.setUpdate(update).setDraw(draw).start();
    });

    // callback when component un-mounts
    return () => {
      // unsubscribe from events
      window.removeEventListener('resize', setup, false);
      window.removeEventListener('click', clickHandler, false);
      // stop main loop
      MainLoop.stop();
    };
  }, []);

  return (
    <canvas
      ref={(node) => (canvas = node)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );
};

function mouseMoveHandler(event) {
  mousePos = {
    x: event.clientX,
    y: event.clientY,
  };
}

function clickHandler() {
  for (let i = 0; i < targetSticks.length; i++) {
    const { imageTarget, pointB } = targetSticks[i];
    // not quite half since the images have some padding
    const targetRadius = imageTarget.size * 0.4;
    const position = {
      x: pointB.position.x,
      // half of the "radius" gets us pretty close without doing any angle math
      y: pointB.position.y + targetRadius * 0.5,
    };
    if (distance(mousePos, position) < targetRadius) {
      pointB.position.x += Math.random() * 30 - 15;
    }
  }
}

function createBody(x, segmentLength, segmentCount, imageTarget) {
  let tempPoints = [];
  let tempSticks = [];
  let xx = x;
  let yy = 0;
  // add points
  for (let i = 0; i < segmentCount; i++) {
    const position = { x: xx, y: yy };
    tempPoints.push(new Point(position, position, i === 0));
    // march the chain downwards while slightly randomizing the angle
    const angle = halfPI + (Math.random() - 0.5) * 0.2;
    xx = xx + Math.cos(angle) * segmentLength;
    yy = yy + Math.sin(angle) * segmentLength;
  }
  // add sticks
  for (let i = 0; i < segmentCount - 1; i++) {
    tempSticks.push(
      new Stick(tempPoints[i], tempPoints[i + 1], segmentLength, null)
    );
  }

  // add an image target to the last stick
  tempSticks[tempSticks.length - 1].imageTarget = imageTarget;
  targetSticks.push(tempSticks[tempSticks.length - 1]);

  points = points.concat(tempPoints);
  sticks = sticks.concat(tempSticks);
}

function setup() {
  // set the canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // reset points and sticks
  points = [];
  sticks = [];

  // x offset = size * 0.5
  // y offset = size * 0.1875
  createBody(
    window.innerWidth * 0.15,
    64,
    6,
    new ImageTarget(assetLoader.assets[0], { x: -128, y: -75 }, 256)
  );
  createBody(
    window.innerWidth * 0.84,
    32,
    4,
    new ImageTarget(assetLoader.assets[1], { x: -40, y: -15 }, 80)
  );
  createBody(
    window.innerWidth * 0.92,
    64,
    3,
    new ImageTarget(assetLoader.assets[1], { x: -64, y: -24 }, 128)
  );
}

function update(delta) {
  // update points
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    if (!point.locked) {
      // remember the position but break the reference
      const positionBeforeUpdate = {
        x: point.position.x,
        y: point.position.y,
      };
      // continue moving in the same direction
      point.position.x += point.position.x - point.prevPosition.x;
      point.position.y += point.position.y - point.prevPosition.y;
      // apply gravity
      point.position.y += gravity * delta * delta;
      // set previous position
      point.prevPosition = positionBeforeUpdate;
    }
  }
  // perform set number of updates on sticks
  for (let i = 0; i < iterations; i++) {
    // update sticks
    for (let j = 0; j < sticks.length; j++) {
      const stick = sticks[j];
      const stickCenter = {
        x: (stick.pointA.position.x + stick.pointB.position.x) * 0.5,
        y: (stick.pointA.position.y + stick.pointB.position.y) * 0.5,
      };
      const stickDir = normalise({
        x: stick.pointA.position.x - stick.pointB.position.x,
        y: stick.pointA.position.y - stick.pointB.position.y,
      });

      if (!stick.pointA.locked) {
        stick.pointA.position = {
          x: stickCenter.x + stickDir.x * stick.length * 0.5,
          y: stickCenter.y + stickDir.y * stick.length * 0.5,
        };
      }
      if (!stick.pointB.locked) {
        stick.pointB.position = {
          x: stickCenter.x - stickDir.x * stick.length * 0.5,
          y: stickCenter.y - stickDir.y * stick.length * 0.5,
        };
      }
    }
  }
}

function draw() {
  if (!ready) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ctx.fillStyle = 'red';
  // ctx.beginPath();
  // ctx.arc(canvas.width * 0.5, 547, 128, 0, Math.PI * 2);
  // ctx.fill();

  // draw sticks
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#aaa';
  for (let i = 0; i < sticks.length; i++) {
    const stick = sticks[i];
    ctx.beginPath();
    ctx.moveTo(stick.pointA.position.x, stick.pointA.position.y);
    ctx.lineTo(stick.pointB.position.x, stick.pointB.position.y);
    ctx.stroke();

    if (stick.imageTarget) {
      // angle between the two points
      const angle =
        Math.atan2(
          stick.pointA.position.y - stick.pointB.position.y,
          stick.pointA.position.x - stick.pointB.position.x
        ) + halfPI;

      // save before translating/rotating
      ctx.save();
      ctx.translate(stick.pointB.position.x, stick.pointB.position.y);
      ctx.rotate(angle);
      // get our image params from the image target instance
      const { image, offset, size } = stick.imageTarget;
      ctx.drawImage(image, offset.x, offset.y, size, size);
      // restore the canvas
      ctx.restore();
    }
  }
}

function normalise(vector) {
  const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  if (magnitude === 0) {
    return { x: 0, y: 0 };
  }
  return {
    x: vector.x / magnitude,
    y: vector.y / magnitude,
  };
}

function Point(position, prevPosition, locked) {
  this.position = position;
  this.prevPosition = prevPosition;
  this.locked = locked;
}

function Stick(pointA, pointB, length, imageTarget) {
  this.pointA = pointA;
  this.pointB = pointB;
  this.length = length;
  this.imageTarget = imageTarget;
}

function ImageTarget(image, offset, size) {
  this.image = image;
  this.offset = offset;
  this.size = size;
}

function AssetLoader(assetPaths) {
  this.assetPaths = assetPaths;
  this.assets = [];
  this.loaded = 0;
  this.load = () =>
    new Promise((res) => {
      this.assetPaths.forEach((path) => {
        const image = new Image();
        image.onload = () => {
          this.loaded++;
          this.assets.push(image);
          if (this.loaded === this.assetPaths.length) {
            res(this.assets);
          }
        };
        image.src = path;
      });
    });
}

function distance(vectorA, vectorB) {
  return Math.sqrt((vectorA.x - vectorB.x) ** 2 + (vectorA.y - vectorB.y) ** 2);
}
