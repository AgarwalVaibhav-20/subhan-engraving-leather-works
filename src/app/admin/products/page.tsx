"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  Download,
  Star,
  Package,
  IndianRupee,
  TrendingUp,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

// Type definitions
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "low_stock" | "out_of_stock";
  image: string;
  description: string;
  sku: string;
  rating: number;
  sales: number;
}

interface FormData {
  name: string;
  category: string;
  price: string;
  stock: string;
  description: string;
  sku: string;
  image: string;
}

interface StatusOption {
  value: string;
  label: string;
}

type SortField = "name" | "price" | "stock" | "sales";
type SortOrder = "asc" | "desc";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Premium Wireless Headphones",
      category: "Electronics",
      price: 299.99,
      stock: 45,
      status: "active",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
      description: "High-quality wireless headphones with noise cancellation",
      sku: "WH-001",
      rating: 4.8,
      sales: 156,
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      category: "Wearables",
      price: 199.99,
      stock: 23,
      status: "active",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
      description: "Advanced fitness tracking with heart rate monitor",
      sku: "SW-002",
      rating: 4.6,
      sales: 89,
    },
    {
      id: 3,
      name: "Professional Camera Lens",
      category: "Photography",
      price: 899.99,
      stock: 12,
      status: "low_stock",
      image:
        "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=100&h=100&fit=crop",
      description: "85mm f/1.4 portrait lens for professional photography",
      sku: "CL-003",
      rating: 4.9,
      sales: 34,
    },
    {
      id: 4,
      name: "Gaming Mechanical Keyboard",
      category: "Gaming",
      price: 159.99,
      stock: 0,
      status: "out_of_stock",
      image:
        "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=100&h=100&fit=crop",
      description: "RGB backlit mechanical keyboard with blue switches",
      sku: "KB-004",
      rating: 4.7,
      sales: 78,
    },
    {
      id: 5,
      name: "Bluetooth Speaker",
      category: "Electronics",
      price: 79.99,
      stock: 35,
      status: "active",
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop",
      description: "Portable waterproof Bluetooth speaker",
      sku: "BS-005",
      rating: 4.5,
      sales: 120,
    },
    {
      id: 6,
      name: "Wireless Mouse",
      category: "Accessories",
      price: 49.99,
      stock: 8,
      status: "low_stock",
      image:
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop",
      description: "Ergonomic wireless mouse with precision tracking",
      sku: "WM-006",
      rating: 4.3,
      sales: 95,
    },
    {
      id: 7,
      name: "Laptop Stand",
      category: "Accessories",
      price: 89.99,
      stock: 18,
      status: "low_stock",
      image:
        "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=100&h=100&fit=crop",
      description: "Adjustable aluminum laptop stand",
      sku: "LS-007",
      rating: 4.4,
      sales: 67,
    },
    {
      id: 8,
      name: "USB-C Hub",
      category: "Electronics",
      price: 69.99,
      stock: 42,
      status: "active",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop",
      description: "7-in-1 USB-C hub with HDMI and charging",
      sku: "UH-008",
      rating: 4.6,
      sales: 103,
    },
    {
      id: 9,
      name: "Webcam HD",
      category: "Electronics",
      price: 129.99,
      stock: 0,
      status: "out_of_stock",
      image:
        "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=100&h=100&fit=crop",
      description: "1080p HD webcam with auto-focus",
      sku: "WC-009",
      rating: 4.2,
      sales: 85,
    },
    {
      id: 10,
      name: "Phone Case",
      category: "Accessories",
      price: 24.99,
      stock: 150,
      status: "active",
      image:
        "https://images.unsplash.com/photo-1601593346740-925612772716?w=100&h=100&fit=crop",
      description: "Protective phone case with wireless charging",
      sku: "PC-010",
      rating: 4.1,
      sales: 200,
    },
    {
      id: 11,
      name: "Monitor 4K",
      category: "Electronics",
      price: 599.99,
      stock: 15,
      status: "low_stock",
      image:
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=100&h=100&fit=crop",
      description: "27-inch 4K UHD monitor with HDR",
      sku: "MN-011",
      rating: 4.8,
      sales: 45,
    },
    {
      id: 12,
      name: "Gaming Chair",
      category: "Gaming",
      price: 299.99,
      stock: 12,
      status: "low_stock",
      image:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=100&h=100&fit=crop",
      description: "Ergonomic gaming chair with lumbar support",
      sku: "GC-012",
      rating: 4.7,
      sales: 38,
    },
  ]);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    sku: "",
    image: "",
  });

  const categories: string[] = [
    "Electronics",
    "Wearables",
    "Photography",
    "Gaming",
    "Accessories",
  ];
  const statuses: StatusOption[] = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "low_stock", label: "Low Stock" },
    { value: "out_of_stock", label: "Out of Stock" },
  ];

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "all" || product.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue: string | number = a[sortBy];
      let bValue: string | number = b[sortBy];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedStatus,
    sortBy,
    sortOrder,
  ]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number): void => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleAddProduct = (): void => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      sku: "",
      image: "",
    });
    setShowModal(true);
  };

  const handleEditProduct = (product: Product): void => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
      sku: product.sku,
      image: product.image,
    });
    setShowModal(true);
  };

  const handleDeleteProduct = (id: number): void => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  const handleSubmit = (): void => {
    const stockValue = parseInt(formData.stock);
    const productData: Omit<Product, "id"> = {
      ...formData,
      price: parseFloat(formData.price),
      stock: stockValue,
      rating: editingProduct?.rating || 0,
      sales: editingProduct?.sales || 0,
      status:
        stockValue === 0
          ? "out_of_stock"
          : stockValue < 20
            ? "low_stock"
            : "active",
    };

    if (editingProduct) {
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id
            ? { ...product, ...productData }
            : product
        )
      );
    } else {
      const newProduct: Product = {
        id: Date.now(),
        ...productData,
      };
      setProducts([...products, newProduct]);
    }

    setShowModal(false);
  };

  const getStatusColor = (status: Product["status"]): string => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "low_stock":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "out_of_stock":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusText = (status: Product["status"]): string => {
    switch (status) {
      case "active":
        return "Active";
      case "low_stock":
        return "Low Stock";
      case "out_of_stock":
        return "Out of Stock";
      default:
        return "Unknown";
    }
  };

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "active").length;
  const lowStockProducts = products.filter(
    (p) => p.status === "low_stock"
  ).length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  return (
    <main className="min-h-screen">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold ">Products Management</h1>
              <p className="text-gray-400 mt-1">
                Manage your product inventory and details
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="  border  rounded-xl p-6 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Products</p>
                  <p className="text-2xl font-bold ">{totalProducts}</p>
                </div>
                <Package className="text-blue-400" size={24} />
              </div>
            </div>
            <div className=" backdrop-blur-sm border  rounded-xl p-6  transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className=" text-sm">Active Products</p>
                  <p className="text-2xl font-bold text-green-400">
                    {activeProducts}
                  </p>
                </div>
                <TrendingUp className="text-green-400" size={24} />
              </div>
            </div>
            <div className="  rounded-xl p-6 border transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {lowStockProducts}
                  </p>
                </div>
                <AlertCircle className="text-yellow-400" size={24} />
              </div>
            </div>
            <div className=" border rounded-xl p-6  transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Value</p>
                  <p className="text-2xl font-bold ">
                    ₹{totalValue.toLocaleString()}
                  </p>
                </div>
                <IndianRupee className="text-purple-400" size={24} />
              </div>
            </div>
          </div>

          <div className=" border  rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3  border  rounded-lg "
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-lg focus:outline-none focus:ring-2 "
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 rounded-lg focus:outline-none "
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortField)}
                className="px-4 py-3 rounded-lg focus:outline-none "
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="stock">Sort by Stock</option>
                <option value="sales">Sort by Sales</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="px-4 py-3 rounded-lg focus:outline-none "
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>

              <div className="flex gap-2">
                <button className="flex-1  border px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Download size={18} />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className=" border  rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    Sales
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-800">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y border">
                {currentProducts.map((product) => (
                  <tr
                    key={product.id}
                    className=" hover:bg-gray-100 transition-colors"
                  >
                    <td className="px-2 py-4">
                      <div className="flex items-center gap-2 w-12 h-12">
                        <Image
                          src={product.image}
                          width={10}
                          height={10}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-600/50"
                        />
                        <div>
                          <p className="font-semibold ">
                            {product.name.slice(0, 10)}...
                          </p>
                          {/* <p className="text-sm">SKU: {product.sku}</p> */}
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <span className="font-semibold ">₹{product.price}</span>
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`font-semibold ${product.stock < 20 ? "text-yellow-400" : "text-black"}`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(product.status)}`}
                      >
                        {getStatusText(product.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star
                          className="text-yellow-400 fill-current"
                          size={16}
                        />
                        <span className="">{product.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="">{product.sales}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors border border-red-600/30"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto text-gray-500 mb-4" size={48} />
              <p className="text-gray-400 text-lg">No products found</p>
              <p className="text-gray-500 text-sm">
                Try adjusting your search or filters
              </p>
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) =>
                        handleItemsPerPageChange(Number(e.target.value))
                      }
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-gray-600">per page</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, filteredProducts.length)} of{" "}
                    {filteredProducts.length} products
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-3 py-1 text-sm border rounded-lg transition-colors ${
                            currentPage === pageNumber
                              ? "bg-blue-500 text-white border-blue-500"
                              : "text-gray-600 border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductsPage;
