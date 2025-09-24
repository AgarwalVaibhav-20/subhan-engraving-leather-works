"use client";

import { useState } from "react";
import {
  Upload,
  X,
  Package,
  IndianRupee,
  Tag,
  Building,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const ProductUploadForm = () => {
  const [images, setImages] = useState<(File | null)[]>([null, null, null, null]);
  const [previewUrls, setPreviewUrls] = useState<(string | null)[]>([null, null, null, null]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    inStock: "",
    aboutTheItems:[],
    discountPrice:""
  });

  const [isLoading, setIsLoading] = useState(false);
const [fields, setFields] = useState<string[]>([""]);

  const handleAddField = () => setFields([...fields, ""]);
  const handleRemoveField = (index: number) =>
    setFields(fields.filter((_, i) => i !== index));
  const handleChange = (index: number, value: string) => {
    const updated = [...fields];
    updated[index] = value;
    setFields(updated);
  };
  const handleImageChange = (index: number, file: File | null) => {
    const newImages = [...images];
    const newPreviews = [...previewUrls];

    if (file) {
      newImages[index] = file;
      newPreviews[index] = URL.createObjectURL(file);
    } else {
      newImages[index] = null;
      if (newPreviews[index]) {
        URL.revokeObjectURL(newPreviews[index]!);
      }
      newPreviews[index] = null;
    }

    setImages(newImages);
    setPreviewUrls(newPreviews);
  };

  const removeImage = (index: number) => {
    handleImageChange(index, null);
  };

 const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  setFormData((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};


  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.price ||
      !formData.category ||
      !formData.brand ||
      !formData.inStock ||
      !formData.description ||
      !formData.aboutTheItems ||
      !formData.discountPrice ||
      fields.length === 0 || fields.some(field => !field.trim())
    ) {
      toast.error("Please fill all fields!");
      return;
    }

    setIsLoading(true);

    const payload = new FormData();

    images
      .filter((img) => img !== null)
      .forEach((img) => {
        payload.append("images", img!);
      });

    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });
// Before appending formData fields
fields.forEach((item) => {
  payload.append("aboutTheItems", item);
});

// Then append the rest of formData
Object.entries(formData).forEach(([key, value]) => {
  // avoid appending aboutTheItems again since it's already done
  if (key !== "aboutTheItems") {
    payload.append(key, value);
  }
});

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 sec delay
      const res = await axios.post("/api/upload", payload);

      if (res.data.success) {
        toast.success("Product uploaded successfully!");
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          brand: "",
          inStock: "",
          discountPrice:"",
          aboutTheItems:[]
        });
        setImages([null, null, null, null]);
        setPreviewUrls([null, null, null, null]);
      } else {
        toast.error("Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.error || "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-7xl w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold  mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
            Upload Product
          </h1>
          <p className="text-gray-300">Add your amazing products to the catalog</p>
        </div>

        <div className="rounded-2xl p-8 shadow-2xl border ">
          {/* Product Images */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 m-4">
  {[0, 1, 2, 3].map((index) => (
    <div
      key={index}
      className="relative group border-2 border-dashed rounded-xl aspect-square overflow-hidden transition-all duration-300 bg-white text-black flex items-center justify-center"
      onDragOver={(e) => {
        e.preventDefault();
        e.currentTarget.classList.add("border-purple-500");
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.currentTarget.classList.remove("border-purple-500");
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.currentTarget.classList.remove("border-purple-500");
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
          handleImageChange(index, file);
        }
      }}
    >
      {previewUrls[index] ? (
        <div className="relative h-full w-full">
          <img
            src={previewUrls[index]!}
            alt={`Preview ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => removeImage(index)}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center h-full cursor-pointer text-gray-400 hover:text-purple-400 transition-colors">
          <Upload size={24} className="mb-2" />
          <span className="text-xs text-center px-2">Click or Drag & Drop</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageChange(index, file);
            }}
            className="hidden"
          />
        </label>
      )}
    </div>
  ))}
</div>


          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium ">
                <Package className="mr-2" size={16} />
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
                className="w-full px-4 py-3  border rounded-lg   focus:outline-none   transition-all"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium ">
                <IndianRupee className="mr-2" size={16} />
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3  border 0 rounded-lg transition-all"
              />
            </div>
            {/* {discount} */}
                <div className="space-y-2">
              <label className="flex items-center text-sm font-medium ">
                <IndianRupee className="mr-2" size={16} />
                Discount
              </label>
              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleInputChange}
                placeholder="0.00"
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3  border 0 rounded-lg transition-all"
              />
            </div>
            {/* Category */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium ">
                <Tag className="mr-2" size={16} />
                Category
              </label>
              <select
                name="category"
                id="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-all"
              >
                <option value="">Select Category</option>
                <option value="Metal">Metal</option>
                <option value="Rubber">Rubber</option>
                <option value="Wood">Wood</option>
                <option value="Toys">Toys</option>
              </select>

            </div>

            {/* Brand */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium ">
                <Building className="mr-2" size={16} />
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="Enter brand name"
                required
                className="w-full px-4 py-3  border  rounded-lg  transition-all"
              />
            </div>

            {/* Stock Quantity */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium ">
                <Layers className="mr-2" size={16} />
                Stock Quantity
              </label>
              <input
                type="number"
                name="inStock"
                value={formData.inStock}
                onChange={handleInputChange}
                placeholder="Available quantity"
                required
                min="0"
                className="w-full px-4 py-3  border  rounded-lg transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 space-y-2">
            <label className="text-sm font-medium ">
              Product Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your product in detail..."
              required
              rows={4}
              className="w-full px-4 py-3 border rounded-lg  transition-all resize-none"
            />
          </div>
          {/* About the items */}
          <div className="mt-6 space-y-2">
            <label className="font-semibold text-gray-700">About This Item</label>
      {fields.map((value, index) => (
        <div key={index} className="flex gap-2 items-center">
          <input
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder={`Detail ${index + 1}`}
            className="w-full px-4 py-3 border rounded-lg  transition-all resize-none"
          />
          {fields.length > 1 && (
            <Button
              onClick={() => handleRemoveField(index)}
            >
              −
            </Button>
          )}
        </div>
      ))}
      <Button
        onClick={handleAddField}
        className=" font-medium"
      >
        + Add More
      </Button>
          </div>

          {/* Submit Button */}

          <div className="mt-8 flex justify-center">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-8 py-4 font-semibold rounded-xl shadow-lg transition-all duration-300 ${isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "hover:shadow-xl hover:-translate-y-0.5"
                }`}
            >
              {isLoading ? "Uploading..." : "Upload Product"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUploadForm;