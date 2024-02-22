"use client";

import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";



interface FormErrors {
    title?: string;
    content?: string;
}

export default function AddBlog() {
    const { data: session }: any = useSession(); //session for authorized user
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        let newErrors: FormErrors = {};
        setErrors(newErrors);

        if (!title) {
            newErrors.title = 'Title is required.';
        }

        if (!content) {
            newErrors.content = 'Content is required.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const res = await fetch("/api/blog", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    content: content,
                    author: session.user?.name,
                }),
            });

            if (res.status === 200) {
                router.push("/dashboard");
                router.refresh();
            } else {
                console.log("Error during posting");
            }

        } catch (error) {
            console.log("Error during posting:", error);
        }
    }

    if (!session) {
        redirect("/login");
    }

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Create a blog
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                                Title
                            </label>
                            <div className="mt-2">
                                <input onChange={(e) => setTitle(e.target.value)}
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="Enter the title of your post"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            {errors.title && <div className="text-red-600">{errors.title}</div>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="content" className="block text-sm font-medium leading-6 text-gray-900">
                                    Content
                                </label>
                            </div>
                            <div className="mt-2">
                                <textarea
                                    onChange={(e) => setContent(e.target.value)}
                                    id="content"
                                    name="content"
                                    rows={5}
                                    placeholder="Write your content here"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" >

                                </textarea>
                            </div>
                            {errors.content && <div className="text-red-600">{errors.content}</div>}
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">

                                Post
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </>
    );
}