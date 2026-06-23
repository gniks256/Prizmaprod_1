import { PROJECTS, BLOG_POSTS } from './constants';
import { Category, Project, BlogPost } from './types';

// Simple Markdown to HTML parser
function parseMarkdown(md: string): string {
  if (!md) return '';
  let html = md;
  
  // Convert horizontal rules
  html = html.replace(/^---$/gm, '<hr class="my-8 border-t border-zinc-200" />');
  
  // Convert blockquotes
  html = html.replace(/^>\s+(.*)$/gm, '<blockquote class="border-l-2 border-zinc-900 pl-4 my-6 italic text-zinc-600">$1</blockquote>');
  
  // Convert headings
  html = html.replace(/^###\s+(.*)$/gm, '<h3 class="text-xl font-bold tracking-tight text-zinc-900 mt-8 mb-4">$1</h3>');
  html = html.replace(/^####\s+(.*)$/gm, '<h4 class="text-xs font-extrabold uppercase tracking-widest text-zinc-400 mt-6 mb-2">$1</h4>');
  
  // Convert bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-zinc-950">$1</strong>');
  
  // Convert lists (find lines starting with * or - and wrap with <li>)
  html = html.replace(/^[\*\-]\s+(.*)$/gm, '<li class="ml-5 list-disc mb-1.5 text-zinc-600 font-light">$1</li>');
  
  // Process paragraphs: split by empty lines, wrap non-empty blocks that aren't other elements
  const lines = html.split('\n\n');
  html = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<hr') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<li')) {
      return trimmed;
    }
    return `<p class="mb-4 text-zinc-600 leading-relaxed font-light">${trimmed}</p>`;
  }).filter(Boolean).join('\n');
  
  return html;
}

const getEmbedUrl = (url: string | undefined) => {
  if (!url) return '';
  if (url.includes('kinescope.io') && !url.includes('/embed/')) {
    return url.replace('kinescope.io/', 'kinescope.io/embed/');
  }
  return url;
};

// Layout elements
const SVGS = {
  VkIcon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.8712 15.6599C12.8712 15.6599 15.2212 15.6199 16.5412 17.5199C16.9812 18.1599 16.6412 18.6199 16.6412 18.6199L13.8812 18.6599C13.8812 18.6599 11.8212 18.7899 10.4612 17.2299C10.4612 17.2299 10.4412 15.1199 9.94119 15.2199C9.33119 15.3499 9.17119 16.6699 9.17119 17.5999C9.17119 18.2899 8.61119 18.6699 8.61119 18.6699C8.61119 18.6699 6.27119 18.7999 4.39119 16.5999C2.45119 14.3199 0.441193 9.42993 0.441193 9.42993C0.441193 9.42993 0.731193 8.76993 1.98119 8.79993C1.98119 8.79993 3.69119 8.74993 3.79119 8.74993C4.21119 8.74993 4.41119 8.97993 4.50119 9.16993C4.50119 9.16993 5.37119 11.4599 6.54119 13.0699C7.65119 14.5999 8.12119 14.6599 8.35119 14.4899C8.94119 14.0799 8.84119 12.3399 8.84119 11.6699C8.84119 9.53993 9.17119 8.21993 10.0812 7.97993C10.3812 7.89993 10.8412 7.84993 11.4112 7.83993C12.1612 7.81993 13.0112 7.91993 13.1912 8.16993C13.2412 8.23993 12.5512 8.52993 12.4812 9.69993C12.4212 10.9799 12.8712 11.0899 12.8712 11.0899C12.8712 11.0899 14.3612 10.9999 15.9312 8.27993C15.9312 8.27993 16.2712 7.72993 17.0712 7.79993C17.9612 7.87993 18.9112 7.78993 18.9112 7.78993C18.9112 7.78993 19.3812 7.76993 19.7412 8.13993C20.0712 8.48993 19.9512 9.10993 19.9512 9.10993C19.9512 9.10993 19.5712 10.9399 17.7412 13.0199C15.8212 15.1999 15.0712 15.3499 15.0712 15.3499L12.8712 15.6599Z" />
  </svg>`,
  Send: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>`,
  Mail: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>`,
  ArrowRight: `<svg class="inline-block transition-transform group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>`,
  ArrowLeft: `<svg class="transition-transform group-hover:-translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>`,
  Play: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>`,
  ChevronRight: `<svg class="transition-all duration-200" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>`,
  Menu: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>`,
  X: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>`
};

const menuItems = [
  { path: '/', label: 'Главная' },
  { path: '/portfolio', label: 'Портфолио' },
  { path: '/pricing', label: 'Прайс' },
  { path: '/journal', label: 'Журнал' },
  { path: '/why-us', label: 'Почему мы' },
  { path: '/team', label: 'Команда' },
  { path: '/contacts', label: 'Контакты' },
];

interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  structuredDataJson?: string;
}

export function wrapLayout(content: string, activePath: string, meta: PageMeta): string {
  const activeClass = "text-zinc-950 font-bold relative";
  const inactiveClass = "text-zinc-500 font-bold hover:text-brandOrange";
  const indicator = `<span class="absolute bottom-0 left-0 w-full h-[2px] bg-brandOrange rounded-full"></span>`;

  // Build Desktop Nav
  const desktopNav = menuItems.map(item => {
    const isActive = activePath === item.path || 
                     (item.path === '/portfolio' && activePath.startsWith('/project')) ||
                     (item.path === '/journal' && activePath.startsWith('/journal/'));
    return `
      <a href="${item.path}" class="transition-all duration-200 py-2 whitespace-nowrap uppercase tracking-wider text-[10px] lg:text-[11px] font-sans ${isActive ? activeClass : inactiveClass}">
        ${item.label}
        ${isActive ? indicator : ''}
      </a>
    `;
  }).join('');

  // Build Mobile Nav
  const mobileNav = menuItems.map(item => {
    const isActive = activePath === item.path || 
                     (item.path === '/portfolio' && activePath.startsWith('/project')) ||
                     (item.path === '/journal' && activePath.startsWith('/journal/'));
    return `
      <a href="${item.path}" class="py-3.5 flex items-center justify-between border-b border-zinc-100 transition-colors uppercase tracking-wider font-sans text-xs ${isActive ? 'text-brandOrange' : 'text-zinc-600'}">
        <span>${item.label}</span>
        ${isActive ? `<span class="w-1.5 h-1.5 rounded-full bg-brandOrange"></span>` : ''}
      </a>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="ru" class="scroll-smooth">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="yandex-verification" content="45084375cee74b1d" />
    <meta name="google-site-verification" content="OWYnr58zL6lKuOQjR0utDAYN_5aAtmhMwHgpHI0LNGU" />
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description.replace(/"/g, '&quot;')}" />
    <meta name="keywords" content="видеопродакшн, видеосъемка воронеж, архитектурная съемка, производство видео, рекламные ролики, контент для соцсетей, ИИ видео, PRIZMA" />
    <meta name="author" content="PRIZMA Production" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
    <link rel="canonical" href="${meta.canonical}" />
    
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${meta.canonical}" />
    <meta property="og:title" content="${meta.title.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${meta.description.replace(/"/g, '&quot;')}" />
    <meta property="og:image" content="https://prizmaprod.ru/apple-touch-icon.png" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="${meta.title.replace(/"/g, '&quot;')}" />
    <meta property="twitter:description" content="${meta.description.replace(/"/g, '&quot;')}" />
    <meta property="twitter:image" content="https://prizmaprod.ru/apple-touch-icon.png" />

    <!-- Structured Data (JSON-LD) -->
    ${meta.structuredDataJson ? `<script type="application/ld+json">${meta.structuredDataJson}</script>` : ''}

    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['"Inter Tight"', 'Inter', 'sans-serif'],
              serif: ['"Instrument Serif"', 'Georgia', 'serif'],
              mono: ['"JetBrains Mono"', 'monospace'],
            },
            colors: {
              brandOrange: '#FF5722',
            }
          }
        }
      }
    </script>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Inter+Tight:ital,wght@0,100..900;1,100..900&family=JetBrains+Mono:wght@400;500&family=Inter:wght@300;400;600;900&display=swap');
      
      body {
        background-color: #ffffff;
        color: #18181b;
        font-family: 'Inter Tight', 'Inter', sans-serif;
      }
      
      .no-scrollbar::-webkit-scrollbar {
          display: none;
      }
      .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
      }
    </style>
  </head>
  <body>
    <div class="min-h-screen bg-white text-zinc-950 flex flex-col font-sans">
      <!-- Header -->
      <header class="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-zinc-100 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <!-- Logo -->
          <a href="/" class="text-2xl font-sans font-black tracking-tighter text-zinc-900 uppercase select-none flex items-baseline hover:opacity-80 transition-opacity">
            PRIZMA<span class="font-serif italic text-brandOrange font-normal ml-0.5">.</span>
          </a>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-7 font-bold tracking-wider">
            ${desktopNav}
          </nav>

          <!-- Right Actions & Social Links -->
          <div class="hidden md:flex items-center gap-4 text-zinc-400">
            <div class="hidden lg:flex items-center gap-3">
              <a href="https://t.me/gnikw" target="_blank" rel="noopener noreferrer" class="hover:text-brandOrange transition-colors">
                ${SVGS.Send}
              </a>
              <a href="https://vk.com/prizmastudia" target="_blank" rel="noopener noreferrer" class="hover:text-brandOrange transition-colors">
                ${SVGS.VkIcon}
              </a>
              <a href="mailto:gniks1@yandex.ru" class="hover:text-brandOrange transition-colors">
                ${SVGS.Mail}
              </a>
            </div>
            <a href="/contacts" class="ml-2 bg-zinc-950 text-white font-black text-[10px] uppercase tracking-[0.2em] px-4 py-2.5 hover:bg-brandOrange hover:text-white transition-all rounded-lg duration-300 whitespace-nowrap">
              Связаться
            </a>
          </div>

          <!-- Mobile Menu Button -->
          <div class="flex md:hidden items-center">
            <button id="mobile-menu-btn" class="p-2 text-zinc-900 hover:text-brandOrange transition-colors focus:outline-none" aria-label="Toggle menu">
              ${SVGS.Menu}
            </button>
          </div>
        </div>

        <!-- Mobile Menu Overlay -->
        <div id="mobile-menu" class="hidden md:hidden fixed inset-x-0 top-20 bg-white border-b border-zinc-200 shadow-2xl z-40 max-h-[calc(100vh-5rem)] overflow-y-auto">
          <div class="px-6 py-4 flex flex-col font-sans font-bold text-xs uppercase tracking-wider">
            ${mobileNav}

            <!-- Mobile Social & Contact -->
            <div class="pt-6 mt-2 flex flex-col gap-4">
              <div class="flex gap-8 text-zinc-500 justify-center py-2">
                <a href="https://t.me/gnikw" target="_blank" rel="noopener noreferrer" class="hover:text-brandOrange transition-colors">
                  ${SVGS.Send}
                </a>
                <a href="https://vk.com/prizmastudia" target="_blank" rel="noopener noreferrer" class="hover:text-brandOrange transition-colors">
                  ${SVGS.VkIcon}
                </a>
                <a href="mailto:gniks1@yandex.ru" class="hover:text-brandOrange transition-colors">
                  ${SVGS.Mail}
                </a>
              </div>
              <a href="/contacts" class="w-full text-center bg-zinc-950 hover:bg-brandOrange text-white font-bold text-xs uppercase tracking-widest py-3 rounded-lg shadow-sm transition-colors">
                Связаться
              </a>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 w-full flex flex-col px-4 sm:px-6 lg:px-8 py-10 md:py-16 max-w-7xl mx-auto overflow-hidden">
        <div class="w-full flex-1 flex flex-col items-center">
          ${content}
        </div>

        <!-- Footer -->
        <footer class="w-full mt-24 pt-10 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-zinc-400 text-[10px] font-mono uppercase tracking-[0.2em]">
          <p class="text-center sm:text-left">&copy; 2026 PRIZMA Video Production. Все права защищены.</p>
          <p class="font-extrabold text-zinc-600">Воронеж &bull; По всей России</p>
        </footer>
      </main>
    </div>

    <!-- Layout & Nav Logic -->
    <script>
      // Hamburger Menu Toggle
      const mobileMenuBtn = document.getElementById('mobile-menu-btn');
      const mobileMenu = document.getElementById('mobile-menu');
      
      if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
          mobileMenu.classList.toggle('hidden');
          const isHidden = mobileMenu.classList.contains('hidden');
          mobileMenuBtn.innerHTML = isHidden ? \`${SVGS.Menu}\` : \`${SVGS.X}\`;
        });
      }
    </script>
  </body>
</html>`;
}

// 1. Home Page Generator
export function generateHome(): string {
  const featuredProjects = PROJECTS.slice(0, 3);
  
  // Collage background cards
  const positions = [
    { top: '5%', left: '55%', rotate: -5 },
    { top: '30%', left: '70%', rotate: 8 },
    { top: '60%', left: '50%', rotate: -12 },
    { top: '10%', left: '80%', rotate: 15 },
    { top: '45%', left: '40%', rotate: -3 },
    { top: '70%', left: '75%', rotate: 10 },
    { top: '2%', left: '35%', rotate: -8 },
    { top: '55%', left: '85%', rotate: 5 },
  ];

  const collageCards = PROJECTS.map((p, i) => {
    if (!p.imageUrl) return '';
    const pos = positions[i % positions.length];
    return `
      <div class="absolute w-48 h-64 md:w-64 md:h-80 bg-zinc-200 rounded-lg overflow-hidden shadow-2xl border border-white/20 transition-transform duration-[4000ms] ease-in-out hover:scale-105" 
           style="top: ${pos.top}; left: ${pos.left}; transform: rotate(${pos.rotate}deg);">
        <img src="${p.imageUrl}" alt="Съемка: ${p.title}" class="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
      </div>
    `;
  }).filter(Boolean).slice(0, positions.length).join('');

  // Featured Projects grid cards
  const featuredCards = featuredProjects.map(project => {
    const videoSrc = getEmbedUrl(project.videoUrl || project.vkIframeSrc);
    return `
      <div class="group">
        <a href="/project/${project.id}" class="block">
          <div class="aspect-video bg-zinc-100 rounded-lg overflow-hidden mb-4 relative border border-zinc-100">
            ${videoSrc ? `
              <div class="w-full h-full relative pointer-events-none">
                <iframe src="${videoSrc}?controls=false&muted=true&autoplay=false" class="absolute inset-0 w-full h-full object-cover" title="${project.title}" frameborder="0" loading="lazy"></iframe>
                <div class="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="text-white ml-1">${SVGS.Play}</span>
                  </div>
                </div>
              </div>
            ` : `
              <div class="w-full h-full relative">
                <img src="${project.imageUrl}" alt="Превью: ${project.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="text-white ml-1">${SVGS.Play}</span>
                  </div>
                </div>
              </div>
            `}
          </div>
          <h3 class="text-lg font-extrabold text-zinc-950 uppercase tracking-tight mb-1 group-hover:text-brandOrange transition-colors">${project.title}</h3>
          <p class="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">${project.client}</p>
        </a>
      </div>
    `;
  }).join('');

  const content = `
    <div class="w-full max-w-7xl pb-20">
      <!-- Hero Section -->
      <section class="relative min-h-[65vh] md:min-h-[85vh] flex flex-col justify-center items-start mb-16 md:mb-24 lg:mb-32 overflow-hidden w-full">
        <!-- Collage Background (Hidden on mobile) -->
        <div class="hidden md:block absolute inset-0 z-0 opacity-40 pointer-events-none select-none overflow-hidden">
          <div class="relative w-full h-full">
            ${collageCards}
          </div>
          <div class="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent"></div>
        </div>

        <div class="relative z-10 max-w-5xl w-full">
          <p class="text-[10px] sm:text-xs font-mono uppercase tracking-[0.5em] text-zinc-400 mb-3 md:mb-6">PRIZMA - Video Production Studio</p>
          <h1 class="text-[1.8rem] min-[320px]:text-[2rem] min-[360px]:text-[2.2rem] min-[400px]:text-[2.5rem] min-[440px]:text-[3rem] min-[480px]:text-[3.5rem] sm:text-7xl md:text-[6rem] lg:text-[7.5rem] xl:text-[9.5rem] font-sans font-black uppercase tracking-tighter leading-[0.85] text-zinc-950 mb-6 md:mb-12 select-none w-full">
            <span class="whitespace-nowrap inline-block">Производство</span> <br />
            <span class="font-serif italic text-brandOrange font-normal lowercase tracking-normal">видео</span> <br />
            полного цикла
          </h1>
          <p class="text-zinc-600 text-sm sm:text-lg md:text-xl lg:text-2xl font-light leading-relaxed mb-8 md:mb-14 max-w-2xl">
            Создаем качественный визуальный контент, который работает на имидж и цели вашего бизнеса.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 w-full sm:w-auto">
            <a href="/portfolio" class="bg-zinc-950 text-white px-6 py-3.5 md:px-8 md:py-4 font-extrabold text-[11px] uppercase tracking-widest hover:bg-brandOrange transition-all flex items-center justify-center gap-2 rounded-lg w-full sm:w-auto text-center group">
              Смотреть работы ${SVGS.ArrowRight}
            </a>
            <a href="/contacts" class="border-2 border-zinc-950 text-zinc-950 px-6 py-3.5 md:px-8 md:py-4 font-extrabold text-[11px] uppercase tracking-widest hover:bg-zinc-950 hover:text-white transition-all rounded-lg w-full sm:w-auto text-center">
              Обсудить проект
            </a>
          </div>
        </div>

        <!-- Decorative shape -->
        <div class="absolute top-1/2 right-0 -translate-y-1/2 w-1/2 h-full opacity-10 pointer-events-none hidden lg:block">
           <div class="w-full h-full border-[40px] border-zinc-900 rounded-full scale-150 translate-x-1/2"></div>
         </div>
      </section>

      <!-- Featured Projects Section -->
      <section class="mb-24 md:mb-32 lg:mb-40">
        <div class="flex justify-between items-end mb-10 md:mb-16">
          <div>
            <p class="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-zinc-400 mb-2">Избранное</p>
            <h2 class="text-4xl sm:text-5xl md:text-6xl font-sans font-black uppercase tracking-tighter text-zinc-950">
              Любимые <span class="font-serif italic text-brandOrange font-normal lowercase tracking-normal">проекты</span>
            </h2>
          </div>
          <a href="/portfolio" class="text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-brandOrange transition-colors border-b border-zinc-200 pb-1 hidden sm:block">
            Портфолио
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
          ${featuredCards}
        </div>
      </section>

      <!-- Quality Services grid -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 mb-24 md:mb-32 lg:mb-40 bg-zinc-50/50 p-6 sm:p-12 md:p-16 rounded-2xl border border-zinc-100/80">
        <div class="flex flex-col gap-4 lg:gap-6">
          <div class="w-12 h-12 lg:w-14 lg:h-14 bg-brandOrange/10 text-brandOrange flex items-center justify-center rounded-xl">
            ${SVGS.Zap}
          </div>
          <h3 class="text-xl lg:text-2xl font-black uppercase tracking-tight text-zinc-950">Скорость</h3>
          <p class="text-zinc-500 text-sm lg:text-base leading-relaxed">
            Мы ценим ваше время. От идеи до первого драфта — в кратчайшие сроки без потери качества.
          </p>
        </div>
        <div class="flex flex-col gap-4 lg:gap-6">
          <div class="w-12 h-12 lg:w-14 lg:h-14 bg-brandOrange/10 text-brandOrange flex items-center justify-center rounded-xl">
            ${SVGS.Shield}
          </div>
          <h3 class="text-xl lg:text-2xl font-black uppercase tracking-tight text-zinc-950">Качество</h3>
          <p class="text-zinc-500 text-sm lg:text-base leading-relaxed">
            Используем современное оборудование и ИИ-технологии для достижения кинематографичного результата.
          </p>
        </div>
        <div class="flex flex-col gap-4 lg:gap-6">
          <div class="w-12 h-12 lg:w-14 lg:h-14 bg-brandOrange/10 text-brandOrange flex items-center justify-center rounded-xl">
            ${SVGS.Clock}
          </div>
          <h3 class="text-xl lg:text-2xl font-black uppercase tracking-tight text-zinc-950">Опыт</h3>
          <p class="text-zinc-500 text-sm lg:text-base leading-relaxed">
            Множество реализованных проектов в различных нишах: от архитектуры до мероприятий.
          </p>
        </div>
      </section>

      <!-- CTA Footer block -->
      <section class="text-center py-16 sm:py-24 md:py-32 bg-zinc-950 text-white rounded-2xl relative overflow-hidden">
        <div class="relative z-10 max-w-3xl mx-auto px-6">
          <h2 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-black uppercase tracking-tighter leading-none mb-8 md:mb-10 break-words">
            Готовы создать <br /> что-то <span class="font-serif italic text-brandOrange font-normal lowercase tracking-normal">особенное?</span>
          </h2>
          <p class="text-zinc-400 mb-10 md:mb-12 text-base sm:text-lg md:text-xl font-light max-w-md mx-auto">
            Оставьте заявку, и мы свяжемся с вами для обсуждения деталей вашего будущего проекта.
          </p>
          <a href="/contacts" class="inline-block bg-white text-zinc-950 px-8 py-4 font-black text-xs uppercase tracking-widest hover:bg-brandOrange hover:text-white transition-all rounded-lg shadow-sm">
            Начать проект
          </a>
        </div>
        <div class="absolute -bottom-10 -left-10 text-[15vw] font-black text-white/[0.02] select-none pointer-events-none leading-none uppercase tracking-tighter">
          PRIZMA
        </div>
      </section>
    </div>
  `;

  const meta: PageMeta = {
    title: 'PRIZMA Video Production | Видеопроизводство полного цикла в Воронеже',
    description: 'Профессиональный видеопродакшн PRIZMA в Воронеже. Архитектурная съемка, видеоконтент для соцсетей, ИИ-видеогенерация и репортажи мероприятий. Съемки по всей России.',
    canonical: 'https://prizmaprod.ru/',
    structuredDataJson: JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "PRIZMA Production",
        "alternateName": "ПРИЗМА Видео Продакшн",
        "url": "https://prizmaprod.ru/",
        "logo": "https://prizmaprod.ru/apple-touch-icon.png",
        "description": "Профессиональный видеопродакшн полного цикла. Архитектурная съемка, мероприятия, контент для соцсетей.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "ул. Революции 1905 года",
          "addressLocality": "Voronezh",
          "postalCode": "394000",
          "addressCountry": "RU"
        },
        "sameAs": [
          "https://vk.com/prizmastudia",
          "https://t.me/gnikw"
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "PRIZMA Production",
        "image": "https://prizmaprod.ru/apple-touch-icon.png",
        "url": "https://prizmaprod.ru/",
        "telephone": "+79102814981",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "ул. Революции 1905 года",
          "addressLocality": "Voronezh",
          "postalCode": "394000",
          "addressCountry": "RU"
        },
        "priceRange": "4000RUB - 100000RUB",
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "00:00",
          "closes": "23:59"
        }
      }
    ])
  };

  return wrapLayout(content, '/', meta);
}

// 2. Portfolio Page Generator
export function generatePortfolio(): string {
  const categories = Object.values(Category);

  // Render Category Subheader buttons
  const catButtons = categories.map(cat => {
    const isAll = cat === Category.ALL;
    return `
      <button data-cat="${cat}" class="portfolio-filter-btn text-[10px] font-mono uppercase tracking-wider transition-all duration-200 py-1 px-3.5 rounded-full border ${isAll ? 'bg-zinc-900 text-white font-bold border-zinc-900 shadow-sm' : 'bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300'}">
        ${cat}
      </button>
    `;
  }).join('');

  // Render Projects list
  const projectCards = PROJECTS.map(project => {
    // Project can have single category or array of categories
    const projCats = Array.isArray(project.category) ? project.category : [project.category];
    const catDataString = projCats.join(',');
    const videoSrc = getEmbedUrl(project.videoUrl || project.vkIframeSrc);

    return `
      <div class="portfolio-project-card group" data-categories="${catDataString}">
        <a href="/project/${project.id}" class="block">
          <div class="aspect-video bg-zinc-100 rounded-lg overflow-hidden mb-4 relative border border-zinc-100 shadow-sm">
            ${videoSrc ? `
              <div class="w-full h-full relative pointer-events-none">
                <iframe src="${videoSrc}?controls=false&muted=true&autoplay=false" class="absolute inset-0 w-full h-full object-cover" title="${project.title}" frameborder="0" loading="lazy"></iframe>
                <div class="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="text-white ml-1">${SVGS.Play}</span>
                  </div>
                </div>
              </div>
            ` : `
              <div class="w-full h-full relative">
                <img src="${project.imageUrl}" alt="Превью: ${project.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="text-white ml-1">${SVGS.Play}</span>
                  </div>
                </div>
              </div>
            `}
          </div>
          
          <div class="flex justify-between items-start gap-4">
            <div class="flex-1">
              <h3 class="text-lg font-extrabold text-zinc-950 uppercase tracking-tight group-hover:text-brandOrange transition-colors leading-tight mb-1">
                ${project.title}
              </h3>
              <p class="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                ${project.client}
              </p>
            </div>
            <span class="font-mono text-xs font-bold text-zinc-400 border border-zinc-100 px-2 py-0.5 rounded">
              ${project.year}
            </span>
          </div>
        </a>
      </div>
    `;
  }).join('');

  const content = `
    <div class="w-full">
      <!-- Portfolio Category Navigation Sub-Header -->
      <div class="w-full py-4 border-b border-zinc-100 mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span class="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Категории:</span>
        <div class="flex flex-wrap gap-2">
          ${catButtons}
        </div>
      </div>

      <!-- Portfolio Header Title -->
      <div class="mb-12 md:mb-16 lg:mb-20 w-full text-left">
        <h1 id="portfolio-title" class="text-[1.8rem] min-[360px]:text-[2.1rem] min-[400px]:text-[2.5rem] sm:text-[4rem] md:text-[6rem] lg:text-[7.5rem] xl:text-[9rem] font-sans font-black text-zinc-950 uppercase tracking-tighter leading-none select-none break-words">
          Наши <span class="font-serif italic text-brandOrange font-normal lowercase tracking-normal">работы</span>
        </h1>
        <div class="flex items-center gap-3 mt-4">
          <p class="text-zinc-500 text-[10px] lg:text-xs font-mono uppercase tracking-[0.3em] font-medium grow md:grow-0">
            Video Production Portfolio
          </p>
          <div class="h-px bg-zinc-200 grow hidden md:block"></div>
          <p id="portfolio-counter" class="text-zinc-400 text-[10px] font-mono uppercase tracking-widest hidden sm:block">
            ${PROJECTS.length} Проектов
          </p>
        </div>
      </div>

      <!-- Projects Grid -->
      <div id="projects-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-12 lg:gap-x-10 w-full">
        ${projectCards}
      </div>

      <!-- Empty state placeholder -->
      <div id="empty-state" class="hidden flex-col items-center justify-center h-[50vh] text-zinc-500 text-sm font-light">
        Проекты в данной категории временно отсутствуют.
      </div>
    </div>

    <!-- Client-Side Vanilla JS Interactive Filter for Portfolio Categories -->
    <script>
      const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
      const projectCards = document.querySelectorAll('.portfolio-project-card');
      const counterEl = document.getElementById('portfolio-counter');
      const emptyState = document.getElementById('empty-state');
      const titleEl = document.getElementById('portfolio-title');

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          // Reset button styles
          filterBtns.forEach(b => {
            b.className = "portfolio-filter-btn text-[10px] font-mono uppercase tracking-wider transition-all duration-200 py-1 px-3.5 rounded-full border bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300";
          });

          // Highlight selected button
          btn.className = "portfolio-filter-btn text-[10px] font-mono uppercase tracking-wider transition-all duration-200 py-1 px-3.5 rounded-full border bg-zinc-900 text-white font-bold border-zinc-900 shadow-sm";

          const category = btn.getAttribute('data-cat');
          let visibleCount = 0;

          projectCards.forEach(card => {
            const categoriesString = card.getAttribute('data-categories');
            const categories = categoriesString ? categoriesString.split(',') : [];
            
            if (category === '${Category.ALL}' || categories.includes(category)) {
              card.style.display = 'block';
              visibleCount++;
            } else {
              card.style.display = 'none';
            }
          });

          // Update heading title based on active category
          if (category === '${Category.ALL}') {
            titleEl.innerHTML = \`Наши <span class="font-serif italic text-brandOrange font-normal lowercase tracking-normal">работы</span>\`;
          } else {
            titleEl.textContent = category;
          }

          // Update counter
          if (counterEl) {
            counterEl.textContent = \`\${visibleCount} Проектов\`;
          }

          // Toggle empty state
          if (visibleCount === 0) {
            emptyState.classList.remove('hidden');
            emptyState.classList.add('flex');
          } else {
            emptyState.classList.add('hidden');
            emptyState.classList.remove('flex');
          }
        });
      });
    </script>
  `;

  const meta: PageMeta = {
    title: 'Портфолио | PRIZMA Video Production',
    description: 'Посмотрите видео работы студии PRIZMA: архитектурная съемка, видео для соцсетей, репортажи мероприятий. Примеры успешных кейсов в Воронеже и по всей России.',
    canonical: 'https://prizmaprod.ru/portfolio'
  };

  return wrapLayout(content, '/portfolio', meta);
}

// 3. Pricing Page Generator
export function generatePricing(): string {
  const priceList = [
    {
      title: 'Интерьерная съёмка до 60 м²',
      description: '1 объект, до 2 часов, базовый монтаж',
      price: '8 000 ₽'
    },
    {
      title: 'Интерьерная съёмка 60–150 м²',
      description: '1 объект, до 3 часов, базовый монтаж',
      price: '12 000 ₽'
    },
    {
      title: 'Вертикальный ролик до 30 c',
      description: 'Сценарий по ТЗ, съёмка, монтаж',
      price: '4 000 ₽'
    },
    {
      title: 'Контент‑день (8–12 роликов)',
      description: '3–4 часа съёмки, нарезка для соцсетей',
      price: '24 000 ₽'
    },
    {
      title: 'Мероприятие, 1 час',
      description: 'Съёмка 1 оператора, мин. заказ 2 часа',
      price: '4 000 ₽/час'
    },
    {
      title: 'Полный день мероприятия',
      description: 'До 10 часов, итоговый ролик 3–5 минут',
      price: '35 000 ₽'
    },
    {
      title: 'ИИ‑интро до 15 сек',
      description: 'Идея, генерация, монтаж, звук',
      price: 'от 5 000 ₽'
    }
  ];

  const pricingRows = priceList.map(item => `
    <div class="group flex flex-col md:flex-row md:items-center justify-between py-6 md:py-10 border-b border-zinc-900/10 hover:bg-white/30 transition-colors px-2 md:px-4" role="row">
      <div class="flex flex-col gap-1 md:max-w-[65%] mb-4 md:mb-0">
        <h3 class="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-zinc-900 leading-tight" role="cell">
          ${item.title}
        </h3>
        <p class="text-zinc-500 text-sm sm:text-base font-light">
          ${item.description}
        </p>
      </div>
      <div class="flex items-center gap-2" role="cell">
        <span class="font-mono text-xl sm:text-2xl md:text-3xl font-medium tracking-tighter text-zinc-900 whitespace-nowrap">
          ${item.price}
        </span>
      </div>
    </div>
  `).join('');

  const content = `
    <section class="w-full max-w-7xl pb-20">
      <h1 class="text-zinc-900 text-[1.8rem] min-[360px]:text-[2.1rem] min-[400px]:text-[2.5rem] sm:text-[4rem] md:text-[5rem] lg:text-6xl xl:text-7xl font-sans font-black uppercase tracking-tighter mb-10 md:mb-16 select-none leading-[0.85] break-words">
        Стоимость видеосъемки и монтажа видео
      </h1>

      <div class="flex flex-col border-t border-zinc-900" role="table">
        ${pricingRows}
      </div>

      <div class="mt-16 md:mt-24 p-8 sm:p-12 md:p-16 bg-zinc-900 text-white rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-8 md:gap-12 shadow-2xl relative overflow-hidden">
        <div class="flex flex-col gap-2 relative z-10 max-w-2xl">
          <p class="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] opacity-60">Расчет стоимости проекта</p>
          <h4 class="text-2xl sm:text-3xl md:text-4xl font-black leading-[0.9] uppercase tracking-tight">Нужен индивидуальный продакшн под ключ?</h4>
        </div>
        <a href="/contacts" class="relative z-10 border-2 border-white hover:bg-white hover:text-zinc-900 px-8 py-4 md:px-10 md:py-5 font-black text-xs sm:text-sm uppercase tracking-widest transition-all text-center shrink-0 rounded-lg" aria-label="Заказать расчет стоимости видеопроекта">
          Обсудить проект
        </a>
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      </div>
      
      <p class="mt-4 text-[10px] text-zinc-400 font-mono uppercase tracking-widest text-center md:text-right">
        * Цены актуальны на 2026 год и могут меняться в зависимости от технического задания.
      </p>
    </section>
  `;

  const meta: PageMeta = {
    title: 'Цены на видеосъемку | PRIZMA Production',
    description: 'Цены на услуги видеопроизводства в Воронеже. Прозрачная стоимость интерьерной съемки, создания Reels/TikTok, видеорепортажей мероприятий. Понятный прайс-лист.',
    canonical: 'https://prizmaprod.ru/pricing'
  };

  return wrapLayout(content, '/pricing', meta);
}

// 4. Why Us Page Generator
export function generateWhyUs(): string {
  const points = [
    {
      id: '01',
      title: 'Полный цикл производства — от идеи до готового видео',
      description: 'Мы берём на себя всё: разработку сценария, подготовку, съёмку, монтаж, цветокор, звук и адаптацию под разные платформы. Клиент получает результат «под ключ» без необходимости что-то контролировать или додумывать.'
    },
    {
      id: '02',
      title: 'Видео, которое решает бизнес-задачи',
      description: 'Мы создаём не просто красивые кадры — мы делаем контент, который влияет на продажи, восприятие бренда и доверие клиентов. Каждый ролик основан на логике бизнеса, а не на случайных креативных идеях.'
    },
    {
      id: '03',
      title: 'Гибкие условия и любые способы оплаты',
      description: 'Работаем официально, принимаем любые удобные способы оплаты: ИП, ООО, самозанятые, переводы, по договору — подстраиваемся под бизнес-процессы клиента. Никаких сложностей с бухгалтерами и закрывающими документами.'
    },
    {
      id: '04',
      title: 'Погружение в продукт и внимательность к деталям',
      description: 'Мы изучаем специфику компании, её аудиторию и ценность, чтобы ролик точно отражал суть бренда. Поэтому наши видео выглядят живыми, убедительными и профессиональными — их не хочется пролистывать.'
    }
  ];

  const pointBlocks = points.map(point => `
    <div class="flex flex-col gap-3 group">
      <div class="flex items-baseline justify-between border-b border-zinc-900 pb-2 mb-1">
        <span class="text-3xl md:text-5xl font-mono font-light text-zinc-200 group-hover:text-zinc-900 transition-colors duration-300 leading-none">
          ${point.id}
        </span>
      </div>
      <h3 class="text-lg md:text-xl font-black leading-tight">${point.title}</h3>
      <p class="text-zinc-600 leading-relaxed text-sm md:text-base font-light">${point.description}</p>
    </div>
  `).join('');

  const content = `
    <section class="w-full max-w-7xl pb-12">
      <h1 class="text-zinc-900 text-[1.8rem] min-[360px]:text-[2.1rem] min-[400px]:text-[2.5rem] sm:text-[4rem] md:text-[5rem] lg:text-6xl xl:text-7xl font-sans font-black uppercase tracking-tighter mb-10 md:mb-12 select-none leading-[0.85] break-words">
        Почему выбирают PRIZMA Production
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        ${pointBlocks}
      </div>
    </section>
  `;

  const meta: PageMeta = {
    title: 'Почему выбирают нас | PRIZMA Production',
    description: 'Преимущества работы с видеостудией PRIZMA: полное ведение проектов, сильный фокус на бизнес-задачи, гибкие условия оплаты (ИП, ООО), внимание к деталям.',
    canonical: 'https://prizmaprod.ru/why-us'
  };

  return wrapLayout(content, '/why-us', meta);
}

// 5. Team Page Generator
export function generateTeam(): string {
  const content = `
    <section class="w-full max-w-7xl pb-12">
      <h1 class="text-zinc-900 text-[1.8rem] min-[360px]:text-[2.1rem] min-[400px]:text-[2.5rem] sm:text-[4rem] md:text-[5rem] lg:text-6xl xl:text-7xl font-sans font-black uppercase tracking-tighter mb-8 md:mb-12 select-none leading-[0.85] break-words">
        Наша Команда
      </h1>

      <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div class="flex-1 flex flex-col gap-6 text-zinc-700 leading-relaxed text-sm md:text-base font-light">
          <div class="border-l-2 border-zinc-900 pl-4 py-1">
            <blockquote class="font-medium text-zinc-900 italic text-base md:text-lg lg:text-xl">
              «В основе студии — два специалиста, которые формируют креатив, продумывают сценарии и лично отвечают за качество каждого проекта».
            </blockquote>
          </div>
          
          <p>
            Мы работаем в формате «бутик-продакшена»: меньше людей, больше внимания, лучший результат. Специализируемся на видеопроизводстве в Воронеже и по всей России.
          </p>

          <p>
            Под конкретные задачи мы привлекаем специалистов из нашей профессиональной сети — операторов, цветокорректоров, аниматоров, звукорежиссёров. Такой подход позволяет собирать оптимальную команду под каждый проект.
          </p>

          <div class="bg-zinc-200/50 p-6 rounded-2xl mt-4 border-l-4 border-zinc-900">
            <p class="font-black text-zinc-900 text-sm md:text-base uppercase tracking-tight">
              Наша цель — создавать видео, которое помогает бизнесу выделяться, продавать и расти.
            </p>
          </div>
        </div>

        <div class="flex-1">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
            <div class="flex flex-col gap-2" itemscope itemtype="https://schema.org/Person">
              <div class="aspect-[3/4] w-full bg-zinc-300 relative overflow-hidden rounded-2xl group shadow-md">
                <img src="https://sun9-79.userapi.com/s/v1/ig2/49TfrQ5b2Fp0dM19a6Kh_5hfugreg0VRlTQ8veq8PPgWuZ3RVpLyj3e_y3t11QzIKT9A31aecgVMMV029QGesK5u.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,960x1280&from=bu&cs=960x0" alt="Никита - Сооснователь и Продюсер PRIZMA Production" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" itemprop="image" />
              </div>
              <div>
                <h3 class="text-lg font-black text-zinc-900 uppercase" itemprop="name">Никита</h3>
                <p class="text-[9px] font-mono text-zinc-500 uppercase tracking-widest" itemprop="jobTitle">Co-Founder / Producer</p>
              </div>
            </div>

            <div class="flex flex-col gap-2 md:mt-8" itemscope itemtype="https://schema.org/Person">
              <div class="aspect-[3/4] w-full bg-zinc-300 relative overflow-hidden rounded-2xl group shadow-md">
                <img src="https://sun9-65.userapi.com/s/v1/ig2/9V8vyxHZVNBc1p8OK28ziORMpml4ALMDS4Ff8m90iTZ-DUtjcN9tcx2DL96EycWgKVLEZ_uBNpcnNmtDGCEZYpE8.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,960x1280&from=bu&cs=960x0" alt="Игорь - Сооснователь и Оператор-постановщик PRIZMA Production" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" itemprop="image" />
              </div>
              <div>
                <h3 class="text-lg font-black text-zinc-900 uppercase" itemprop="name">Игорь</h3>
                <p class="text-[9px] font-mono text-zinc-500 uppercase tracking-widest" itemprop="jobTitle">Co-Founder / DOP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  const meta: PageMeta = {
    title: 'Наша команда | PRIZMA Production',
    description: 'Познакомьтесь с сооснователями студии PRIZMA в Воронеже: Никита (Co-Founder, Продюсер) и Игорь (Co-Founder, DOP). Ведем проекты лично и отвечаем за качество.',
    canonical: 'https://prizmaprod.ru/team'
  };

  return wrapLayout(content, '/team', meta);
}

// 6. Contacts Page Generator
export function generateContacts(): string {
  const content = `
    <div class="w-full max-w-7xl pb-12">
      <h1 class="text-zinc-900 text-[1.8rem] min-[360px]:text-[2.1rem] min-[400px]:text-[2.5rem] sm:text-[4rem] md:text-[5rem] lg:text-6xl xl:text-7xl font-sans font-black uppercase tracking-tighter mb-8 md:mb-12 select-none leading-[0.85] break-words">
        Контакты
      </h1>

      <div class="flex flex-col lg:flex-row gap-12 md:gap-16 lg:gap-24">
        <!-- Text Contact Information -->
        <div class="flex-1 flex flex-col gap-10 md:gap-12 w-full">
          <div class="flex flex-col gap-2">
            <span class="text-[10px] sm:text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold">Телефон</span>
            <a href="tel:89102814981" class="text-xl min-[350px]:text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black hover:text-brandOrange transition-colors tracking-tighter leading-[0.85] break-words">
              8 910 281-49-81
            </a>
          </div>

          <div class="flex flex-col gap-4 md:gap-6">
            <span class="text-[10px] sm:text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold">Соцсети и почта</span>
            <div class="flex flex-wrap items-start gap-6 md:gap-8 lg:gap-10">
              <div class="flex flex-col items-center gap-2">
                <a href="https://t.me/gnikw" target="_blank" class="w-12 h-12 border border-zinc-900 flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all shadow-sm rounded-lg">
                  ${SVGS.Send}
                </a>
                <span class="text-[9px] font-bold uppercase tracking-widest text-zinc-400 font-mono">Telegram</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <a href="https://vk.com/prizmastudia" target="_blank" class="w-12 h-12 border border-zinc-900 flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all shadow-sm rounded-lg">
                  ${SVGS.VkIcon}
                </a>
                <span class="text-[9px] font-bold uppercase tracking-widest text-zinc-400 font-mono">ВКонтакте</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <a href="mailto:gniks1@yandex.ru" class="w-12 h-12 border border-zinc-900 flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all shadow-sm rounded-lg">
                  ${SVGS.Mail}
                </a>
                <span class="text-[9px] font-bold uppercase tracking-widest text-zinc-400 font-mono">Почта</span>
              </div>
            </div>
          </div>

          <div class="mt-2 border-l-2 border-zinc-900 pl-4 py-1">
            <p class="text-zinc-700 leading-relaxed font-light text-base md:text-lg italic">
              Мы находимся в Воронеже, но работаем по всей России. Обсудим ваш проект в любое время.
            </p>
          </div>
        </div>

        <!-- Submission Form Box -->
        <div class="flex-1 bg-white p-6 md:p-8 border border-zinc-100 shadow-xl shadow-zinc-100/50 rounded-2xl">
          <form id="lead-form" class="flex flex-col gap-4">
            <!-- Honeypot -->
            <input type="text" name="_honey" style="display: none;" tabindex="-1" autocomplete="off" />
            
            <div class="flex flex-col gap-1">
              <label class="text-[9px] font-bold uppercase tracking-widest text-zinc-400 font-mono">Ваше имя</label>
              <input type="text" id="form-name" name="name" required placeholder="Имя" class="w-full border-b border-zinc-200 py-1 text-base focus:outline-none focus:border-zinc-900 transition-colors bg-transparent font-medium" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[9px] font-bold uppercase tracking-widest text-zinc-400 font-mono">Телефон для связи</label>
              <input type="tel" id="form-contact" name="contact" required placeholder="+7 (999) 000-00-00" class="w-full border-b border-zinc-200 py-1 text-base focus:outline-none focus:border-zinc-900 transition-colors bg-transparent font-medium" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[9px] font-bold uppercase tracking-widest text-zinc-400 font-mono">Ваш вопрос</label>
              <textarea id="form-message" name="message" rows="2" placeholder="Опишите задачу..." class="w-full border-b border-zinc-200 py-1 text-sm focus:outline-none focus:border-zinc-900 transition-colors bg-transparent resize-none font-medium"></textarea>
            </div>
            
            <button type="submit" id="form-submit-btn" class="mt-2 py-3.5 px-6 font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-zinc-950 text-white hover:bg-brandOrange hover:border-brandOrange border border-zinc-950 rounded-lg">
              Отправить заявку
            </button>

            <!-- Status boxes -->
            <div id="form-status-error" class="hidden flex flex-col gap-1 mt-2">
              <p class="text-[10px] text-red-600 font-mono uppercase tracking-widest text-center">Ошибка при отправке</p>
              <p id="form-status-error-text" class="text-[9px] text-red-400 font-mono text-center lowercase italic"></p>
            </div>
            <p id="form-status-success" class="hidden text-[10px] text-green-600 font-mono uppercase tracking-widest text-center mt-2">
              Заявка успешно отправлена!
            </p>
          </form>
        </div>
      </div>
    </div>

    <!-- Contact Form Submission JS Logic -->
    <script>
      const form = document.getElementById('lead-form');
      const submitBtn = document.getElementById('form-submit-btn');
      const nameInput = document.getElementById('form-name');
      const contactInput = document.getElementById('form-contact');
      const msgInput = document.getElementById('form-message');
      
      const errorBox = document.getElementById('form-status-error');
      const errorTextEl = document.getElementById('form-status-error-text');
      const successBox = document.getElementById('form-form-status-success');
      const successEl = document.getElementById('form-status-success');

      if (contactInput) {
        contactInput.addEventListener('input', (e) => {
          contactInput.value = contactInput.value.replace(/[^\\d+()\\-\\s]/g, '');
        });
      }

      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const name = nameInput.value.trim();
          const contact = contactInput.value.trim();
          const message = msgInput.value.trim();

          if (!name || !contact) return;

          // Honeypot check
          const honey = form.querySelector('input[name="_honey"]').value;
          if (honey) {
            console.log("Spam blocked");
            return;
          }

          // Loading state
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'Отправка...';
          errorBox.classList.add('hidden');
          successEl.classList.add('hidden');

          const subject = "Новая заявка (Контакты): " + name;
          const text = "Имя: " + name + "\\nКонтакт: " + contact + "\\nСообщение: " + (message || "Без сообщения");

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 40000);

          try {
            const response = await fetch("/api/send-lead", {
              method: "POST",
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ subject, text, name }),
              signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (response.ok) {
              submitBtn.className = "mt-2 py-3.5 px-6 font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-green-600 text-white border-green-600 rounded-lg";
              submitBtn.innerHTML = "Готово";
              successEl.classList.remove('hidden');
              nameInput.value = '';
              contactInput.value = '';
              msgInput.value = '';
              
              if (name.toUpperCase() === 'TEST') {
                errorBox.classList.remove('hidden');
                errorTextEl.textContent = "ТЕСТ СВЯЗИ ПРОШЕЛ УСПЕШНО!";
              }

              setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.className = "mt-2 py-3.5 px-6 font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-zinc-950 text-white hover:bg-brandOrange hover:border-brandOrange border border-zinc-950 rounded-lg";
                submitBtn.innerHTML = "Отправить заявку";
                successEl.classList.add('hidden');
                errorBox.classList.add('hidden');
              }, 5000);

            } else {
              const errorData = await response.json().catch(() => ({}));
              const msg = errorData.error || "Ошибка сервера";
              const detail = errorData.details ? ": " + errorData.details : "";
              throw new Error(msg + detail);
            }
          } catch (err) {
            clearTimeout(timeoutId);
            submitBtn.disabled = false;
            submitBtn.className = "mt-2 py-3.5 px-6 font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-red-600 text-white border-red-600 rounded-lg";
            submitBtn.innerHTML = "Ошибка";
            errorBox.classList.remove('hidden');
            errorTextEl.textContent = err.name === 'AbortError' ? 'Время ожидания истекло' : err.message;
            
            setTimeout(() => {
              submitBtn.className = "mt-2 py-3.5 px-6 font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-zinc-950 text-white hover:bg-brandOrange hover:border-brandOrange border border-zinc-950 rounded-lg";
              submitBtn.innerHTML = "Отправить заявку";
              errorBox.classList.add('hidden');
            }, 10000);
          }
        });
      }
    </script>
  `;

  const meta: PageMeta = {
    title: 'Контакты | PRIZMA Production — Видеосъемка Воронеж',
    description: 'Контакты студии PRIZMA. Закажите видеосъемку недвижимости, мероприятий или Reels в Воронеже и по РФ. Телефон: +7 (910) 281-49-81. Форма обратной связи.',
    canonical: 'https://prizmaprod.ru/contacts'
  };

  return wrapLayout(content, '/contacts', meta);
}

// 7. Journal Page Generator
export function generateJournal(): string {
  const blogList = BLOG_POSTS.map(post => `
    <article class="group">
      <a href="/journal/${post.slug}" class="block">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
            <span>${post.date}</span>
            <span class="w-1 h-1 bg-zinc-300 rounded-full"></span>
            <span>Статья</span>
          </div>
          
          <h2 class="text-2xl md:text-3xl font-bold group-hover:text-zinc-600 transition-colors leading-tight text-zinc-900">
            ${post.title}
          </h2>
          
          <p class="text-zinc-500 leading-relaxed max-w-2xl font-light">
            ${post.excerpt}
          </p>
          
          <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider group-hover:gap-4 transition-all">
            Читать далее ${SVGS.ChevronRight}
          </div>
        </div>
      </a>
    </article>
  `).join('<div class="h-px bg-zinc-100 my-8"></div>');

  const content = `
    <div class="max-w-4xl w-full">
      <div class="mb-12 md:mb-16 lg:mb-20 w-full text-left">
        <h1 class="text-zinc-950 text-[1.8rem] min-[360px]:text-[2.1rem] min-[400px]:text-[2.5rem] sm:text-[4rem] md:text-[5rem] lg:text-6xl xl:text-7xl font-sans font-black uppercase tracking-tighter select-none leading-[0.85] break-words mb-4">
          Наш <span class="font-serif italic text-brandOrange font-normal lowercase tracking-normal">журнал</span>
        </h1>
        <p class="text-zinc-500 text-sm font-medium max-w-xl leading-relaxed">
          Делимся опытом, рассказываем о технологиях и помогаем бизнесу эффективно использовать видеоконтент.
        </p>
      </div>

      <div class="grid gap-12 w-full">
        ${blogList}
      </div>
    </div>
  `;

  const meta: PageMeta = {
    title: 'Журнал | Блог о видеосъемке — PRIZMA Production',
    description: 'Полезные статьи, гайды и кейсы о видеопроизводстве, видеомаркетинге недвижимости и применении искусственного интеллекта в рекламе от студии PRIZMA.',
    canonical: 'https://prizmaprod.ru/journal'
  };

  return wrapLayout(content, '/journal', meta);
}

// 8. Single Project Page Generator
export function generateProject(project: Project): string {
  const videoSrc = getEmbedUrl(project.videoUrl || project.vkIframeSrc);
  const projCats = Array.isArray(project.category) ? project.category : [project.category];

  // Render Videos
  let videosSection = '';
  if (project.videos) {
    const isAnyVertical = project.videos.some(v => v.isVertical);
    const videoGridColsClass = isAnyVertical ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1';
    
    const videosHtml = project.videos.map((vid, idx) => {
      const src = getEmbedUrl(vid.url);
      const verticalContainerClass = vid.isVertical ? 'aspect-[9/16] max-w-[320px]' : 'aspect-video';
      return `
        <div class="flex flex-col gap-4">
          ${vid.title ? `<h2 class="text-xs font-mono uppercase tracking-widest text-zinc-400">${vid.title}</h2>` : ''}
          <div class="relative overflow-hidden bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 mx-auto w-full ${verticalContainerClass}">
            <iframe src="${src}?autoplay=false&dnt=true" class="absolute inset-0 w-full h-full" title="${vid.title || project.title}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen loading="lazy"></iframe>
          </div>
        </div>
      `;
    }).join('');
    
    videosSection = `<div class="grid gap-8 md:gap-12 ${videoGridColsClass}">${videosHtml}</div>`;
  } else {
    const verticalContainerClass = project.isVertical ? 'aspect-[9/16] max-w-[400px]' : 'aspect-video w-full';
    videosSection = `
      <div class="relative overflow-hidden bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 mx-auto ${verticalContainerClass}">
        ${videoSrc ? `
          <iframe src="${videoSrc}?autoplay=false&dnt=true" class="absolute inset-0 w-full h-full" title="Видео: ${project.title}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen loading="lazy"></iframe>
        ` : `
          <img src="${project.imageUrl || 'https://via.placeholder.com/1920x1080?text=PRIZMA'}" alt="Кадр из видео ${project.title}" class="w-full h-full object-cover" loading="lazy" />
        `}
      </div>
    `;
  }

  // Render Description Markdown
  const parsedDescription = project.description ? parseMarkdown(project.description) : '';

  // Other Projects suggestions
  const suggestions = PROJECTS.filter(p => p.id !== project.id).slice(0, 4).map(p => {
    const otherVideoSrc = getEmbedUrl(p.videoUrl || p.vkIframeSrc);
    return `
      <a href="/project/${p.id}" class="group flex flex-col gap-3">
        <div class="aspect-video bg-zinc-200 rounded-xl overflow-hidden relative border border-zinc-300/30 shadow-sm">
          ${otherVideoSrc ? `
            <div class="w-full h-full relative pointer-events-none">
              <iframe src="${otherVideoSrc}?controls=false&muted=true&autoplay=false" class="absolute inset-0 w-full h-full object-cover" title="${p.title}" frameborder="0" loading="lazy"></iframe>
              <div class="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
            </div>
          ` : `
            <img src="${p.imageUrl}" alt="Проект: ${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          `}
        </div>
        <h4 class="text-[10px] font-bold uppercase tracking-tight text-zinc-900 line-clamp-1 group-hover:text-zinc-500 transition-colors">
          ${p.title}
        </h4>
      </a>
    `;
  }).join('');

  const content = `
    <div class="w-full max-w-7xl pb-20">
      <!-- Back button -->
      <a href="/portfolio" class="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors mb-8 group">
        ${SVGS.ArrowLeft}
        <span class="text-xs font-mono uppercase tracking-widest">Назад</span>
      </a>

      <!-- Title Section -->
      <div class="mb-10 lg:mb-16">
        <p class="text-zinc-400 text-[10px] font-mono uppercase tracking-[0.3em] mb-2">Проект</p>
        <h1 class="text-2xl sm:text-3xl lg:text-4xl xl:text-6xl font-black uppercase tracking-tight leading-tight text-zinc-900 break-words">
          ${project.title}
        </h1>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
        <!-- Left Side: Video & Description -->
        <div class="lg:col-span-8">
          ${videosSection}

          ${project.description ? `
            <div class="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-zinc-300/50">
              <p class="text-zinc-400 text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] mb-6">О проекте</p>
              <div class="text-zinc-800 text-base sm:text-lg lg:text-xl leading-relaxed font-light markdown-body">
                ${parsedDescription}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Right Side: Sidebar Metadata -->
        <div class="lg:col-span-4">
          <div class="flex flex-col gap-8 md:gap-10 sticky top-32">
            <div class="grid grid-cols-2 lg:grid-cols-1 gap-8 py-8 md:py-10 border-y border-zinc-300/50">
              <div>
                <p class="text-zinc-400 text-[9px] font-mono uppercase tracking-widest mb-1">Клиент</p>
                <p class="text-sm font-bold text-zinc-900 uppercase">${project.client}</p>
              </div>
              <div>
                <p class="text-zinc-400 text-[9px] font-mono uppercase tracking-widest mb-1">Год</p>
                <p class="text-sm font-bold text-zinc-900 font-mono">${project.year}</p>
              </div>
              <div class="col-span-2 lg:col-span-1">
                <p class="text-zinc-400 text-[9px] font-mono uppercase tracking-widest mb-1">Категория</p>
                <div class="flex flex-wrap gap-2 mt-2">
                  ${projCats.map(cat => `
                    <span class="text-[10px] bg-zinc-200 px-3 py-1 rounded-full font-medium text-zinc-600">
                      ${cat}
                    </span>
                  `).join('')}
                </div>
              </div>
            </div>

            <a href="/contacts" class="flex items-center justify-center gap-2 bg-zinc-900 text-white py-4 px-6 font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20 rounded-xl">
              ${SVGS.Mail}
              Обсудить проект
            </a>
          </div>
        </div>
      </div>

      <!-- Other Projects suggestions block -->
      <div class="mt-24 pt-12 border-t border-zinc-300/50">
        <p class="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-8">Другие проекты</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          ${suggestions}
        </div>
      </div>
    </div>
  `;

  const meta: PageMeta = {
    title: `${project.title} | ${project.client} | PRIZMA Production`,
    description: `Видео кейс ${project.title} для бренда ${project.client}. Категория: ${projCats.join(', ')}. Выполнено видеостудией PRIZMA Production.`,
    canonical: `https://prizmaprod.ru/project/${project.id}`,
    structuredDataJson: JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": project.title,
        "description": `Видео проект ${project.title} для клиента ${project.client}.`,
        "thumbnailUrl": project.imageUrl,
        "uploadDate": `${project.year}-01-01`,
        "contentUrl": project.videoUrl || project.vkIframeSrc,
        "embedUrl": getEmbedUrl(project.videoUrl || project.vkIframeSrc),
        "publisher": {
          "@type": "Organization",
          "name": "PRIZMA Production",
          "logo": {
            "@type": "ImageObject",
            "url": "https://prizmaprod.ru/apple-touch-icon.png"
          }
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Главная",
            "item": "https://prizmaprod.ru/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Портфолио",
            "item": "https://prizmaprod.ru/portfolio"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": project.title,
            "item": `https://prizmaprod.ru/project/${project.id}`
          }
        ]
      }
    ])
  };

  return wrapLayout(content, `/project/${project.id}`, meta);
}

// 9. Single Blog Post Page Generator
export function generateBlogPost(post: BlogPost): string {
  const videoSrc = getEmbedUrl(post.videoUrl);
  const parsedContent = parseMarkdown(post.content);

  // Suggested other articles
  const otherPosts = BLOG_POSTS.filter(p => p.id !== post.id).map(p => `
    <a href="/journal/${p.slug}" class="group block py-2 border-b border-zinc-100 hover:border-zinc-300 transition-colors">
      <h4 class="text-base font-bold text-zinc-900 group-hover:text-zinc-600 transition-colors leading-snug">${p.title}</h4>
    </a>
  `).join('');

  const content = `
    <div class="max-w-3xl w-full">
      <!-- Back button -->
      <a href="/journal" class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-900 transition-colors mb-12 group">
        ${SVGS.ArrowLeft} Назад в журнал
      </a>

      <article>
        <!-- Post Header -->
        <header class="mb-12">
          <div class="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-4">
            ${post.date}
          </div>
          <h1 class="text-zinc-950 text-[1.8rem] min-[360px]:text-[2rem] sm:text-[2.5rem] md:text-4xl lg:text-5xl font-sans font-black uppercase tracking-tighter leading-tight mb-8 select-none break-words">
            ${post.title}
          </h1>
          <p class="text-lg md:text-xl text-zinc-500 font-medium leading-relaxed italic border-l-2 border-brandOrange pl-6">
            ${post.excerpt}
          </p>
        </header>

        <!-- Markdown Body -->
        <div class="prose prose-zinc max-w-none markdown-body mb-16">
          ${parsedContent}
        </div>

        <!-- Attached Video Case -->
        ${videoSrc ? `
          <div class="mb-16">
            <h3 class="text-sm font-bold uppercase tracking-widest mb-6">Видео кейса</h3>
            <div class="aspect-video w-full bg-zinc-100 overflow-hidden rounded-xl shadow-lg border border-zinc-200">
              <iframe src="${videoSrc}?autoplay=false&dnt=true" allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer" allowfullscreen class="w-full h-full border-0"></iframe>
            </div>
          </div>
        ` : ''}

        <!-- Show CTA if set -->
        ${post.showContactCTA ? `
          <div class="bg-zinc-900 text-white p-8 md:p-12 mb-16 rounded-2xl border border-zinc-800">
            <h3 class="text-2xl font-bold mb-4 uppercase tracking-tighter">Готовы обсудить ваш проект?</h3>
            <p class="text-zinc-400 mb-8 max-w-md font-light leading-relaxed">Создадим контент, который раскроет ценность вашего объекта и поможет привлечь клиентов.</p>
            <a href="/contacts" class="inline-block bg-white text-zinc-900 px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors rounded-lg shadow">
              Оставить заявку
            </a>
          </div>
        ` : ''}
      </article>

      <!-- Suggested Articles -->
      <div class="mt-20 pt-10 border-t border-zinc-200">
        <h3 class="text-sm font-bold uppercase tracking-widest mb-6 text-zinc-400">Другие статьи</h3>
        <div class="grid gap-4">
          ${otherPosts}
        </div>
      </div>
    </div>
  `;

  const meta: PageMeta = {
    title: `${post.title} | Журнал PRIZMA`,
    description: post.excerpt,
    canonical: `https://prizmaprod.ru/journal/${post.slug}`,
    structuredDataJson: JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "datePublished": post.date,
        "author": {
          "@type": "Organization",
          "name": "PRIZMA Production"
        },
        "publisher": {
          "@type": "Organization",
          "name": "PRIZMA Production",
          "logo": {
            "@type": "ImageObject",
            "url": "https://prizmaprod.ru/apple-touch-icon.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://prizmaprod.ru/journal/${post.slug}`
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Главная",
            "item": "https://prizmaprod.ru/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Журнал",
            "item": "https://prizmaprod.ru/journal"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
            "item": `https://prizmaprod.ru/journal/${post.slug}`
          }
        ]
      }
    ])
  };

  return wrapLayout(content, `/journal/${post.slug}`, meta);
}
