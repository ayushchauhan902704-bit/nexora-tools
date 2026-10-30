export default function handler(req, res) {
  const baseUrl = 'https://nexora-tools-drab.vercel.app';
  const today = new Date().toISOString().split('T')[0];

  const pages = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/tools`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/video-compressor`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/internet-speed-test`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/text-to-speech`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/yt-thumbnail-downloader`, priority: '0.9', changefreq: 'weekly' },
    
    { loc: `${baseUrl}/about`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/age-calculator`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/ai-text-humanizer`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/background-remover`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/bmi-calculator`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/character-counter`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/compress-image`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/contact`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/date-difference`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/disclaimer`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/discount-calculator`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/image-to-word`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/instagram-reels-downloader`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/jpg-to-pdf`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/loan-emi-calculator`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/mirror`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/passport-size-photo-maker`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/password-generator`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/pdf-to-jpg`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/pdf-to-word`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/percentage-calculator`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/privacy`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/qr-code-generator`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/resume-builder`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/terms`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/unit-converter`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/word-counter`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/word-to-pdf`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/love-calculator/`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/pdf-merge-split/`, priority: '0.8', changefreq: 'weekly' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(xml);
}
