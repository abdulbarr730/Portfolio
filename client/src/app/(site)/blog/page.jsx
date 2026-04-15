'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medium`)
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error(err));
  }, []);

  // Filter posts by title/snippet/index
  const filteredPosts = posts
    .map((post, i) => ({ ...post, originalIndex: i }))
    .filter((post) => {
      const title = post?.title?.toLowerCase() || '';
      const snippet = post?.contentSnippet?.toLowerCase() || '';
      const search = searchTerm.toLowerCase();
      const indexMatch = (post.originalIndex + 1).toString().includes(search);
      return title.includes(search) || snippet.includes(search) || indexMatch;
    });

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.12 },
    }),
  };

  const ribbonVariants = {
    hidden: { opacity: 0, rotate: -10, scale: 0.9, x: -20 },
    visible: { opacity: 1, rotate: -12, scale: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut', delay: 0.3 } },
  };

  return (
    <div className="container mx-auto py-20 px-4 md:px-8">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-4xl md:text-5xl font-extrabold mb-2 text-center text-primary"
      >
        My Blogs
      </motion.h1>
      <div className="mt-20 max-w-1xl mx-auto pb-5 text-center">

        <h2 className="text-2xl font-semibold mb-1">
          What I Write About
        </h2>

        <p className="text-neutral-600 leading-relaxed text-sm md:text-base">
          I write about real-world development — not theory. Most of my blogs come from things I’ve actually built, broken, or optimized while working on full-stack applications and systems.
          <br /><br />
          You’ll find content around system design, backend architecture, SaaS development, performance decisions, and practical implementation details that are usually skipped in tutorials.
          <br /><br />
          The goal is simple — to document how real products are built, how decisions are made, and how problems are solved in production environments.
        </p>

      </div>
      {/* --- ABOUT MY WRITING --- */}
      

      {/* Search */}
      <div className="max-w-md mx-auto mb-12">
        <input
          type="text"
          placeholder="Search blogs by title, content, or number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all text-sm bg-white"
        />
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => {
            const isMatch =
              searchTerm &&
              ((post.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (post.contentSnippet?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (post.originalIndex + 1).toString().includes(searchTerm));

            return (
              <motion.a
                key={post.originalIndex}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={index}
                whileHover={{
                  y: -10,
                  scale: 1.05,
                  boxShadow: '0 25px 55px rgba(0,0,0,0.15)',
                  background:
                    'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(245,245,245,0.9))',
                }}
                animate={
                  isMatch
                    ? { scale: [1, 1.03, 1], boxShadow: ['0 0 0 rgba(0,0,0,0)', '0 0 25px rgba(0,0,0,0.2)', '0 0 0 rgba(0,0,0,0)'] }
                    : {}
                }
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="relative group rounded-3xl p-6 flex flex-col justify-between border border-muted bg-white/80 backdrop-blur-lg shadow-lg transition-all duration-300 hover:shadow-2xl overflow-hidden"
              >
                {/* Glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

                {/* Content */}
                <div className="relative z-10 flex flex-col flex-grow pt-6">
                  {/* 🏷 Angled “Latest” ribbon */}
                  {post.originalIndex === 0 && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={ribbonVariants}
                      className="absolute -left-4 -top-3 transform -rotate-12 origin-top-left overflow-hidden"
                    >
                      <div className="relative bg-gradient-to-r from-gray-700 to-gray-800 text-white text-[10px] font-bold px-2 py-0.5 shadow-md rounded-sm overflow-hidden">
                        <span className="relative z-10">LATEST</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-slow" />
                      </div>
                    </motion.div>
                  )}

                  <h2 className="text-lg font-semibold mb-2 text-primary leading-snug group-hover:text-gray-800 transition-colors duration-200">
                    {post.originalIndex + 1}. {post.title}
                  </h2>
                  <p className="text-secondary text-sm leading-relaxed line-clamp-5">
                    {post.contentSnippet}
                  </p>
                </div>

                <span className="mt-4 text-xs font-semibold text-gray-700 underline underline-offset-2 relative z-10 group-hover:text-[#444] transition-colors duration-200">
                  Read More →
                </span>
              </motion.a>
            );
          })
        ) : (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-muted rounded-3xl h-64 w-full"
            />
          ))
        )}
      </div>

      {/* Shimmer Animation */}
      <style jsx global>{`
        @keyframes shimmer-slow {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer-slow {
          background-size: 200% auto;
          animation: shimmer-slow 3.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default BlogPage;
