"use client"

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, MailIcon, PhoneIcon, ClockIcon, MessageSquareIcon } from 'lucide-react';

interface FAQItem {
    id: number;
    question: string;
    answer: string;
    category: string;
}

interface ContactMethod {
    icon: React.ReactNode;
    title: string;
    description: string;
    contact: string;
    hours?: string;
}

const HelpCenter: React.FC = () => {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const faqData: FAQItem[] = [
        {
            id: 1,
            question: "What materials do you use for metal logos?",
            answer: "We use high-quality materials including stainless steel, aluminum, brass, copper, and specialty alloys. All materials are corrosion-resistant and suitable for both indoor and outdoor applications. We can also work with custom materials upon request.",
            category: "products"
        },
        {
            id: 2,
            question: "How long does it take to produce a custom metal logo?",
            answer: "Standard production time is 7-10 business days after design approval. Rush orders (3-5 business days) are available for an additional fee. Complex designs or specialty finishes may require additional time.",
            category: "orders"
        },
        {
            id: 3,
            question: "What file formats do you accept for custom designs?",
            answer: "We accept AI, EPS, PDF, SVG, PNG, and JPG files. For best results, vector formats (AI, EPS, PDF, SVG) are preferred. If you only have a low-resolution image, our design team can help recreate it as a vector for optimal results.",
            category: "design"
        },
        {
            id: 4,
            question: "Do you offer installation services?",
            answer: "Yes, we provide professional installation services in most major metropolitan areas. We also provide detailed installation instructions and mounting hardware for DIY installation. Contact us for availability in your area.",
            category: "installation"
        },
        {
            id: 5,
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy for standard products in original condition. Custom-made items are non-returnable unless there's a manufacturing defect. We stand behind our quality with a 1-year warranty against manufacturing defects.",
            category: "returns"
        },
        {
            id: 6,
            question: "Can you match specific colors or finishes?",
            answer: "Yes! We offer powder coating, anodizing, brushed finishes, and patina treatments. We can match Pantone colors or provide custom color matching services. Contact us with your specific requirements.",
            category: "products"
        },
        {
            id: 7,
            question: "What are your minimum order quantities?",
            answer: "We have no minimum order quantity for most standard products. For custom fabrication, there may be minimum quantities depending on complexity. Bulk discounts are available for orders over 10 pieces.",
            category: "orders"
        },
        {
            id: 8,
            question: "How do I track my order?",
            answer: "Once your order ships, you'll receive a tracking number via email. You can also check your order status by logging into your account or contacting our customer service team.",
            category: "orders"
        },
        {
            id: 9,
            question: "Do you ship internationally?",
            answer: "Yes, we ship worldwide. International shipping costs and delivery times vary by destination. All international customers are responsible for customs duties and taxes in their country.",
            category: "shipping"
        },
        {
            id: 10,
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards, PayPal, bank transfers, and for business customers, we offer net 30 payment terms with approved credit application.",
            category: "payment"
        }
    ];

    const contactMethods: ContactMethod[] = [
        {
            icon: <MailIcon className="w-6 h-6" />,
            title: "Email Support",
            description: "Get detailed help via email",
            contact: "subhanleatherworks@gmail.com",
            hours: "Response within 24 hours"
        },
        {
            icon: <PhoneIcon className="w-6 h-6" />,
            title: "Phone Support",
            description: "Speak directly with our team",
            contact: "+917607267749",
            hours: "Mon-Sat 9AM - 6PM EST"
        },
        {
            icon: <MessageSquareIcon className="w-6 h-6" />,
            title: "Live Chat",
            description: "Instant help for quick questions",
            contact: "Available on WhatsApp",
            hours: "Mon-Fri 9AM-6PM EST"
        }
    ];

    const categories = [
        { id: 'all', name: 'All Topics' },
        { id: 'products', name: 'Products & Materials' },
        { id: 'orders', name: 'Orders & Pricing' },
        { id: 'design', name: 'Design & Customization' },
        { id: 'shipping', name: 'Shipping' },
        { id: 'installation', name: 'Installation' },
        { id: 'returns', name: 'Returns & Warranty' },
        { id: 'payment', name: 'Payment' }
    ];

    const filteredFAQs = selectedCategory === 'all'
        ? faqData
        : faqData.filter(faq => faq.category === selectedCategory);

    const toggleFAQ = (id: number) => {
        setOpenFAQ(openFAQ === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-[#000814] text-white">
                <div className="max-w-6xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl font-bold mb-4">Help Center</h1>
                    <p className="text-xl text-gray-300">Find answers to common questions about our metal logo products and services</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Quick Links */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ClockIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Order Status</h3>
                        <p className="text-gray-600 mb-4">Track your order and get delivery updates</p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Track Order
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquareIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Design Consultation</h3>
                        <p className="text-gray-600 mb-4">Get expert help with your custom design</p>

                        <button
                            onClick={() => {
                                const phoneNumber = "917607267749";
                                const message = encodeURIComponent("Hello! I need help with my design.");
                                window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
                        >
                            Start Chat
                        </button>
                    </div>


                    <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MailIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Returns & Warranty</h3>
                        <p className="text-gray-600 mb-4">Information about returns and our warranty</p>
                        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                            Learn More
                        </button>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-12">
                    <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

                    {/* Category Filter */}
                    <div className="mb-8">
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Items */}
                    <div className="space-y-4">
                        {filteredFAQs.map((faq) => (
                            <div key={faq.id} className="border border-gray-200 rounded-lg">
                                <button
                                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                                    onClick={() => toggleFAQ(faq.id)}
                                >
                                    <span className="font-medium text-gray-900">{faq.question}</span>
                                    {openFAQ === faq.id ? (
                                        <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                                    )}
                                </button>
                                {openFAQ === faq.id && (
                                    <div className="px-6 pb-4">
                                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Section */}
          <div className="grid md:grid-cols-3 gap-6">
  {contactMethods.map((method, index) => (
    <div
      key={index}
      className="text-center p-6 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
    >
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <div className="text-gray-600">
          {method.icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
      <p className="text-gray-600 mb-2">{method.description}</p>

      {/* Clickable contact */}
      {method.title === "Email Support" && (
        <a
          href={`mailto:${method.contact}`}
          className="font-medium  hover:underline"
        >
          {method.contact}
        </a>
      )}
      {method.title === "Phone Support" && (
        <a
          href={`tel:${method.contact}`}
          className="font-medium  hover:underline"
        >
          {method.contact}
        </a>
      )}
      {method.title === "Live Chat" && (
        <a
          href={`https://wa.me/917607267749?text=${encodeURIComponent(
            "Hello! I need help with my order."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium  hover:underline"
        >
          {method.contact}
        </a>
      )}

      {method.hours && (
        <p className="text-sm text-gray-500 mt-1">{method.hours}</p>
      )}
    </div>
  ))}
</div>
            </div>
        </div>
    );
};

export default HelpCenter;