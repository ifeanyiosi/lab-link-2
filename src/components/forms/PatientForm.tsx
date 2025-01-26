"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase/firebaseConfig";

const schema = z.object({
  displayName: z.string(),
  email: z.string().email({ message: "Invalid email address!" }),

  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.string().min(1, { message: "Birthday is required!" }),
  sex: z.enum(["male", "female"], { message: "Sex is required!" }),
  img: z
    .instanceof(FileList)
    .refine(
      (fileList) =>
        fileList.length === 0 || fileList[0].type.startsWith("image/"),
      {
        message: "Only image files are allowed.",
      }
    )
    .optional(),
});

type Inputs = z.infer<typeof schema>;

const PatientForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: data?.displayName || user?.displayName,
      email: data?.email || user?.email,
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      phone: data?.phone || "",
      address: data?.address || "",
      bloodType: data?.bloodType || "",
      birthday: data?.birthday || "",
      sex: data?.sex || "male",
    },
  });

  const uploadImage = async (file: File) => {
    const storageRef = ref(storage, `users/${user?.uid}/profile.jpg`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const onSubmit = async (formData: Inputs) => {
    setIsUpdating(true);

    try {
      if (!user?.uid) {
        throw new Error("User is not authenticated or UID is unavailable.");
      }

      const userRef = doc(db, "users", user.uid);
      let imageUrl = data?.img;

      if (formData.img?.[0]) {
        imageUrl = await uploadImage(formData.img[0]);
      }

      const updateData = {
        displayName: formData.displayName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        bloodType: formData.bloodType,
        birthday: formData.birthday,
        sex: formData.sex,
        img: imageUrl,
      };

      await updateDoc(userRef, updateData);
      console.log("User data updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create a new student"
          : "Update student information"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          defaultValue={user?.displayName}
          register={register}
          error={errors?.displayName}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={user?.email}
          register={register}
          error={errors?.email}
          disabled={true}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex flex-wrap gap-4">
        <InputField
          label="First Name"
          name="firstName"
          register={register}
          error={errors.firstName}
        />
        <InputField
          label="Last Name"
          name="lastName"
          register={register}
          error={errors.lastName}
        />
        <InputField
          label="Phone"
          name="phone"
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          register={register}
          error={errors.address}
        />
        <InputField
          label="Blood Type"
          name="bloodType"
          register={register}
          error={errors.bloodType}
        />
        <InputField
          label="Birthday"
          name="birthday"
          register={register}
          error={errors.birthday}
          type="date"
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">{errors.sex.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label
            htmlFor="img"
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
          >
            <Image src="/upload.png" alt="Upload" width={28} height={28} />
            <span>Upload a photo</span>
          </label>
          <input type="file" id="img" {...register("img")} className="hidden" />
          {errors.img?.message && (
            <p className="text-xs text-red-400">{errors.img.message}</p>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-400 text-white p-2 rounded-md"
        disabled={isUpdating}
      >
        {isUpdating ? "Saving..." : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default PatientForm;
