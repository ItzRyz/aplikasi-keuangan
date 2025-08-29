import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcrypt-ts";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { email, password, name, classId } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password required" }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashed = await hashSync(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashed,
                name,
                classId
            },
        });

        return NextResponse.json({ message: "User created", user: { id: user.id, email: user.email } });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}