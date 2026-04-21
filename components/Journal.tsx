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
      </Helmet>

      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight mb-4">
          Журнал
        </h1>
        <p className="text-zinc-500 font-medium max-w-xl">
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
