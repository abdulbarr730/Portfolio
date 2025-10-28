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

    if (!user) {
      return res.status(404).json({ msg: 'USER_NOT_FOUND' });
    }
    if (!user.isVerified) {
      return res.status(403).json({ msg: 'ACCOUNT_NOT_VERIFIED' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'INVALID_PASSWORD' });
    }

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
  {
    id: 'cloudinary',
    title: 'Cloudinary File Upload Helper',
    description:
      'Stream-based upload helper — non-blocking, memory-efficient, and better for large files.',
    language: 'javascript',
    code: `const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};`,
    naiveCode: `// Naive: writes temp files then uploads (extra IO)
const uploadToCloudinary = async (file) => {
  const result = await cloudinary.uploader.upload(file.path);
  return result;
};`,
    bullets: [
      'Stream-based upload avoids temp files and heavy memory usage.',
      'Better throughput for concurrent uploads and large files.',
      'Promise wrapper provides clear error handling and testability.',
    ],
  },
  {
    id: 'forgot',
    title: 'Forgot Password & Email (AWS SES)',
    description:
      'Generates a secure reset token, stores only its hash, and sends an SES email without leaking account existence.',
    language: 'javascript',
    code: `router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ msg: 'If a user exists, a reset link has been sent.' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = \`\${process.env.CLIENT_URL}/reset-password/\${resetToken}\`;
    const message = \`Click this link to reset your password: \${resetUrl}\`;

    const sesClient = new SESClient({ region: process.env.AWS_REGION });
    const command = new SendEmailCommand({
      Destination: { ToAddresses: [user.email] },
      Message: { Body: { Text: { Data: message } }, Subject: { Data: "Password Reset Request" } },
      Source: '"SIH Portal" <no-reply@sihportal.com>',
    });

    await sesClient.send(command);
    res.json({ msg: 'If a user exists, a reset link has been sent.' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});`,
    naiveCode: `// Naive: reveals user existence and uses weak tokens
router.post('/forgot-password', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.send('User not found');
  const token = Math.random().toString(36).substring(2, 15);
  await sendEmail(user.email, 'Reset Password', 'Use this link to reset: ' + token);
  res.send('Email sent');
});`,
    bullets: [
      'Generates cryptographically secure tokens and stores only their hash.',
      'Avoids user enumeration by using generic success messages.',
      'Uses SES with proper templating and error handling for reliability.',
    ],
  },
  {
    id: 'complex-query',
    title: 'Complex Database Query',
    description:
      'Dynamically builds filters and populates team relations — efficient and scalable.',
    language: 'javascript',
    code: `router.get('/users', auth, async (req, res) => {
  try {
    const { year, search, course } = req.query;
    const filter = { role: 'student' };
    if (year) filter.year = Number(year);
    if (course) filter.course = course;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }
    const users = await User.find(filter)
      .select('name email year course team')
      .populate('team', 'teamName');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});`,
    naiveCode: `// Naive: fetches all users then filters in memory (inefficient)
router.get('/users', async (req, res) => {
  const users = await User.find();
  const filtered = users.filter(u => u.role === 'student' && u.name.includes(req.query.search || ''));
  res.json(filtered);
});`,
    bullets: [
      'Applies filters in DB to reduce network and memory usage.',
      'Uses RegExp for flexible, case-insensitive searching.',
      'Selects only needed fields and populates related data efficiently.',
    ],
  },
  {
    id: 'defensive-delete',
    title: 'Defensive Delete Logic',
    description:
      'Prevents deletion when the user is a team leader; returns a clear, actionable error.',
    language: 'javascript',
    code: `router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const ledTeam = await Team.findOne({ leader: userId });
    if (ledTeam) return res.status(400).json({ msg: \`Cannot delete user. They are the leader of team "\${ledTeam.teamName}".\` });

    await User.findByIdAndDelete(userId);
    res.json({ msg: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});`,
    naiveCode: `// Naive: deletes user directly with no checks
router.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.send('Deleted');
});`,
    bullets: [
      'Prevents data integrity issues by checking leadership roles before deletion.',
      'Returns actionable error messages indicating the dependent team.',
      'Protects against accidental data loss and broken relations.',
    ],
  },
  {
    id: 'profile-limiter',
    title: 'User Profile Update Limiter',
    description:
      'Limits name changes to prevent abuse; keeps a server-side counter and enforces rules cleanly.',
    language: 'javascript',
    code: `router.put('/profile', auth, async (req, res) => {
  const { name } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (name && name !== user.name) {
      if (user.nameUpdateCount >= 2) return res.status(403).json({ msg: 'You can no longer change your name.' });
      user.name = name;
      user.nameUpdateCount += 1;
    }
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});`,
    naiveCode: `// Naive: allows unlimited changes, no tracking
router.put('/profile', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.name = req.body.name || user.name;
  await user.save();
  res.json(user);
});`,
    bullets: [
      'Implements server-side limits so users cannot abuse critical profile fields.',
      'Returns clear error states for UX when limits are reached.',
      'Counters are simple to audit and work well with admin reporting.',
    ],
  },
];

const CodeCraftPage = () => {
  const [openSnippet, setOpenSnippet] = useState(null);
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  const setCardRef = (el, idx) => (cardRefs.current[idx] = el);

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
    <div ref={containerRef} className="container mx-auto py-20 px-4 sm:px-6 lg:px-8 relative">
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
          How I implement features, handle edge cases, and write production-ready code — compare my
          implementation to typical approaches.
        </motion.p>
      </div>

      <div className="service-cta-card mb-12">
        <Link
          href="/services"
          className="block bg-primary/10 border border-primary rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center"
        >
          <h3 className="text-2xl font-bold text-primary mb-2">Book a Service / Learn More</h3>
          <p className="text-secondary text-sm sm:text-base">
            Explore my web dev and consulting services. First consultancy is free!
          </p>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {codeSnippets.map((snippet, idx) => (
          <motion.article
            key={snippet.id}
            ref={(el) => setCardRef(el, idx)}
            whileHover={{
              y: -6,
              scale: 1.02,
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className="project-card will-change-transform bg-white/70 backdrop-blur-md rounded-xl border border-white/20 shadow-md overflow-hidden 
            transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-gradient-to-br hover:from-white/80 hover:to-primary/10"
            style={{ opacity: 0 }}
          >
            <div className="p-5 flex flex-col h-full">
              <h3 className="text-lg font-semibold text-primary">{snippet.title}</h3>
              <p className="mt-2 text-sm text-secondary">{snippet.description}</p>

              <div className="mt-4 h-24 overflow-hidden rounded-md bg-white/5">
                <SyntaxHighlighter
                  language={snippet.language}
                  style={atomDark}
                  showLineNumbers={false}
                  customStyle={{
                    margin: 0,
                    padding: '0.5rem',
                    fontSize: '0.72rem',
                    background: '#1f2227',
                  }}
                >
                  {snippet.code.split('\n').slice(0, 6).join('\n')}
                </SyntaxHighlighter>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setOpenSnippet(snippet)}
                  className="px-4 py-2 rounded-md bg-primary/95 text-white font-medium hover:brightness-105 transition"
                >
                  See Code
                </motion.button>
                <Link
                  href="/services"
                  className="text-sm text-secondary hover:text-primary transition"
                >
                  Need help implementing?
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <AnimatePresence>
        {openSnippet && (
          <motion.div
            key="modal-root"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
            onClick={() => setOpenSnippet(null)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="absolute inset-0 bg-white/30 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.995 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.995 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[80vh] overflow-hidden flex flex-col"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-start justify-between p-6 border-b border-gray-200 z-10">
                <div>
                  <h2 className="text-2xl font-bold text-primary">{openSnippet.title}</h2>
                  <p className="text-sm text-secondary mt-1">{openSnippet.description}</p>
                </div>
                <button
                  onClick={() => setOpenSnippet(null)}
                  className="text-2xl text-gray-400 hover:text-primary"
                  aria-label="Close code modal"
                >
                  &times;
                </button>
              </div>

              <div className="p-6 overflow-auto z-10">
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
                    <div className="rounded-md overflow-auto">
                      <SyntaxHighlighter
                        language={openSnippet.language}
                        style={atomDark}
                        customStyle={{
                          margin: 0,
                          padding: '0.75rem',
                          fontSize: '0.78rem',
                          background: '#1f2227',
                        }}
                      >
                        {openSnippet.naiveCode}
                      </SyntaxHighlighter>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-green-600 mb-2">
                      My Production-Ready Implementation
                    </h3>
                    <div className="rounded-md overflow-auto">
                      <SyntaxHighlighter
                        language={openSnippet.language}
                        style={atomDark}
                        customStyle={{
                          margin: 0,
                          padding: '0.75rem',
                          fontSize: '0.78rem',
                          background: '#1f2227',
                        }}
                      >
                        {openSnippet.code}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-primary mb-2">Why My Version Is Better:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-secondary">
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
