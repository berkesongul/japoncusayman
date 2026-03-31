"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
    LayoutDashboard,
    Package,
    Tags,
    Car,
    LogOut,
    Menu,
    X,
    BarChart2,
    Settings,
    Warehouse,
    FolderTree
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Ürünler", href: "/admin/dashboard/products", icon: Package },
    { name: "Kategoriler", href: "/admin/dashboard/categories", icon: FolderTree },
    { name: "Stok Yönetimi", href: "/admin/dashboard/products/stock", icon: BarChart2 },
    { name: "Dükkan Stoğu", href: "/admin/dashboard/internal-stock", icon: Warehouse },
    { name: "Markalar", href: "/admin/dashboard/brands", icon: Tags },
    { name: "Modeller", href: "/admin/dashboard/models", icon: Car },
    { name: "Ayarlar", href: "/admin/dashboard/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Nav Toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)} className="bg-background">
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Sidebar Content */}
            <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
                <div className="p-6 border-b border-white/10">
                    <Link href="/admin/dashboard" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        Japoncu<span className="text-blue-400">Sayman</span>
                    </Link>
                    <p className="text-xs text-slate-400 mt-1">Yönetim Paneli</p>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1 px-3">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin/dashboard");
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium
                    ${isActive
                                            ? "bg-blue-600 text-white"
                                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                                        }
                  `}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white/5 mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
                            {session?.user?.email?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Admin</p>
                            <p className="text-xs text-slate-400 truncate">{session?.user?.email}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/10 px-3"
                        onClick={() => signOut({ callbackUrl: '/admin/login' })}
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        Çıkış Yap
                    </Button>
                </div>
            </div>

            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
