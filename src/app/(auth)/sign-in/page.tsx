"use client";

import React, { useState } from "react";
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
import { auth } from "@/firebase/firebaseConfig";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const SigninPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setLoading(true);
    try {
      const { email, password } = data;

      // Sign in with email/password
      await signInWithEmailAndPassword(auth, email, password);

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
        className: "bg-[#43b38c] text-[#FFF8E7] p-4 rounded-lg shadow-lg mt-20",
      });
      router.push("/patient"); // Redirect after successful login
      form.reset();
    } catch (err) {
      toast({
        title: "Error",
        description: "Invalid email or password. Please try again.",
        className: "bg-red-500 text-[#FFF8E7] p-4 rounded-lg shadow-lg mt-20",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start min-h-screen">
      {/* Left Side - Image */}
      <div className="w-full md:w-1/2 relative h-48 md:h-screen">
        <Image
          src="/images/sign-in.jpg"
          alt="Sign In Image"
          layout="fill"
          objectFit="cover"
          className="rounded-t-md"
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex mt-4 lg:h-screen justify-center items-center p-2">
        <Card className="w-full max-w-md">
          <CardContent>
            <h1 className="text-xl font-semibold mb-4 py-2 text-start">
              Sign In
            </h1>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
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
                <Button
                  className="rounded-[24px] text-white w-full lg:w-auto mt-5 min-w-[140px] py-4 px-8"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border animate-spin w-5 h-5 mr-2 border-t-2 border-white"></span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SigninPage;
