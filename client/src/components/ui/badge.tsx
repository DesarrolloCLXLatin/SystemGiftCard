import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = ({ className, variant, ...props }: BadgeProps) => {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
};

export const StatusBadge = ({ status }: { status: 'active' | 'disabled' }) => {
  const styles = {
    active: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
    disabled: 'bg-rose-100 text-rose-800 hover:bg-rose-200'
  };

  return (
    <Badge variant="outline" className={`beneficiaries-status-badge ${styles[status]}`}>
      {status === 'active' ? 'Activo' : 'Deshabilitado'}
    </Badge>
  );
};

export { badgeVariants };
