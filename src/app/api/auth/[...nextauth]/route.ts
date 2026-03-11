import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Admin Login",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "admin@japoncusayman.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Geçerli bir E-posta ve Şifre girin.");
                }

                const admin = await prisma.adminUser.findUnique({
                    where: { email: credentials.email }
                });

                if (!admin || !admin.password) {
                    throw new Error("Böyle bir yönetici hesabı bulunamadı.");
                }

                const isValid = await bcrypt.compare(credentials.password, admin.password);

                if (!isValid) {
                    throw new Error("Hatalı şifre.");
                }

                return {
                    id: admin.id,
                    email: admin.email,
                };
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: "/admin/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.id;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET || "japoncusayman-super-secret-key-12345",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
