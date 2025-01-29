"use client";

import React, { useState } from "react";
import { z } from "zod";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import Select, { SingleValue } from "react-select";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { labSignupSchema } from "@/validations/sign-up";

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

const LabSignupPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [towns, setTowns] = useState<{ value: string; label: string }[]>([]);

  const form = useForm<z.infer<typeof labSignupSchema>>({
    resolver: zodResolver(labSignupSchema),
    defaultValues: {
      labName: "",
      labRegNo: "",
      labRole: "",
      firstName: "",
      lastName: "",
      services: [],

      email: "",
      password: "",
      address: "",
      state: "",
      town: "",
      phone: "",
      confirmPassword: "",

      operatingHours: {
        openingTime: "", // default value for openingTime
        closingTime: "", // default value for closingTime
      },
      role: "lab",
    },
  });

  const onSubmit = async (data: z.infer<typeof labSignupSchema>) => {
    setLoading(true);
    try {
      const {
        email,
        password,
        labName,
        phone,
        address,
        operatingHours,
        town,
        state,
        services,
        role,
        labRegNo,
      } = data;

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        labName,
        phone,
        address,
        operatingHours,
        town,
        state,
        services,
        role,
        labRegNo,
        createdAt: new Date(),
      });

      toast({
        title: "Success!",
        description: "Lab account created successfully!",
        className: "bg-[#43b38c] text-[#FFF8E7] p-4 rounded-lg shadow-lg mt-20",
      });

      router.push("/lab");
      form.reset();
    } catch (err) {
      setError("Error: " + (err as Error).message);
      toast({
        title: "Error",
        description: "Signup failed. Please try again.",
        className: "bg-red-500 text-[#FFF8E7] p-4 rounded-lg shadow-lg mt-20",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start h-screen">
      <div className="w-full md:w-1/2 relative h-48 md:h-screen">
        <Image
          src="/images/lab-signup.jpg"
          alt="Lab Signup Image"
          layout="fill"
          objectFit="cover"
          className="rounded-t-md"
        />
      </div>
      <div className="w-full md:w-1/2 flex mt-4 lg:min-h-screen overflow-y-auto justify-center items-center p-2">
        <Card className="w-full max-w-md">
          <CardContent>
            <h1 className="text-xl font-semibold mb-4 py-2 text-start">
              Lab Signup
            </h1>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="labName"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="labName">Lab Name</Label>
                        <FormControl>
                          <Input {...field} placeholder="Enter lab name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="labRegNo"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="labRegNo">
                          Lab Registration Number
                        </Label>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter registration number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="labRole"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="labRole">Lab Role</Label>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter registration number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="firstName">Your First Name</Label>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter registration number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="lastName">Your Last Name</Label>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter registration number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="email">Email</Label>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your professional email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="phone">Phone</Label>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your business phone number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <Label>State</Label>
                        <Select
                          options={stateOptions}
                          value={
                            field.value
                              ? { value: field.value, label: field.value }
                              : null
                          }
                          onChange={(
                            selected: SingleValue<{
                              value: string;
                              label: string;
                            }>
                          ) => {
                            field.onChange(selected?.value);
                            setTowns(
                              stateTownMapping[
                                selected?.value as keyof typeof stateTownMapping
                              ] || []
                            );
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="town"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Town</Label>
                        <Select
                          options={towns}
                          value={
                            field.value
                              ? { value: field.value, label: field.value }
                              : null
                          }
                          onChange={(
                            selected: SingleValue<{
                              value: string;
                              label: string;
                            }>
                          ) => field.onChange(selected?.value)}
                          isDisabled={!towns.length}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Town Field */}
                  <div>
                    <Label htmlFor="services">Services</Label>
                    <FormField
                      control={form.control}
                      name="services"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              isMulti
                              options={[
                                { value: "blood-tests", label: "Blood Tests" },
                                { value: "x-rays", label: "X-Rays" },
                                { value: "ultrasound", label: "Ultrasound" },
                                { value: "ct-scan", label: "CT Scan" },
                                { value: "mri", label: "MRI" },
                                {
                                  value: "vaccinations",
                                  label: "Vaccinations",
                                },
                                { value: "drug-tests", label: "Drug Tests" },
                                { value: "ecg", label: "ECG" },
                                {
                                  value: "cholesterol-check",
                                  label: "Cholesterol Check",
                                },
                                {
                                  value: "diabetes-screening",
                                  label: "Diabetes Screening",
                                },
                              ]}
                              value={field.value?.map((v: string) => ({
                                value: v,
                                label: v,
                              }))}
                              onChange={(selected) =>
                                field.onChange(
                                  selected.map((option) => option.value)
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="address">Address</Label>
                        <FormControl>
                          <Input {...field} placeholder="Enter lab address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="operatingHours.openingTime"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="openingTime">Opening Time</Label>
                        <FormControl>
                          <Input
                            {...field}
                            type="time"
                            placeholder="E.g., 08:00"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="operatingHours.closingTime"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="closingTime">Closing Time</Label>
                        <FormControl>
                          <Input
                            {...field}
                            type="time"
                            placeholder="E.g., 18:00"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="password">Password</Label>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            placeholder="Enter a strong password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="confirmPassword">
                          Confirm Password
                        </Label>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            placeholder="Re-enter password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full"
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LabSignupPage;
