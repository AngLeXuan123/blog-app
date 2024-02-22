"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";


interface FormErrors {
  email?: string;
  password?: string;
}
export default function LoginForm() {

  const router = useRouter();
  const session = useSession(); //session variable give data if the user is authenticated or not.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loginError, setLoginErr] = useState("");
  
  useEffect(() => {
    if (session?.status === "authenticated") {
      router.replace("/dashboard"); //navigate to dashboard if user is authenticated, prevent authenticated user to the login page again.
    }
  }, [session, router]) //if session or router is changed

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let newErrors: FormErrors = {};
    setErrors(newErrors);

    if (!email) {
      newErrors.email = 'Email is required.';


    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length <= 6) {
      newErrors.password = 'Password must be at least 6 characters.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password
    });

    if (res?.error) {
      setLoginErr("Invalid email or password");
      if (res?.url) router.replace("/dashboard");//login success
    } else {
      setLoginErr("");
    }
  };
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  name="email"
                  type="email"

                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {errors.email && <div className="text-red-600">{errors.email}</div>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  type="password"

                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {errors.password && <div className="text-red-600">{errors.password}</div>}
            </div>

            <div>
              <button

                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
            {loginError && (<div className="text-red-600">{loginError}</div>)}
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link href={'/register'} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Register here!
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}