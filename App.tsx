
import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Sidebar } from './components/Sidebar';
import { ProjectCard } from './components/ProjectCard';
import { WhyUs } from './components/WhyUs';
import { Team } from './components/Team';
import { Contacts } from './components/Contacts';
import { Pricing } from './components/Pricing';
import { ProjectPage } from './components/ProjectPage';
import { Journal } from './components/Journal';
import { BlogPostPage } from './components/BlogPostPage';
import { Home } from './components/Home';
import { Category } from './types';
import { PROJECTS } from './constants';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="w-full"
  >
    {children}
  </motion.div>
);

const Portfolio: React.FC<{ 
  activeCategory: Category 
}> = ({ activeCategory }) => {
  const filteredProjects = useMemo(() => {
    if (activeCategory === Category.ALL) return PROJECTS;
    return PROJECTS.filter(p => Array.isArray(p.category) ? p.category.includes(activeCategory) : p.category === activeCategory);
  }, [activeCategory]);

  const seoTitle = activeCategory === Category.ALL 
    ? 'Портфолио | PRIZMA Video Production' 
    : `${activeCategory} | PRIZMA Production`;

  return (
    <PageWrapper>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={`Посмотрите наши работы в категории ${activeCategory}. Профессиональный видеопродакшн PRIZMA.`} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={`Портфолио проектов PRIZMA по категории ${activeCategory}. Примеры архитектурной съемки, рекламы и мероприятий.`} />
        <meta property="og:url" content="https://prizmaprod.ru/portfolio" />
        <meta property="og:image" content="https://prizmaprod.ru/apple-touch-icon.png" />
        <link rel="canonical" href="https://prizmaprod.ru/portfolio" />
      </Helmet>
      <div className="mb-12 md:mb-16 lg:mb-20 w-full text-left">
        <h1 className="text-[1.8rem] min-[360px]:text-[2.1rem] min-[400px]:text-[2.5rem] sm:text-[4rem] md:text-[6rem] lg:text-[7.5rem] xl:text-[9rem] font-sans font-black text-zinc-950 uppercase tracking-tighter leading-none select-none break-words">
          {activeCategory === Category.ALL ? (
            <>
              Наши <span className="font-serif italic text-brandOrange font-normal lowercase tracking-normal">работы</span>
            </>
          ) : (
            activeCategory
          )}
        </h1>
        <div className="flex items-center gap-3 mt-4">
          <p className="text-zinc-500 text-[10px] lg:text-xs font-mono uppercase tracking-[0.3em] font-medium grow md:grow-0">
            {activeCategory === Category.ALL ? 'Video Production Portfolio' : 'Project Category'}
          </p>
          <div className="h-px bg-zinc-200 grow hidden md:block"></div>
          <p className="text-zinc-400 text-[10px] font-mono uppercase tracking-widest hidden sm:block">
            {filteredProjects.length} Проектов
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8 lg:gap-x-10 w-full">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      {filteredProjects.length === 0 && <div className="flex flex-col items-center justify-center h-[50vh] text-zinc-500 text-sm font-light">Проекты не найдены.</div>}
    </PageWrapper>
  );
};

const AppRoutes: React.FC<{ 
  activeCategory: Category
}> = ({ activeCategory }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/portfolio" element={<Portfolio activeCategory={activeCategory} />} />
          <Route path="/project/:id" element={<PageWrapper><ProjectPage /></PageWrapper>} />
          <Route path="/pricing" element={<PageWrapper><Pricing /></PageWrapper>} />
          <Route path="/journal" element={<PageWrapper><Journal /></PageWrapper>} />
          <Route path="/journal/:slug" element={<PageWrapper><BlogPostPage /></PageWrapper>} />
          <Route path="/why-us" element={<PageWrapper><WhyUs /></PageWrapper>} />
          <Route path="/team" element={<PageWrapper><Team /></PageWrapper>} />
          <Route path="/contacts" element={<PageWrapper><Contacts /></PageWrapper>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<Category>(Category.ALL);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white text-zinc-950 flex flex-col font-sans">
      <Helmet>
        <title>PRIZMA Video Production | Видеопроизводство полного цикла</title>
        <meta name="description" content="Профессиональный видеопродакшн PRIZMA в Воронеже. Архитектурная съемка, контент для соцсетей, ИИ-генерация и освещение мероприятий." />
        <meta property="og:title" content="PRIZMA Video Production" />
        <meta property="og:description" content="Создаем видеоконтент, который решает задачи бизнеса." />
        <meta property="og:type" content="website" />
      </Helmet>
      <Sidebar 
        activeCategory={activeCategory} 
        onSelectCategory={setActiveCategory} 
        isMobileMenuOpen={isMobileMenuOpen} 
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
      />

      <main className="flex-1 w-full flex flex-col px-4 sm:px-6 lg:px-8 py-10 md:py-16 max-w-7xl mx-auto overflow-hidden">
        <div className="w-full flex-1 flex flex-col items-center">
          <AppRoutes activeCategory={activeCategory} />
        </div>

        <footer className="w-full mt-24 pt-10 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-zinc-400 text-[10px] font-mono uppercase tracking-[0.2em]">
          <p className="text-center sm:text-left">&copy; 2026 PRIZMA Video Production. Все права защищены.</p>
          <p className="font-extrabold text-zinc-600">Воронеж &bull; По всей России</p>
        </footer>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
      <Analytics />
      <SpeedInsights />
    </HelmetProvider>
  );
};

export default App;
