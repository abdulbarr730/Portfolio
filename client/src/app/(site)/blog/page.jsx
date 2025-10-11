'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/medium')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error(err));
  }, []);

  // Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
        delay: i * 0.2, // stagger by index
      },
    }),
  };

  return (
    <div className="container mx-auto py-20 px-4 md:px-8">
      {/* Page Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
      >
        My Blogs
      </motion.h1>

      {/* Blog List */}
      <div className="flex flex-col gap-10 max-w-3xl mx-auto">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <motion.a
              key={index}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={index}
              whileHover={{
                y: -6,
                scale: 1.02,
                boxShadow: '0 25px 45px rgba(0,0,0,0.15)',
              }}
              className="relative group bg-white/90 dark:bg-primary/90 backdrop-blur-xl rounded-3xl p-8 flex flex-col justify-between border border-gray-200/40 dark:border-gray-700/40 shadow-md overflow-hidden transition-all duration-300"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

              <div className="relative z-10">
                <h2 className="text-2xl font-semibold mb-3 text-primary dark:text-background leading-snug group-hover:text-secondary transition-colors duration-200">
                  {post.title}
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-5">
                  {post.contentSnippet}
                </p>
              </div>

              <span className="mt-6 text-sm font-medium text-secondary dark:text-gray-200 underline underline-offset-2 relative z-10 group-hover:text-primary transition-colors">
                Read More →
              </span>
            </motion.a>
          ))
        ) : (
          // Shimmer loader
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-3xl h-48"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BlogPage;
