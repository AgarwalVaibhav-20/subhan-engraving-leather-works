// app/page.tsx
// "use client";

// import { useEffect, useRef } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
// import { motion, useScroll, useTransform } from 'framer-motion';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import Lenis from '@studio-freight/lenis';

// // Make sure GSAP's ScrollTrigger plugin is registered
// gsap.registerPlugin(ScrollTrigger);

// // --- Component Data ---
// const clientLogos = [
//   { src: "/productPhotos/rider.png", alt: "Rider Logo" },
//   { src: "/productPhotos/berunni3.png", alt: "Berunni Logo" },
//   { src: "/productPhotos/horse.png", alt: "Horse Logo" },
//   { src: "/productPhotos/logos.jpg", alt: "Logos Showcase" },
//   { src: "/productPhotos/drilldown.jpeg", alt: "Drilldown Logo" },
// ];

// const categoriesData = [
//   { src: '/productPhotos/logos.jpg', title: "Rubber & Metal Logos", href: "/products/RubberLogo" },
//   { src: '/productPhotos/idealharness.png', title: "Apparel Branding", href: "/product/apparel" },
//   { src: '/productPhotos/rubber.jpg', title: "Custom Accessories", href: "/product/accessories" },
//   { src: '/productPhotos/drilldownwhite.jpeg', title: "Precision Metalwork", href: "/product/MetalLogo" },
// ];

// const craftsmanshipSteps = [
//     { 
//         title: "Concept & Design",
//         description: "Every masterpiece begins with an idea. We collaborate with you to translate your vision into a detailed blueprint, ensuring every curve and detail is perfected before production.",
//         image: "/productPhotos/horse.png"
//     },
//     { 
//         title: "Material Selection",
//         description: "We source only the finest metals, leathers, and polymers. The material is the soul of the emblem, chosen for its durability, texture, and character.",
//         image: "/productPhotos/mainstay.jpg"
//     },
//     { 
//         title: "Precision Crafting",
//         description: "Using state-of-the-art machinery and artisanal techniques, our craftsmen meticulously forge, stamp, and mold each piece. This is where your design comes to life.",
//         image: "/productPhotos/drilldownwhite.jpeg"
//     },
//     { 
//         title: "Finishing & Quality",
//         description: "The final touches are applied – polishing, plating, and coloring. Every single item undergoes a rigorous quality check to ensure it meets our exacting standards of excellence.",
//         image: "/image2.jpg"
//     },
// ];

// // ✨ Enhanced: Data for our Toy Showcase Section with better organization
// const toysData = [
//     {
//         name: "Bandit the Cat",
//         description: "A sly and silent friend, always ready for a secret mission.",
//         image: "/toys/cat.jpg",
//         bgColor: "from-rose-400 via-pink-500 to-rose-600",
//         accentColor: "rose"
//     },
//     {
//         name: "Hoppy the Rabbit",
//         description: "A simple, elegant silhouette to spark imagination.",
//         image: "/toys/rabbit.jpg",
//         bgColor: "from-emerald-400 via-green-500 to-teal-600",
//         accentColor: "emerald"
//     },
//     {
//         name: "Zola the Zebra",
//         description: "Hand-stitched with bold stripes and a playful spirit.",
//         image: "/toys/zebra.jpg",
//         bgColor: "from-sky-400 via-blue-500 to-indigo-600",
//         accentColor: "sky"
//     },
//     {
//         name: "Fin the Fish",
//         description: "Made for splashing fun, this fishy friend floats on water.",
//         image: "/toys/fish.jpg",
//         bgColor: "from-cyan-400 via-blue-500 to-blue-700",
//         accentColor: "cyan"
//     },
//     {
//         name: "The Little Monster",
//         description: "A quirky creature with rope arms, perfect for tug-of-war.",
//         image: "/toys/monster.jpg",
//         bgColor: "from-slate-600 via-gray-700 to-slate-800",
//         accentColor: "slate"
//     },
//     {
//         name: "Lola the Llama",
//         description: "Ready for adventure with a soft saddle and a friendly face.",
//         image: "/toys/llama.jpg",
//         bgColor: "from-amber-500 via-orange-600 to-red-600",
//         accentColor: "amber"
//     },
//     {
//         name: "Barnaby the Bear",
//         description: "A cuddly companion with knotted rope legs for endless fun.",
//         image: "/toys/bear.jpg",
//         bgColor: "from-amber-700 via-yellow-800 to-orange-900",
//         accentColor: "amber"
//     },
//     {
//         name: "Rocky the Raccoon",
//         description: "A mischievous mask and clever paws make this a fan favorite.",
//         image: "/toys/raccoon.jpg",
//         bgColor: "from-orange-800 via-amber-900 to-yellow-900",
//         accentColor: "orange"
//     },
// ];

// // --- Main Page Component ---
// export default function Page() {
//     const heroRef = useRef(null);
//     const craftsmanshipRef = useRef(null);
//     const toysRef = useRef(null);

//     // Smooth Scrolling with Lenis
//     useEffect(() => {
//         const lenis = new Lenis({
//             duration: 1.2,
//             easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
//         });
        
//         function raf(time) {
//             lenis.raf(time);
//             requestAnimationFrame(raf);
//         }
//         requestAnimationFrame(raf);

//         return () => {
//             lenis.destroy();
//         };
//     }, []);

//     // Enhanced GSAP Animations
//     useEffect(() => {
//         let ctx = gsap.context(() => {
//             // Animate the main heading text with improved timing
//             gsap.from(".char", {
//                 yPercent: 130,
//                 stagger: 0.03,
//                 ease: "back.out(1.7)",
//                 duration: 0.8,
//                 delay: 0.3
//             });
            
//             // Craftsmanship Section - Enhanced Pinned Animation
//             const steps = gsap.utils.toArray('.step-panel');
//             if (steps.length > 0) {
//                 gsap.to(steps, {
//                     xPercent: -100 * (steps.length - 1),
//                     ease: "none",
//                     scrollTrigger: {
//                         trigger: craftsmanshipRef.current,
//                         pin: true,
//                         scrub: 0.5,
//                         snap: {
//                             snapTo: 1 / (steps.length - 1),
//                             duration: 0.5,
//                             delay: 0.1
//                         },
//                         end: () => "+=" + (craftsmanshipRef.current?.offsetWidth || 0) * 2
//                     }
//                 });
//             }

//             // ✨ Enhanced Toys Section - Better Animation Control
//             const toyPanels = gsap.utils.toArray('.toy-panel');
//             if (toyPanels.length > 0) {
//                 const toysAnimation = gsap.to(toyPanels, {
//                     xPercent: -100 * (toyPanels.length - 1),
//                     ease: "none",
//                     scrollTrigger: {
//                         trigger: toysRef.current,
//                         pin: true,
//                         scrub: 0.8,
//                         anticipatePin: 1,
//                         end: () => "+=" + (toysRef.current?.offsetWidth || 0) * 3
//                     }
//                 });

//                 // Enhanced parallax effects for each toy panel
//                 toyPanels.forEach((panel, index) => {
//                     const toyCard = panel.querySelector('.toy-card');
//                     const toyText = panel.querySelector('.toy-text');
//                     const toyBg = panel.querySelector('.toy-bg');

//                     if (toyCard && toyText && toyBg) {
//                         // Background parallax
//                         gsap.to(toyBg, {
//                             scale: 1.1,
//                             rotation: index % 2 === 0 ? 2 : -2,
//                             ease: "none",
//                             scrollTrigger: {
//                                 trigger: panel,
//                                 containerAnimation: toysAnimation,
//                                 start: "left right",
//                                 end: "right left",
//                                 scrub: true
//                             }
//                         });

//                         // Toy card animation with improved motion
//                         gsap.to(toyCard, {
//                             yPercent: -15,
//                             scale: 1.02,
//                             rotation: index % 2 === 0 ? 1 : -1,
//                             ease: "none",
//                             scrollTrigger: {
//                                 trigger: panel,
//                                 containerAnimation: toysAnimation,
//                                 start: "left right",
//                                 end: "right left",
//                                 scrub: true
//                             }
//                         });

//                         // Text animation
//                         gsap.to(toyText, {
//                             yPercent: 10,
//                             ease: "none",
//                             scrollTrigger: {
//                                 trigger: panel,
//                                 containerAnimation: toysAnimation,
//                                 start: "left right",
//                                 end: "right left",
//                                 scrub: true
//                             }
//                         });
//                     }
//                 });
//             }

//         });
//         return () => ctx.revert();
//     }, []);

//     // Enhanced Framer Motion Parallax for Hero Background
//     const { scrollYProgress } = useScroll({
//         target: heroRef,
//         offset: ['start start', 'end start'],
//     });
//     const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
//     const textY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

//     return (
//         <div className="bg-zinc-900 text-neutral-100 font-sans antialiased">
//             {/* Enhanced Global Styles */}
//             <style jsx global>{`
//                 @keyframes breathe {
//                     0%, 100% { transform: scale(1) rotate(0deg); }
//                     50% { transform: scale(1.03) rotate(0.5deg); }
//                 }
//                 @keyframes float {
//                     0%, 100% { transform: translateY(0px) rotate(0deg); }
//                     50% { transform: translateY(-10px) rotate(1deg); }
//                 }
//                 @keyframes infinite-scroll {
//                     from { transform: translateX(0); }
//                     to { transform: translateX(-100%); }
//                 }
//                 .animate-breathe {
//                     animation: breathe 4s ease-in-out infinite;
//                 }
//                 .animate-float {
//                     animation: float 6s ease-in-out infinite;
//                 }
//                 .animate-infinite-scroll {
//                     animation: infinite-scroll 25s linear infinite;
//                 }
                
//                 /* Custom scrollbar */
//                 ::-webkit-scrollbar {
//                     width: 8px;
//                     height: 8px;
//                 }
//                 ::-webkit-scrollbar-track {
//                     background: #18181b;
//                 }
//                 ::-webkit-scrollbar-thumb {
//                     background: #f59e0b;
//                     border-radius: 4px;
//                 }
//                 ::-webkit-scrollbar-thumb:hover {
//                     background: #d97706;
//                 }
//             `}</style>

//             {/* ===== Enhanced Hero Section ===== */}
//             <section ref={heroRef} className="relative h-screen flex items-center justify-center text-center overflow-hidden">
//                 <motion.div
//                     className="absolute inset-0 z-0"
//                     style={{ y: backgroundY }}
//                 >
//                     <Image
//                         src="/productPhotos/mainstay.jpg"
//                         alt="Craftsmanship background"
//                         fill
//                         className="object-cover brightness-40 contrast-110"
//                         priority
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-zinc-900/20"></div>
//                 </motion.div>
                
//                 <motion.div className="relative z-10 p-4 max-w-6xl mx-auto" style={{ y: textY }}>
//                     <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase tracking-wider leading-tight">
//                         {"Forge Your Identity".split("").map((char, i) => (
//                            <span key={i} className="inline-block overflow-hidden">
//                                <span className="char inline-block">
//                                    {char === " " ? "\u00A0" : char}
//                                </span>
//                            </span>
//                         ))}
//                     </h1>
//                     <motion.p 
//                         initial={{ opacity: 0, y: 30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 1, delay: 1.2 }}
//                         className="font-body text-lg md:text-xl lg:text-2xl mt-6 max-w-3xl mx-auto text-neutral-200 leading-relaxed"
//                     >
//                         Custom Metal, Leather, and Rubber Emblems Crafted with Precision and Passion.
//                     </motion.p>
//                     <Link href="/product">
//                         <motion.button
//                             initial={{ opacity: 0, y: 30 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 1, delay: 1.5 }}
//                             whileHover={{ 
//                                 scale: 1.05, 
//                                 boxShadow: "0px 10px 30px rgba(245, 158, 11, 0.4)",
//                                 y: -2
//                             }}
//                             whileTap={{ scale: 0.95 }}
//                             className="mt-10 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-900 font-bold font-body py-4 px-10 rounded-lg uppercase tracking-wide inline-flex items-center gap-3 shadow-xl hover:shadow-amber-500/20 transition-all duration-300"
//                         >
//                             Explore Collection <ArrowRight size={22} />
//                         </motion.button>
//                     </Link>
//                 </motion.div>
//             </section>

//             {/* ===== Enhanced Client Logos Marquee Section ===== */}
//             <section className="py-20 bg-zinc-950 border-y border-zinc-800 overflow-hidden">
//                 <div className="w-full inline-flex flex-nowrap [mask-image:_linear-gradient(to_right,transparent_0,_black_10%,_black_90%,transparent_100%)]">
//                     <ul className="flex items-center justify-center md:justify-start [&_li]:mx-12 animate-infinite-scroll">
//                         {[...clientLogos, ...clientLogos].map((logo, i) => (
//                            <li key={i} className="flex-shrink-0">
//                                <Image 
//                                    src={logo.src} 
//                                    alt={logo.alt} 
//                                    width={180} 
//                                    height={60} 
//                                    className="grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110 filter brightness-0 invert opacity-60 hover:opacity-100" 
//                                />
//                            </li> 
//                         ))}
//                     </ul>
//                 </div>
//             </section>

//             {/* ===== Enhanced Categories Section ===== */}
//             <section className="w-full max-w-7xl mx-auto p-8 my-32">
//                 <motion.div
//                     initial={{ opacity: 0, y: 50 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.8, ease: "easeOut" }}
//                     viewport={{ once: true, amount: 0.3 }}
//                     className="text-center mb-20"
//                 >
//                     <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-6">
//                         Engineered for Excellence
//                     </h2>
//                     <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
//                         Discover our specialized craftsmanship across multiple disciplines
//                     </p>
//                 </motion.div>
                
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//                     {categoriesData.map((item, i) => (
//                         <motion.div
//                             key={item.href}
//                             initial={{ opacity: 0, y: 60, scale: 0.9 }}
//                             whileInView={{ opacity: 1, y: 0, scale: 1 }}
//                             transition={{ 
//                                 duration: 0.7, 
//                                 delay: i * 0.1, 
//                                 ease: [0.25, 0.46, 0.45, 0.94]
//                             }}
//                             viewport={{ once: true, amount: 0.3 }}
//                             whileHover={{ y: -10, transition: { duration: 0.3 } }}
//                         >
//                             <Link href={item.href} className="block group relative overflow-hidden rounded-xl shadow-2xl">
//                                 <div className="relative w-full h-[500px]">
//                                     <Image
//                                         src={item.src}
//                                         alt={item.title}
//                                         fill
//                                         className="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
//                                     />
//                                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:from-black/70 transition-all duration-700"></div>
//                                 </div>
//                                 <div className="absolute bottom-0 left-0 p-8 w-full">
//                                     <h3 className="font-body text-xl font-semibold uppercase tracking-wider text-white mb-3 transition-transform duration-500 ease-out group-hover:-translate-y-2">{item.title}</h3>
//                                     <div className="flex items-center gap-3 text-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
//                                         <span className="font-medium">View Products</span>
//                                         <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
//                                     </div>
//                                 </div>
//                             </Link>
//                         </motion.div>
//                     ))}
//                 </div>
//             </section>
            
//             {/* ✨ Optimized Full-Height Toys Showcase Section ✨ */}
//             <section ref={toysRef} className="relative h-screen bg-zinc-900 overflow-hidden">
//                 {/* Compact Fixed Header */}
//                 <div className="absolute top-0 left-0 w-full p-6 z-30 bg-gradient-to-b from-zinc-900/95 to-transparent">
//                     <div className="text-center max-w-4xl mx-auto">
//                         <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold uppercase mb-2">
//                             Where Imagination Comes to Play
//                         </h2>
//                         <p className="text-base md:text-lg text-neutral-400">Scroll horizontally to meet our handcrafted friends</p>
//                     </div>
//                 </div>
                
//                 {/* Full Height Toys Container */}
//                 <div 
//                     className="flex flex-nowrap h-full"
//                     style={{ width: `${toysData.length * 100}vw` }}
//                 >
//                     {toysData.map((toy, index) => (
//                         <div 
//                             key={index} 
//                             className="toy-panel w-screen h-full flex items-center justify-center relative"
//                         >
//                             {/* Enhanced Background with Pattern */}
//                             <div className={`toy-bg absolute inset-0 bg-gradient-to-br ${toy.bgColor} opacity-95`}>
//                                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
//                                 <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
//                             </div>
                            
//                             {/* Full Height Content Container */}
//                             <div className="relative z-10 w-full h-full flex items-center justify-center px-4 sm:px-8 py-20">
//                                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full max-w-7xl mx-auto h-full max-h-[80vh]">
                                    
//                                     {/* Toy Image Container - Maximized Height */}
//                                     <div className="toy-card flex justify-center items-center order-2 lg:order-1 h-full">
//                                         <div className="relative w-full h-full max-w-2xl max-h-[600px] flex items-center justify-center">
//                                             {/* Decorative background circle */}
//                                             <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl animate-pulse scale-75"></div>
                                            
//                                             {/* Main image container - Full available space */}
//                                             <div className="relative w-full h-full animate-float">
//                                                 <Image 
//                                                     src={toy.image} 
//                                                     alt={toy.name} 
//                                                     fill 
//                                                     className="object-contain drop-shadow-2xl"
//                                                     sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 40vw"
//                                                     priority={index < 3}
//                                                 />
//                                             </div>
                                            
//                                             {/* Floating decorative elements */}
//                                             <div className="absolute top-4 right-4 w-6 h-6 bg-white/30 rounded-full animate-ping"></div>
//                                             <div className="absolute bottom-4 left-4 w-4 h-4 bg-white/20 rounded-full animate-bounce"></div>
//                                             <div className="absolute top-1/3 left-0 w-3 h-3 bg-white/25 rounded-full animate-pulse"></div>
//                                             <div className="absolute bottom-1/3 right-0 w-5 h-5 bg-white/15 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
//                                         </div>
//                                     </div>
                                    
//                                     {/* Text Content - Optimized vertical space */}
//                                     <div className="toy-text text-center lg:text-left order-1 lg:order-2 space-y-4 lg:space-y-6 flex flex-col justify-center h-full">
//                                         <div>
//                                             <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold uppercase tracking-wider text-white/90 mb-3">
//                                                 Toy #{index + 1}
//                                             </div>
//                                             <h3 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold text-white drop-shadow-lg leading-tight">
//                                                 {toy.name}
//                                             </h3>
//                                         </div>
                                        
//                                         <p className="text-white/90 font-body text-base sm:text-lg lg:text-xl max-w-md mx-auto lg:mx-0 leading-relaxed">
//                                             {toy.description}
//                                         </p>
                                        
//                                         <div className="pt-2">
//                                             <Link href="/product/toys">
//                                                 <motion.button
//                                                     whileHover={{ 
//                                                         scale: 1.05, 
//                                                         boxShadow: "0px 15px 35px rgba(0,0,0,0.3)",
//                                                         y: -2
//                                                     }}
//                                                     whileTap={{ scale: 0.95 }}
//                                                     className="bg-white text-zinc-900 font-bold font-body py-3 px-6 lg:px-8 rounded-full uppercase tracking-wide inline-flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 text-sm lg:text-base"
//                                                 >
//                                                     Meet {toy.name.split(' ')[0]} <ArrowRight size={18} />
//                                                 </motion.button>
//                                             </Link>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
                            
//                             {/* Progress indicator - Better positioned */}
//                             <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
//                                 {toysData.map((_, i) => (
//                                     <div 
//                                         key={i} 
//                                         className={`h-1.5 rounded-full transition-all duration-300 ${
//                                             i === index ? 'bg-white w-8' : 'bg-white/50 w-1.5'
//                                         }`}
//                                     />
//                                 ))}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </section>

//             {/* ===== Optimized Full-Height Craftsmanship Process Section ===== */}
//             <section ref={craftsmanshipRef} className="relative h-screen bg-zinc-950 overflow-hidden">
//                 {/* Compact Header */}
//                 <div className="absolute top-0 left-0 w-full p-6 z-20 bg-gradient-to-b from-zinc-950/95 to-transparent">
//                     <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold uppercase text-center">
//                         The Art of Creation
//                     </h2>
//                     <p className="text-center text-neutral-400 text-base mt-2">Our meticulous process from concept to completion</p>
//                 </div>
                
//                 {/* Full Height Content Container */}
//                 <div 
//                     className="flex flex-nowrap h-full"
//                     style={{ width: `${craftsmanshipSteps.length * 100}vw` }}
//                 >
//                     {craftsmanshipSteps.map((step, index) => (
//                         <div key={index} className="step-panel w-screen h-full flex items-center justify-center relative">
//                             {/* Background Pattern */}
//                             <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(245,158,11,0.05)_0%,transparent_50%)] opacity-50"></div>
                            
//                             {/* Content - Full Height Usage */}
//                             <div className="w-full h-full flex items-center justify-center px-4 sm:px-8 py-20">
//                                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-7xl mx-auto w-full h-full max-h-[80vh]">
                                    
//                                     {/* Image Container - Maximized */}
//                                     <div className={`relative w-full h-full max-h-[600px] rounded-2xl overflow-hidden shadow-2xl ${index % 2 === 0 ? 'order-1' : 'order-2'}`}>
//                                         <Image 
//                                             src={step.image} 
//                                             alt={step.title} 
//                                             fill 
//                                             className="object-cover hover:scale-105 transition-transform duration-700"
//                                             sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 45vw"
//                                         />
//                                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
                                        
//                                         {/* Step number overlay */}
//                                         <div className="absolute top-6 left-6 w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center">
//                                             <span className="text-zinc-900 font-bold text-xl">{index + 1}</span>
//                                         </div>
//                                     </div>
                                    
//                                     {/* Text Content - Optimized spacing */}
//                                     <div className={`space-y-4 lg:space-y-6 flex flex-col justify-center h-full ${index % 2 === 0 ? 'order-2' : 'order-1'}`}>
//                                         <div>
//                                             <span className="inline-block px-3 py-1 bg-amber-500 text-zinc-900 font-bold rounded-full text-xs uppercase tracking-wider mb-4">
//                                                 Step {index + 1} of {craftsmanshipSteps.length}
//                                             </span>
//                                             <h3 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white leading-tight">
//                                                 {step.title}
//                                             </h3>
//                                         </div>
                                        
//                                         <p className="text-neutral-300 font-body text-base lg:text-lg leading-relaxed">
//                                             {step.description}
//                                         </p>
                                        
//                                         {/* Enhanced Progress Visualization */}
//                                         <div className="space-y-2">
//                                             <div className="flex justify-between text-sm text-neutral-400">
//                                                 <span>Progress</span>
//                                                 <span>{Math.round(((index + 1) / craftsmanshipSteps.length) * 100)}% Complete</span>
//                                             </div>
//                                             <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
//                                                 <div 
//                                                     className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full transition-all duration-1000 shadow-lg"
//                                                     style={{ width: `${((index + 1) / craftsmanshipSteps.length) * 100}%` }}
//                                                 ></div>
//                                             </div>
//                                         </div>
                                        
//                                         {/* Process indicators */}
//                                         <div className="flex space-x-2 pt-2">
//                                             {craftsmanshipSteps.map((_, i) => (
//                                                 <div 
//                                                     key={i} 
//                                                     className={`h-1.5 rounded-full transition-all duration-300 ${
//                                                         i <= index ? 'bg-amber-500 w-8' : 'bg-zinc-700 w-1.5'
//                                                     }`}
//                                                 />
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </section>
//         </div>
//     );
// }

// // app/page.tsx
"use client";

import { useEffect, useRef } from 'react';
import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import ParticleCanvas from '@/components/FireParticles';
// import RevealingText from '@/components/RevealingText';
import FireParticles from '@/components/FireParticles';
// import ScrambledText from '@/components/ScrambledText';
// import Lenis from '@studio-freight/lenis';

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

const projectsData = [
  { name: "Opulento", image: "/productPhotos/rider.png" },
  { name: "Torecelli", image: "/productPhotos/berunni3.png" },
  { name: "Platinum", image: "/productPhotos/horse.png" },
  { name: "Opla", image: "/productPhotos/logos.jpg" },
  { name: "Trecip", image: "/productPhotos/drilldown.jpeg" },
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
    // useEffect(() => {
    //     const lenis = new Lenis();
    //     function raf(time) {
    //         lenis.raf(time);
    //         requestAnimationFrame(raf);
    //     }
    //     requestAnimationFrame(raf);
    // }, []);

        // ✨ Add these new refs
    const projectsSectionRef = useRef(null);
    const imagePreviewRef = useRef(null);

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

    // GSAP Animations
useEffect(() => {
    let ctx = gsap.context(() => {
        // ... (your existing GSAP animations for .char and craftsmanship)

        // ✨ --- START: NEW ANIMATION LOGIC FOR IMAGE HOVER --- ✨
        
        // Select all the project items and the image preview elements
        const projects = gsap.utils.toArray('.project-item');
        const imagePreview = imagePreviewRef.current;
        const imagePreviewImg = imagePreview.querySelector('img');

        // Create a "quickTo" function for smooth mouse following
        // This is more performant than using gsap.to() in a mousemove event
        const xTo = gsap.quickTo(imagePreview, "x", { duration: 0.6, ease: "power3" });
        const yTo = gsap.quickTo(imagePreview, "y", { duration: 0.6, ease: "power3" });
        
        // 1. Animate the image position to follow the mouse
        const moveImage = (e) => {
            const { clientX, clientY } = e;
            // We subtract half the image's width/height to center it on the cursor
            xTo(clientX - imagePreview.offsetWidth / 2);
            yTo(clientY - imagePreview.offsetHeight / 2);
        };
        projectsSectionRef.current.addEventListener("mousemove", moveImage);

        // 2. Animate the image visibility on hover
        projects.forEach(project => {
            // On mouse enter
            project.addEventListener("mouseenter", (e) => {
                // Update the image source
                const newImage = e.currentTarget.getAttribute('data-image');
                if (newImage) {
                    imagePreviewImg.src = newImage;
                }
                
                // Animate the image in
                gsap.to(imagePreview, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            // On mouse leave
            project.addEventListener("mouseleave", () => {
                // Animate the image out
                gsap.to(imagePreview, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.3,
                    ease: "power2.in"
                });
            });
        });
        
        // ✨ --- END: NEW ANIMATION LOGIC --- ✨
    }, projectsSectionRef); // Scope the context to the new section for better performance

    return () => ctx.revert(); // Cleanup
}, []); // Empty dependency array ensures this runs only once

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
                {/* <ParticleCanvas /> */}
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

             {/* ===== Forging Ideas Section ===== */}
            <section className="relative w-full min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center overflow-hidden my-24">
                {/* The particle canvas serves as the background */}
                <FireParticles />

                {/* The text content sits on top of the canvas */}
                <div className="relative z-10 p-8 max-w-4xl mx-auto">
                    
                    {/* ✅ REPLACE ScrambledText WITH RevealingText */}
                    <motion.p 
                        initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }} 
                        viewport={{ once: true }}
                        className="font-body text-5xl tracking-wide md:text-xl mt-6 max-w-2xl mx-auto text-white"
                    >
                        Forging Digital Realities
                    </motion.p>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }} // Shortened delay to sync with new text animation
                        viewport={{ once: true }}
                        className="font-body text-lg md:text-xl mt-6 max-w-2xl mx-auto text-neutral-400"
                    >
                        From raw concepts to refined digital emblems, our process blends creative vision with technical precision. We build identities that are not only seen but felt, engineered to endure and inspire.
                    </motion.p>
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

            {/* Image on hover */}
            {/* ===== Image on hover Section ===== */}
            <section 
                ref={projectsSectionRef} // ✨ Add ref here
                className="w-full min-h-screen bg-zinc-950 flex items-center justify-center relative"
            >
                {/* This is the floating image container */}
                <div 
                    ref={imagePreviewRef} // ✨ Add ref here
                    className="w-80 h-96 rounded-lg overflow-hidden absolute pointer-events-none opacity-0 scale-0"
                >
                    <Image 
                        src="/productPhotos/rider.png" // Default src, will be changed by GSAP
                        alt="Project Preview" 
                        fill 
                        className="object-cover" 
                    />
                </div>

                <div className="mx-auto w-[50%] space-y-5">
                    {projectsData.map((project, index) => (
                        // Use React.Fragment to handle keys for multiple elements
                        <React.Fragment key={project.name}>
                            <div 
                                className="project-item text-8xl text-[#f2f2f2] flex gap-5 items-center cursor-pointer"
                                data-image={project.image} // ✨ Add data attribute
                            >
                                {project.name} <ArrowUpRight size={80} />
                            </div>
                            {/* Don't render a <hr> after the last item */}
                            {index < projectsData.length - 1 && <hr />} 
                        </React.Fragment>
                    ))}
                </div>
            </section>
        </div>
    );
}

