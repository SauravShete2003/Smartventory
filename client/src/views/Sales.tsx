import type React from "react";
import { useState, useEffect } from "react";
import api from "../utils/api";

const Sales: React.FC = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [newSale, setNewSale] = useState({ itemId: "", quantity: 0 });
  const [inventory, setInventory] = useState<any[]>([]);

  const fetchSales = async () => {
    try {
      const response = await api.get("/sales");
      setSales(response.data);
      console.log(response.data);
      
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await api.get("/inventories");
      setInventory(response.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchInventory();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setNewSale({ ...newSale, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/sales", newSale);
      setNewSale({ itemId: "", quantity: 0 });
      fetchSales();
      fetchInventory();
    } catch (error) {
      console.error("Error adding new sale:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Sales Management
      </h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Record New Sale
          </h3>
          <form
            onSubmit={handleSubmit}
            className="mt-5 sm:flex sm:items-center"
          >
            <div className="w-full sm:max-w-xs">
              <label htmlFor="itemId" className="sr-only">
                Item
              </label>
              <select
                id="itemId"
                name="itemId"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
            <div className="w-full sm:max-w-xs mt-3 sm:mt-0 sm:ml-3">
              <label htmlFor="quantity" className="sr-only">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                id="quantity"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Quantity"
                value={newSale.quantity}
                onChange={handleInputChange}
                required
              />
            </div>
            <button
              type="submit"
              className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Record Sale
            </button>
          </form> 
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Item
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales.map((sale) => (
                    <tr key={sale._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(sale.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {sale.item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${sale.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
