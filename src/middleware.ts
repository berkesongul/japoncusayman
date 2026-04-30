import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "./lib/rate-limit";

export async function middleware(req: NextRequest) {
    // 1. İstemci IP Adresi Bulma
    // Gerçek bir Nginx reverse proxy arkasında IP tespiti için x-forwarded-for kullanılır.
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const path = req.nextUrl.pathname;

    // Rate limit, Edge runtime'da (middleware'de) RAM tutulamadığı için 
    // doğrudan sayfa component'lerine ve API'lere (Node.js runtime) taşındı.

    // 3. Yetkilendirme (Authentication) Kontrolü
    // Admin Dashboard UI veya Admin API istekleri
    const isProtected = path.startsWith("/admin/dashboard") || path.startsWith("/api/admin");
    
    if (isProtected) {
        const token = await getToken({ 
            req, 
            secret: process.env.NEXTAUTH_SECRET || "japoncusayman-super-secret-key-12345" 
        });

        if (!token) {
            if (path.startsWith("/api/")) {
                return NextResponse.json({ error: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 });
            }
            
            // Eğer giriş yapmamışsa, izinsiz sayfaya girmeye çalışıyorsa admin logine yönlendir
            const loginUrl = new URL("/admin/login", req.url);
            loginUrl.searchParams.set("callbackUrl", path);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*", 
        "/api/admin/:path*", 
        "/api/auth/:path*",
        "/products"
    ],
};
