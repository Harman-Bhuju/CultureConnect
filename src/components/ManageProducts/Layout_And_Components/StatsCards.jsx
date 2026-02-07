import React from "react";
import { Package, TrendingUp, AlertCircle, DollarSign } from "lucide-react";
import StatsCard from "./StatsCard";

const StatsCards = ({
  totalProducts,
  activeProducts,
  lowStockProducts,
  inventoryValue,
}) => (
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-5 sm:mb-6">
    <StatsCard
      icon={Package}
      iconBgColor="bg-orange-50"
      iconColor="text-orange-500"
      label="Total Products"
      value={totalProducts}
    />
    <StatsCard
      icon={TrendingUp}
      iconBgColor="bg-emerald-50"
      iconColor="text-emerald-500"
      label="Active Products"
      value={activeProducts}
    />
    <StatsCard
      icon={AlertCircle}
      iconBgColor="bg-amber-50"
      iconColor="text-amber-500"
      label="Low Stock"
      value={lowStockProducts}
    />
    <StatsCard
      icon={DollarSign}
      iconBgColor="bg-purple-50"
      iconColor="text-purple-500"
      label="Inventory Value"
      value={`Rs.${inventoryValue.toLocaleString()}`}
    />
  </div>
);

export default StatsCards;
