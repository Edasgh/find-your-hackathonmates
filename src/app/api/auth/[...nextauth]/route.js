import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { dbConn } from "@/lib/mongo";
import User from "@/model/user-model";

// ✅ EXPORT THIS
export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
                provider: {},
            },

            async authorize(credentials) {
                await dbConn();

                if (credentials.provider === "facebook") {
                    const user = await User.findOne({ email: credentials.email });

                    if (!user) throw new Error("User not found");

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        bio: user.bio,
                        githubID: user.githubID,
                        country: user.country,
                        skills: user.skills,
                        teams: user.teams,
                        isAdmin: user.isAdmin,
                    };
                }

                const user = await User.findOne({ email: credentials.email });

                if (!user) throw new Error("User not found");

                const isMatch = await user.matchPassword(credentials.password);

                if (!isMatch) throw new Error("Invalid credentials");

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    bio: user.bio,
                    githubID: user.githubID,
                    country: user.country,
                    skills: user.skills,
                    teams: user.teams,
                    isAdmin: user.isAdmin,
                };
            },
        }),

        GitHubProvider({
            clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
        }),

        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_SECRET,
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async signIn({ user, account }) {
            await dbConn();

            if (account.provider !== "credentials") {
                const existingUser = await User.findOne({ email: user.email });

                if (!existingUser) {
                    throw new Error("User not found. Please sign up first.");
                }

                user.id = existingUser._id.toString();
                user.isAdmin = existingUser.isAdmin;
                user.skills = existingUser.skills;
                user.teams = existingUser.teams;
                user.country = existingUser.country;
                user.githubID = existingUser.githubID;
            }

            return true;
        },

        // 🔥 IMPORTANT FOR PROFILE UPDATE
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.user = user;
            }

            if (trigger === "update") {
                token.user = session.user;
            }

            return token;
        },

        async session({ session, token }) {
            session.user = token.user;
            return session;
        },
    },

    pages: {
        signIn: "/login",
    },

    secret: process.env.JWT_SECRET,
};

// ✅ USE IT HERE
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };