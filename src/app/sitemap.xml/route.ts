import { NextResponse } from 'next/server';

async function fetchPagesData() {
  const res = await fetch('https://dashboard.chotuengineer.com/api/sitemap-items', {
    next: { revalidate: 43200 },
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch pages data');
  }
  const data = await res.json()  
  return data;
}

export async function GET() {
  try {
    const pagesData = await fetchPagesData();    
    const sitemap = generateSitemap(pagesData);
    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

function generateSitemap(pages: any[]) {
  const baseUrl = 'https://www.chotuengineer.com';
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map(
          (page) => `
            <url>
              <loc>${baseUrl}/blog/${page.slug}</loc>
              <lastmod>${page.lastmod}</lastmod>
              <changefreq>daily</changefreq>
            </url>
          `
        )
        .join('')}
    </urlset>`;
}