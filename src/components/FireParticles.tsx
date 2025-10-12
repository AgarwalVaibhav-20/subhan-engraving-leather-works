// app/FireParticles.tsx
"use client";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function FireParticles() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const c = canvasRef.current;
        if (!c) return;

        const ctx = c.getContext('2d');
        if (!ctx) return;
        
        // Set canvas to full screen dimensions
        const cw = c.width = window.innerWidth;
        const ch = c.height = window.innerHeight;

        const dots: { x: number; y: number; r: number }[] = [];
        const dotCount = 750;
        const duration = 25;

        // Mouse position state
        const mPos = { x: cw / 2, y: ch / 2 };
        
        const handlePointerMove = (e: PointerEvent) => {
            gsap.to(mPos, { x: e.offsetX, y: e.offsetY });
        };
        window.addEventListener('pointermove', handlePointerMove);

        // Populate the dots array
        for (let i = 0; i < dotCount; i++) {
            dots.push({
                x: cw * Math.random(),
                y: -10,
                r: gsap.utils.random(1.5, 4.5, 0.1)
            });
        }

        // The drawing function - MODIFIED FOR FIRE COLORS
        function drawDot(dot: { x: number; y: number; r: number }) {
            const dist = Math.abs(dot.x - mPos.x) + Math.abs(dot.y - mPos.y);
            
            // Generate a hue between red (0) and yellow (60) for a fire effect
            const fireHue = gsap.utils.random(0, 60); 
            // Lightness is affected by distance to the pointer
            const lightness = Math.max(1 - dist / (cw), 0.5) * 80;

            ctx!.fillStyle = `hsl(${fireHue}, 100%, ${lightness}%)`;
            ctx!.beginPath();
            ctx!.arc(dot.x, dot.y, dot.r * dot.r * Math.max(1 - dist / cw, 0.1), 0, 2 * Math.PI);
            ctx!.fill();
        }

        function redraw() {
            ctx!.clearRect(0, 0, cw, ch);
            dots.forEach(drawDot);
        }

        // GSAP Timeline
        const tl = gsap.timeline({ onUpdate: redraw })
            .from(dots, {
                duration: duration,
                ease: 'none',
                x: '+=random(-99,99)',
                y: (i, t) => t.r * ch, // larger dots move further/faster
                r: '+=random(-1,2)',
                repeatRefresh: true,
                stagger: { from: 'random', amount: duration, repeat: -1 },
            })
            .seek(duration); // Fast-forward to the middle of the animation

        // Cleanup function to run when the component unmounts
        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            tl.kill(); // Stop the GSAP timeline
        };

    }, []); // Empty dependency array ensures this runs only once

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
        ></canvas>
    );
}