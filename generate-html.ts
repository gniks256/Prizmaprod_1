import * as fs from 'fs';
import * as path from 'path';
import { PROJECTS, BLOG_POSTS } from './constants';
import {
  generateHome,
  generatePortfolio,
  generatePricing,
  generateWhyUs,
  generateTeam,
  generateContacts,
  generateJournal,
  generateProject,
  generateBlogPost,
  generatePrivacy,
  generateNotFound
} from './templates';

const DIST_DIR = path.join(process.cwd(), 'dist');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Helper to recursively copy directories
function copyFolderSync(from: string, to: string) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach(element => {
    const stat = fs.lstatSync(path.join(from, element));
    if (stat.isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else if (stat.isDirectory()) {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}

// Helper to write a file, creating subdirectories as needed
function writePage(subPath: string, htmlContent: string) {
  const targetPath = path.join(DIST_DIR, subPath);
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(targetPath, htmlContent, 'utf-8');
  console.log(`Generated: ${subPath}`);
}

function main() {
  console.log('Starting pure HTML static compilation...');

  // 1. Clean dist directory
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });

  // 2. Copy all public assets
  if (fs.existsSync(PUBLIC_DIR)) {
    copyFolderSync(PUBLIC_DIR, DIST_DIR);
    console.log('Copied public assets.');
  }

  // 3. Compile core static pages
  const homeHtml = generateHome();
  writePage('index.html', homeHtml);
  
  // Also update the root index.html to be the pure HTML homepage
  fs.writeFileSync(path.join(process.cwd(), 'index.html'), homeHtml, 'utf-8');
  console.log('Updated root index.html');

  writePage('portfolio/index.html', generatePortfolio());
  writePage('pricing/index.html', generatePricing());
  writePage('why-us/index.html', generateWhyUs());
  writePage('team/index.html', generateTeam());
  writePage('contacts/index.html', generateContacts());
  writePage('journal/index.html', generateJournal());
  writePage('privacy/index.html', generatePrivacy());
  writePage('404.html', generateNotFound());

  // 4. Compile dynamic Project detail pages
  PROJECTS.forEach(project => {
    const pageHtml = generateProject(project);
    writePage(`project/${project.id}/index.html`, pageHtml);
  });

  // 5. Compile dynamic Journal Blog Post detail pages
  BLOG_POSTS.forEach(post => {
    const pageHtml = generateBlogPost(post);
    writePage(`journal/${post.slug}/index.html`, pageHtml);
  });

  // 6. Generate dynamic sitemap.xml
  console.log('Generating dynamic sitemap.xml...');
  const currentDate = new Date().toISOString().split('T')[0];
  const baseUrl = 'https://prizmaprod.ru';

  const staticUrls = [
    { loc: '', priority: '1.0', changefreq: 'monthly' },
    { loc: '/portfolio', priority: '0.8', changefreq: 'monthly' },
    { loc: '/pricing', priority: '0.7', changefreq: 'monthly' },
    { loc: '/why-us', priority: '0.7', changefreq: 'monthly' },
    { loc: '/team', priority: '0.6', changefreq: 'monthly' },
    { loc: '/contacts', priority: '0.9', changefreq: 'monthly' },
    { loc: '/journal', priority: '0.8', changefreq: 'weekly' },
    { loc: '/privacy', priority: '0.5', changefreq: 'monthly' },
  ];

  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemapXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Add static URLs
  staticUrls.forEach(url => {
    sitemapXml += `  <url>\n`;
    sitemapXml += `    <loc>${baseUrl}${url.loc}</loc>\n`;
    sitemapXml += `    <lastmod>${currentDate}</lastmod>\n`;
    sitemapXml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    sitemapXml += `    <priority>${url.priority}</priority>\n`;
    sitemapXml += `  </url>\n`;
  });

  // Add Project URLs
  PROJECTS.forEach(project => {
    sitemapXml += `  <url>\n`;
    sitemapXml += `    <loc>${baseUrl}/project/${project.id}</loc>\n`;
    sitemapXml += `    <lastmod>${currentDate}</lastmod>\n`;
    sitemapXml += `    <changefreq>monthly</changefreq>\n`;
    sitemapXml += `    <priority>0.7</priority>\n`;
    sitemapXml += `  </url>\n`;
  });

  // Add Blog Post URLs
  BLOG_POSTS.forEach(post => {
    sitemapXml += `  <url>\n`;
    sitemapXml += `    <loc>${baseUrl}/journal/${post.slug}</loc>\n`;
    sitemapXml += `    <lastmod>${currentDate}</lastmod>\n`;
    sitemapXml += `    <changefreq>monthly</changefreq>\n`;
    sitemapXml += `    <priority>0.7</priority>\n`;
    sitemapXml += `  </url>\n`;
  });

  sitemapXml += `</urlset>\n`;

  // Write to both public and dist directories
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');
  console.log('Sitemap.xml updated in public/ and dist/');

  console.log('Static site compilation completed successfully!');
}

main();
