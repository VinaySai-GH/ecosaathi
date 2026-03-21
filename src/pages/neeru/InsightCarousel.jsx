import React, { useState, useRef, useEffect } from 'react';
import './carousel.css';

export default function InsightCarousel({ slides, autoplay = false }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const wrapperRef = useRef(null);

  const slideCount = slides.length;

  const goToSlide = (index) => {
    setCurrentSlide((index + slideCount) % slideCount);
  };

  const nextSlide = () => {
    goToSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    goToSlide(currentSlide - 1);
  };

  // Touch/mouse drag handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    setDragStart(e.touches?.at(0)?.clientX ?? e.clientX);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches?.at(0)?.clientX ?? e.clientX;
    const diff = dragStart - currentX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
      setIsDragging(false);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);

      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, dragStart, currentSlide]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="carousel-container">
      <div
        className={`carousel-wrapper${isDragging ? ' dragging' : ''}`}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        ref={wrapperRef}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        {slides.map((slide, i) => (
          <div key={i} className="carousel-slide">
            {slide}
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      {slideCount > 1 && (
        <div className="carousel-dots">
          {Array.from({ length: slideCount }).map((_, i) => (
            <button
              key={i}
              className={`dot${i === currentSlide ? ' active' : ''}`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
