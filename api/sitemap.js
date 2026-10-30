export default function handler(req, res) {
  const baseUrl = 'https://nexora-tools-drab.vercel.app';
  const today = new Date().toISOString().split('T')[0];

  const tools = [
    '', // homepage
    'video-compressor',
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
    'love-calculator/',
    'pdf-merge-split/',
    'yt-thumbnail-downloader.html',
    'internet-speed-test',
    'text-to-speech'
  ];

  const urls = tools.map(path => {
    const loc = path === '' ? `${baseUrl}/` : `${baseUrl}/${path}`;
    const isNew = path.includes('video-compressor') || path.includes('text-to-speech') || path.includes('yt-thumbnail');
    return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${isNew ? 'hourly' : 'daily'}</changefreq>
    <priority>${path === '' ? '1.0' : isNew ? '0.9' : '0.8'}</priority>
  </url>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(xml);
}
