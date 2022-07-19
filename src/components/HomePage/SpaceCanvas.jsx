import React, { useEffect } from 'react';
import MainLoop from 'mainloop.js';

import { useWindowSize } from '../../hooks';

const gravity = 0.001;
const iterations = 3;
const halfPI = Math.PI * 0.5;

let canvas, ctx;
let hangers = [];

let assetLoader = new AssetLoader([
  require('../../assets/cheese.png'),
  require('../../assets/star.png'),
]);
let ready = false;
let mousePos = { x: 0, y: 0 };

export const SpaceCanvas = () => {
  const size = useWindowSize();
  console.log(size);
  useEffect(() => {
    // get the canvas context
    ctx = canvas.getContext('2d');

    // add event listener for window events
    window.addEventListener('resize', setup, false);
    window.addEventListener('click', clickHandler, false);
    window.addEventListener('mousemove', mouseMoveHandler, false);
    window.addEventListener('blur', blurHandler, false);
    window.addEventListener('focus', focusHandler, false);

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
      window.removeEventListener('mousemove', mouseMoveHandler, false);
      window.removeEventListener('blur', blurHandler, false);
      window.removeEventListener('focus', focusHandler, false);
      // stop main loop
      MainLoop.stop();
    };
  }, []);

  return (
    <canvas
      ref={(node) => (canvas = node)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );
};

function blurHandler() {
  if(MainLoop.isRunning()) {
    MainLoop.stop();
  }
}

function focusHandler() {
  setup();
}

function mouseMoveHandler(event) {
  mousePos = {
    x: event.clientX,
    y: event.clientY,
  };
}

function clickHandler() {
  for (let i = 0; i < hangers.length; i++) {
    const { sticks } = hangers[i];
    const { imageTarget, pointB } = sticks[sticks.length - 1];
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

function createHanger(x, segmentLength, segmentCount, imageTarget) {
  let tempPoints = [];
  let tempSticks = [];

  // add points
  for (let i = 0; i < segmentCount; i++) {
    const position = { x, y: i * segmentLength };
    tempPoints.push(new Point(position, position, i === 0));
  }
  // add sticks
  for (let i = 0; i < segmentCount - 1; i++) {
    tempSticks.push(
      new Stick(tempPoints[i], tempPoints[i + 1], segmentLength, null)
    );
  }

  // introduce some wobble
  tempPoints[tempPoints.length - 1].position.x += Math.random() * 40 - 20;

  // add an image target to the last stick
  tempSticks[tempSticks.length - 1].imageTarget = imageTarget;

  hangers.push(new Hanger(tempPoints, tempSticks));
}

function setup() {
  const rect = document.body.getBoundingClientRect();

  // set the canvas size
  canvas.width = rect.width;
  canvas.height = rect.height;

  if (canvas.width > 960) {
    if (!MainLoop.isRunning() && ready) {
      // start the loop if not running
      MainLoop.start();
    }
    if (hangers.length === 0) {
      // reset hangers
      hangers = [];

      // x offset = size * 0.5
      // y offset = size * 0.1875
      createHanger(
        canvas.width * 0.15,
        64,
        6,
        new ImageTarget(assetLoader.assets[0], { x: -128, y: -75 }, 256)
      );
      createHanger(
        canvas.width * 0.84,
        32,
        4,
        new ImageTarget(assetLoader.assets[1], { x: -40, y: -15 }, 80)
      );
      createHanger(
        canvas.width * 0.92,
        32,
        6,
        new ImageTarget(assetLoader.assets[1], { x: -64, y: -24 }, 128)
      );
    } else {
      hangers[0].slideX(canvas.width * 0.15);
      hangers[1].slideX(canvas.width * 0.84);
      hangers[2].slideX(canvas.width * 0.92);
    }
  } else {
    if (MainLoop.isRunning()) {
      // stop the loop if running
      MainLoop.stop();
    }

    // reset hangers
    hangers = [];
  }
}

function update(delta) {
  for (let i = 0; i < hangers.length; i++) {
    const { points, sticks } = hangers[i];
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
}

function draw() {
  if (!ready) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < hangers.length; i++) {
    const { sticks } = hangers[i];
    // draw sticks
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#999';
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

function Hanger(points, sticks) {
  this.points = points;
  this.sticks = sticks;
  this.slideX = (x) => {
    points[0].position.x = x;
  };
}

function AssetLoader(assetPaths) {
  this.assetPaths = assetPaths;
  this.assets = [];
  this.loaded = 0;
  this.load = () =>
    new Promise((res) => {
      this.assetPaths.forEach((path) => {
        const image = new Image();
        this.assets.push(image);
        image.onload = () => {
          this.loaded++;
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
