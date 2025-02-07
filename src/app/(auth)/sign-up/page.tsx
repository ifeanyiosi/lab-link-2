"use client";

import React, { useState } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { z } from "zod";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { signupSchema } from "@/validations/sign-up";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Select, { SingleValue } from "react-select";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bounce, toast } from "react-toastify";

const stateTownMapping = {
  Lagos: [
    { value: "Ikeja", label: "Ikeja" },
    { value: "Surulere", label: "Surulere" },
    { value: "Lekki", label: "Lekki" },
  ],
  Enugu: [
    { value: "Nsukka", label: "Nsukka" },
    { value: "Awgu", label: "Awgu" },
    { value: "Enugu North", label: "Enugu North" },
  ],
  Kano: [
    { value: "Gwale", label: "Gwale" },
    { value: "Nasarawa", label: "Nasarawa" },
    { value: "Tarauni", label: "Tarauni" },
  ],
};

const stateOptions = Object.keys(stateTownMapping).map((state) => ({
  value: state,
  label: state,
}));

const SignupPage = () => {
  noStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [towns, setTowns] = useState<{ value: string; label: string }[]>([]);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",

      role: "patient",
      gender: "Male", // Ensure gender is added to the form values
    },
  });

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setLoading(true);
    try {
      // Extract values from form data
      const {
        email,
        password,
        role,
        firstName,
        lastName,
        phone,
        address,
        gender,
      } = data;

      // Sign up with email/password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // After signup, save the user's role and other info to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        firstName,
        lastName,
        phone,

        address,
        role, // Save the role selected by the user
        gender, // Save the gender
        createdAt: new Date(),
      });

      toast.success("Success!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        transition: Bounce,
        theme: "dark",
      });

      router.push("/patient");
      form.reset();
    } catch (err: any) {
      let errorMessage = "An error occurred. Please try again.";

      switch (err.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered. Try logging in.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email format. Please enter a valid email.";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak. Use at least 6 characters.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Check your internet connection.";
          break;
        case "auth/internal-error":
          errorMessage = "Internal error. Please try again later.";
          break;
        default:
          errorMessage = "Error: " + err.message;
      }

      setError(errorMessage);

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex  h-screen w-full ">
      {/* Left Side - Image */}
      <div className="w-full hidden md:block md:w-1/2 relative h-48 md:h-screen">
        <div className="hidden md:block md:w-1/2 fixed top-0 left-0 h-screen">
          <Image
            src="/images/sign-up.jpg"
            alt="Signup Image"
            layout="fill"
            objectFit="cover"
            className="rounded-t-md"
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:flex flex-col md:items-center md:justify-center md:w-1/2 h-screen overflow-y-auto py-5 p-4">
        <Card className="w-full    max-w-md  ">
          <CardContent>
            <h1 className="text-xl font-semibold mb-4 py-2 text-start">
              Patient Sign Up
            </h1>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                  {/* First Name */}
                  <div className="flex flex-col md:flex-row gap-4 w-full items-center md:justify-between ">
                    <div className="w-full">
                      <Label htmlFor="firstName">First Name</Label>
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your first name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Last Name */}
                    <div className="w-full">
                      <Label htmlFor="lastName">Last Name</Label>
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your last name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Email */}
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

                  {/* Gender */}
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            options={[
                              { value: "Male", label: "Male" },
                              { value: "Female", label: "Female" },
                            ]}
                            value={
                              field.value
                                ? { value: field.value, label: field.value }
                                : null
                            }
                            onChange={(selected) =>
                              field.onChange(selected?.value)
                            }
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your house address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="tel"
                              {...field}
                              placeholder="Enter your phone number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Password */}
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

                  {/* Confirm Password */}
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              placeholder="Confirm your password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    className="rounded-[24px] text-white w-full lg:w-auto mt-5 min-w-[140px] py-4 px-8 flex items-center justify-center gap-2"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
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
                      "Sign Up"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="text-center mt-4">
          <span className="text-gray-600">Already have an account? </span>
          <Link
            href="/sign-in"
            className="text-primary font-semibold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
