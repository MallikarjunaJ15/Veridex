"use server";
import connectDb from "@/app/lib/db";
import userModel from "@/app/models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "@/app/lib/generateToken";
import { cookies } from "next/headers";
export async function regsiter(formData) {
  try {
    await connectDb();
    const { fullname, email, password } = formData;
    if (!fullname || !email || !password) {
      return { error: "Missing fields" };
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return ({ error: "User exists" }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await userModel.create({
      fullname,
      email,
      password: hashedPassword,
    });
    const token = generateToken(user._id);
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
    });

    return { success: true, message: "Registered successfully" };
  } catch (error) {
     return { error: "Internal Server Error" };
  }
}

export const loginUser = async (formData) => {
  try {
    await connectDb();
    const { email, password } = formData;
    if (!email || !password) {
      return { error: "Please provide email and password" };
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return { error: "User not found" };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: "Invalid credentials" };
    }
    const token = generateToken(user._id);
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return { success: true, message: "Welcome to Veridex" };
  } catch (error) {
    return { error: "Internal Server Error" };
  }
};
