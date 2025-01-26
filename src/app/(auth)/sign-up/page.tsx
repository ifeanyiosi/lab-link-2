"use client";

import React, { useState } from "react";
import { z } from "zod";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { signupSchema } from "@/validations/sign-up";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Select from "react-select";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

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
      await setDoc(doc(db, "patient", user.uid), {
        email: user.email,
        firstName,
        lastName,
        phone,
        address,
        role, // Save the role selected by the user
        gender, // Save the gender
        createdAt: new Date(),
      });

      toast({
        title: "Success!",
        description: "Signed Up!",
        className: "bg-[#43b38c] text-[#FFF8E7] p-4 rounded-lg shadow-lg mt-20",
      });

      router.push("/patient");
      form.reset();
    } catch (err) {
      setError("Error: " + (err as Error).message);
      toast({
        title: "Error",
        description: "Failed. Please try again.",
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
          src="/images/sign-up.jpg"
          alt="Signup Image"
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
              Sign Up
            </h1>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                  {/* First Name */}
                  <div>
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
                  <div>
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
                    className="rounded-[24px] text-white w-full lg:w-auto mt-5 min-w-[140px] py-4 px-8"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border animate-spin w-5 h-5 mr-2 border-t-2 border-white"></span>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
