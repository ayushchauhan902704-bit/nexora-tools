import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const baseUrl = 'https://nexora-tools-drab.vercel.app';
  const today = new Date().toISOString().split('T')[0];
  
  let toolFiles = [
    'text-to-speech.html', 'image-compressor.html', 'video-compressor.html',
    'qr-generator.html', 'password-generator.html', 'word-counter.html'
  ];

  try {
    const appDir = path.join(process.cwd(), 'app');
    if (fs.existsSync(appDir)) {
      const scanned = fs.readdirSync(appDir).filter(f => f.endsWith('.html'));
      if (scanned.length > 0) toolFiles = scanned;
    }
  } catch(e) {}

  const urls = toolFiles.map(file => {
    const name = file.replace('.html', '');
    return `
  <url>
    <loc>${baseUrl}/${name}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('');

  const staticPages = `
  <url><loc>${baseUrl}/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${baseUrl}/tools</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages}${urls}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(xml);
}
