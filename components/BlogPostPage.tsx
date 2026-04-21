import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { BLOG_POSTS } from '../constants';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) return <Navigate to="/journal" replace />;

  const getEmbedUrl = (url: string | undefined) => {
    if (!url) return '';
    if (url.includes('kinescope.io') && !url.includes('/embed/')) {
      return url.replace('kinescope.io/', 'kinescope.io/embed/');
    }
    return url;
  };

  const videoSrc = getEmbedUrl(post.videoUrl);

  return (
    <div className="max-w-3xl">
      <Helmet>
        <title>{post.title} | Журнал PRIZMA</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <Link 
        to="/journal" 
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-900 transition-colors mb-12"
      >
        <ArrowLeft size={16} /> Назад в журнал
      </Link>

      <article>
        <header className="mb-12">
          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-4">
            {post.date}
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
            {post.title}
          </h1>
          <p className="text-xl text-zinc-500 font-medium leading-relaxed italic border-l-4 border-zinc-900 pl-6">
            {post.excerpt}
          </p>
        </header>

        <div className="prose prose-zinc max-w-none markdown-body mb-16">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {videoSrc && (
          <div className="mb-16">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Видео кейса</h3>
            <div className="aspect-video w-full bg-zinc-100 overflow-hidden rounded-xl shadow-lg border border-zinc-200">
              <iframe
                src={`${videoSrc}?autoplay=false&dnt=true`}
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer"
                allowFullScreen
                className="w-full h-full border-0"
              ></iframe>
            </div>
          </div>
        )}

        {post.showContactCTA && (
          <div className="bg-zinc-900 text-white p-8 md:p-12 mb-16">
            <h3 className="text-2xl font-bold mb-4 uppercase tracking-tighter">Готовы обсудить ваш проект?</h3>
            <p className="text-zinc-400 mb-8 max-w-md">Создадим контент, который раскроет ценность вашего объекта и поможет привлечь клиентов.</p>
            <Link 
              to="/contacts" 
              className="inline-block bg-white text-zinc-900 px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
            >
              Оставить заявку
            </Link>
          </div>
        )}
      </article>

      <div className="mt-20 pt-10 border-t border-zinc-200">
        <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Другие статьи</h3>
        <div className="grid gap-6">
          {BLOG_POSTS.filter(p => p.id !== post.id).map(p => (
            <Link key={p.id} to={`/journal/${p.slug}`} className="group block">
              <h4 className="text-lg font-bold group-hover:text-zinc-500 transition-colors">{p.title}</h4>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
