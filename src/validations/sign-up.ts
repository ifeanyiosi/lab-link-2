import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    gender: z.enum(["Male", "Female", "Other"]),
    state: z.string().min(1, "Select a state"),
    town: z.string().min(1, "Select a town"),
    phone: z
      .string()
      .regex(
        /^080\d{8}$/,
        "Phone number must start with 080 and be 11 digits long"
      ),
    confirmPassword: z.string().min(6, "Confirm Password must match Password"),
    role: z.string().nonempty("Role is required").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom", // Specifies a custom validation error
        path: ["confirmPassword"], // Point the error at the confirmPassword field
        message: "Passwords do not match",
      });
    }
  });

const operatingHoursSchema = z.object({
  openingTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:mm)"),

  closingTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:mm)"),
});

export const labSignupSchema = z
  .object({
    labName: z.string().min(1, "Lab name is required"),
    labRegNo: z.string().min(1, "Registration Number is required"),
    labRole: z.string().min(1, "Lab role is required"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    services: z.array(z.string()).optional(),

    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    state: z.string().min(1, "State is required"),
    operatingHours: operatingHoursSchema,
    town: z.string().min(1, "Town is required"),
    phone: z
      .string()
      .regex(
        /^080\d{8}$/,
        "Phone number must start with 080 and be 11 digits long"
      ),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),

    role: z.string().nonempty("Role is required").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom", // Specifies a custom validation error
        path: ["confirmPassword"], // Points the error at the confirmPassword field
        message: "Passwords do not match",
      });
    }
  });
