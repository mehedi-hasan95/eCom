import { OrderStatus } from "@/lib/@types/db-types";
import { Badge } from "@workspace/ui/components/badge";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PROCESSING:
        return "bg-blue-100 text-blue-800";
      case OrderStatus.SHIPPED:
        return "bg-purple-100 text-purple-800";
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-800";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      case OrderStatus.REFUNDED:
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PROCESSING:
        return "⏳";
      case OrderStatus.SHIPPED:
        return "🚚";
      case OrderStatus.DELIVERED:
        return "✓";
      case OrderStatus.CANCELLED:
        return "✕";
      case OrderStatus.REFUNDED:
        return "↩";
      default:
        return "•";
    }
  };

  return (
    <Badge className={getStatusColor(status)}>
      <span className="mr-1">{getStatusIcon(status)}</span>
      {status}
    </Badge>
  );
}
