import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { getJwtToken } from "../utils/common";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";

const Sales: React.FC = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [newSale, setNewSale] = useState({
    itemId: "",
    quantity: 0,
    phone: "",
    email: "",
    customer: { name: "" },
  });
  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = getJwtToken();
      if (!token) {
        toast.error("Authentication token not found!");
        return;
      }

      try {
        const inventoryResponse = await api.get("/inventories", {
          headers: { Authorization: token },
        });
        setInventory(inventoryResponse.data);

        const salesResponse = await api.get("/sales", {
          headers: { Authorization: token },
        });
        setSales(salesResponse.data.sales);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data. Please try again.");
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    // Handle nested object updates for customer name
    if (name === "customer.name") {
      setNewSale({
        ...newSale,
        customer: { ...newSale.customer, name: value },
      });
    } else {
      setNewSale({ ...newSale, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getJwtToken();
      if (!token) throw new Error("Authentication token is missing!");

      await api.post("/sales", newSale, {
        headers: { Authorization: token },
      });

      setNewSale({
        itemId: "",
        quantity: 0,
        phone: "",
        email: "",
        customer: { name: "" },
      });
      toast.success("Sale recorded successfully!");
      // Optionally refresh data after submission
      // fetchData();
    } catch (error: any) {
      console.error("Error adding new sale:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to record sale. Please try again."
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <Navbar />
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Sales Management
      </h1>

      {/* Form to record a new sale */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Record New Sale
          </h3>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Item Selection */}
            <div>
              <label htmlFor="itemId" className="block text-sm font-medium text-gray-700">
                Item
              </label>
              <select
                id="itemId"
                name="itemId"
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={newSale.itemId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select an item</option>
                {inventory.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                id="quantity"
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Quantity"
                value={newSale.quantity}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Customer Name */}
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                Customer Name
              </label>
              <input
                type="text"
                name="customer.name"
                id="customerName"
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Customer Name"
                value={newSale.customer.name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Customer Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Customer Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Customer Email"
                value={newSale.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Customer Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Customer Phone
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Customer Phone"
                value={newSale.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Record Sale
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Sales Data Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales.map((sale) => (
                    <tr key={sale._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(sale.saleDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {sale.item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{sale.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Sales;
