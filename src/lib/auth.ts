import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    // Login de clientes con email/contraseña
    CredentialsProvider({
      id: "credentials-usuario",
      name: "Usuario",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email ?? "", name: user.name, role: "user" } as never;
      },
    }),
    // Login de administradores
    CredentialsProvider({
      id: "credentials-admin",
      name: "Admin",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const admin = await prisma.administrador.findUnique({ where: { email: credentials.email } });
        if (!admin) return null;
        const ok = await bcrypt.compare(credentials.password, admin.passwordHash);
        if (!ok) return null;
        return { id: admin.id, email: admin.email, name: admin.nombre, role: "admin" } as never;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as never as { role: string }).role ?? "user";
      }
      if (account?.provider === "google") {
        token.role = "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as never as { id: string }).id = token.id as string;
        (session.user as never as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/cuenta/login",
  },
};
