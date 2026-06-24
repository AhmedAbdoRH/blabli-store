import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Testimonial } from '../types/database';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Constants for styling and animation
const VISIBLE_CARDS = 3; // How many cards to prepare for the stack effect (current + next ones)
const CARD_OFFSET_X = '8%'; // Horizontal offset for stacked cards
const CARD_OFFSET_Y = '10px'; // Vertical offset for stacked cards
const CARD_SCALE_DECREMENT = 0.08; // How much smaller each stacked card gets
const ANIMATION_DURATION = 500; // ms, ensure this matches Tailwind duration class

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  // No isAnimating state needed for this specific slide approach if transitions are handled by CSS
  // and we prevent rapid clicks on buttons if desired. For simplicity, we'll keep it if needed for button debouncing.
  const [isAnimating, setIsAnimating] = useState(false);


  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('id, image_url, is_active, created_at')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setTestimonials(data || []);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const testimonialsWithImages = testimonials.filter(t => t.image_url);
  const totalTestimonials = testimonialsWithImages.length;

  const handleNavigation = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating || totalTestimonials <= 1) return;
    setIsAnimating(true);

    setCurrentIndex((prevIndex) => {
      if (direction === 'next') {
        return (prevIndex + 1) % totalTestimonials;
      } else {
        return (prevIndex - 1 + totalTestimonials) % totalTestimonials;
      }
    });

    setTimeout(() => setIsAnimating(false), ANIMATION_DURATION);
  }, [isAnimating, totalTestimonials, ANIMATION_DURATION]);

  const nextTestimonial = useCallback(() => handleNavigation('next'), [handleNavigation]);
  const prevTestimonial = useCallback(() => handleNavigation('prev'), [handleNavigation]);

  const goToTestimonial = useCallback((index: number) => {
    if (isAnimating || index === currentIndex || totalTestimonials <= 1) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), ANIMATION_DURATION);
  }, [isAnimating, currentIndex, totalTestimonials, ANIMATION_DURATION]);


  useEffect(() => {
    if (totalTestimonials <= 1) return;
    const timer = setInterval(nextTestimonial, 3000);
    return () => clearInterval(timer);
  }, [totalTestimonials, nextTestimonial]); // currentIndex removed, nextTestimonial is memoized

  if (loading) {
    return (
      <div className="relative py-16 px-4 md:px-0 overflow-hidden bg-gradient-to-br from-brand-deep via-brand to-brand-600">
        <div className="max-w-4xl mx-auto relative z-10 text-center py-8 text-white/80">
          جاري التحميل...
        </div>
      </div>
    );
  }

  if (totalTestimonials === 0) {
    return (
      <section className="relative py-16 px-4 md:px-0 overflow-hidden bg-gradient-to-br from-brand-deep via-brand to-brand-600">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_60%)]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-center text-white mb-3 drop-shadow-lg">آراء عملائنا</h2>
          <div className="flex items-center justify-center gap-2 mb-10">
            <span className="w-12 h-1 bg-white/60 rounded-full"></span>
            <span className="w-2 h-1 bg-white/60 rounded-full"></span>
          </div>
          <div className="text-center text-white/70 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
            لا توجد صور آراء لعرضها حالياً.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 px-4 md:px-0 overflow-hidden bg-gradient-to-br from-brand-deep via-brand to-brand-600">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.12),transparent_60%)]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <span className="inline-block text-brand-200 font-bold text-sm tracking-wider uppercase mb-3">شهادات</span>
          <h2 className="text-3xl md:text-4xl font-black text-center text-white drop-shadow-lg">آراء عملائنا</h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="w-12 h-1 bg-white/60 rounded-full"></span>
            <span className="w-2 h-1 bg-white/60 rounded-full"></span>
          </div>
        </div>

        <div className="relative h-[400px] md:h-[500px] w-full"> {/* Fixed height container for cards */}
          {/* Testimonial Cards */}
          {testimonialsWithImages.map((testimonial, index) => {
            let positionFactor = index - currentIndex;
            if (positionFactor < -totalTestimonials / 2) {
              positionFactor += totalTestimonials;
            } else if (positionFactor > totalTestimonials / 2) {
              positionFactor -= totalTestimonials;
            }
            
            // Determine card state based on its position relative to currentIndex
            // We want to style cards that are current, next, and one after next
            // And also the one that is previous (for exiting animation)
            let zIndex = totalTestimonials - Math.abs(positionFactor);
            let scale = 1 - Math.abs(positionFactor) * CARD_SCALE_DECREMENT;
            let opacity = positionFactor === 0 ? 1 : (Math.abs(positionFactor) < VISIBLE_CARDS ? 0.7 - Math.abs(positionFactor) * 0.2 : 0);
            let translateX = `${positionFactor * 100}%`; // Default for current, prev, next for simple slide
            let cardOffsetY = `${Math.abs(positionFactor) * parseFloat(CARD_OFFSET_Y)}px`;

            // More refined positioning for stack effect
            if (positionFactor === 0) { // Current card
              translateX = '0%';
              cardOffsetY = '0px';
              scale = 1;
              opacity = 1;
              zIndex = VISIBLE_CARDS + 1;
            } else if (positionFactor > 0 && positionFactor < VISIBLE_CARDS) { // Stacked upcoming cards
              translateX = `calc(${positionFactor * parseFloat(CARD_OFFSET_X)}% + ${positionFactor * 10}px)`; // Add small gap
              cardOffsetY = `${positionFactor * parseFloat(CARD_OFFSET_Y)}px`;
              scale = 1 - positionFactor * CARD_SCALE_DECREMENT;
              opacity = 1 - positionFactor * 0.3; // More gradual fade
              zIndex = VISIBLE_CARDS - positionFactor;
            } else if (positionFactor < 0) { // Exiting card (to the left)
              translateX = '-100%';
              opacity = 0;
              scale = 0.8;
              zIndex = 0;
            } else { // Cards far in the future (to the right, hidden)
              translateX = '100%';
              opacity = 0;
              scale = 0.8;
              zIndex = 0;
            }


            return (
              <div
                key={testimonial.id}
                className="absolute inset-0 transition-all origin-center"
                style={{
                  transform: `translateX(${translateX}) translateY(${cardOffsetY}) scale(${scale})`,
                  opacity: opacity,
                  zIndex: zIndex,
                  transitionDuration: `${ANIMATION_DURATION}ms`,
                }}
              >
                <div className="w-full h-full flex justify-center items-center p-2 md:p-4">
                  <img
                    src={testimonial.image_url}
                    alt={`testimonial by client ${testimonial.id}`}
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                    style={{ background: 'white' }} // Keep background for non-transparent parts of image
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Controls */}
        {totalTestimonials > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-4 rtl:space-x-reverse">
            <button
              onClick={prevTestimonial}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 focus:outline-none disabled:opacity-50"
              aria-label="التعليق السابق"
              disabled={isAnimating}
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Dots Indicator */}
            <div className="flex space-x-2 rtl:space-x-reverse">
              {testimonialsWithImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  disabled={isAnimating}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60 w-2.5'
                  } disabled:opacity-50`}
                  aria-label={`انتقل إلى التعليق ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 focus:outline-none disabled:opacity-50"
              aria-label="التعليق التالي"
              disabled={isAnimating}
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
