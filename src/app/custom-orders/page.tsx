"use client"
import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Star, Upload, Check, AlertCircle, CreditCard, Truck } from 'lucide-react';

const MetalLogoOrderPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customization, setCustomization] = useState({
    text: '',
    font: 'Arial',
    size: 'medium',
    finish: 'polished',
    mounting: 'wall-mount'
  });
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [orderStep, setOrderStep] = useState('browse'); // browse, customize, cart, checkout, success
  const [uploadedLogo, setUploadedLogo] = useState(null);

  const products = [
    {
      id: 1,
      name: 'Brushed Steel Logo',
      basePrice: 89.99,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjYzBjMGMwIiByeD0iMTAiLz4KPHN2ZyB4PSI1MCIgeT0iNDAiIHdpZHRoPSIxMDAiIGhlaWdodD0iNzAiPgo8dGV4dCB4PSI1MCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxPR088L3RleHQ+Cjwvc3ZnPgo8L3N2Zz4=',
      description: 'Premium brushed steel finish with modern appeal',
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: 'Brass Vintage Logo',
      basePrice: 129.99,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjYjg4NjBiIiByeD0iMTAiLz4KPHN2ZyB4PSI1MCIgeT0iNDAiIHdpZHRoPSIxMDAiIGhlaWdodD0iNzAiPgo8dGV4dCB4PSI1MCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiM0NDQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxPR088L3RleHQ+Cjwvc3ZnPgo8L3N2Zz4=',
      description: 'Classic brass finish with vintage elegance',
      rating: 4.9,
      reviews: 89
    },
    {
      id: 3,
      name: 'Aluminum Modern Logo',
      basePrice: 69.99,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjZTZlNmU2IiByeD0iMTAiLz4KPHN2ZyB4PSI1MCIgeT0iNDAiIHdpZHRoPSIxMDAiIGhlaWdodD0iNzAiPgo8dGV4dCB4PSI1MCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMiIgZm9udC13ZWlnaHQ9Im5vcm1hbCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TE9HTzwvdGV4dD4KPC9zdmc+Cjwvc3ZnPg==',
      description: 'Lightweight aluminum with sleek modern design',
      rating: 4.7,
      reviews: 156
    }
  ];

  const sizeMultipliers = {
    small: 1,
    medium: 1.3,
    large: 1.8,
    xlarge: 2.5
  };

  const finishPrices = {
    polished: 0,
    brushed: 15,
    matte: 12,
    antique: 25
  };

  const mountingPrices = {
    'wall-mount': 0,
    'standoff': 20,
    'floating': 35,
    'backlit': 60
  };

  const calculatePrice = () => {
    if (!selectedProduct) return 0;
    const basePrice = selectedProduct.basePrice;
    const sizeMultiplier = sizeMultipliers[customization.size];
    const finishPrice = finishPrices[customization.finish];
    const mountingPrice = mountingPrices[customization.mounting];
    
    return ((basePrice * sizeMultiplier) + finishPrice + mountingPrice) * quantity;
  };

  const addToCart = () => {
    const cartItem = {
      id: Date.now(),
      product: selectedProduct,
      customization: { ...customization },
      quantity,
      price: calculatePrice(),
      uploadedLogo
    };
    setCart([...cart, cartItem]);
    setShowCart(true);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedLogo({
          name: file.name,
          url: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const processOrder = () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.address) {
      alert('Please fill in all required fields');
      return;
    }
    setOrderStep('success');
  };

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">
          ${product.basePrice}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600">{product.rating} ({product.reviews})</span>
          </div>
          <button
            onClick={() => {
              setSelectedProduct(product);
              setOrderStep('customize');
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
          >
            Customize
          </button>
        </div>
      </div>
    </div>
  );

  if (orderStep === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-4">Thank you for your order. We'll send you a confirmation email shortly.</p>
          <p className="text-sm text-gray-500 mb-6">Order Total: ${getTotalPrice().toFixed(2)}</p>
          <button
            onClick={() => {
              setOrderStep('browse');
              setCart([]);
              setSelectedProduct(null);
              setCustomerInfo({
                name: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                zipCode: ''
              });
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
          >
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">MetalCraft Logos</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Steps */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            {['browse', 'customize', 'cart', 'checkout'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  orderStep === step ? 'bg-blue-600 text-white' : 
                  ['browse', 'customize', 'cart', 'checkout'].indexOf(orderStep) > index ? 'bg-green-600 text-white' : 
                  'bg-gray-300 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <span className="ml-2 text-sm font-medium capitalize">{step}</span>
                {index < 3 && <div className="w-8 h-px bg-gray-300 ml-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        {showCart && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCart(false)} />
            <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold">Shopping Cart</h2>
                  <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-700">×</button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-center">Your cart is empty</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="border-b pb-4 mb-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.product.name}</h3>
                            <p className="text-sm text-gray-600">Size: {item.customization.size}</p>
                            <p className="text-sm text-gray-600">Finish: {item.customization.finish}</p>
                            <p className="text-sm text-gray-600">Mounting: {item.customization.mounting}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${item.price.toFixed(2)}</p>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-600 text-sm hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {cart.length > 0 && (
                  <div className="border-t p-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Total: ${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowCart(false);
                        setOrderStep('checkout');
                      }}
                      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors duration-200"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {orderStep === 'browse' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Choose Your Metal Logo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {orderStep === 'customize' && selectedProduct && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Customize Your {selectedProduct.name}</h2>
              
              {/* Logo Upload */}
              <div className="bg-white rounded-lg p-6 shadow-md mb-6">
                <h3 className="text-lg font-semibold mb-4">Upload Your Logo</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-4">Upload your logo file (SVG, PNG, JPG)</p>
                  <input
                    type="file"
                    accept=".svg,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                  >
                    Choose File
                  </label>
                  {uploadedLogo && (
                    <div className="mt-4 p-2 bg-green-100 rounded">
                      <p className="text-green-800 text-sm">✓ {uploadedLogo.name} uploaded</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Text Input */}
              <div className="bg-white rounded-lg p-6 shadow-md mb-6">
                <h3 className="text-lg font-semibold mb-4">Custom Text</h3>
                <input
                  type="text"
                  placeholder="Enter your text"
                  value={customization.text}
                  onChange={(e) => setCustomization({...customization, text: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Customization Options */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-4">Customization Options</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                    <select
                      value={customization.size}
                      onChange={(e) => setCustomization({...customization, size: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="small">Small (6" x 4")</option>
                      <option value="medium">Medium (8" x 6")</option>
                      <option value="large">Large (12" x 8")</option>
                      <option value="xlarge">Extra Large (16" x 12")</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Finish (+${finishPrices[customization.finish]})</label>
                    <select
                      value={customization.finish}
                      onChange={(e) => setCustomization({...customization, finish: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="polished">Polished</option>
                      <option value="brushed">Brushed (+$15)</option>
                      <option value="matte">Matte (+$12)</option>
                      <option value="antique">Antique (+$25)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mounting (+${mountingPrices[customization.mounting]})</label>
                    <select
                      value={customization.mounting}
                      onChange={(e) => setCustomization({...customization, mounting: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="wall-mount">Wall Mount</option>
                      <option value="standoff">Standoff Mount (+$20)</option>
                      <option value="floating">Floating Mount (+$35)</option>
                      <option value="backlit">Backlit Mount (+$60)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg p-6 shadow-md sticky top-8">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>${selectedProduct.basePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size Multiplier:</span>
                    <span>x{sizeMultipliers[customization.size]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Finish:</span>
                    <span>+${finishPrices[customization.finish]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mounting:</span>
                    <span>+${mountingPrices[customization.mounting]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>x{quantity}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>${calculatePrice().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={addToCart}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => setOrderStep('browse')}
                    className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  >
                    Back to Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {orderStep === 'checkout' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={customerInfo.city}
                  onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Address *"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                  className="md:col-span-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={customerInfo.zipCode}
                  onChange={(e) => setCustomerInfo({...customerInfo, zipCode: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-600">{item.customization.size} • {item.customization.finish} • Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold">${item.price.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 text-lg font-bold">
                <span>Total:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                  <CreditCard className="w-5 h-5 text-gray-600 mr-3" />
                  <span>Credit/Debit Card</span>
                </div>
                <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                  <Truck className="w-5 h-5 text-gray-600 mr-3" />
                  <span>Cash on Delivery</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setOrderStep('cart')}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Back to Cart
              </button>
              <button
                onClick={processOrder}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetalLogoOrderPage;