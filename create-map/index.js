const fs = require("fs");
const { createCanvas } = require("canvas");
const imagePixels = require("image-pixels");

const convertToPixles = arr => {
  if (arr.length % 4 !== 0) return;
  const data = [];
  for (let i = 0; i < arr.length; i += 4) {
    data.push({
      r: arr[i],
      g: arr[i + 1],
      b: arr[i + 2],
      a: arr[i + 3],
    });
  }
  return data;
};

const main = async () => {
  const { data, width, height } = await imagePixels(
    "images/input/dark-map.jpg"
  );

  const pixels = convertToPixles(data);

  canvas = createCanvas(width, height);

  const ctx = canvas.getContext("2d");

  const diam = 10;
  const padding = 2;

  // const bgColor = "#4649c6";
  // const fillColor = "#8075e8";
  const bgColor = "#132336";
  const fillColor = "#082e59";

  const circle = (x, y, r) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.fill();
  };

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = fillColor;
  for (let i = 0; i < width; i += diam) {
    for (let j = 0; j < height; j += diam) {
      let index = i + width * j;
      //   ctx.fillStyle = `rgba(${pixels[index].r}, ${pixels[index].g}, ${pixels[index].b}, ${pixels[index].a})`;
      if (pixels[index].a > 10 && pixels[index].r < 50)
        circle(i, j, diam / 2 - padding);
    }
  }
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync("images/output/map7.png", buffer);
};

main();
