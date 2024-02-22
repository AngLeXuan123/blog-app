import { connectMongoDB } from '@/libs/mongodb';
import User from '@/models/users';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export const POST = async (request: any) => {
    const { name, email, password } = await request.json();

    await connectMongoDB();

    const existUser = await User.findOne({ email });
    if (existUser) {
        return new NextResponse("Email is already in use", { status: 400 });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
        name,
        email,
        password: hashPassword,
    })

    try {
        await newUser.save();
        return new NextResponse("User is registered", { status: 200 });
    } catch (err: any) {
        return new NextResponse(err, {
            status: 500,
        });
    }
};