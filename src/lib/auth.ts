import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts"
import { prisma } from "@/lib/prisma";
import { signInSchema } from "@/lib/zod/auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        maxAge: 60 * 60 * 24 * 30,
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const { email, password } = await signInSchema.parseAsync(
                    credentials
                );

                const user = await prisma.user.findFirst({
                    where: {
                        email: email,
                    },
                });

                if (!user || !user.password) {
                    throw new Error("Invalid user.");
                }

                const passwordMatch = compareSync(password, user.password);

                if (!passwordMatch) return null;

                return user;
            },
        }),
    ],
});