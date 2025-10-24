'use client';

import React, { useState, useEffect, useRef, useCallback, useLayoutEffect, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import useEmblaCarousel from 'embla-carousel-react';
import useSWR from 'swr';

gsap.registerPlugin(ScrollTrigger);
const fetcher = url => fetch(url).then(r => r.json());

// ⭐ Star Component
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

// ⭐ FlowingStars Component
const FlowingStars = ({ rating }) => {
  const fillRef = useRef(null);
  const componentRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(fillRef.current, {
        width: `${rating * 20}%`,
        ease: 'power2.out',
        duration: 1.2,
        scrollTrigger: {
          trigger: componentRef.current,
          start: 'top 85%',
        },
      });
    }, componentRef);
    return () => ctx.revert();
  }, [rating]);

  return (
    <div ref={componentRef} className="relative flex">
      <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} />)}</div>
      <div ref={fillRef} className="absolute top-0 left-0 h-full overflow-hidden w-0">
        <div className="flex w-max">
          {[...Array(5)].map((_, i) => <Star key={i} filled isRatingStar />)}
        </div>
      </div>
    </div>
  );
};

// ⏱️ TimeAgo (safe for hydration)
const TimeAgo = ({ date }) => {
  const [text, setText] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined')
      setText(formatDistanceToNow(new Date(date), { addSuffix: true }));
  }, [date]);
  return <p className="text-xs text-gray-500">{text}</p>;
};

// 🏆 Reviews Section
export default function ReviewsSection() {
  const { data: reviews = [], mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reviews`,
    fetcher
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAllReviewsModalOpen, setIsAllReviewsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [formState, setFormState] = useState({ name: '', review: '', rating: 0 });
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formState.rating) {
      setMessage('Please select a star rating.');
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      if (res.ok) {
        setMessage('Thank you! Your review has been posted.');
        setIsAddModalOpen(false);
        setFormState({ name: '', review: '', rating: 0 });
        mutate(); // refresh data automatically
      } else throw new Error();
    } catch {
      setMessage('Sorry, there was an error. Please try again.');
    }
  };

  const truncate = (text, max = 100) =>
    text.length <= max ? { text, long: false } : { text: text.slice(0, max) + '...', long: true };

  return (
    // FIX: Added `overflow-hidden` here to clip the absolute-positioned
    // carousel buttons that were pushing outside the container.
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
                        "{text}"
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

      {/* Modals */}
      <AnimatePresence>
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
                <h3 className="text-2xl font-bold text-primary mb-4">
                  Write a Review
                </h3>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formState.name}
                  onChange={e => setFormState({ ...formState, name: e.target.value })}
                  required
                  className="w-full p-2 bg-background border rounded"
                />
                <textarea
                  placeholder="Your review..."
                  rows="4"
                  value={formState.review}
                  onChange={e => setFormState({ ...formState, review: e.target.value })}
                  required
                  className="w-full p-2 bg-background border rounded"
                />
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
                <button
                  type="submit"
                  className="w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Submit Review
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

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
              <div className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map(r => (
                  <div key={r._id} className="bg-white p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <FlowingStars rating={r.rating} />
                      <TimeAgo date={r.createdAt} />
                    </div>
                    <p className="text-gray-700 my-2 italic">"{r.review}"</p>
                    <p className="font-bold text-primary mt-2 self-end">- {r.name}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

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
                <div className="flex justify-between items-center mb-4">
                  <FlowingStars rating={selectedReview.rating} />
                  <TimeAgo date={selectedReview.createdAt} />
                </div>
                <p className="text-lg text-gray-700 my-4 italic">
                  "{selectedReview.review}"
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