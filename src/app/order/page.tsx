"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios"; // Step 1: Import axios
import { Truck, Shield, Check, Minus, Plus, X, ArrowLeft, Phone, Mail, MapPin, CreditCard, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/UserContext";

export default function OrderPage() {
  const router = useRouter();
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "IN",
    phone: "",
    contactTime: "",
    specialInstructions: "",
    paymentMethod: "Cash",
    saveInfo: false,
    newsletter: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  

  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
    if (user?.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses[0];
      setFormData(prev => ({
        ...prev,
        address: defaultAddr.street || "",
        apartment: defaultAddr.apartment || "",
        city: defaultAddr.city || "",
        state: defaultAddr.state || "",
        zipCode: defaultAddr.zipcode || "",
        country: defaultAddr.country || "IN",
      }));
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.zipCode) newErrors.zipCode = "ZIP code is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const applyPromoCode = () => {
    const validCodes: Record<string, number> = {
      "SAVE10": 10,
      "WELCOME20": 20,
      "FREESHIP": 15
    };

    if (validCodes[promoCode.toUpperCase()]) {
      setDiscount(validCodes[promoCode.toUpperCase()]);
      setPromoApplied(true);
    } else {
      alert("Invalid promo code");
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const discountAmount = (subtotal * discount) / 100;
  const tax = (subtotal - discountAmount) * 0.08;
  const total = subtotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill in all required fields correctly");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!user) {
      alert("Please login to place an order");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    
    // --- New Validation Logic ---
    // Helper function to check for a valid 24-character hex string
    const isValidObjectId = (id: string | undefined) => id && /^[0-9a-fA-F]{24}$/.test(id);

    const currentUserId = user._id 
    if (!isValidObjectId(currentUserId)) {
        alert(`❌ Error: Invalid user ID. Please log out and log back in.`);
        setIsSubmitting(false);
        return;
    }

    // for (const item of cart) {
    //     if (!isValidObjectId(item.id)) {
    //         alert(`❌ Error: An item in your cart ("${item.name}") has an invalid ID. Please remove it and add it to your cart again.`);
    //         setIsSubmitting(false);
    //         return;
    //     }
    // }
    // --- End of New Validation Logic ---

    const orderData = {
      userId: currentUserId, 
      items: cart.map(item => ({
        id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      address: {
        street: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        state: formData.state,
        zipcode: formData.zipCode,
        country: formData.country,
      },
      customerInfo: {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        contactTime: formData.contactTime,
        specialInstructions: formData.specialInstructions,
      },
      saveInfo: formData.saveInfo,
      paymentMethod: formData.paymentMethod,
      promoCode: promoApplied ? promoCode : null,
      discount: discountAmount,
      shipping: shipping,
      tax: tax,
      subtotal: subtotal,
      totalAmount: total,
    };

    try {
      const response = await axios.post("/api/order", orderData);

      if (response.status !== 201) {
        throw new Error(response.data.error || "Failed to create order");
      }

      const data = response.data;
      setOrderId(data.orderId);
      
      console.log("Order created successfully:", data);

      clearCart();
      
      setCurrentStep(3);

    } catch (error) {
      console.error("Order submission error:", error);
      const errorMessage = 
        axios.isAxiosError(error) && error.response 
        ? error.response.data.error 
        : "Something went wrong. Please try again.";
      
      alert(`❌ ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    if (!user) {
      alert("Please login to continue");
      router.push("/login");
      return;
    }
    setCurrentStep(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentStep > 1 && currentStep < 3 && (
                <button 
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
              {[
                { num: 1, label: "Cart" },
                { num: 2, label: "Details" },
                { num: 3, label: "Confirmation" }
              ].map((step, idx) => (
                <div key={step.num} className="flex items-center">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        currentStep >= step.num
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {currentStep > step.num ? <Check className="w-4 h-4" /> : step.num}
                    </div>
                    <span className="text-sm font-medium hidden lg:block">{step.label}</span>
                  </div>
                  {idx < 2 && <div className="w-12 h-0.5 bg-gray-200 mx-2"></div>}
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-600">{cart.length} items</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-2xl font-semibold mb-6">Shopping Cart</h2>

                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                    <button 
                      onClick={() => router.push("/products")}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 border-b pb-4 hover:bg-gray-50 p-4 rounded-lg transition-colors"
                      >
                        <img
                          src={item.images[0] || "/fallback.jpg"}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-blue-600 font-semibold mt-1">
                            ₹{item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            disabled={item.quantity <= 1}
                            className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-semibold text-lg">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors mt-2 flex items-center space-x-1"
                          >
                            <X className="w-4 h-4" />
                            <span className="text-sm">Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                
                {/* <div className="mb-4 p-4 bg-green-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      disabled={promoApplied}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                    <button
                      onClick={applyPromoCode}
                      disabled={promoApplied || !promoCode}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-green-600 text-sm mt-2 flex items-center">
                      <Check className="w-4 h-4 mr-1" />
                      Promo code applied!
                    </p>
                  )}
                </div> */}

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discount}%)</span>
                      <span className="font-medium">-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₹${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (free)</span>
                    <span className="font-medium">₹ 0.00</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-xl font-bold text-blue-600">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={proceedToCheckout}
                  disabled={cart.length === 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Proceed to Checkout
                </button>

                {subtotal < 100 && (
                  <p className="text-sm text-gray-600 mt-3 text-center">
                    Add ₹{(100 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Contact Information</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="your.email@example.com"
                      required
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="123 Main Street"
                      required
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apartment, suite, etc. (Optional)
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Apt 4B"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.zipCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="9876543210"
                      required
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Delivery Preferences</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Contact Time
                    </label>
                    <select
                      name="contactTime"
                      value={formData.contactTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select preferred time</option>
                      <option value="morning">Morning (9 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                      <option value="evening">Evening (5 PM - 8 PM)</option>
                      <option value="anytime">Anytime</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      name="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Any special delivery instructions..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash"
                      checked={formData.paymentMethod === "Cash"}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div className="ml-3 flex-1">
                      <span className="font-semibold">Cash</span>
                      <p className="text-sm text-gray-500">Pay when you receive your order</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={formData.paymentMethod === "bank"}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div className="ml-3 flex-1">
                      <span className="font-semibold">Bank Transfer</span>
                      <p className="text-sm text-gray-500">We'll provide bank details after order</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      Save my information for faster checkout next time
                    </span>
                  </label>

                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      Subscribe to newsletter for exclusive offers
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24 space-y-6">
                <h3 className="text-xl font-semibold">Order Summary</h3>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 pb-3 border-b">
                      <img
                        src={item.images[0] || "/fallback.jpg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-3 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discount}%)</span>
                      <span className="font-medium">-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₹${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (free)</span>
                    <span className="font-medium">₹ 0.00</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-xl font-bold text-blue-600">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Complete Order</span>
                    </>
                  )}
                </button>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4 text-green-600" />
                    <span>Fast delivery</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Order Placed Successfully!
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Thank you for your order. We'll contact you shortly to confirm the details.
              </p>

              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-lg mb-4">Order Details</h3>
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-bold text-blue-600">
                      {orderId || "Processing..."}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Total:</span>
                    <span className="font-bold text-xl text-blue-600">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">
                      {formData.paymentMethod === 'Cash' ? 'Cash on Delivery' : 'Online'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contact:</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-green-50 rounded-lg">
                  <Phone className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold">We'll Call You</p>
                  <p className="text-xs text-gray-600">Within minutes</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold">Order Prepared</p>
                  <p className="text-xs text-gray-600">Same/next day</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <Truck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold">Fast Delivery</p>
                  <p className="text-xs text-gray-600">To your doorstep</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push("/products")}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => router.push("/orders")}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  View My Orders
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-white border-t mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-blue-600" />
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-purple-600" />
              <span>Quality Guaranteed</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-orange-600" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

