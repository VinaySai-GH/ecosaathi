import React from 'react';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.text}>
          © {new Date().getFullYear()} EcoSaathi. Built with 🌿 for a sustainable campus.
        </p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    width: '100%',
    padding: '12px 0',
    marginTop: 'auto',
    borderTop: '1px solid var(--border)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Slightly darker to contrast
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '0 24px',
  },
  text: {
    color: 'var(--text-muted)',
    fontSize: '14px',
    margin: '0 0 4px 0',
  },
  subtext: {
    color: 'var(--text-dim)',
    fontSize: '12px',
    margin: 0,
  }
};
