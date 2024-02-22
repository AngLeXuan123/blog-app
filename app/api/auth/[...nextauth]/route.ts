
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/users";
import connectMongoDB from "@/libs/mongodb";
import bcrypt from "bcryptjs";


const authOptions: any = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any) {
                await connectMongoDB();
                try {
                    const user = await User.findOne({ email: credentials.email });

                    if (user) {
                        const isPasswordValid = await bcrypt.compare(
                            credentials.password,
                            user.password
                        )

                        if (isPasswordValid) {
                            return user;
                        }
                    }
                } catch (error: any) {
                    throw new Error(error);
                }
            }
        })
    ],
}

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };