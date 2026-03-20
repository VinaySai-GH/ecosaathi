import React, { useEffect, useRef, useState } from 'react';
import './AnimatedCard.css';

/**
 * AnimatedCard
 * A wrapper component that fades and smoothly slides up its children
 * when they enter the viewport. Simulates modern scroll-driven entry animations.
 */
export default function AnimatedCard({ children, delay = 0, className = '', style = {} }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // In your case there's only one element to observe.
        if (entries[0].isIntersecting) {
          // Not possible to set it back to false like this:
          setIsVisible(true);
          // Stop observing once visible to prevent re-triggering constantly on scroll
          observer.unobserve(domRef.current);
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the component is visible
    );
    
    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`animated-card ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}
