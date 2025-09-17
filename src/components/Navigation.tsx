"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Home, User } from "lucide-react";

export function Navigation() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading" || !session) {
    return null;
  }

  const navigation = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "SMS",
      href: "/sms",
      icon: MessageSquare,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  return (
    <nav className="hidden md:flex space-x-1">
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`
              flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${isActive
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }
            `}
          >
            <Icon className="h-4 w-4 mr-2" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
