import { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt"; // eslint-disable-line

declare module "next-auth" {
    interface Session {
        user: User & DefaultSession["user"];
    }

    interface User {
        id: number;
        name: string;
        email: string;
        password: string;
        role: UserRole;
        classId: number | null;
        createdAt: Date;
        updatedAt: Date;
        studentId?: string;
        className?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        sub: string
        role: string
        classId: string
        studentId: string
        className: string
    }
}