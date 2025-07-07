"use client"

import Link from 'next/link';

const customers = [
  { id: '45457821547514th', name: 'Alice Sharma', email: 'alice@example.com' },
  { id: '2', name: 'Bob Yadav', email: 'bob@example.com' },
  { id: '3', name: 'Charlie Mehta', email: 'charlie@example.com' },
];

export default function CustomersTablePage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="text-center">
              <td className="border p-2">{customer.id}</td>
              <td className="border p-2">{customer.name}</td>
              <td className="border p-2">{customer.email}</td>
              <td className="border p-2">
                <Link
                  href={`/admin/customer/${customer.id}`}
                  className="text-blue-600 underline"
                >
                  View Profile
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
