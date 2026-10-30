import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const baseUrl = 'https://nexora-tools-drab.vercel.app';
  const today = new Date().toISOString().split('T')[0];
  
  // /app folder me jo bhi .html file hogi, wo khud sitemap me aa jayegi
  const appDir = path.join(process.cwd(), 'app');
  let files = [];
  try {
    files = fs.readdirSync(appDir);
  } catch(e) {
    files = [];
  }

  const toolFiles = files.filter(f => f.endsWith('.html'));

  const urls = toolFiles.map(file => {
    const name = file.replace('.html', '');
    const loc = `${baseUrl}/${name}`;
    return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('');

  // extra pages
  const staticPages = `
  <url><loc>${baseUrl}/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${baseUrl}/tools</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  `;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages}${urls}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.status(200).send(xml);
}
