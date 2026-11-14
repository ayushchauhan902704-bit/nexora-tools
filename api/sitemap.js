export default function handler(req, res) {
  const baseUrl = 'https://thenexoratools.com';
  const today = new Date().toISOString().split('T')[0];

  const pages = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/about`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${baseUrl}/contact`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${baseUrl}/privacy`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${baseUrl}/terms`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${baseUrl}/disclaimer`, priority: '0.5', changefreq: 'monthly' },

    { loc: `${baseUrl}/tools`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/age-calculator`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/ai-text-humanizer`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/background-remover`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/background-remover/hi`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/background-remover/es`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/background-remover/pt`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/background-remover/fr`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/background-remover/zh`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/background-remover/ar`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/background-remover/de`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/background-remover/id`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/bmi-calculator`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/character-counter`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/compress-image`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/date-difference-calculator`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/discount-calculator`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/handwriting-to-text`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/handwriting-to-text/english`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/handwriting-to-text/spanish`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/image-dpi-changer`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/image-to-text`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/image-to-word`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/instagram-reel-downloader`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/internet-speed-test`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/jpg-to-pdf`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/loan-emi-calculator`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/love-calculator`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/mirror`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/passport-size-photo-maker`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/password-generator`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/pdf-merge-split`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/pdf-to-jpg`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/pdf-to-word`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/percentage-calculator`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/qr-code-generator`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/resume-builder`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/text-to-speech`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/unit-converter`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/video-compressor`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/word-counter`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/word-to-pdf`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/yt-thumbnail-downloader`, priority: '0.8', changefreq: 'weekly' },

    { loc: `${baseUrl}/blog/best-free-video-compressor-online`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${baseUrl}/blog/compress-video-for-instagram-reels-tiktok`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${baseUrl}/blog/how-to-compress-image-to-100kb`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${baseUrl}/blog/how-to-compress-image-to-200kb`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${baseUrl}/blog/how-to-compress-image-to-500kb`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${baseUrl}/blog/how-to-compress-photo-to-20kb-for-upsc`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${baseUrl}/blog/how-to-compress-video-for-email-gmail`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${baseUrl}/blog/how-to-compress-video-to-20mb`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${baseUrl}/blog/how-to-compress-video-to-5mb`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${baseUrl}/blog/how-to-compress-video-without-losing-quality`, priority: '0.6', changefreq: 'monthly' }
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
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  res.status(200).send(xml);
}
