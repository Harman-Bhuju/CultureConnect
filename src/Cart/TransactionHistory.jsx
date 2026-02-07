// components/TransactionHistory.jsx
import React, { useMemo, useState } from "react";
import {
  CheckCircle2,
  Package,
  Hash,
  MapPin,
  Clock,
  ChevronDown,
  CreditCard,
} from "lucide-react";

import { BASE_URL } from "../Configs/ApiEndpoints";

const TransactionHistory = ({ completedOrders, loading, selectedPeriod }) => {
  const [sortOrder, setSortOrder] = useState("newest");

  // Helper function to format date labels based on period
  const formatDateLabel = (date, period) => {
    if (period === "This month") {
      // Show full date: "December 16, 2025"
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else {
      // Show month and year: "December 2025"
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    }
  };

  const sortedOrders = useMemo(() => {
    const orders = [...completedOrders];
    orders.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.orderDate);
      const dateB = new Date(b.updatedAt || b.orderDate);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    return orders;
  }, [completedOrders, sortOrder]);

  const groupedOrders = useMemo(() => {
    const groups = {};
    sortedOrders.forEach((order) => {
      const date = new Date(order.updatedAt || order.orderDate);
      const key = formatDateLabel(date, selectedPeriod);
      groups[key] = groups[key] || [];
      groups[key].push(order);
    });
    return groups;
  }, [sortedOrders, selectedPeriod]);

  const totalSpent = useMemo(() => {
    return sortedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  }, [sortedOrders]);

  const totalItems = useMemo(() => {
    return sortedOrders.reduce((sum, order) => sum + order.quantity, 0);
  }, [sortedOrders]);

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "This month":
        return "this month";
      case "This year":
        return "this year";
      default:
        return "all time";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Transaction History
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              View your completed orders and payment details -{" "}
              {getPeriodLabel()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 min-w-[140px] sm:flex-none">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer transition-colors">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {sortedOrders.length > 0 && (
        <div className="mt-6 mb-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg sm:bg-transparent sm:p-0">
              <p className="text-2xl font-bold text-gray-900">
                {sortedOrders.length}
              </p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                Completed Orders
              </p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg sm:bg-transparent sm:p-0">
              <p className="text-2xl font-bold text-blue-600">
                {sortedOrders.reduce((sum, order) => sum + order.quantity, 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                Total Items
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg sm:bg-transparent sm:p-0">
              <p className="text-2xl font-bold text-gray-900">
                Rs.{" "}
                {sortedOrders
                  .reduce((sum, order) => sum + order.totalAmount, 0)
                  .toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                Total Spent
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {Object.keys(groupedOrders).length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No completed orders yet</p>
            <p className="text-sm text-gray-400 mt-1">
              {selectedPeriod === "This month"
                ? "No completed orders this month"
                : selectedPeriod === "This year"
                  ? "No completed orders this year"
                  : "Completed orders will appear here"}
            </p>
          </div>
        ) : (
          Object.entries(groupedOrders).map(([date, orders]) => (
            <div key={date}>
              <div className="flex items-center mb-4">
                <div className="text-sm font-semibold text-gray-900 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                  {date}
                </div>
                <div className="flex-1 h-px bg-gray-200 ml-4"></div>
                <div className="text-xs text-gray-500 ml-4">
                  {orders.length} order{orders.length !== 1 ? "s" : ""}
                </div>
              </div>

              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-3 sm:p-5 hover:shadow-md transition-shadow bg-white mb-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
                          <img
                            src={`${BASE_URL}/uploads/product_images/${order.productImage}`}
                            alt={order.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 sm:hidden">
                          <h3 className="text-gray-900 font-semibold text-base mb-1 line-clamp-1">
                            {order.productName}
                          </h3>
                          <p className="text-lg font-bold text-orange-600">
                            Rs. {order.totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex-1 w-full">
                        <div className="flex items-start justify-between">
                          <div className="hidden sm:block">
                            <h3 className="text-gray-900 font-semibold text-lg mb-1">
                              {order.productName}
                            </h3>
                            {order.size && (
                              <p className="text-sm text-gray-600 mt-1">
                                Size: {order.size}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 font-mono mt-1">
                              Order ID: {order.order_number}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mt-4">
                          <div>
                            <p className="text-xs text-gray-500 font-medium flex items-center gap-1 uppercase tracking-wider">
                              <MapPin className="w-3 h-3" />
                              Delivered to
                            </p>
                            <p className="text-sm text-gray-900 font-medium">
                              {order.delivery_location}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium flex items-center gap-1 uppercase tracking-wider">
                              <Clock className="w-3 h-3" />
                              Delivered on
                            </p>
                            <p className="text-sm text-gray-900 font-medium">
                              {order.updatedAt}
                            </p>
                          </div>
                          {order.transaction_uuid && (
                            <div className="sm:col-span-2">
                              <p className="text-xs text-gray-500 font-medium flex items-center gap-1 uppercase tracking-wider">
                                <Hash className="w-3 h-3" />
                                Transaction UUID
                              </p>
                              <p className="text-xs sm:text-sm text-gray-900 font-mono break-all sm:break-normal">
                                {order.transaction_uuid}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-xs text-gray-500 font-medium whitespace-nowrap">
                              Unit Price
                            </p>
                            <p className="text-sm text-gray-900">
                              Rs. {order.productPrice?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium whitespace-nowrap">
                              Quantity
                            </p>
                            <p className="text-sm text-gray-900 font-bold sm:font-normal">
                              {order.quantity}
                            </p>
                          </div>
                          <div className="sm:block">
                            <p className="text-xs text-gray-500 font-medium whitespace-nowrap">
                              Del. Charge
                            </p>
                            <p className="text-sm text-gray-900">
                              Rs. {order.delivery_charge}
                            </p>
                          </div>
                          <div className="hidden sm:block">
                            <p className="text-xs text-gray-500 font-medium whitespace-nowrap">
                              Total Amount
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              Rs. {order.totalAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-3 border-t border-gray-100">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Delivered
                          </span>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <CreditCard className="w-3 h-3 mr-1" />
                            {order.payment_status}
                          </span>
                          <div className="text-[10px] sm:text-xs text-gray-500 font-medium">
                            {order.payment_method}
                          </div>
                          <div className="text-[10px] sm:text-xs text-gray-500 italic">
                            Ordered at {order.orderDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
