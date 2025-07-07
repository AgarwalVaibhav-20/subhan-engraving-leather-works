'use client';

import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsappButton = () => {
  const phoneNumber = '918799071147';
  const message = "Hello , I want to know your product";
  const encode = encodeURIComponent(message)

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encode}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={24} />
    </a>
  );
};

export default WhatsappButton;
