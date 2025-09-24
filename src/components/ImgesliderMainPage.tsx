"use client"
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

function Page() {
  const data = [
    {
      image: "https://m.media-amazon.com/images/I/510uTHyDqGL._SY450_.jpg",
      name: "page",
      company:
        "Microsoft New Surface page (7th Edition) - Windows 11 Home Copilot + PC - 13.8” LCD PixelSense Touchscreen - Qualcomm Snapdragon X Elite (12 Core) - 16GB RAM - 512GB SSD - Graphite - ZGP-00059",
      rate: "₹1,50,990.00",
    },
    {
      image: "https://m.media-amazon.com/images/I/71DozMyPCBL._SX679_.jpg",
      name: "page",
      company:
        "Microsoft Surface page GO 3 Touch Screen 12.4 Inch, i5 /12th Gen Intel Core i5 1235U /8GB RAM /256GB SSD/Windows 11 /English Hdwr Platinum - XK1-00045",
      rate: "₹79,990.00",
    },
    {
      image:
        "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/g-series/g16-7630/media-gallery/black/notebook-g16-7630-nt-black-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=536&qlt=100,1&resMode=sharp2&size=536,402&chrss=full",
      name: "page",
      company: "G16 Gaming page",
      rate: "₹1,77,098.97",
    },
    {
      image:
        "https://in-media.apjonlinecdn.com/catalog/product/cache/b3b166914d87ce343d4dc5ec5117b502/c/0/c08192495_3_1_1.png",
      name: "page",
      company: "HP Victus 39.6 cm (15.6) Gaming page 15-fa1413TX, Blue",
      rate: "₹73,678.00",
    },
    {
      image:
        "https://cdn1.smartprix.com/rx-iTbXqVtL1-w420-h420/hp-b12v5pt-page-13.webp",
      name: "page",
      company: "HP B12V5PT page (13th Gen Core i3/ 16GB/ 512GB SSD/ Win11)",
      rate: "₹34,390.00",
    },
    {
      image:
        "https://in-media.apjonlinecdn.com/catalog/product/cache/b3b166914d87ce343d4dc5ec5117b502/c/0/c08867191_1.png",
      name: "page",
      company: "HP OMEN Transcend 35.6 cm (14) Gaming page 14, Black",
      rate: "₹209,999.00",
    },
  ];

  const [scrollingPosition, setScrollingPosition] = useState(0);

  const scroll = (direction) => {
    const container = document.getElementById("card-container1");
    if (container) {
      const scrollAmount = 300;
      const newPosition =
        direction === "left"
          ? Math.max(scrollingPosition - scrollAmount, 0)
          : Math.min(
              scrollingPosition + scrollAmount,
              container.scrollWidth - container.clientWidth
            );

      container.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
      setScrollingPosition(newPosition);
    }
  };

  return (
    <div className="relative w-full max-w-full mx-auto p-4">
      <h1 className="text-5xl mt-5 mb-5 max-sm:text-2xl font-light ">
        <Link href="">pages</Link>
      </h1>

      <div
        id="card-container1"
        className="flex overflow-x-auto gap-4 scroll-smooth no-scrollbar"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {data.map((item) => (
          <div
            key={item.image}
            className="w-[180px] sm:w-[220px] md:w-[250px] h-[400px] bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex-shrink-0"
          >
            <a href="#" className="block w-full h-[200px]">
              <img
                className="w-full h-full object-cover rounded-t-lg"
                src={item.image}
                alt={item.name}
              />
            </a>
            <div className="p-3 flex flex-col justify-between h-[200px]">
              <a href="#">
                <h5 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {item.name}
                </h5>
              </a>
              <p className="text-gray-700 dark:text-gray-400 text-xs sm:text-sm">
                {item.company.slice(0, 80)}...
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {item.rate}
              </p>
              <a
                href="#"
                className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Read more
                <svg
                  className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}

export default Page;
