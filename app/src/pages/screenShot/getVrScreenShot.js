const getVrScreenShot = (zoom) => {
  // 0. create canvas
  const threeElement = document.querySelector('.three-element canvas');
  const sourceCanvas = document.createElement('canvas');
  const sourceCtx = sourceCanvas.getContext('2d');
  const destinationCanvas = document.createElement('canvas');
  const destinationCtx = destinationCanvas.getContext('2d');
  // 1. three canvas
  const gl = threeElement.getContext('webgl', { preserveDrawingBuffer: true });
  const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
  const pixels  = new Uint8Array(width * height * 4);

  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

  const imageData = new ImageData(new Uint8ClampedArray(pixels), width, height);

  // 2. source canvas 
  sourceCanvas.width = width;
  sourceCanvas.height = height;
  sourceCtx.fillStyle = '#FFFFFF';
  sourceCtx.fillRect(0, 0, width, height);
  // sourceCtx.putImageData(getGrayscaleImage(imageData), 0, 0);
  sourceCtx.putImageData(imageData, 0, 0);
  // 3. destination canvas
  destinationCanvas.width = width;
  destinationCanvas.height = height;
  destinationCtx.fillStyle = '#FFFFFF';

  const dx = (zoom && width > 1200) ? -width / 5 : 0;
 
  destinationCtx.save();
  destinationCtx.fillRect(0, 0, width, height);
  destinationCtx.scale(1, -1);
  destinationCtx.drawImage(sourceCanvas, dx, -height, width, height);
  destinationCtx.setTransform(1, 0, 0, 1, 0, 0);
  destinationCtx.restore();
  // 4. output imageData
  cropBlankCanvas(destinationCtx);
  const url = destinationCanvas.toDataURL('image/png', 1);
  return url;
};

// const getGrayscaleImage = (pixelsData) => {
//   for(let i = 0, len = pixelsData.data.length; i < len; i += 4){
//     const gray = Math.max(pixelsData.data[i], pixelsData.data[i+1], pixelsData.data[i+2]) * 1.8;
//     pixelsData.data[i] = 255 - gray;
//     pixelsData.data[i+1] = 255 - gray;
//     pixelsData.data[i+2] = 255 - gray;
//   }
//   return pixelsData;
// };

const cropBlankCanvas = (ctx) => {
  let canvas = ctx.canvas, 
    w = canvas.width,
    h = canvas.height,
    pix = { x:[], y:[] },
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
    x,
    y,
    index;

  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      index = (y * w + x) * 4;
      if (imageData.data[index] != 255 && imageData.data[index+1] != 255 && imageData.data[index+2] != 255) {
        pix.x.push(x);
        pix.y.push(y);
      } 
    }
  }
  pix.x.sort((a, b) => (a - b));
  pix.y.sort((a, b) => (a - b));
  let n = pix.x.length - 1;

  w = 1 + pix.x[n] - pix.x[0];
  h = 1 + pix.y[n] - pix.y[0];

  if(pix.x[0] && pix.y[0]) {
    let cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);
    canvas.width = w;
    canvas.height = h;
    ctx.putImageData(cut, 0, 0);
  }
};

export {
  getVrScreenShot,
};