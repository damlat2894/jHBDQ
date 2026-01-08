
import React, { useEffect, useRef } from 'react';
import { RewardType } from '../types';

interface ConfettiProps {
  type?: RewardType;
}

const Confetti: React.FC<ConfettiProps> = ({ type }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces: any[] = [];
    const numberOfPieces = 150;
    
    // Theme-based colors
    let colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
    
    if (type === 'GIFTICON') colors = ['#FFD700', '#FFA500', '#FF8C00', '#FFFACD']; // Gold/Orange
    if (type === 'GIF') colors = ['#FF69B4', '#DA70D6', '#BA55D3', '#FF1493']; // Pinks/Purples
    if (type === 'CARD') colors = ['#ADD8E6', '#87CEEB', '#F0F8FF', '#4682B4']; // Blues/Whites
    if (type === 'VIDEO') colors = ['#FF0000', '#8B0000', '#FF4500', '#000000']; // Red/Dark

    for (let i = 0; i < numberOfPieces; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 4 + 3,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
        shape: type === 'CARD' ? 'rect' : Math.random() > 0.5 ? 'circle' : 'rect'
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.y += p.speed;
        p.rotation += p.rotationSpeed;
        if (p.y > canvas.height) p.y = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        
        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }
        
        ctx.restore();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [type]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[60]" />;
};

export default Confetti;
