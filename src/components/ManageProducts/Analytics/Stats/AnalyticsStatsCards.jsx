import React from "react";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Box,
  FileText,
  Trash2,
  Grid,
} from "lucide-react";
import AnalyticsStatsCard from "./AnalyticsStatsCard";

const AnalyticsStatsCards = ({
  totalRevenue,
  totalOrders,
  productsSold,
  productStats,
}) => (
  <div className="space-y-4 sm:space-y-5 lg:space-y-6">
    {/* Sales Performance Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      <AnalyticsStatsCard
        icon={DollarSign}
        iconBgColor="bg-orange-100"
        iconColor="text-orange-600"
        label="TOTAL REVENUE"
        value={`Rs. ${totalRevenue}`}
      />

      <AnalyticsStatsCard
        icon={Package}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
        label="PRODUCTS SOLD"
        value={productsSold}
      />

      <AnalyticsStatsCard
        icon={ShoppingCart}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
        label="TOTAL ORDERS"
        value={totalOrders}
      />
    </div>

    {/* Product Inventory Stats */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      <AnalyticsStatsCard
        icon={Grid}
        iconBgColor="bg-purple-100"
        iconColor="text-purple-600"
        label="TOTAL PRODUCTS"
        value={productStats.total_products}
      />

      <AnalyticsStatsCard
        icon={Box}
        iconBgColor="bg-emerald-100"
        iconColor="text-emerald-600"
        label="ACTIVE"
        value={productStats.active_products}
      />

      <AnalyticsStatsCard
        icon={FileText}
        iconBgColor="bg-amber-100"
        iconColor="text-amber-600"
        label="DRAFT"
        value={productStats.draft_products}
      />

      <AnalyticsStatsCard
        icon={Trash2}
        iconBgColor="bg-red-100"
        iconColor="text-red-600"
        label="DELETED"
        value={productStats.deleted_products}
      />
    </div>
  </div>
);

export default AnalyticsStatsCards;
