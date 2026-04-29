import React from 'react';

/**
 * A smooth, CSS-based horizontal scroller with snap points.
 * Perfect for mobile-first swiping of cards.
 */
export default function HorizontalScroller({ children, gap = 16, padding = 20 }) {
  return (
    <div style={{
      ...styles.container,
      padding: `0 ${padding}px`,
    }}>
      <div style={{
        ...styles.wrapper,
        gap: `${gap}px`,
      }}>
        {React.Children.map(children, (child) => (
          <div style={styles.slide}>
            {child}
          </div>
        ))}
      </div>
      
      {/* Scroll indicator for desktop/affordance */}
      <div style={styles.affordance}>
        Swipe for more →
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    overflowX: 'auto',
    overflowY: 'hidden',
    WebkitOverflowScrolling: 'touch', // Smooth momentum scroll on iOS
    scrollbarWidth: 'none', // Hide scrollbar Firefox
    msOverflowStyle: 'none', // Hide scrollbar IE/Edge
    marginBottom: '24px',
  },
  wrapper: {
    display: 'flex',
    paddingBottom: '10px',
    // Snap points logic
    scrollSnapType: 'x mandatory',
  },
  slide: {
    flex: '0 0 85%', // Show 85% of card to hint at next one
    minWidth: '280px',
    maxWidth: '320px',
    scrollSnapAlign: 'center',
  },
  affordance: {
    textAlign: 'center',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
    marginTop: '-4px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    pointerEvents: 'none',
  }
};
