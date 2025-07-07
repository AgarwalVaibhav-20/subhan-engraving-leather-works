"use client";
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

const data = [
  { month: "Jan", sales: 100, orders: 240 },
  { month: "Feb", sales: 300, orders: 121 },
  { month: "Mar", sales: 200, orders: 229 },
  { month: "Apr", sales: 478, orders: 200 },
  { month: "May", sales: 589, orders: 218 },
  { month: "Jun", sales: 639, orders: 250 },
  { month: "Jul", sales: 749, orders: 300 },
  { month: "Aug", sales: 900, orders: 400 },
  { month: "Sep", sales: 720, orders: 980 },
  { month: "Oct", sales: 390, orders: 310 },
  { month: "Nov", sales: 310, orders: 260 },
  { month: "Dec", sales: 480, orders: 330 },
];

export default function MonthlySalesChart() {
  return (
    <div className="w-full space-y-6 p-2 ">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl md:text-2xl">
            Monthly  Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[300px] h-[300px] sm:h-[350px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#2b2c28"
                  name="Orders Received"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl md:text-2xl">
            Monthly Products Sales
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[300px] h-[300px] sm:h-[350px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#4361ee"
                  name="Products Sold"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
