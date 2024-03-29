"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface IBlog {
  _id: string;
  title: string;
  content: string;
  author: string;
}

export default function BlogInfo() {
  const { data: session, status }: any = useSession();

  const [blogs, setBlogs] = useState<IBlog[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();
        setBlogs(data.blogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        throw error;
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Wait for the session to be loaded before making decisions
    if (status === "loading") {
      return;
    }

    // If the user is not authenticated, redirect to the login page
    if (!session) {
      redirect("/login");
    }
  }, [status, session]);

  if (status === "loading") {
    // You can show a loading spinner or a message while the session is loading
    return <p>Loading...</p>;
  }


  return (
    <div className="bg-white py-24 sm:py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">

          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">From the blog</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Learn how to grow your business with our expert advice.
          </p>
          <Link href={'/blog'} type="button" className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center max-w-40 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Post new Blog
            <FaPlus className="ml-2" />
          </Link>
        </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <>
            {blogs.map((t: any) => (
              <article key={t._id} className="flex max-w-xl flex-col items-start justify-between">
                <div className="flex items-center gap-x-4 text-xs">
                  <time className="text-gray-500">
                    <time className="text-gray-500">
                      {new Intl.DateTimeFormat('en-MY', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }).format(new Date(t.createdAt))}
                    </time>
                  </time>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <span className="absolute inset-0" />
                    {t.title}
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{t.content}</p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4">

                  <div className="text-sm leading-6">
                    Author:
                    <p className="font-semibold text-gray-900">
                      <span className="absolute inset-0" />
                      {t.author}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </>

        </div>
      </div>
    </div>
  )
}
