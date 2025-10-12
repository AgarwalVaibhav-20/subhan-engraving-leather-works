// app/RevealingText.tsx
"use client";

import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface RevealingTextProps {
    children: string; // We expect a string for splitting
    className?: string;
}

export default function RevealingText({ children, className }: RevealingTextProps) {
    const textRef = useRef<HTMLHeadingElement | null>(null);

    // useLayoutEffect is preferred for animations that measure/affect layout
    useLayoutEffect(() => {
        if (!textRef.current) return;

        // Use GSAP's context for easy cleanup
        const ctx = gsap.context(() => {
            // Select all the individual character spans
            const chars = gsap.utils.toArray(".char");

            gsap.from(chars, {
                yPercent: 110, // Start each character 110% below its final position
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                stagger: 0.03, // Stagger the start of each animation by 0.03s
                scrollTrigger: {
                    trigger: textRef.current,
                    start: "top 85%", // Start animation when the element is 85% down the viewport
                    toggleActions: "play none none none",
                    once: true, // Animate only once
                },
            });
        }, textRef); // Scope the context to our component

        // Cleanup function
        return () => ctx.revert();

    }, [children]);

    return (
        <h2 ref={textRef} className={className} aria-label={children}>
            {children.split('').map((char, index) => (
                <span 
                    key={index}
                    // This outer span acts as a mask with overflow hidden
                    className="char-container"
                    style={{ display: 'inline-block', overflow: 'hidden' }}
                    aria-hidden="true"
                >
                    <span 
                        className="char"
                        style={{ display: 'inline-block', transform: 'translateY(110%)' }}
                    >
                        {/* Use non-breaking space for spaces to maintain layout */}
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                </span>
            ))}
        </h2>
    );
}