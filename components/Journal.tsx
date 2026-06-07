import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { BLOG_POSTS } from '../constants';
import { ChevronRight } from 'lucide-react';

export const Journal: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <Helmet>
        <title>Журнал | PRIZMA Video Production</title>
        <meta name="description" content="Полезные статьи о видеопроизводстве, ИИ-технологиях и маркетинге от студии PRIZMA." />
        <meta property="og:title" content="Журнал PRIZMA Video Production" />
        <meta property="og:description" content="Читайте наш блог о видеомаркетинге, съемках и ИИ в производстве контента." />
        <meta property="og:url" content="https://prizmaprod.ru/journal" />
        <meta property="og:image" content="https://prizmaprod.ru/apple-touch-icon.png" />
        <link rel="canonical" href="https://prizmaprod.ru/journal" />
      </Helmet>

      <div className="mb-12 md:mb-16 lg:mb-20 w-full text-left">
        <h1 className="text-zinc-950 text-[1.8rem] min-[360px]:text-[2.1rem] min-[400px]:text-[2.5rem] sm:text-[4rem] md:text-[5rem] lg:text-6xl xl:text-7xl font-sans font-black uppercase tracking-tighter select-none leading-[0.85] break-words mb-4">
          Наш <span className="font-serif italic text-brandOrange font-normal lowercase tracking-normal">журнал</span>
        </h1>
        <p className="text-zinc-500 text-sm font-medium max-w-xl leading-relaxed">
          Делимся опытом, рассказываем о технологиях и помогаем бизнесу эффективно использовать видеоконтент.
        </p>
      </div>

      <div className="grid gap-12">
        {BLOG_POSTS.map((post, index) => (
          <motion.article 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Link to={`/journal/${post.slug}`} className="block">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                  <span>Статья</span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold group-hover:text-zinc-600 transition-colors leading-tight">
                  {post.title}
                </h2>
                
                <p className="text-zinc-500 leading-relaxed max-w-2xl">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider group-hover:gap-4 transition-all">
                  Читать далее <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  );
};
