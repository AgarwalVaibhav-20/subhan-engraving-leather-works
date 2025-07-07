"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

// Dummy customer orders data
const orders = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    payment: "Paid",
    orderImage: "/img.jpg",
    orderDetails: "Metal logo of car",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    payment: "Pending",
    orderImage: "/img.jpg",
    orderDetails: "Metal logo of car",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice@example.com",
    payment: "Paid",
    orderImage: "/img.jpg",
    orderDetails: "Metal logo of car",
  },
];

function Page() {
  return (
    <div className="p-4 w-full bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Total Orders: {orders.length}</h1>

      <div className="overflow-x-auto">
        <Table className="w-full text-white">
          <TableCaption className="text-white">
            Customer order and payment overview.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">User Details</TableHead>
              <TableHead className="text-white">Payment</TableHead>
              <TableHead className="text-right text-white">Order</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={index}>
                <TableCell className="text-white">{order.name}</TableCell>
                <TableCell className="text-white">
                  <div>
                    <div className="font-semibold">{order.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-white">
                  <span
                    className={`px-2 py-1 rounded-md text-sm ${
                      order.payment === "Paid"
                        ? "bg-green-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {order.payment}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Image
                      src={order.orderImage}
                      alt={`Image of ${order.orderDetails}`}
                      width={60}
                      height={40}
                      className="rounded-md"
                    />
                    <span className="text-sm text-muted-foreground text-right">
                      {order.orderDetails}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Page;
