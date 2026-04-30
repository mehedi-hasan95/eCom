import { OrderStatus } from "@/lib/@types/db-types";

interface TimelineStep {
  status: OrderStatus;
  label: string;
  icon: string;
}

const TIMELINE_STEPS: TimelineStep[] = [
  { status: OrderStatus.PROCESSING, label: "Processing", icon: "⏳" },
  { status: OrderStatus.SHIPPED, label: "Shipped", icon: "🚚" },
  { status: OrderStatus.DELIVERED, label: "Delivered", icon: "✓" },
];

interface OrderTimelineProps {
  currentStatus: OrderStatus;
}

export function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  // Cancelled and refunded orders don't follow the normal timeline
  if (
    currentStatus === OrderStatus.CANCELLED ||
    currentStatus === OrderStatus.REFUNDED
  ) {
    return (
      <div className="py-4">
        <div className="text-center">
          <div className="text-2xl mb-2">
            {currentStatus === OrderStatus.CANCELLED ? "❌" : "↩"}
          </div>
          <p className="text-lg font-semibold">
            {currentStatus === OrderStatus.CANCELLED
              ? "Order Cancelled"
              : "Order Refunded"}
          </p>
        </div>
      </div>
    );
  }

  const currentStatusIndex = TIMELINE_STEPS.findIndex(
    (step) => step.status === currentStatus,
  );

  return (
    <div className="py-6">
      <div className="flex items-center justify-between relative">
        {/* Connecting bars */}
        {TIMELINE_STEPS.map((_, index) => {
          if (index === TIMELINE_STEPS.length - 1) return null;

          const isCompleted = index < currentStatusIndex;

          return (
            <div
              key={`bar-${index}`}
              className={`absolute top-6 h-1 mx-5 ${
                isCompleted ? "bg-green-500" : "bg-gray-200"
              }`}
              style={{
                left: `${index * (100 / (TIMELINE_STEPS.length - 1))}%`,
                right: `${(1 - (index + 1) / (TIMELINE_STEPS.length - 1)) * 100}%`,
              }}
            />
          );
        })}

        {/* Timeline items */}
        {TIMELINE_STEPS.map((step, index) => (
          <div
            key={step.status}
            className="flex flex-col items-center relative z-10"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                index <= currentStatusIndex
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step.icon}
            </div>
            <p
              className={`mt-2 text-sm font-medium ${
                index <= currentStatusIndex ? "text-green-600" : "text-gray-500"
              }`}
            >
              {step.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
