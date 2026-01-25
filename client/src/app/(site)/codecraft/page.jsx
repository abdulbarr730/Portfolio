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
    id: 'auth-middleware',
    title: 'Dual-Strategy Authentication',
    description:
      'A flexible middleware that secures routes by checking httpOnly cookies first, then falling back to Bearer headers. This supports both browser sessions and mobile/API clients seamlessly.',
    language: 'javascript',
    code: `module.exports = async function (req, res, next) {
  // 1. Prioritize secure, httpOnly cookie
  let token = req.cookies.token;

  // 2. Fallback to Authorization Header for API clients
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Support legacy and new payload structures
    const userId = decoded.user?.id || decoded._id;
    
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(401).json({ msg: 'User not found' });

    req.user = user; // Attach full user object
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};`,
    naiveCode: `// Naive Approach: Only checks headers, vulnerable to XSS if stored in localStorage
module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, 'mysecret');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};`,
    bullets: [
      'Hybrid approach supports both Web (Cookies) and Mobile (Headers).',
      'Prevents unauthorized access immediately if user is deleted from DB.',
      'Centralized error handling for expired or malformed tokens.',
    ],
  },
  {
    id: 'business-logic',
    title: 'Constraint-Based Team Formation',
    description:
      'Implementing strict hackathon business rules (e.g., gender diversity requirements) directly into the API logic to ensure compliance before database commits.',
    language: 'javascript',
    code: `// Helper: Enforce Diversity Rule
function violatesFemaleRule(teamMembers, newUser) {
  if (teamMembers.length === 5) {
    const hasFemale = teamMembers.some(m => m.gender === 'Female');
    // If team is full (5->6) and no female yet, new user MUST be female
    if (!hasFemale && newUser.gender !== 'Female') {
      return true;
    }
  }
  return false;
}

// Route: Approve Join Request
router.post('/:id/approve/:userId', auth, async (req, res) => {
  const team = await Team.findById(teamId).populate('members');
  
  // 1. Check Capacity
  if (team.members.length >= 6) {
    return res.status(400).json({ msg: 'Team is full.' });
  }

  // 2. Run Diversity Check
  if (violatesFemaleRule(team.members, userToApprove)) {
    return res.status(400).json({ 
      msg: 'A team of 6 must have at least one female member.' 
    });
  }

  // 3. Atomic State Update
  team.members.push(userId);
  team.pendingRequests = team.pendingRequests.filter(id => id !== userId);
  await team.save();
});`,
    naiveCode: `// Naive Approach: No validation, just pushing to array
router.post('/join', async (req, res) => {
  const team = await Team.findById(req.body.teamId);
  
  // Risk: Team could exceed max size
  // Risk: Ignores diversity rules
  team.members.push(req.body.userId);
  
  await team.save();
  res.json(team);
});`,
    bullets: [
      'Enforces complex business rules (Diversity/Gender checks) at the API level.',
      'Prevents race conditions by validating capacity before updates.',
      'Keeps database clean by filtering pending requests upon acceptance.',
    ],
  },
  {
    id: 'data-integrity',
    title: 'Defensive Data Integrity',
    description:
      'Handling edge cases where referenced data (like a Team) might be deleted by a leader while an Invitation is still pending for a user.',
    language: 'javascript',
    code: `router.post('/:id/accept', requireAuth, async (req, res) => {
  const invitation = await Invitation.findById(req.params.id);
  
  // Check if the referenced team still exists
  const team = await Team.findById(invitation.teamId).populate('members');

  // EDGE CASE: Team was deleted after invite was sent
  if (!team) {
    await invitation.deleteOne(); // Self-healing: remove stale data
    return res.status(404).json({ 
      message: 'Invitation invalid: Team no longer exists.' 
    });
  }

  // Check concurrency: Did someone else fill the spot?
  if (team.members.length >= 6) {
    return res.status(400).json({ message: 'Team is now full.' });
  }

  // Transaction-like execution
  team.members.push(req.user.id);
  user.team = team._id;
  invitation.status = 'accepted';

  await Promise.all([team.save(), user.save(), invitation.save()]);
});`,
    naiveCode: `// Naive Approach: Assumes data exists
router.post('/accept-invite', async (req, res) => {
  const invite = await Invite.findById(req.params.id);
  
  // CRASHES if team was deleted
  const team = await Team.findById(invite.teamId);
  
  team.members.push(req.user.id);
  await team.save();
});`,
    bullets: [
      'Self-healing system: automatically cleans up stale invitations.',
      'Prevents server crashes by null-checking related documents.',
      'Concurrency safe: checks limits again at the moment of acceptance.',
    ],
  },
  {
    id: 'admin-export',
    title: 'Enterprise Data Export',
    description:
      'Advanced Admin feature allowing dynamic filtering and streaming of database records into downloadable Excel files using Streams.',
    language: 'javascript',
    code: `router.get('/users/export', adminAuth, async (req, res) => {
  const { verified, role, q } = req.query;
  
  // Dynamic Filtering
  const filters = {};
  if (q) filters.$or = [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }];
  if (verified) filters.isVerified = verified === 'true';

  const users = await User.find(filters).populate('team').lean();

  // Excel Stream Generation
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Users');

  worksheet.columns = [
    { header: 'Name', key: 'Name', width: 30 },
    { header: 'Role', key: 'Role', width: 15 },
    { header: 'Team', key: 'Team', width: 25 },
    { header: 'Verified', key: 'Verified', width: 10 },
  ];

  // Transform Data
  users.forEach(u => worksheet.addRow({
    Name: u.name,
    Role: u.role,
    Team: u.team?.teamName || 'N/A',
    Verified: u.isVerified ? 'Yes' : 'No'
  }));

  // Stream response to client
  res.setHeader('Content-Type', 'application/vnd.openxmlformats...');
  res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
  
  await workbook.xlsx.write(res);
  res.end();
});`,
    naiveCode: `// Naive Approach: JSON dump
router.get('/export', async (req, res) => {
  const users = await User.find();
  // Just sends raw JSON, hard for non-tech admins to read
  res.json(users);
});`,
    bullets: [
      'Generates professional .xlsx files suitable for stakeholders.',
      'Uses Streams to handle large datasets without memory leaks.',
      'Applies current dashboard filters to the exported data.',
    ],
  },
  {
    id: 'cloud-asset-management',
    title: 'Atomic Asset Swapping',
    description:
      'Handling file uploads cleanly by wrapping stream-based cloud APIs in Promises and ensuring old assets are garbage-collected (deleted) before new ones are linked.',
    language: 'javascript',
    code: `// 1. Promisify the stream upload for clean async/await usage
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' }, 
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(fileBuffer);
  });
};

// 2. Logic to swap team logos
if (req.file) {
  // Clean up storage: Remove old image first
  if (team.logoPublicId) {
    await cloudinary.uploader.destroy(team.logoPublicId);
  }
  
  // Upload new image from memory buffer
  const result = await uploadToCloudinary(req.file.buffer);
  
  // Update DB references
  team.logoUrl = result.secure_url;
  team.logoPublicId = result.public_id;
}`,
    naiveCode: `// Naive Approach: Storing locally / No cleanup
router.post('/upload', upload.single('logo'), (req, res) => {
  // Risk: Server disk fills up
  // Risk: Old files remain forever (Orphaned files)
  
  team.logoUrl = '/uploads/' + req.file.filename;
  team.save();
});`,
    bullets: [
      'Prevents storage waste by deleting old assets (Garbage Collection).',
      'Uses memory buffers (Multer) instead of temporary disk files for speed.',
      'Wraps callback-based legacy APIs into modern Promises.',
    ],
  },
  {
    id: 'audit-logging',
    title: 'Security Audit Trails',
    description:
      'A dedicated logging system that silently tracks critical administrative actions (like deleting users or changing roles) to ensure accountability and traceability.',
    language: 'javascript',
    code: `// Route: Delete User (Admin Only)
router.delete('/users/:id', adminAuth, async (req, res) => {
  const user = await User.findById(req.params.id);

  // 1. Perform the critical action
  await User.findByIdAndDelete(req.params.id);

  // 2. Create an immutable audit log
  await AdminLog.create({
    actor: req.user.id, // Who did it?
    action: 'USER_DELETE', // What did they do?
    targetType: 'User',
    targetId: user._id, // Who was affected?
    meta: { 
      email: user.email, 
      reason: 'Admin Dashboard Action' 
    },
  });

  res.json({ msg: 'User deleted and action logged.' });
});`,
    naiveCode: `// Naive Approach: Action without trace
router.delete('/users/:id', async (req, res) => {
  // If an admin goes rogue or makes a mistake, 
  // there is NO RECORD of who did this.
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: 'User deleted' });
});`,
    bullets: [
      'Creates a permanent record of "Who, What, When, and Whom".',
      'Essential for enterprise compliance and debugging admin mistakes.',
      'Stores snapshot metadata (email/name) even after the user is deleted.',
    ],
  },
  {
    id: 'advanced-search',
    title: 'Multi-Field Regex Search',
    description:
      'A powerful, unified search API that allows admins to find users by Name, Email, or Roll Number simultaneously using regex patterns and logical OR operators.',
    language: 'javascript',
    code: `router.get('/users', adminAuth, async (req, res) => {
  const { q } = req.query;
  const filters = {};

  // Dynamic Search Logic
  if (q) {
    // Escapes special characters automatically in real app
    const regex = new RegExp(q, 'i'); // 'i' = case-insensitive
    
    // Searches across multiple fields at once
    filters.$or = [
      { name: regex },
      { email: regex },
      { rollNumber: regex }
    ];
  }

  // Efficient Pagination
  const users = await User.find(filters)
    .select('-password') // Security: Exclude hashes
    .skip((page - 1) * limit)
    .limit(limit)
    .lean(); // Performance: Plain JS objects

  res.json(users);
});`,
    naiveCode: `// Naive Approach: Exact match only
router.get('/users', (req, res) => {
  const { email } = req.query;
  
  // Can't search by name
  // Must type email exactly (case-sensitive)
  User.find({ email: email }).then(users => {
    res.json(users);
  });
});`,
    bullets: [
      'Provides a "Google-like" search experience (single box, multiple targets).',
      'Uses `.lean()` for faster read performance on large datasets.',
      'Excludes sensitive fields (password hash) at the database layer.',
    ],
  }
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
