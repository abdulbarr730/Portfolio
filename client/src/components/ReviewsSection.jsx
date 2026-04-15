'use client';

import React, { useState, useEffect, useRef, useCallback, useLayoutEffect, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import useEmblaCarousel from 'embla-carousel-react';
import useSWR from 'swr';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);
const fetcher = url => fetch(url).then(r => r.json());

// ─────────────────────────────────────────────
// 🛡️ INPUT SANITIZATION UTILS
// ─────────────────────────────────────────────

/**
 * Strips all HTML tags, trims whitespace, and collapses multiple spaces.
 * Prevents XSS / HTML injection from reaching the DB.
 */
const stripTags = (str) =>
  str
    .replace(/<[^>]*>/g, '')          // remove all HTML tags
    .replace(/[<>'"`;]/g, '')         // remove dangerous chars
    .replace(/\s+/g, ' ')            // collapse whitespace
    .trim();

const LIMITS = {
  name: 60,
  review: 800,
};

const sanitizeForm = ({ name, review, rating }) => ({
  name: stripTags(name).slice(0, LIMITS.name),
  review: stripTags(review).slice(0, LIMITS.review),
  rating: Math.min(5, Math.max(1, Math.round(Number(rating)))), // always 1–5 integer
});

const validateForm = ({ name, review, rating }) => {
  if (!name || name.trim().length < 2) return 'Name must be at least 2 characters.';
  if (!review || review.trim().length < 5) return 'Review must be at least 5 characters.';
  if (!rating || rating < 1 || rating > 5) return 'Please select a star rating.';
  return null; // null = valid
};

// ─────────────────────────────────────────────
// ⭐ Star Component
// ─────────────────────────────────────────────
const Star = memo(({ filled, isRatingStar }) => (
  <svg
    className={`w-5 h-5 ${isRatingStar ? 'text-yellow-400' : 'text-gray-300'}`}
    fill={filled ? 'currentColor' : 'none'}
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
    />
  </svg>
));
Star.displayName = 'Star';

// ─────────────────────────────────────────────
// ⭐ FlowingStars Component
// ─────────────────────────────────────────────
const FlowingStars = ({ rating }) => {
  const fillRef = useRef(null);
  const componentRef = useRef(null);

  useEffect(() => {
    const el = componentRef.current;
    const fill = fillRef.current;
    if (!el || !fill) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // stars are visible — animate immediately
          gsap.fromTo(fill,
            { width: '0%' },
            { width: `${rating * 20}%`, duration: 1.2, ease: 'power2.out' }
          );
          gsap.fromTo(el,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
          );
          observer.disconnect(); // run once
        }
      },
      { threshold: 0.1 } // fires as soon as 10% of stars are visible
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rating]);

  return (
    <div ref={componentRef} className="relative flex items-center" style={{ opacity: 0 }}>
      <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} />)}</div>
      <div ref={fillRef} className="absolute top-0 left-0 h-full overflow-hidden w-0">
        <div className="flex w-max star-fill">
          {[...Array(5)].map((_, i) => <Star key={i} filled isRatingStar />)}
        </div>
      </div>
      <span className="sr-only">Rated {rating.toFixed(1)} out of 5 stars</span>
    </div>
  );
};

// ─────────────────────────────────────────────
// ⏱️ TimeAgo
// ─────────────────────────────────────────────
const TimeAgo = ({ date }) => {
  const [text, setText] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined')
      setText(formatDistanceToNow(new Date(date), { addSuffix: true }));
  }, [date]);
  return <p className="text-xs text-gray-500">{text}</p>;
};

// ─────────────────────────────────────────────
// 🔒 useBodyScrollLock — locks bg scroll when any modal is open
// ─────────────────────────────────────────────
const useBodyScrollLock = (isLocked) => {
  useEffect(() => {
    if (isLocked) {
      const scrollY = window.scrollY;
      document.documentElement.style.setProperty('--scroll-y', `${scrollY}px`);
      document.documentElement.classList.add('modal-open');
    } else {
      const scrollY = getComputedStyle(document.documentElement)
        .getPropertyValue('--scroll-y')
        .trim();
      document.documentElement.classList.remove('modal-open');
      window.scrollTo({ top: parseInt(scrollY || '0', 10), behavior: 'instant' });
    }

    return () => {
      const scrollY = getComputedStyle(document.documentElement)
        .getPropertyValue('--scroll-y')
        .trim();
      document.documentElement.classList.remove('modal-open');
      if (scrollY) window.scrollTo({ top: parseInt(scrollY, 10), behavior: 'instant' });
    };
  }, [isLocked]);
};

// ─────────────────────────────────────────────
// 🏆 Reviews Section
// ─────────────────────────────────────────────
export default function ReviewsSection() {
  const { data, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reviews`,
    fetcher
  );

  const reviews = Array.isArray(data) ? data : data?.reviews || [];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAllReviewsModalOpen, setIsAllReviewsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [formState, setFormState] = useState({ name: '', review: '', rating: 0 });
  const [hoverRating, setHoverRating] = useState(0);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [message, setMessage] = useState('');
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // 🔒 Lock body scroll whenever any modal is open
  const anyModalOpen = isAddModalOpen || isAllReviewsModalOpen || !!selectedReview;
  useBodyScrollLock(anyModalOpen);

  const handleSubmit = async e => {
    e.preventDefault();

    // Must agree to policy
    if (!agreedToPolicy) {
      setMessage('Please agree to the Privacy Policy and Terms & Conditions.');
      return;
    }

    // Client-side validation first
    const validationError = validateForm(formState);
    if (validationError) {
      setMessage(validationError);
      return;
    }

    // Sanitize before sending
    const cleanData = sanitizeForm(formState);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData),
      });
      if (res.ok) {
        setMessage('Thank you! Your review has been posted.');
        setIsAddModalOpen(false);
        setFormState({ name: '', review: '', rating: 0 });
        setAgreedToPolicy(false);
        mutate();
      } else {
        const errData = await res.json().catch(() => ({}));
        setMessage(errData?.message || 'Sorry, there was an error. Please try again.');
      }
    } catch {
      setMessage('Sorry, there was an error. Please try again.');
    }
  };

  const truncate = (text, max = 100) =>
    text.length <= max ? { text, long: false } : { text: text.slice(0, max) + '...', long: true };

  return (
    <section id="reviews" className="container mx-auto pt-22 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <header className="text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight text-primary">Testimonials</h2>
        <p className="mt-4 text-lg text-secondary">
          What others are saying about my work.
        </p>
      </header>

      {reviews.length > 0 ? (
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {reviews.map((r, i) => {
                const { text, long } = truncate(r.review);
                return (
                  <div key={r._id} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 pl-4">
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full relative">
                      {i === 0 && (
                        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                          Latest
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <FlowingStars rating={r.rating} />
                        <TimeAgo date={r.createdAt} />
                      </div>
                      <p className="text-secondary my-4 flex-grow italic">
                        &ldquo;{text}&rdquo;
                      </p>
                      {long && (
                        <button
                          onClick={() => setSelectedReview(r)}
                          className="text-blue-500 hover:underline text-sm self-start mb-4"
                        >
                          Read More
                        </button>
                      )}
                      <p className="font-bold text-primary mt-auto self-end">
                        - {r.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <button
            onClick={scrollPrev}
            className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md text-primary hover:scale-110 transition-transform"
          >
            ←
          </button>
          <button
            onClick={scrollNext}
            className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md text-primary hover:scale-110 transition-transform"
          >
            →
          </button>
        </div>
      ) : (
        <p className="text-center text-secondary">Be the first to leave a review!</p>
      )}

      <div className="text-center mt-16 flex flex-col items-center gap-4">
        {reviews.length > 0 && (
          <button
            onClick={() => setIsAllReviewsModalOpen(true)}
            className="text-primary font-semibold hover:underline"
          >
            View All {reviews.length} Reviews
          </button>
        )}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-colors"
        >
          Leave a Review
        </button>
        {message && <p className="mt-4 text-secondary">{message}</p>}
      </div>

      {/* ─── MODALS ─── */}
      <AnimatePresence>

        {/* ➕ Add Review Modal */}
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl w-full max-w-lg"
              onClick={e => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit} className="p-8 space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-primary">Write a Review</h3>
                  <button
                    type="button"
                    onClick={() => { setIsAddModalOpen(false); setMessage(''); setFormState({ name: '', review: '', rating: 0 }); setAgreedToPolicy(false); }}
                    className="text-2xl text-gray-400 hover:text-primary transition-colors"
                  >
                    &times;
                  </button>
                </div>

                {/* Name */}
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formState.name}
                    onChange={e => setFormState({ ...formState, name: e.target.value })}
                    maxLength={LIMITS.name}
                    required
                    className="w-full p-2 bg-background border rounded"
                  />
                  <p className="text-xs text-gray-400 text-right mt-0.5">
                    {formState.name.length}/{LIMITS.name}
                  </p>
                </div>

                {/* Review text */}
                <div>
                  <textarea
                    placeholder="Your review..."
                    rows="4"
                    value={formState.review}
                    onChange={e => setFormState({ ...formState, review: e.target.value })}
                    maxLength={LIMITS.review}
                    required
                    className="w-full p-2 bg-background border rounded resize-none"
                  />
                  <p className="text-xs text-gray-400 text-right mt-0.5">
                    {formState.review.length}/{LIMITS.review}
                  </p>
                </div>

                {/* Star rating */}
                <div className="flex items-center space-x-2 cursor-pointer">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      onMouseEnter={() => setHoverRating(i + 1)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setFormState({ ...formState, rating: i + 1 })}
                    >
                      <Star filled={(hoverRating || formState.rating) > i} isRatingStar />
                    </div>
                  ))}
                </div>

                {/* ✅ Privacy Policy + T&C Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreedToPolicy}
                    onChange={e => setAgreedToPolicy(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-primary shrink-0 cursor-pointer"
                  />
                  <span className="text-xs text-gray-500 leading-relaxed">
                    I agree to the{' '}
                    <Link
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline hover:opacity-70 transition-opacity"
                      onClick={e => e.stopPropagation()}
                    >
                      Privacy Policy
                    </Link>
                    {' '}and{' '}
                    <Link
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline hover:opacity-70 transition-opacity"
                      onClick={e => e.stopPropagation()}
                    >
                      Terms & Conditions
                    </Link>
                    . My review may be publicly displayed on this site.
                  </span>
                </label>

                {/* Error/success message inline */}
                {message && (
                  <p className="text-sm text-red-500">{message}</p>
                )}

                <button
                  type="submit"
                  disabled={!agreedToPolicy}
                  className="w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                >
                  Submit Review
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* 👁️ View All Reviews Modal */}
        {isAllReviewsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setIsAllReviewsModalOpen(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-primary">All Reviews</h3>
                <button
                  onClick={() => setIsAllReviewsModalOpen(false)}
                  className="text-2xl text-gray-400 hover:text-primary"
                >
                  &times;
                </button>
              </div>

              <div className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 reviews-scroll-container">
                {reviews.map(r => (
                  <div key={r._id} className="bg-white p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <FlowingStars rating={r.rating} />
                      <TimeAgo date={r.createdAt} />
                    </div>
                    <p className="text-gray-700 my-2 italic">&ldquo;{r.review}&rdquo;</p>
                    <p className="font-bold text-primary mt-2 self-end">- {r.name}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 📖 Selected Review Modal */}
        {selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedReview(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl w-full max-w-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex justify-end mb-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReview(null)}
                    className="text-2xl text-gray-400 hover:text-primary transition-colors"
                  >
                    &times;
                  </button>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <FlowingStars rating={selectedReview.rating} />
                  <TimeAgo date={selectedReview.createdAt} />
                </div>
                <p className="text-lg text-gray-700 my-4 italic">
                  &ldquo;{selectedReview.review}&rdquo;
                </p>
                <p className="font-bold text-primary mt-4 text-right">
                  - {selectedReview.name}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </section>
  );
}