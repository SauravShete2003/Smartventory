import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import api from "../utils/api";
import { getJwtToken } from "../utils/common";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";

// Type definitions
interface InventoryItem {
  _id: string;
  name: string;
}

interface Sale {
  _id: string;
  saleDate: string;
  item: { name: string };
  quantity: number;
  total: number;
}

interface NewSale {
  itemId: string;
  quantity: number;
}

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [newSale, setNewSale] = useState<NewSale>({
    itemId: "",
    quantity: 0,
  });
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // Reusable function for API fetching
  const fetchData = async () => {
    const token = getJwtToken();
    if (!token) {
      toast.error("Authentication token not found!");
      return;
    }

    try {
      // Fetch inventory
      const inventoryResponse = await api.get<InventoryItem[]>("/inventories", {
        headers: { Authorization: token },
      });
      setInventory(inventoryResponse.data);

      // Fetch sales
      const salesResponse = await api.get<{ sales: Sale[] }>("/sales", {
        headers: { Authorization: token },
      });
      setSales(salesResponse.data.sales);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error(error.response?.data?.message || "Failed to fetch data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewSale({ ...newSale, [name]: name === "quantity" ? parseInt(value, 10) || 0 : value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const token = getJwtToken();
    if (!token) {
      toast.error("Authentication token is missing!");
      return;
    }

    try {
      await api.post("/sales", newSale, {
        headers: { Authorization: token },
      });

      setNewSale({
        itemId: "",
        quantity: 0,
      });
      toast.success("Sale recorded successfully!");
      fetchData(); // Refresh data after successful submission
    } catch (error: any) {
      console.error("Error adding new sale:", error);
      toast.error(
        error.response?.data?.message || "Failed to record sale. Please try again."
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
                  {sales.length > 0 ? (
                    sales.map((sale) => (
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        No sales data available.
                      </td>
                    </tr>
                  )}
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