'use client';

import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const codeSnippets = [
  {
    id: 'login',
    title: 'Secure Login & Error Handling',
    description:
      'A production-ready login route with explicit errors, bcrypt, and httpOnly cookie-based session tokens.',
    language: 'javascript',
    code: `router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: 'USER_NOT_FOUND' });
    if (!user.isVerified) return res.status(403).json({ msg: 'ACCOUNT_NOT_VERIFIED' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'INVALID_PASSWORD' });

    const payload = { user: { id: user.id, isAdmin: user.isAdmin } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 5 * 60 * 60 * 1000,
    }).json({ msg: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});`,
    naiveCode: `// Naive/inexperienced approach — insecure and ambiguous errors
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.send('Invalid credentials');
  if (user.password !== password) return res.send('Wrong password');

  const token = jwt.sign({ id: user._id }, 'secret');
  res.json({ token });
});`,
    bullets: [
      'Uses bcrypt for secure password comparison instead of plain text.',
      'Returns precise HTTP status codes so frontend can react correctly.',
      'Stores token in httpOnly cookie (safer against XSS) and sets expiration.',
    ],
  },
];

const CodeCraftPage = () => {
  const [openSnippet, setOpenSnippet] = useState(null);
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  const setCardRef = (el, idx) => {
    cardRefs.current[idx] = el;
  };

  // GSAP reveal
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, scale: 0.985 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpenSnippet(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div
      ref={containerRef}
      className="container mx-auto py-20 px-4 sm:px-6 lg:px-8 relative"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-primary"
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          Code Craft
        </motion.h1>
        <motion.p
          className="mt-3 text-lg text-secondary max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.7 }}
        >
          How I implement features, handle edge cases, and write production-ready
          code — compare my implementation to typical approaches.
        </motion.p>
      </div>

      {/* CTA */}
      <div className="service-cta-card mb-12">
        <Link
          href="/services"
          className="block bg-primary/10 border border-primary rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center"
        >
          <h3 className="text-2xl font-bold text-primary mb-2">
            Book a Service / Learn More
          </h3>
          <p className="text-secondary text-sm sm:text-base">
            Explore my web dev and consulting services. First consultancy is
            free!
          </p>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {codeSnippets.map((snippet, idx) => (
          <article
            key={snippet.id}
            ref={(el) => setCardRef(el, idx)}
            className="project-card will-change-transform bg-white/70 backdrop-blur-md rounded-xl border border-white/20 shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(0,0,0,0.15)]"
            style={{ opacity: 0 }}
          >
            <div className="p-5 flex flex-col h-full">
              <h3 className="text-lg font-semibold text-primary">
                {snippet.title}
              </h3>
              <p className="mt-2 text-sm text-secondary">
                {snippet.description}
              </p>

              <div className="mt-4 h-24 overflow-hidden rounded-md bg-[#1f2227]">
                <SyntaxHighlighter
                  language={snippet.language}
                  style={atomDark}
                  showLineNumbers={false}
                  customStyle={{
                    margin: 0,
                    padding: '0.5rem',
                    fontSize: '0.72rem',
                    background: 'transparent',
                  }}
                >
                  {snippet.code.split('\n').slice(0, 6).join('\n')}
                </SyntaxHighlighter>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => setOpenSnippet(snippet)}
                  className="px-4 py-2 rounded-md bg-primary/95 text-white font-medium hover:brightness-105 transition"
                >
                  See Code
                </button>
                <Link
                  href="/services"
                  className="text-sm text-secondary hover:text-primary transition"
                >
                  Need help implementing?
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {openSnippet && (
          <motion.div
            key="modal-root"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
            onClick={() => setOpenSnippet(null)}
          >
            {/* BACKDROP: full blur + dim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-[10px]"
            />

            {/* MODAL PANEL */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 240, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[80vh] overflow-hidden flex flex-col"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-start justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-primary">
                    {openSnippet.title}
                  </h2>
                  <p className="text-sm text-secondary mt-1">
                    {openSnippet.description}
                  </p>
                </div>
                <button
                  onClick={() => setOpenSnippet(null)}
                  className="text-2xl text-gray-400 hover:text-primary"
                  aria-label="Close code modal"
                >
                  &times;
                </button>
              </div>

              <div className="p-6 overflow-auto">
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium border border-red-100">
                    <span className="w-2 h-2 rounded-full bg-red-600 block" /> Common Implementation
                  </span>
                  <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-100">
                    <span className="w-2 h-2 rounded-full bg-green-600 block" /> My Implementation
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-red-600 mb-2">
                      Common / Typical Approach
                    </h3>
                    <SyntaxHighlighter
                      language={openSnippet.language}
                      style={atomDark}
                      showLineNumbers
                      customStyle={{
                        margin: 0,
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        background: '#2d2f36',
                        fontSize: '0.85rem',
                      }}
                    >
                      {openSnippet.naiveCode}
                    </SyntaxHighlighter>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-green-700 mb-2">
                      My Implementation
                    </h3>
                    <SyntaxHighlighter
                      language={openSnippet.language}
                      style={atomDark}
                      showLineNumbers
                      customStyle={{
                        margin: 0,
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        background: '#1e1e1e',
                        fontSize: '0.85rem',
                      }}
                    >
                      {openSnippet.code}
                    </SyntaxHighlighter>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-primary">
                    Why this matters
                  </h4>
                  <ul className="mt-2 list-disc list-inside text-sm text-secondary space-y-1">
                    {openSnippet.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CodeCraftPage;
