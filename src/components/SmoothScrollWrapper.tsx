'use client'; // This component must run on the client

import { useEffect } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollWrapper({ children }: {children : any}) {
  const lenis = useLenis(ScrollTrigger.update); 
  useEffect(() => {
    if (lenis) {
      const updateLenis = (time) => {
        lenis.raf(time * 1000); 
      };

      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);
      
      return () => {
        gsap.ticker.remove(updateLenis);
      };
    }
  }, [lenis]);

  
  return (
    <ReactLenis 
      root
      options={{ 
        lerp: 0.1, 
        duration: 1.2,
        syncTouch: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}