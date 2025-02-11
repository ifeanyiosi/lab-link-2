/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { signinSchema } from "@/validations/sign-in";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { Bounce, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth, UserDetails } from "@/context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { unstable_noStore as noStore } from "next/cache";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";

const SigninPage = () => {
  noStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserDetails;
            router.replace(
              userData.role === "patient"
                ? "/patient"
                : userData.role === "lab"
                ? "/lab"
                : "/"
            );
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSocialSignin = async (provider: "google" | "facebook") => {
    setLoading(true);
    try {
      let authProvider;
      if (provider === "google") {
        authProvider = new GoogleAuthProvider();
      } else {
        authProvider = new FacebookAuthProvider();
      }

      const userCredential = await signInWithPopup(auth, authProvider);
      const user = userCredential.user;

      // Check if user already exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      // If user doesn't exist, create a new document
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ")[1] || "",
          role: "patient", // Default role
          createdAt: new Date(),
          profilePicture: user.photoURL || "",
        });
      }

      const userData = userDoc.exists()
        ? (userDoc.data() as UserDetails)
        : { role: "patient" };

      toast.success("Successfully signed in!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        transition: Bounce,
        theme: "dark",
      });

      setRedirecting(true);
      const redirectTimer = setTimeout(() => {
        router.replace(
          userData.role === "patient"
            ? "/patient"
            : userData.role === "lab"
            ? "/lab"
            : "/"
        );
      }, 2000);

      return () => clearTimeout(redirectTimer);
    } catch (error: any) {
      console.error(error);

      let errorMessage = "Social signin failed";
      switch (error.code) {
        case "auth/account-exists-with-different-credential":
          errorMessage = "Email already used with different method";
          break;
        case "auth/popup-blocked":
          errorMessage = "Popup blocked. Please enable popups.";
          break;
        case "auth/popup-closed-by-user":
          errorMessage = "Signin canceled";
          return;
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setLoading(true);
    try {
      const { email, password } = data;
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      if (!userDoc.exists()) throw new Error("User data not found");
      const userData = userDoc.data() as UserDetails;

      toast.success("Success!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        transition: Bounce,
        theme: "dark",
      });

      setRedirecting(true);
      const redirectTimer = setTimeout(() => {
        router.replace(
          userData.role === "patient"
            ? "/patient"
            : userData.role === "lab"
            ? "/lab"
            : "/"
        );
      }, 2000);

      return () => clearTimeout(redirectTimer);
    } catch (err: any) {
      console.error("Sign-in error:", err);
      let errorMessage = "An error occurred. Please try again.";

      if (err.code === "auth/invalid-credential") {
        errorMessage = "Incorrect email or password. Please try again.";
      } else if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Try again.";
      } else if (err.code === "auth/network-request-failed") {
        errorMessage = "Network error. Check your internet connection.";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage =
          "Too many failed login attempts. Please try again later.";
      }

      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        hideProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex max-h-screen w-full">
        <div className="hidden md:block md:w-1/2 lg:w-2/5 h-screen relative">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="w-full md:w-1/2 lg:w-3/5 flex flex-col justify-center items-center p-6">
          <Skeleton className="h-12 w-32 mb-8" />
          <Skeleton className="h-96 w-full max-w-md" />
        </div>
      </div>
    );
  }

  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="w-12 h-12 border-4 border-t-transparent border-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 0.8,
            ease: "linear",
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex max-h-screen w-full">
      {/* Left Side - Image */}
      <div className="hidden md:block md:w-1/2 lg:w-2/5 h-screen relative">
        <Image
          src="/images/sign-in.jpg"
          alt="Sign In Image"
          fill
          objectFit="cover"
          className="fixed top-0 left-0 w-1/2 lg:w-2/5 h-screen"
          priority
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 lg:w-3/5 flex flex-col justify-center items-center p-6 overflow-y-auto">
        <div className="py-5">
          <Link
            className="text-5xl flex flex-col items-center font-bold text-black"
            href={"/"}
          >
            <img
              className="h-[150px] w-[150px] "
              src="/lab-link-logo.png"
              alt="Lab Link Logo"
            />
            <span>Lab Link</span>
          </Link>
        </div>

        <Card className="w-full max-w-md">
          <CardContent>
            <h1 className="text-xl font-semibold mb-4 py-2 text-start">
              Sign In
            </h1>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                  {/* Email Field */}
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your email address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <Label htmlFor="password">Password</Label>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                {...field}
                                placeholder="Enter your password"
                                className="pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff size={18} />
                                ) : (
                                  <Eye size={18} />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  className="rounded-[24px] text-white w-full lg:w-auto mt-5 min-w-[140px] py-4 px-8 flex items-center justify-center gap-2"
                  type="submit"
                  disabled={loading || redirecting}
                >
                  {redirecting ? (
                    "Redirecting..."
                  ) : loading ? (
                    <motion.div
                      className="w-5 h-5 border-4 border-t-transparent border-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.6,
                        ease: "linear",
                      }}
                    />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>

            {/* Social Signin Buttons */}
            <div className="mt-4 w-full space-y-3">
              <div className="flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-4 text-gray-500 text-sm">
                  Or sign in with
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <div className="w-full">
                <Button
                  variant="outline"
                  onClick={() => handleSocialSignin("google")}
                  disabled={loading || redirecting}
                  className="flex w-full items-center justify-center gap-1"
                >
                  <img className="w-5 h-5" src="/icons/google.png" alt="" />{" "}
                  Continue with Google
                </Button>
              </div>
            </div>
          </CardContent>
          <div className="text-center py-4">
            <span className="text-gray-600">Don&apos;t have an account? </span>
            <Link
              href="/sign-up"
              className="text-primary font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SigninPage;
