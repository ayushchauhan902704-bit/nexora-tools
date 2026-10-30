import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const baseUrl = 'https://nexora-tools-drab.vercel.app';
  const today = new Date().toISOString().split('T')[0];
  
  let toolFiles = [
    'about.html',
    'age-calculator.html',
    'ai-text-humanizer.html',
    'background-remover.html',
    'bmi-calculator.html',
    'character-counter.html',
    'compress-image.html',
    'contact.html',
    'date-difference.html',
    'disclaimer.html',
    'discount-calculator.html',
    'image-to-word.html',
    'instagram-reels-downloader.html',
    'jpg-to-pdf.html',
    'loan-emi-calculator.html',
    'mirror.html',
    'passport-size-photo-maker.html',
    'password-generator.html',
    'pdf-to-jpg.html',
    'pdf-to-word.html',
    'percentage-calculator.html',
    'privacy.html',
    'qr-code-generator.html',
    'resume-builder.html',
    'terms.html',
    'tools.html',
    'unit-converter.html',
    'word-counter.html',
    'word-to-pdf.html',
    'yt-thumbnail-downloader.html',
    'video-compressor.html',
    'text-to-speech.html',
    'internet-speed-test.html',
    'love-calculator.html',
    'pdf-merge-split.html'
  ];

  try {
    const appDir = path.join(process.cwd(), 'app');
    if (fs.existsSync(appDir)) {
      const scanned = fs.readdirSync(appDir).filter(f => f.endsWith('.html'));
      if (scanned.length > 5) toolFiles = scanned;
    }
  } catch(e) {}

  const urls = toolFiles.map(file => {
    const name = file.replace('.html', '');
    return `
  <url>
    <loc>${baseUrl}/${name}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('');

  const staticPages = `
  <url><loc>${baseUrl}/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${baseUrl}/tools</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${baseUrl}/video-compressor</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>${baseUrl}/internet-speed-test</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>${baseUrl}/text-to-speech</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>${baseUrl}/love-calculator/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/pdf-merge-split/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages}${urls}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(xml);
}
