"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Select from "react-select";

import Image from "next/image";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import { Button } from "../ui/button";
import labProfileSchema from "@/validations/labs";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

type Inputs = z.infer<typeof labProfileSchema>;

const LabTechForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const form = useForm<z.infer<typeof labProfileSchema>>({
    resolver: zodResolver(labProfileSchema),
  });

  function onSubmit(values: z.infer<typeof labProfileSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="text-xl font-semibold">
          {type === "create" ? "Create a new lab tech" : "Update lab tech"}
        </h1>
        <div>
          <span className="text-sm font-medium text-muted-foreground">
            Authentication Information
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Lab Name</Label>
              <FormField
                control={form.control}
                name="labName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Enter lab name" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
              <Label htmlFor="phone">Phone</Label>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Enter your phone number" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                        placeholder="Enter the address of your lab"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Services */}
            <div>
              <Label htmlFor="licenseNumber">Services</Label>
              <FormField
                control={form.control}
                name="services"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      isMulti
                      options={[
                        { value: "blood-tests", label: "Blood Tests" },
                        { value: "x-rays", label: "X-Rays" },
                        { value: "ultrasound", label: "Ultrasound" },
                        { value: "ct-scan", label: "CT Scan" },
                        { value: "mri", label: "MRI" },
                        { value: "vaccinations", label: "Vaccinations" },
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
                        field.onChange(selected.map((option) => option.value))
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* License Number */}
            <div>
              <Label htmlFor="licenseNumber">License Number</Label>
              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Enter license number" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="open">Opening Time</Label>
                <FormField
                  control={form.control}
                  name="operatingHours.open"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="Enter opening time" />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="close">Closing Time</Label>
                <FormField
                  control={form.control}
                  name="operatingHours.close"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="Enter closing time" />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* About */}
            <div>
              <Label htmlFor="about">About</Label>
              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Provide a brief description of your lab"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image Upload */}
            {/* <div>
            <Label htmlFor="img">Profile Image</Label>
            <Input id="img" {...register("img")} type="file" />
            {errors.img && (
              <p className="text-red-500 text-sm">{errors.img.message}</p>
            )}
          </div> */}
          </div>
        </div>

        <Button type="submit" className="w-full">
          {type === "create" ? "Create" : "Update"}
        </Button>
      </form>
    </Form>
  );
};

export default LabTechForm;
