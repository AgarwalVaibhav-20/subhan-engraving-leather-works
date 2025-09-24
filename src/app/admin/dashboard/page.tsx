"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  Bell,
  Search,
  Download,
  EllipsisVertical,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Page = () => {
  const [customers, setCustomers] = useState([
    
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
      {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
      {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
      {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
      {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
      {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
      {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
      {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
      {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Krystal Beer",
      email: "Evangeline30@gmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Mr. Tanya Runolfsdottir",
      email: "Casper_Rippin@hotmail.com",
      date: "Jan 6, 2022",
      status: "Paid",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    },
    {
      name: "Gloria Bechtelar",
      email: "Reba95@hotmail.com",
      date: "Jan 5, 2022",
      status: "Refunded",
      purchase: "Monthly subscription",
      avatar: "https://randomuser.me/api/portraits/women/52.jpg",
    },
    // Add more if needed for testing
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredCustomers.length / (itemsPerPage === -1 ? filteredCustomers.length : itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers =
    itemsPerPage === -1
      ? filteredCustomers
      : filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (indexToRemove: number) => {
    const updated = customers.filter((_, i) => i !== indexToRemove);
    setCustomers(updated);
  };

  const handleEdit = (name: string) => {
    alert(`Edit functionality for: ${name}`);
  };

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isOpenDate, setIsOpenDate] = useState(false);

  const toggleDateButtton = () => {
    setIsOpenDate((prev) => !prev);
  };

  const name = "Subhan";

  const generatePreviousMonthData = () => {
    const today = new Date();
    const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const year = prevMonthDate.getFullYear();
    const month = prevMonthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const data = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      data.push({
        date: date.toISOString().split("T")[0],
        transactions: Math.floor(Math.random() * 200) + 50,
      });
    }

    return data;
  };

  const transactionData = generatePreviousMonthData();

  return (
    <main className="bg-white h-screen w-full p-4 sm:p-6 md:p-8 overflow-x-hidden   space-y-4">
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 max-md:flex-row">
          <div className="headings flex flex-col">
            <h4 className="font-semibold text-2xl">Welcome Back, {name}.</h4>
            <h4 className="font-extralight">Welcome to the Dashboard</h4>
          </div>

          <div className="flex items-center space-x-4 max-sm:items-end">
            <div className="p-3 border rounded-full">
              <Bell size={20} />
            </div>
            <div className="flex items-center space-x-3 max-sm:hidden">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p>{name}</p>
                <p className="text-sm text-gray-400">Admin</p>
              </div>
            </div>
          </div>
        </header>

        <div className="searchbar flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center border rounded-2xl px-3 py-2 w-full sm:w-[250px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search here .... "
              className="outline-none border-none w-full bg-transparent"
            />
            <Search size={18} />
          </div>

          <div className="flex items-center flex-wrap gap-4">
            <div className="relative">
              <Button
                onClick={toggleDateButtton}
                className="bg-white text-black hover:text-black hover:bg-gray-200"
              >
                <CalendarIcon size={14} className="mr-2" />
                Date
              </Button>
              {isOpenDate && (
                <div className="absolute right-0 z-10 mt-2 bg-white p-2 rounded-lg border shadow-md">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md"
                    captionLayout="dropdown"
                  />
                </div>
              )}
            </div>

            <Button className="cursor-pointer flex items-center gap-2">
              <Download size={14} />
              Export
            </Button>
          </div>
        </div>

        <section className="flex flex-wrap justify-center items-stretch gap-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="border rounded-2xl p-5 flex flex-col justify-between items-start w-full sm:w-[48%] md:w-[32%]"
            >
              <h3 className="text-[17px]">Total Revenue</h3>
              <div className="pt-3 flex justify-between w-full items-center">
                <h1 className="text-3xl font-semibold">₹ 25,000</h1>
                <p className="bg-green-200 text-green-800 px-2 py-1 rounded-[8px] text-sm">
                  +12%
                </p>
              </div>
              <p className="text-[14px] text-gray-400 mt-4">
                From Jan 01, 2024 - Mar 26, 2024
              </p>
            </div>
          ))}
        </section>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl md:text-2xl">
            Daily Transaction Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[300px] h-[300px] sm:h-[350px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={transactionData}
                margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) =>
                    new Date(date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })
                  }
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(label) =>
                    `Date: ${new Date(label).toLocaleDateString("en-IN")}`
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="transactions"
                  stroke="#42113c"
                  name="Transactions"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="p-3">
        <div className="px-3 py-1 flex items-center justify-between w-full">
          <h1>Customer Details</h1>
          <button className="cursor-pointer">
            <EllipsisVertical />
          </button>
        </div>

        <Card className="p-4 overflow-x-auto">
          <div className="flex justify-between items-center mb-3 gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-3 py-2 rounded-md w-full max-w-sm"
            />
            <div className="flex items-center space-x-2">
              <label htmlFor="pageSize" className="text-sm text-gray-600">
                Rows per page:
              </label>
              <select
                id="pageSize"
                value={itemsPerPage}
                onChange={(e) => {
                  const val = e.target.value === "All" ? -1 : parseInt(e.target.value);
                  setItemsPerPage(val);
                  setCurrentPage(1);
                }}
                className="border px-2 py-1 rounded-md text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value="All">All</option>
              </select>
            </div>
          </div>

          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3">Invoice</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Purchase</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-3 font-medium">{`S${(startIndex + index + 1)
                      .toString()
                      .padStart(5, "0")}`}</td>
                    <td className="p-3 flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={item.avatar} />
                        <AvatarFallback>{item.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.email}</p>
                      </div>
                    </td>
                    <td className="p-3">{item.date}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3">{item.purchase}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleEdit(item.name)}
                        className="text-purple-600 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No matching customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {itemsPerPage !== -1 && totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    size="sm"
                    variant={page === currentPage ? "default" : "outline"}
                  >
                    {page}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </Card>
      </Card>
    </main>
  );
};

export default Page;
