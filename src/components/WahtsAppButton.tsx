'use client';

import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

type Props = {
  productName: string;
  productID: string; // or `slug` if you're using slugs
};

const WhatsappButton = ({ productName, productID }: Props) => {
  const phoneNumber = '918799071147';
  const productURL = `${process.env.NEXT_PUBLIC_BASE_URL}/product/${productID}`;

  const message = `Hello, I'm interested in your product "${productName}". Can you tell me more?\n\nView product: ${productURL}`;
  const encodedMessage = encodeURIComponent(message);

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodedMessage}`}
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
