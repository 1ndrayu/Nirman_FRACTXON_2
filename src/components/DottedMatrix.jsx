import React, { useEffect, useRef } from 'react';

const DottedMatrix = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const dotSpacing = 30;
    const dotRadius = 1;
    const effectRadius = 200;
    const growthFactor = 3;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const theme = document.body.className.includes('theme-business') ? 'business' : 'investor';
      ctx.fillStyle = theme === 'business' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.05)';

      const rows = Math.ceil(canvas.height / dotSpacing);
      const cols = Math.ceil(canvas.width / dotSpacing);

      for (let i = 0; i <= rows; i++) {
        for (let j = 0; j <= cols; j++) {
          const x = j * dotSpacing;
          const y = i * dotSpacing;
          
          const dx = x - mouseRef.current.x;
          const dy = y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          let currentRadius = dotRadius;
          if (distance < effectRadius) {
            const scale = 1 + (growthFactor - 1) * (1 - distance / effectRadius);
            currentRadius = dotRadius * scale;
            // Add a slight color shift for dots near cursor
            if (theme === 'business') {
                ctx.fillStyle = `rgba(255, 255, 255, ${0.15 + (1 - distance / effectRadius) * 0.2})`;
            } else {
                ctx.fillStyle = `rgba(0, 0, 0, ${0.05 + (1 - distance / effectRadius) * 0.1})`;
            }
          } else {
            ctx.fillStyle = theme === 'business' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.05)';
          }

          ctx.beginPath();
          ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="mouse-glow"
      style={{ opacity: 0.8 }}
    />
  );
};

export default DottedMatrix;
