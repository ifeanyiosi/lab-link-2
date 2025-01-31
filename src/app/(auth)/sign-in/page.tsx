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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { Bounce, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth, UserDetails } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const SigninPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
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
    } catch (err) {
      console.error("Sign-in error:", err);
      toast.error("Invalid email or password. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
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
          <Link className="text-5xl font-bold text-black" href={"/"}>
            Lab Link
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
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              placeholder="Enter your password"
                            />
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
