const fs = require("fs");
const path = require("path");
const { createCanvas } = require("canvas");

const width = 1200;
const height = 630;

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

// Background
ctx.fillStyle = "#004f32";
ctx.fillRect(0, 0, width, height);

// Subtle grid overlay
ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
ctx.lineWidth = 1;
const gridSize = 40;
for (let x = 0; x <= width; x += gridSize) {
  ctx.beginPath();
  ctx.moveTo(x + 0.5, 0);
  ctx.lineTo(x + 0.5, height);
  ctx.stroke();
}
for (let y = 0; y <= height; y += gridSize) {
  ctx.beginPath();
  ctx.moveTo(0, y + 0.5);
  ctx.lineTo(width, y + 0.5);
  ctx.stroke();
}

// Title
ctx.fillStyle = "#ffffff";
ctx.font = "bold 80px 'Helvetica Neue', Arial, sans-serif";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("Ourika Travels", width / 2, height / 2 - 20);

// Subtitle
ctx.fillStyle = "#00ef9d";
ctx.font = "32px 'Helvetica Neue', Arial, sans-serif";
ctx.fillText("Authentic Local Experiences · Atlas Mountains · Morocco", width / 2, height / 2 + 50);

// Footer
ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
ctx.font = "20px 'Helvetica Neue', Arial, sans-serif";
ctx.textAlign = "left";
ctx.textBaseline = "alphabetic";
ctx.fillText("ourikatreks.com", 40, height - 40);

const outputPath = path.join(__dirname, "..", "public", "og-image.jpg");

const buffer = canvas.toBuffer("image/jpeg", { quality: 0.9 });
fs.writeFileSync(outputPath, buffer);

// TODO: Consider Next.js ImageResponse (app/opengraph-image.tsx) for dynamic per-page OG images.

console.log(`OG image generated at ${outputPath}`);
