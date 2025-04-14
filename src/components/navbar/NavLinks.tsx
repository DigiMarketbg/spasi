
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Начало" },
  { href: "/signals", label: "Сигнали" },
  { href: "/blog", label: "Блог" },
  { href: "/volunteers", label: "Доброволци" },
  { href: "/donations", label: "Дарения" },
  { href: "/contact", label: "Контакти" },
  { href: "/info", label: "Инфо" },
];

interface NavLinksProps {
  mobile?: boolean;
  onClick?: () => void;
}

export default function NavLinks({ mobile, onClick }: NavLinksProps) {
  const location = useLocation();

  return (
    <div
      className={cn(
        "flex items-center gap-1 md:gap-2",
        mobile && "flex-col w-full items-start gap-0"
      )}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className={cn(
            "transition-colors font-medium",
            mobile
              ? "py-3 w-full hover:bg-accent px-4 rounded-md"
              : "hover:text-foreground px-3 py-2",
            location.pathname === link.href
              ? "text-foreground"
              : "text-muted-foreground"
          )}
          onClick={onClick}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
