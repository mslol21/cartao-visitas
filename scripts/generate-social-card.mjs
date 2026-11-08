// Rebuild exact typography and preserve the repository's Koi artwork without distortion.
import sharp from 'sharp';
import { readFile, mkdir } from 'node:fs/promises';
const logo = await readFile('public/images/koi_hero.png');
const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><radialGradient id="glow"><stop stop-color="#12405a"/><stop offset="1" stop-color="#03050d"/></radialGradient></defs><rect width="1200" height="630" fill="#03050d"/><rect x="0" y="0" width="560" height="630" fill="url(#glow)"/><path d="M560 120V510" stroke="#16465a" stroke-width="2"/><g font-family="DejaVu Sans, sans-serif"><text x="610" y="235" font-size="68" font-weight="bold" fill="#f1f5f9">Konnexy</text><text x="610" y="300" font-size="24" fill="#67e8f9">Conecta • Organiza • Vende</text><text x="610" y="380" font-size="29" fill="#e2e8f0">Soluções digitais para</text><text x="610" y="425" font-size="29" fill="#e2e8f0">pequenos negócios.</text><text x="610" y="505" font-size="20" fill="#94a3b8">konnexy.com.br</text></g><rect x="40" y="40" width="1120" height="550" rx="28" fill="none" stroke="#16465a" stroke-width="2"/></svg>`;
const card = await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer();
const koi = await sharp(logo).resize(470,470,{fit:'contain'}).ensureAlpha().raw().toBuffer();
for (let y=0; y<470; y++) koi.copy(card, ((y+80)*1200+60)*4, y*470*4, (y+1)*470*4);
await sharp(card,{raw:{width:1200,height:630,channels:4}}).png({palette:true,colours:256,effort:10}).toFile('public/images/konnexy-social.png');
await mkdir('public/icons', {recursive:true});
for (const size of [32,180]) await sharp(logo).resize(size,size,{fit:'contain'}).png().toFile(`public/icons/koi-${size}.png`);
