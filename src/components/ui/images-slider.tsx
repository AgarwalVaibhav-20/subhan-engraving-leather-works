"use client"

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, ShoppingBag, Star } from 'lucide-react';

const ImagesSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [imageLoadError, setImageLoadError] = useState({});
  const intervalRef = useRef(null);

  // Sample ecommerce images with product data
  const slides = [
    {
      id: 1,
      image: "/productPhotos/berunni 1.png",
      title: "Premium Metal Logo",
      subtitle: "Discover luxury styles of Metal Logos",
      price: "₹299",
      originalPrice: "₹399",
      badge: "30% OFF",
      category: "Metal Logo"
    },
    {
      id: 2,
      image: "/productPhotos/ideal harness.png",
      title: "Smart Technology Hub",
      subtitle: "Experience the future of innovation",
      price: "₹899",
      originalPrice: "₹1,199",
      badge: "NEW",
      category: "Metal Logo"
    },
    {
      id: 3,
      image: "/productPhotos/horse.png",
      title: "Artisan Home Decor",
      subtitle: "Transform your space with handcrafted beauty",
      price: "₹149",
      originalPrice: "₹199",
      badge: "BESTSELLER",
      category: "Metal Logo"
    },
    {
      id: 4,
      image: "/productPhotos/rubber.jpg",
      title: "Athletic Performance Gear",
      subtitle: "Push your limits with professional equipment",
      price: "₹199",
      originalPrice: "₹249",
      badge: "LIMITED",
      category: "Rubber Logo"
    },
    {
      id: 5,
      image: "/productPhotos/mainstay.jpg",
      title: "Gourmet Culinary Collection",
      subtitle: "Elevate your cooking experience",
      price: "₹79",
      originalPrice: "₹99",
      badge: "CHEF'S CHOICE",
      category: "Kitchen"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex(currentIndex === slides.length - 1 ? 0 : currentIndex + 1);
  };

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? slides.length - 1 : currentIndex - 1);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleImageError = (slideId) => {
    setImageLoadError(prev => ({ ...prev, [slideId]: true }));
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'NEW': return 'bg-emerald-500';
      case '30% OFF': return 'bg-red-500';
      case 'BESTSELLER': return 'bg-orange-500';
      case 'LIMITED': return 'bg-purple-500';
      case "CHEF'S CHOICE": return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Main slider container */}
      <div className="relative w-full h-full">
        {/* Background images with parallax effect */}
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                index === currentIndex
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-100'
              }`}
            >
              {!imageLoadError[slide.id] ? (
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(slide.id)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                  <div className="text-white text-center">
                    <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-semibold">{slide.title}</p>
                  </div>
                </div>
              )}
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            </div>
          ))}
        </div>

        {/* Content overlay */}
        <div className="relative z-10 h-full flex items-center justify-start px-8 md:px-16">
          <div className="max-w-2xl text-white">
            <div
              key={currentIndex}
              className="animate-fade-in-up"
            >
              {/* Badge */}
              {/* <div className="mb-6">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-white ${getBadgeColor(slides[currentIndex].badge)} shadow-lg`}>
                  <Star className="w-4 h-4 mr-2" />
                  {slides[currentIndex].badge}
                </span>
              </div> */}

              {/* Category */}
              <p className="text-blue-400 font-semibold text-lg mb-4 uppercase tracking-wider">
                {slides[currentIndex].category}
              </p>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {slides[currentIndex].title}
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                {slides[currentIndex].subtitle}
              </p>

              {/* Price section */}
              <div className="flex items-center space-x-4 mb-8">
                <span className="text-4xl font-bold text-white">
                  {slides[currentIndex].price}
                </span>
                {slides[currentIndex].originalPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    {slides[currentIndex].originalPrice}
                  </span>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  Shop Now
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Play/Pause button */}
        <button
          onClick={togglePlayPause}
          className="absolute top-6 right-6 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white scale-125 shadow-lg'
                    : 'bg-white/50 hover:bg-white/75 hover:scale-110'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / slides.length) * 100}%`
            }}
          />
        </div>

        {/* Slide counter */}
        <div className="absolute top-6 left-6 z-20 text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
          <span className="font-bold">
            {currentIndex + 1} / {slides.length}
          </span>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ImagesSlider;