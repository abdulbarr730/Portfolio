'use client';

import { useState, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const codeSnippets = [
  {
    title: 'Secure Login & Error Handling',
    description:
      'This is not a generic login. It provides specific error codes to the frontend for a better user experience, distinguishing between a user not found, an unverified account, or a wrong password. It uses bcrypt for secure password comparison and sets a secure, httpOnly cookie for the session token, which is a best practice against XSS attacks.',
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
  },
  {
    title: 'Cloudinary File Upload Helper',
    description:
      'Handles file uploads directly to Cloudinary using a stream — efficient and scalable, offloading storage work from the server.',
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
  },
  {
    title: 'Forgot Password & Email (AWS SES)',
    description:
      'Generates a secure token and uses AWS SES to deliver a password reset link without revealing whether a user exists, ensuring both security and usability.',
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
      Source: '"SIH Portal" <your-verified-email@example.com>',
    });

    await sesClient.send(command);
    res.json({ msg: 'If a user exists, a reset link has been sent.' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});`,
  },
  {
    title: 'Complex Database Query',
    description:
      'Builds dynamic MongoDB queries with optional filters and populates related team data, demonstrating clean handling of relational data in a NoSQL setup.',
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
  },
  {
    title: 'Defensive Delete Logic',
    description:
      'Ensures data integrity by preventing deletion of users who are team leaders until leadership is reassigned.',
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
  },
  {
    title: 'User Profile Update Limiter',
    description:
      'Tracks profile update counts to prevent abuse, ensuring users cannot spam changes to critical fields like name.',
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
  },
];

const CodeCraftPage = () => {
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  const setCardRef = (el, idx) => (cardRefs.current[idx] = el);

  useLayoutEffect(() => {
    cardRefs.current.forEach((card) => (card.style.opacity = 1));

    const ctx = gsap.context(() => {
      gsap.from(cardRefs.current, {
        y: 28,
        opacity: 0,
        scale: 0.985,
        stagger: 0.12,
        duration: 0.66,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          once: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="container mx-auto py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Header Section */}
      <div className="text-center mb-12">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-primary "
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Code Craft
        </motion.h1>
        <motion.p
          className="mt-3 text-lg text-secondary max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          This is how I implement features, handle edge cases, and write scalable code — focusing on clarity, security, and maintainability.
        </motion.p>

        
      </div>
      {/* CTA Card below heading */}
        <div className="service-cta-card mb-12">
          <Link
            href="/services"
            className="block bg-primary/10 border border-primary rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center"
          >
            <h3 className="text-2xl font-bold text-primary mb-2">
              Book a Service / Learn More
            </h3>
            <p className="text-secondary text-sm sm:text-base">
              Explore the services I offer — website development, software issue fixing, and consultancy. First consultancy is free!
            </p>
          </Link>
        </div>

      {/* Code Snippets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {codeSnippets.map((snippet, idx) => (
          <motion.article
            key={idx}
            ref={(el) => setCardRef(el, idx)}
            className="bg-white/60 backdrop-blur-md rounded-xl border border-white/20 shadow-md overflow-hidden transition-transform hover:-translate-y-2 hover:scale-[1.02]"
            whileHover={{ scale: 1.02 }}
          >
            <div className="p-5">
              <h3 className="text-lg font-semibold text-primary ">{snippet.title}</h3>
              <p className="mt-2 text-sm text-secondary ">
                {snippet.description.substring(0, 100)}...
              </p>
              <div className="mt-4 h-20 overflow-hidden rounded-md bg-white/10 ">
                <SyntaxHighlighter
                  language={snippet.language}
                  style={atomDark}
                  showLineNumbers={false}
                  customStyle={{ margin: 0, padding: '0.5rem', fontSize: '0.75rem', background: '#282c34' }}
                >
                  {snippet.code.split('\n').slice(0, 3).join('\n')}
                </SyntaxHighlighter>
              </div>
              <button
                onClick={() => setSelectedSnippet(snippet)}
                className="mt-3 px-4 py-2 rounded-md bg-primary/90 text-white font-medium hover:brightness-110 transition"
              >
                See Code
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Modal popup */}
      <AnimatePresence>
        {selectedSnippet && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setSelectedSnippet(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="flex justify-between items-start p-6 border-b border-gray-200 ">
                <h2 className="text-2xl font-bold text-primary ">{selectedSnippet.title}</h2>
                <button
                  onClick={() => setSelectedSnippet(null)}
                  className="text-2xl text-gray-400 hover:text-primary "
                >
                  &times;
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                <p className="text-secondary mb-4">{selectedSnippet.description}</p>
                <SyntaxHighlighter
                  language={selectedSnippet.language}
                  style={atomDark}
                  showLineNumbers
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    background: '#282c34',
                    fontSize: '0.85rem',
                    minHeight: '100%',
                  }}
                >
                  {selectedSnippet.code}
                </SyntaxHighlighter>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CodeCraftPage;
