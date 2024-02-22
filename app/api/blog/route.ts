import { connectMongoDB } from "@/libs/mongodb";
import Blog from "@/models/blogs";
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
    const { title, content, author } = await request.json();

    await connectMongoDB();

    const newBlog = new Blog({
        title,
        content,
        author,
    })

    try {
        await newBlog.save();
        return new NextResponse("Blog is posted", { status: 200 });
    } catch (err: any) {
        return new NextResponse(err, {
            status: 500,
        });
    }
};

export const GET = async () =>{
    await connectMongoDB();
    const blogs = await Blog.find();
    return NextResponse.json({blogs});
}