export default function handler(req, res) {
  const baseUrl = 'https://nexora-tools-drab.vercel.app';
  const today = new Date().toISOString().split('T')[0];

  const pages = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/tools`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/video-compressor`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/internet-speed-test`, priority: '0.9', changefreq: 'weekly' },
    // ... tere baaki saare pages yaha same rahenge ...
    // BAS DHYAN DE: .html kabhi mat lagana, aur last me / mat lagana
    { loc: `${baseUrl}/image-dpi-changer`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/love-calculator`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/pdf-merge-split`, priority: '0.8', changefreq: 'weekly' },
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
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate'); // Ye line roz update karayegi
  res.status(200).send(xml);
}
