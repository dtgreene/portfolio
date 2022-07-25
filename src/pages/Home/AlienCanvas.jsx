import React, { useEffect } from 'react';

import { subscribe, unsubscribe, MainLoopEvents } from 'src/hooks/useMainLoop';
import { loadImages } from 'src/utils';

const canvasHeight = 256;
const bannerText = 'HIRE ME';
const startShipXRelative = -0.25;
const stopShipXRelative = 1.5;

let canvas, ctx;
let images = [];
let mousePos = { x: 0, y: 0 };
let shipPos = { x: 0, y: 0 };
let shipPosRelative = { x: startShipXRelative, y: 0.5 };
let bannerSinValue = 0;

export const AlienCanvas = () => {
  useEffect(() => {
    async function setup() {
      images = await loadImages([require('../../assets/alien-ship.png')]);

      // initially call resize when images are ready
      resizeHandler();
    }

    // get the canvas context
    ctx = canvas.getContext('2d');
    ctx.lineWidth = 4;
    ctx.font = '300px Verdana';

    // add event listener for window events
    window.addEventListener('resize', resizeHandler, false);
    window.addEventListener('click', clickHandler, false);
    window.addEventListener('mousemove', mouseMoveHandler, false);

    // subscribe to the mainloop event
    subscribe(MainLoopEvents.UPDATE, update);

    setup();

    // callback when component un-mounts
    return () => {
      // unsubscribe from events
      window.removeEventListener('resize', resizeHandler, false);
      window.removeEventListener('click', clickHandler, false);
      window.removeEventListener('mousemove', mouseMoveHandler, false);

      unsubscribe(MainLoopEvents.UPDATE, update);
    };
  }, []);

  return (
    <canvas
      ref={(node) => (canvas = node)}
      style={{
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );
};

function mouseMoveHandler(event) {
  const rect = canvas.getBoundingClientRect();
  mousePos = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function clickHandler() {}

function resizeHandler() {
  // set the canvas size
  canvas.width = window.innerWidth;
  canvas.height = canvasHeight;

  shipPos.x = shipPosRelative.x * canvas.width;
  shipPos.y = shipPosRelative.y * canvas.height;
}

function update(delta) {
  if (images.length === 0) return;

  // update
  // ------

  // update ship pos
  shipPos.x += 0.2 * delta;
  if (shipPos.x > stopShipXRelative * canvas.width) {
    shipPos.x = startShipXRelative * canvas.width;
  }
  shipPosRelative.x = shipPos.x / canvas.width;

  bannerSinValue += 0.05;

  // draw
  // ------
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw banner
  let bannerX = shipPos.x - 530;
  let bannerY = shipPos.y - 30;

  // draw ropes
  ctx.strokeStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(shipPos.x - 130, shipPos.y - 30 + Math.sin(bannerSinValue) * 5);
  ctx.lineTo(shipPos.x - 100, shipPos.y + 30);
  ctx.lineTo(shipPos.x - 130, shipPos.y + 80 + Math.sin(bannerSinValue) * 5);
  ctx.stroke();

  // draw bnner
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(bannerX, bannerY);
  for (let i = 0; i < 20; i++) {
    ctx.lineTo((bannerX += 20), bannerY + Math.sin(bannerSinValue + i) * 5);
  }
  bannerY += 110;
  ctx.lineTo(bannerX, bannerY + Math.sin(bannerSinValue) * 5);
  for (let i = 19; i >= 0; i--) {
    ctx.lineTo((bannerX -= 20), bannerY + Math.sin(bannerSinValue + i) * 5);
  }
  ctx.closePath();
  ctx.fill();

  // draw text
  ctx.fillStyle = 'red';
  ctx.font = '80px monospace';
  for (let i = 0; i < bannerText.length; i++) {
    ctx.fillText(
      bannerText[i],
      shipPos.x - 500 + i * 48,
      shipPos.y + 50 + Math.sin(bannerSinValue + i * 1.35 + 2) * 5
    );
  }

  ctx.drawImage(images[0], shipPos.x - 128, shipPos.y - 128, 256, 256);
}
