// app/page.tsx
"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

// Make sure GSAP's ScrollTrigger plugin is registered
gsap.registerPlugin(ScrollTrigger);

// --- Component Data ---
const clientLogos = [
  { src: "/productPhotos/rider.png", alt: "Rider Logo" },
  { src: "/productPhotos/berunni3.png", alt: "Berunni Logo" },
  { src: "/productPhotos/horse.png", alt: "Horse Logo" },
  { src: "/productPhotos/logos.jpg", alt: "Logos Showcase" },
  { src: "/productPhotos/drilldown.jpeg", alt: "Drilldown Logo" },
];

const categoriesData = [
  { src: '/productPhotos/logos.jpg', title: "Rubber & Metal Logos", href: "/products/RubberLogo" },
  { src: '/productPhotos/idealharness.png', title: "Apparel Branding", href: "/product/apparel" },
  { src: '/productPhotos/rubber.jpg', title: "Custom Accessories", href: "/product/accessories" },
  { src: '/productPhotos/drilldownwhite.jpeg', title: "Precision Metalwork", href: "/product/MetalLogo" },
  // horse: { /* ... data for horse accessories ... */ },
  //   logos: { /* ... data for logos ... */ },
  //   toys: { /* ... data for toys ... */ }
];

const craftsmanshipSteps = [
    { 
        title: "Concept & Design",
        description: "Every masterpiece begins with an idea. We collaborate with you to translate your vision into a detailed blueprint, ensuring every curve and detail is perfected before production.",
        image: "/productPhotos/horse.png"
    },
    { 
        title: "Material Selection",
        description: "We source only the finest metals, leathers, and polymers. The material is the soul of the emblem, chosen for its durability, texture, and character.",
        image: "/productPhotos/mainstay.jpg" // Replace with a relevant image
    },
    { 
        title: "Precision Crafting",
        description: "Using state-of-the-art machinery and artisanal techniques, our craftsmen meticulously forge, stamp, and mold each piece. This is where your design comes to life.",
        image: "/productPhotos/drilldownwhite.jpeg" // Replace with a relevant image
    },
    { 
        title: "Finishing & Quality",
        description: "The final touches are applied – polishing, plating, and coloring. Every single item undergoes a rigorous quality check to ensure it meets our exacting standards of excellence.",
        image: "/image2.jpg" // Replace with a relevant image
    },
];


// --- Main Page Component ---
export default function Page() {
    const heroRef = useRef(null);
    const craftsmanshipRef = useRef(null);

    // Smooth Scrolling with Lenis
    useEffect(() => {
        const lenis = new Lenis();
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }, []);

    // GSAP Animations
    useEffect(() => {
        let ctx = gsap.context(() => {
            // Animate the main heading text
            gsap.from(".char", {
                yPercent: 130,
                stagger: 0.05,
                ease: "back.out",
                duration: 1,
                delay: 0.5
            });
            
            // Craftsmanship Section - Pinned Animation
            const steps = gsap.utils.toArray('.step-panel');
            gsap.to(steps, {
                xPercent: -100 * (steps.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: craftsmanshipRef.current,
                    pin: true,
                    scrub: 1,
                    snap: 1 / (steps.length - 1),
                    end: () => "+=" + craftsmanshipRef.current.offsetWidth
                }
            });
        });
        return () => ctx.revert(); // Cleanup
    }, []);

    // Framer Motion Parallax for Hero Background
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

    return (
        <div className="bg-zinc-900 text-neutral-100 font-sans">
            {/* ===== Hero Section ===== */}
            <section ref={heroRef} className="relative h-screen flex items-center justify-center text-center overflow-hidden">
                <motion.div
                    className="absolute inset-0 z-0"
                    style={{ y: backgroundY }}
                >
                    <Image
                        src="/productPhotos/mainstay.jpg"
                        alt="Craftsmanship background"
                        fill
                        className="object-cover brightness-50"
                        priority
                    />
                </motion.div>
                <div className="relative z-10 p-4">
                    <h1 className="font-heading text-6xl md:text-8xl font-bold uppercase tracking-wider">
                        {/* Splitting text for character animation */}
                        {"Forge Your Identity".split("").map((char, i) => (
                           <span key={i} className="inline-block overflow-hidden">
                                <span className="char inline-block">
                                    {char === " " ? "\u00A0" : char}
                                </span>
                            </span>
                        ))}
                    </h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.5 }}
                        className="font-body text-lg md:text-xl mt-4 max-w-2xl mx-auto text-neutral-300"
                    >
                        Custom Metal, Leather, and Rubber Emblems Crafted with Precision and Passion.
                    </motion.p>
                    <Link href="/product">
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.8 }}
                            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(245, 158, 11, 0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-8 bg-amber-500 text-zinc-900 font-bold font-body py-3 px-8 rounded-sm uppercase tracking-wide inline-flex items-center gap-2"
                        >
                            Explore Collection <ArrowRight size={20} />
                        </motion.button>
                    </Link>
                </div>
            </section>

            {/* ===== Client Logos Marquee Section ===== */}
            <section className="py-16 bg-zinc-950 border-y border-zinc-800">
                <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                    <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
                        {clientLogos.map((logo, i) => (
                           <li key={i}><Image src={logo.src} alt={logo.alt} width={150} height={50} className="grayscale hover:grayscale-0 transition-all duration-300" /></li> 
                        ))}
                    </ul>
                    {/* Duplicate for seamless effect */}
                    <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
                        {clientLogos.map((logo, i) => (
                           <li key={i}><Image src={logo.src} alt={logo.alt} width={150} height={50} className="grayscale hover:grayscale-0 transition-all duration-300" /></li> 
                        ))}
                    </ul>
                </div>
            </section>

            {/* ===== Categories Section ===== */}
            <section className="w-full max-w-7xl mx-auto p-8 my-24">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.5 }}
                    className="font-heading text-4xl md:text-5xl font-bold uppercase text-center mb-16"
                >
                    Engineered for Excellence
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categoriesData.map((item, i) => (
                        <motion.div
                            key={item.href}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                            viewport={{ once: true, amount: 0.5 }}
                        >
                            <Link href={item.href} className="block group relative overflow-hidden rounded-md">
                                <div className="relative w-full h-[450px]">
                                    <Image
                                        src={item.src}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                </div>
                                <div className="absolute bottom-0 left-0 p-6">
                                    <h3 className="font-body text-xl font-medium uppercase tracking-wider text-white transition-transform duration-500 ease-in-out group-hover:-translate-y-2">{item.title}</h3>
                                    <div className="flex items-center gap-2 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <span>View Products</span>
                                        <ArrowRight size={18} />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>
            
            {/* ===== Craftsmanship Process Section ===== */}
            <section ref={craftsmanshipRef} className="relative h-screen bg-zinc-950 flex flex-col justify-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full p-8 z-10">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase text-center">
                        The Art of Creation
                    </h2>
                </div>
                <div className="w-[400vw] h-full flex flex-nowrap">
                    {craftsmanshipSteps.map((step, index) => (
                        <div key={index} className="step-panel w-screen h-full flex items-center justify-center p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                                <div className="relative w-full h-96 rounded-lg overflow-hidden">
                                    <Image src={step.image} alt={step.title} fill className="object-cover"/>
                                </div>
                                <div>
                                    <span className="text-amber-400 font-bold">STEP {index + 1}</span>
                                    <h3 className="text-4xl font-heading font-bold my-4">{step.title}</h3>
                                    <p className="text-neutral-400 font-body text-lg">{step.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
