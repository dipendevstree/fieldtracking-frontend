import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CustomBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const CustomBreadcrumb: React.FC<CustomBreadcrumbProps> = ({
  items,
  className,
}) => {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
            {item.href ? (
              <Link
                to={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default CustomBreadcrumb;
