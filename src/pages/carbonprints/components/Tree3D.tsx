import React from 'react';

const styles = `
  @keyframes sway {
    0%, 100% { transform: rotate(-2deg); }
    50% { transform: rotate(2deg); }
  }
  @keyframes leafDrop {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(150px) rotate(45deg); opacity: 0; }
  }
  @keyframes sparkleFloat {
    0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
    50% { transform: translateY(-10px) scale(1.5); opacity: 1; }
  }

  .tree-container {
    width: 100%;
    height: 300px;
    background: radial-gradient(circle at 50% 100%, rgba(255,255,255,0.05) 0%, transparent 60%);
    border-radius: var(--radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    overflow: hidden;
    position: relative;
    border: 1px solid rgba(16, 185, 129, 0.2);
  }

  .tree-svg {
    width: 180px;
    height: 240px;
    transform-origin: bottom center;
    animation: sway 6s ease-in-out infinite;
  }

  .leaf {
    transition: fill 1s ease, transform 1s ease;
    transform-origin: center;
  }

  .tree-healthy .leaf {
    fill: #10B981;
  }

  .tree-wilted .leaf {
    fill: #ef4444;
  }

  .tree-wilted .leaf-drop-1 { animation: leafDrop 3s infinite linear; }
  .tree-wilted .leaf-drop-2 { animation: leafDrop 4s infinite linear 1s; }
  .tree-wilted .leaf-drop-3 { animation: leafDrop 3.5s infinite linear 2s; }

  .sparkle {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10B981;
    box-shadow: 0 0 10px #10B981;
    animation: sparkleFloat 3s ease-in-out infinite;
  }
  
  .tree-wilted .sparkle {
    background: #ef4444;
    box-shadow: 0 0 10px #ef4444;
  }
`;

export default function Tree3D({ isAboveLimit }: { isAboveLimit: boolean }) {
  const treeClass = isAboveLimit ? 'tree-wilted' : 'tree-healthy';

  return (
    <>
      <style>{styles}</style>
      <div className={`tree-container ${treeClass}`}>
        
        {/* Background Sparkles */}
        <div className="sparkle" style={{ top: '20%', left: '30%', animationDelay: '0s' }} />
        <div className="sparkle" style={{ top: '40%', left: '70%', animationDelay: '1s' }} />
        <div className="sparkle" style={{ top: '60%', left: '20%', animationDelay: '2s' }} />
        {!isAboveLimit && (
           <>
             <div className="sparkle" style={{ top: '30%', left: '80%', animationDelay: '0.5s' }} />
             <div className="sparkle" style={{ top: '70%', left: '60%', animationDelay: '1.5s' }} />
           </>
        )}

        <svg className="tree-svg" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
          {/* Base/Ground */}
          <ellipse cx="100" cy="280" rx="60" ry="10" fill="rgba(255,255,255,0.05)" />
          
          {/* Trunk */}
          <path d="M90 280 Q 95 150 90 100 L 110 100 Q 105 150 110 280 Z" fill="#5c4033" />
          <path d="M90 180 Q 70 140 50 130 L 55 125 Q 75 135 95 160 Z" fill="#4a332a" />
          <path d="M110 160 Q 130 120 150 110 L 145 105 Q 125 115 105 140 Z" fill="#4a332a" />

          {/* Leaves */}
          <g>
            {/* Center Main Canopy */}
            <circle cx="100" cy="80" r="45" className="leaf" />
            <circle cx="70" cy="110" r="35" className="leaf" />
            <circle cx="130" cy="110" r="35" className="leaf" />
            <circle cx="100" cy="130" r="30" className="leaf" />
            
            {/* Branch Canopies */}
            <circle cx="45" cy="120" r="20" className="leaf" />
            <circle cx="155" cy="100" r="20" className="leaf" />

            {/* Dropping Leaves (Only animate when wilted) */}
            <path d="M40 130 Q50 140 45 150 Q35 140 40 130" className="leaf leaf-drop-1" />
            <path d="M160 110 Q170 120 165 130 Q155 120 160 110" className="leaf leaf-drop-2" />
            <path d="M100 150 Q110 160 105 170 Q95 160 100 150" className="leaf leaf-drop-3" />
          </g>
        </svg>
      </div>
    </>
  );
}
