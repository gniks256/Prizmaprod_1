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
  generateBlogPost
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

  console.log('Static site compilation completed successfully!');
}

main();
