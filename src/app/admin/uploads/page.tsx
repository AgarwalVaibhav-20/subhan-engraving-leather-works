"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Image, IndianRupee, Tag, Percent, Save, Eye ,  AlertCircleIcon, CheckCircle2Icon, PopcornIcon  } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Alert,
  AlertTitle,
} from "@/components/ui/alert"
import { Card } from '@/components/ui/card';

const ProductUploadPage = () => {
  const [productData, setProductData] = useState({
    title: '',
    price: '',
    discount: '',
    description: '',
    category: '',
    brand: ''
  });
  
  const [images, setImages] = useState([null, null, null, null]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRefs = useRef([]);

  {/*For audio */}

  const handleClickAudio=()=>{
    const audio = new Audio('/Alert.mp3');
    audio.play()
  }
  const handleInputChange = (field, value) => {
    setProductData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (index, file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImages = [...images];
        newImages[index] = {
          file,
          preview: e.target.result,
          name: file.name
        };
        setImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDraggedIndex(index);
  };

  const handleDragLeave = () => {
    setDraggedIndex(null);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    setDraggedIndex(null);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(index, file);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const openFileDialog = (index) => {
    fileInputRefs.current[index]?.click();
  };

  const calculateDiscountedPrice = () => {
    const price = parseFloat(productData.price) || 0;
    const discount = parseFloat(productData.discount) || 0;
    return price - (price * discount / 100);
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSuccess(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
      setShowSuccess(true);
    
  };
 useEffect(() => {
  
  if (showSuccess) {
    handleClickAudio()
    const timer = setTimeout(() => setShowSuccess(false), 3000);
    return () => clearTimeout(timer);
  }
}, [showSuccess]);
  const isFormValid = () => {
    return productData.title && 
           productData.price && 
           images.some(img => img !== null);
  };

  if (previewMode) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto p-5" >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Product Preview</h1>
            <Button
              onClick={() => setPreviewMode(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Edit
            </Button>
          </div>
          
          <Card className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Images */}
              <div>
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  {images.find(img => img !== null) ? (
                    <img 
                      src={images.find(img => img !== null).preview} 
                      alt={productData.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="aspect-square bg-gray-100 rounded overflow-hidden">
                      {img ? (
                        <img src={img.preview} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-6 h-6 text-gray-300" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Product Details */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{productData.title || 'Product Title'}</h2>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl font-semibold ">
                  ₹{calculateDiscountedPrice().toFixed(2)}
                  </span>
                  {productData.discount && (
                    <>
                     
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                        -{productData.discount}% OFF
                      </span>

                       <span className="text-xs text-gray-500 line-through">
                       M.R.P:   ₹{productData.price}
                      </span>
                    </>
                  )}
                </div>
                
                {productData.brand && (
                  <p className="text-gray-600 mb-2">Brand: <span className="font-medium">{productData.brand}</span></p>
                )}
                
                {productData.category && (
                  <p className="text-gray-600 mb-4">Category: <span className="font-medium">{productData.category}</span></p>
                )}
                
                {productData.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">About the Item</h3>
                    <p className="text-gray-700">{productData.description}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
          <p className="text-gray-600">Upload product images and add details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Product Images Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Images (Upload 4 images)</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <div
                    className={`aspect-square border-2 border-dashed rounded-lg overflow-hidden transition-colors ${
                      draggedIndex === index 
                        ? 'border-blue-500 bg-blue-50' 
                        : image 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    {image ? (
                      <>
                        <img 
                          src={image.preview} 
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div 
                        className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                        onClick={() => openFileDialog(index)}
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500 text-center">
                          Image {index + 1}
                          <br />
                          Click or drag
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <input
                    ref={el => fileInputRefs.current[index] = el}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, e.target.files[0])}
                    className="hidden"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Details</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={productData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border  rounded-lg "
                    placeholder="Enter product title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={productData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border  rounded-lg "
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount (%)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={productData.discount}
                      onChange={(e) => handleInputChange('discount', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border  rounded-lg "
                      placeholder="0"
                    />
                  </div>
                  {productData.price && productData.discount && (
                    <p className="text-sm text-green-600 mt-1">
                      Final Price: ₹{calculateDiscountedPrice().toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={productData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    className="w-full px-3 py-2 border  rounded-lg "
                    placeholder="Enter brand name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <select
                      value={productData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border  rounded-lg "
                    >
                      <option value="">Select category</option>
                      <option value="electronics">Electronics</option>
                      <option value="clothing">Clothing</option>
                      <option value="home">Home & Garden</option>
                      <option value="sports">Sports</option>
                      <option value="books">Books</option>
                      <option value="toys">Toys</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About the Item
                  </label>
                  <textarea
                    value={productData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2   rounded-lg border  outline-none"
                    placeholder="Enter product description"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <Button
              type="button"
              onClick={() => setPreviewMode(true)}
              className="flex items-center space-x-2 cursor-pointer bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              <Eye className="w-5 h-5" />
              <span>Preview</span>
            </Button>
            
            <Button 
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className="flex cursor-pointer items-center space-x-2 bg-[#4361ee] text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? 'Uploading...' : 'Save Product'}</span>
            </Button>
          </div>
        </form>
         {showSuccess && (
          <div className='flex justify-center items-center '>
            <div className='absolute top-2'> 
              <Alert>
          <CheckCircle2Icon className="h-5 w-5 text-green-600" />
          <AlertTitle>Success! Your Product are Uploaded 😁</AlertTitle>
        </Alert>
        </div>
       
        </div>
      )}
      </div>
    </div>
  );
};

export default ProductUploadPage;