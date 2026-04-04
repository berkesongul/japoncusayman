import { AdminSidebar } from "@/components/admin/AdminSidebar";

// Veritabanı Docker build sürecinde ayağa henüz kalkmamış olacağı için 
// admin paneli derleme sırasında db'yi arayıp hata vermemesi için dinamik yapıyoruz.
export const dynamic = "force-dynamic";
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar hidden on mobile by default, handled in client component */}
            <div className="hidden lg:block w-64 flex-shrink-0">
                <AdminSidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 lg:p-8 pt-16 lg:pt-8 w-full max-w-7xl mx-auto">
                    {children}
                </main>
            </div>

            {/* Mobile rendering of sidebar (Client Component handles state) */}
            <div className="lg:hidden">
                <AdminSidebar />
            </div>
        </div>
    );
}
