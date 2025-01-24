import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { getCurrentuser, getJwtToken } from "../utils/common";
import toast, { Toaster } from "react-hot-toast";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  // const [salesData, setSalesData] = useState<any[]>([]);
  const inventoryChartRef = useRef<any>(null);
  const salesChartRef = useRef<any>(null);

  useEffect(() => {
    const currentUser = getCurrentuser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      toast.error("Please login to access this page");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  }, []);

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
        setInventoryData(inventoryResponse.data);

        // const salesResponse = await api.get("/sales", {
        //   headers: { Authorization: token },
        // });
        // setSalesData(salesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data. Please try again.");
      }
    };

    fetchData();
  }, []);

  // Chart data
  const inventoryChartData = {
    labels: inventoryData.map((item) => item.name),
    datasets: [
      {
        label: "Quantity",
        data: inventoryData.map((item) => item.quantity),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // const salesChartData = {
  //   labels: salesData.map((sale) => new Date(sale.date).toLocaleDateString()),
  //   datasets: [
  //     {
  //       label: "Sales",
  //       data: salesData.map((sale) => sale.total),
  //       backgroundColor: "rgba(54, 162, 235, 0.6)",
  //     },
  //   ],
  // };

  // Cleanup chart instances
  useEffect(() => {
    return () => {
      if (inventoryChartRef.current) {
        inventoryChartRef.current.destroy();
      }
      if (salesChartRef.current) {
        salesChartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-lg font-semibold">Smart Inventory</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/" className="text-gray-900 px-3 py-2 text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/inventory" className="text-gray-500 px-3 py-2 text-sm font-medium">
                  Inventory
                </Link>
                <Link to="/sales" className="text-gray-500 px-3 py-2 text-sm font-medium">
                  Sales
                </Link>
                <Link to="/reports" className="text-gray-500 px-3 py-2 text-sm font-medium">
                  Reports
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <span className="text-sm text-gray-500 mr-4">Welcome, {user?.username || "Guest"}</span>
              <button
                onClick={logout}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="bg-white shadow rounded-lg">
            <div className="p-5">
              <Bar
                ref={inventoryChartRef}
                data={inventoryChartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>
          <div className="bg-white shadow rounded-lg">
            {/* <div className="p-5">
              <Bar
                ref={salesChartRef}
                data={salesChartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div> */}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Dashboard;
