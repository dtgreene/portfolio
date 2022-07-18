import React, { useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import MainLoop from 'mainloop.js';

const gravity = 0.001;
const iterations = 3;
const pointSize = 4;
const pointSizeHalf = pointSize * 0.5;
const halfPI = Math.PI * 0.5;

let canvas, ctx;
let points = [];
let sticks = [];
let starImage;
let ready = false;

export const HangingStars = () => {
  useEffect(() => {
    // get the canvas context
    ctx = canvas.getContext('2d');
    // run the canvas setup function
    setup();
    // create a debounce wrapper for the draw function
    const debounced = debounce(setup, 50);
    // add event listener for window resize events
    window.addEventListener('resize', debounced, false);

    // setup the star image
    starImage = new Image();
    starImage.onload = () => {
      ready = true;
      // setup and start main loop
      MainLoop.setUpdate(update).setDraw(draw).start();
    };
    starImage.src = require('../../assets/star.png');

    // callback when component un-mounts
    return () => {
      // unsubscribe from resize event
      window.removeEventListener('resize', debounced, false);
      // stop main loop
      MainLoop.stop();
    };
  }, []);

  return (
    <canvas
      ref={(node) => (canvas = node)}
      style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none' }}
    />
  );
};

function createStar(x, segmentLength, segmentCount) {
  let tempPoints = [];
  let xx = x;
  let yy = 0;
  for (let i = 0; i < segmentCount; i++) {
    const position = { x: xx, y: yy };
    tempPoints.push(new Point(position, position, i === 0));
    // march the chain downwards while slightly randomizing the angle
    const angle = halfPI + (Math.random() - 0.5) * 0.2;
    xx = xx + Math.cos(angle) * segmentLength;
    yy = yy + Math.sin(angle) * segmentLength;
  }
  for (let i = 0; i < segmentCount - 1; i++) {
    sticks.push(
      new Stick(
        tempPoints[i],
        tempPoints[i + 1],
        segmentLength,
        i === segmentCount - 2
      )
    );
  }
  points = points.concat(tempPoints);
}

function setup() {
  // set the canvas size
  canvas.width = window.innerWidth;
  canvas.height = 1024;

  // reset points and sticks
  points = [];
  sticks = [];

  createStar(window.innerWidth * 0.08, 128, 4);
  createStar(window.innerWidth * 0.95, 64, 4);
  createStar(window.innerWidth * 0.85, 64, 3);
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
  // draw sticks
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#aaa';
  for (let i = 0; i < sticks.length; i++) {
    const stick = sticks[i];
    ctx.beginPath();
    ctx.moveTo(stick.pointA.position.x, stick.pointA.position.y);
    ctx.lineTo(stick.pointB.position.x, stick.pointB.position.y);
    ctx.stroke();

    if (stick.star) {
      const angle =
        Math.atan2(
          stick.pointA.position.y - stick.pointB.position.y,
          stick.pointA.position.x - stick.pointB.position.x
        ) + halfPI;
      ctx.save();
      ctx.translate(stick.pointB.position.x, stick.pointB.position.y);
      ctx.rotate(angle);
      ctx.drawImage(starImage, -64, -24);
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

function Stick(pointA, pointB, length, star) {
  this.pointA = pointA;
  this.pointB = pointB;
  this.length = length;
  this.star = star;
}
