import type React from "react"
import { useState, useEffect } from "react"
import api from "../utils/api"

const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState<any[]>([])
  const [newItem, setNewItem] = useState({ name: "", category: "", quantity: 0, price: 0, threshold: 0 })

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      const response = await api.get("/inventories")
      setInventory(response.data)
    } catch (error) {
      console.error("Error fetching inventory:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post("/inventory", newItem)
      setNewItem({ name: "", category: "", quantity: 0, price: 0, threshold: 0 })
      fetchInventory()
    } catch (error) {
      console.error("Error adding new item:", error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Inventory Management</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Item</h3>
          <form onSubmit={handleSubmit} className="mt-5 sm:flex sm:items-center">
            <div className="w-full sm:max-w-xs">
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Item name"
                value={newItem.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="w-full sm:max-w-xs mt-3 sm:mt-0 sm:ml-3">
              <label htmlFor="category" className="sr-only">
                Category
              </label>
              <input
                type="text"
                name="category"
                id="category"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Category"
                value={newItem.category}
                onChange={handleInputChange}
                required
              />
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
                value={newItem.quantity}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="w-full sm:max-w-xs mt-3 sm:mt-0 sm:ml-3">
              <label htmlFor="price" className="sr-only">
                Price
              </label>
              <input
                type="number"
                name="price"
                id="price"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Price"
                value={newItem.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="w-full sm:max-w-xs mt-3 sm:mt-0 sm:ml-3">
              <label htmlFor="threshold" className="sr-only">
                Threshold
              </label>
              <input
                type="number"
                name="threshold"
                id="threshold"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Threshold"
                value={newItem.threshold}
                onChange={handleInputChange}
                required
              />
            </div>
            <button
              type="submit"
              className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Add Item
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
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
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
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Threshold
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.threshold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Inventory

