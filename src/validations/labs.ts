"use client";
import { z } from "zod";

const labProfileSchema = z.object({
  labName: z.string().min(1, { message: "Lab name is required!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits!" }),
  address: z.string().min(5, { message: "Address must be descriptive!" }),
  services: z
    .array(z.string().min(1, { message: "Service name is required!" }))
    .min(1, { message: "At least one service must be listed!" }),
  licenseNumber: z.string().min(1, { message: "License number is required!" }),
  operatingHours: z
    .object({
      open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Invalid opening time! Use HH:MM format.",
      }),
      close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Invalid closing time! Use HH:MM format.",
      }),
    })
    .refine((data) => data.open < data.close, {
      message: "Closing time must be after opening time!",
    }),
  about: z
    .string()
    .min(10, { message: "About section must be at least 10 characters long!" })
    .max(500, { message: "About section cannot exceed 500 characters!" }),
});

export default labProfileSchema;
