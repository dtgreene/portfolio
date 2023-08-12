import { useEffect } from 'react';
import MainLoop from 'mainloop.js';

let updateCallbacks = [];

export const MainLoopEvents = {
  UPDATE: 'update',
};

function getCallbacks(what) {
  if (what === MainLoopEvents.UPDATE) {
    return updateCallbacks;
  }

  throw new Error(`Subscribed to unknown MainLoop callback: ${what}`);
}

export function subscribe(what, callback) {
  const callbacks = getCallbacks(what);
  if (callbacks.indexOf(callback) === -1) {
    callbacks.push(callback);
  }
}

export function unsubscribe(what, callback) {
  const callbacks = getCallbacks(what);
  const index = callbacks.indexOf(callback);
  if (index === -1) {
    callbacks.splice(index, 1);
  }
}

export const useMainLoop = () => {
  useEffect(() => {
    window.addEventListener('visibilitychange', visibilityChangeHandler, false);
    MainLoop.setUpdate(update).start();

    return () => {
      window.removeEventListener('visibilitychange', visibilityChangeHandler, false);
      MainLoop.setUpdate(undefined).stop();
    };
  }, []);
};

function visibilityChangeHandler() {
  if(document.visibilityState === 'visible') {
    MainLoop.start();
  } else if(document.visibilityState === 'hidden') {
    MainLoop.stop();
  }
}

function update(delta) {
  for (let i = 0; i < updateCallbacks.length; i++) {
    updateCallbacks[i](delta);
  }
}
