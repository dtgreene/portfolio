export function loadImages(imagePaths) {
  let assets = [];
  let loaded = 0;
  return new Promise((res) => {
    imagePaths.forEach((path) => {
      const image = new Image();
      assets.push(image);
      image.onload = () => {
        loaded++;
        if (loaded === imagePaths.length) {
          res(assets);
        }
      };
      image.src = path;
    });
  });
}
