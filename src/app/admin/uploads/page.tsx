"use client"

import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, X, Image, IndianRupee, Tag, Percent, Save, Eye, CheckCircle2Icon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle } from '@/components/ui/alert';
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

  const [images, setImages] = useState<any[]>([null, null, null, null]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleClickAudio = () => {
    const audio = new Audio('/Alert.mp3');
    audio.play();
  };

  const handleInputChange = (field: string, value: string) => {
    setProductData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (index: number, file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImages = [...images];
        newImages[index] = {
          file,
          preview: e.target?.result,
          name: file.name
        };
        setImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDraggedIndex(index);
  };

  const handleDragLeave = () => {
    setDraggedIndex(null);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDraggedIndex(null);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(index, file);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const openFileDialog = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  const calculateDiscountedPrice = () => {
    const price = parseFloat(productData.price) || 0;
    const discount = parseFloat(productData.discount) || 0;
    return price - (price * discount / 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSuccess(false);

    try {
      const formData = new FormData();

      images.forEach((img) => {
        if (img?.file) {
          formData.append('images', img.file);
        }
      });

      formData.append('product', JSON.stringify(productData));

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      console.log(result);

      if (!res.ok) throw new Error('Upload failed');

      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (showSuccess) {
      handleClickAudio();
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const isFormValid = () => {
    return productData.title && productData.price && images.some(img => img !== null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
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
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
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
                        Image {index + 1}<br />Click or drag
                      </span>
                    </div>
                  )}
                </div>

                <input
                  ref={el => fileInputRefs.current[index] = el}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, e.target.files?.[0] as File)}
                  className="hidden"
                />
              </div>
            ))}
          </div>

          {/* Other product inputs */}
          <div className="mt-6">
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              value={productData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full border px-4 py-2 rounded"
            />

            <label className="block mt-4 mb-1 font-medium">Price</label>
            <input
              type="number"
              value={productData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className="w-full border px-4 py-2 rounded"
            />

            <label className="block mt-4 mb-1 font-medium">Discount</label>
            <input
              type="number"
              value={productData.discount}
              onChange={(e) => handleInputChange('discount', e.target.value)}
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button type="submit" disabled={!isFormValid() || isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Uploading...' : 'Save Product'}
            </Button>
          </div>
        </form>

        {showSuccess && (
          <div className='flex justify-center items-center mt-4'>
            <Alert>
              <CheckCircle2Icon className="h-5 w-5 text-green-600" />
              <AlertTitle>Success! Your Product has been Uploaded 🎉</AlertTitle>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductUploadPage;
